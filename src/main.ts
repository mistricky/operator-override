import {OperatorOverride} from './override';

const plugin = () => new OperatorOverride().dist();

export = plugin

// const out = transform(FS.readFileSync("../example/src.js").toString(), {
//   plugins: [
//       // ["@babel/plugin-syntax-decorators", {legacy: true}],
//       [plugin, {legacy: true}],
//     ]
//   })

// FS.writeFileSync("../example/out.js", out && out.code)