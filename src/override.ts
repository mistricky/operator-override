import {PluginObj, Visitor} from 'babel-core'
import * as BabelTypes from 'babel-types'

export interface BabelPluginArgument {
    types: typeof BabelTypes;
}


export class OperatorOverride implements PluginObj {
    public name: string = "operator-override";    

    constructor(types: typeof BabelTypes){

    }
    
    visitor: Visitor<{}> = {
        
    }
}