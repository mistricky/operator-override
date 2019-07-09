import {PluginObj, Visitor} from 'babel-core'
import {
    isIdentifier, 
    Decorator,
    classMethod,
    ClassMethod,
    Identifier,
    isBlockStatement, 
    isClassMethod,
    BlockStatement,
    LVal,
    Node,
    callExpression,
    functionExpression,
    identifier,
} from 'babel-types'
import { Plugin } from './plugin';
import { getProcessorLiteral } from './operators';
import template from "@babel/template";

// const SYSTEM_DECORATOR = "operator"
const MULTIPLE_OPERATOR_ERROR_MESSAGE = "Don't use multiple operator decorators in one method"

function findDecoratorName({expression}: Decorator): string | undefined {
    return isIdentifier(expression) && expression.name || undefined
}

function isOperatorDecorator(decorator: Decorator): string | undefined {
    const OPERATOR_DECORATOR = ["Add", "Sub", "Mul", "Div"]
    const name = findDecoratorName(decorator)

    if(!name){
        return undefined
    }

    return OPERATOR_DECORATOR.includes(name) ? name : undefined
}

function sysOperatorMethodsGenerator(
    decorators: Decorator[],
    originKey: Identifier,
    params: LVal[],
    body: BlockStatement
): ClassMethod | undefined {
    let method:ClassMethod | undefined
    let operatorCount = 0 

    for(const decorator of decorators){
        if(operatorCount > 1){
            throw new Error(MULTIPLE_OPERATOR_ERROR_MESSAGE)
        }

        const name = isOperatorDecorator(decorator)


        if(name){
            operatorCount++

            const key = {...originKey}
            
            key.name = `$operator${name}`
            method = classMethod("method", key, params, body)
        }
    }

    return method
}

function isUndefinedNode(node: Node): boolean {
    return isIdentifier(node) && node.name === "undefined"
}

export class OperatorOverride extends Plugin {
    public name: string = "operator-override";    

    constructor(){
        super()
    }
    
    visitor: Visitor<{}> = {
        ClassBody({node}){
            const {body: methods} = node
            let insteadMethods:ClassMethod[] = []

            for(const i of Object.keys(methods)){
                const method = methods[+i]

                if(isClassMethod(method)){
                    const {decorators, key, params, body} = method

                    if(!decorators){
                        continue
                    }   

                    if(isIdentifier(key) && isBlockStatement(body)) {
                        const replaceMethod = sysOperatorMethodsGenerator(decorators, key, params, body)

                        if(!replaceMethod){
                            return                             
                        }

                        node.body.splice(+i, 1, replaceMethod)
                    }
                }
            }
        },
        BinaryExpression(path){
            const {node} = path

            if(!node.loc){
                return 
             }

            const {left, right, operator} = node
            const functionLiteral = getProcessorLiteral(operator);

            if(isUndefinedNode(left) || isUndefinedNode(right)){
                return
            }

            if(!functionLiteral){
                return
            }

            const targetFunctionExpression =
             functionExpression(
                undefined,
                [identifier("a"),
                identifier("b")],
                template.ast(functionLiteral) as unknown as BlockStatement)

            path.replaceWith(callExpression(targetFunctionExpression, [left, right]))
        }
    }

    dist(): PluginObj<{}> {
        return {
            name:this.name,
            visitor:this.visitor,
        }
    }
}