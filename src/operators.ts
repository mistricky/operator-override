interface OperatorLiteralDispatch {
    [index: string]: string
}

function add(a: any, b: any){
    return a.$operatorAdd ? a.$operatorAdd(b) : a + b
}

function sub(a: any, b: any){
    return a.$operatorSub ? a.$operatorSub(b) : a - b
}

function mul(a: any, b: any){
    return a.$operatorMul ? a.$operatorMul(b) : a * b
}

function div(a: any, b: any){
    return a.$operatorDiv ? a.$operatorDiv(b) : a / b
}

export const OPERATOR_LITERAL_DISPATCH:OperatorLiteralDispatch = {
    "+": add.toString(),
    "-": sub.toString(),
    "*": mul.toString(),
    "/": div.toString(),
}

export function getProcessorLiteral(operator: string): string | undefined {
    const result = OPERATOR_LITERAL_DISPATCH[operator]
    
    if(!result){
        return undefined
    }

    return result.replace(/.+?({(.|\s)+}$)/, (_, cap) => cap)
}