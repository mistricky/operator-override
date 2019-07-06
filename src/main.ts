import {OperatorOverride, BabelPluginArgument} from './override';

const plugin = ({types}: BabelPluginArgument) => new OperatorOverride(types);

export = plugin;