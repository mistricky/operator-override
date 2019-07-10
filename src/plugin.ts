/// <reference path="./module.d.ts" />

import { PluginObj, Visitor } from "babel-core";

export abstract class Plugin implements PluginObj{
    name?: string | undefined;
    abstract visitor: Visitor<any>;
    abstract dist(): PluginObj
}