import {OperatorOverride} from './override';
import { transform } from '@babel/core';
import * as FS from 'fs'

const plugin = () => new OperatorOverride().dist();

export = plugin

const out = transform(FS.readFileSync("../example/src.js").toString(), {
  plugins: [
      ["@babel/plugin-syntax-decorators", {legacy: true}],
      plugin,
    ]
  })

FS.writeFileSync("../example/out.js", out && out.code)