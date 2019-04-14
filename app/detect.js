import _ from "underscore";

function detectMode(item) {
  if (_.isArray(item.meta) && _.isString(item.title))
    return ModeEnum.metas;
  if (_.isArray(item))
    return ModeEnum.array;
  if (_.isObject(item))
    return ModeEnum.object;
  if(!item)
    return ModeEnum.error;
  if (_.isString(item))
    return ModeEnum.string;

}

const ModeEnum = {
  string: 'str',
  array: 'arr',
  object: 'obj',
  metas: 'met',
  error: 'err'
};
export {detectMode,ModeEnum}