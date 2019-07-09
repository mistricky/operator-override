import {PluginObj, Visitor} from 'babel-core'
import {
    isCallExpression, 
    isIdentifier, 
    isAssignmentExpression, 
    sequenceExpression, 
    Decorator,
    classMethod,
    ClassMethod,
    Identifier,
    isBlockStatement, 
    isClassMethod,
    BlockStatement,
    isLVal,
    LVal
} from 'babel-types'
import { Plugin } from './plugin';

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
    }

    dist(): PluginObj<{}> {
        return {
            name:this.name,
            visitor:this.visitor,
        }
    }
}