import {PluginObj, Visitor} from 'babel-core'
import * as BabelTypes from 'babel-types'
import { Plugin } from './plugin';

type Types = typeof BabelTypes

export interface BabelPluginArgument {
    types: Types;
}


export class OperatorOverride extends Plugin {
    public name: string = "operator-override";    
    private types: Types

    constructor(types: typeof BabelTypes){
        super()
        this.types = types
    }
    
    visitor: Visitor<{}> = {
        Identifier(path){
            console.info(path)
        },
    }

    dist(): PluginObj<{}> {
        return {
            name:this.name,
            visitor:this.visitor,
        }
    }
}