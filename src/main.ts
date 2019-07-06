import {OperatorOverride, BabelPluginArgument} from './override';

export = ({types}: BabelPluginArgument) => new OperatorOverride(types).dist();;