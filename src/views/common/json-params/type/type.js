import _object from './object'
import _string from './string'
import _array from './array'
import _boolean from './boolean'
import _integer from './integer'
import _number from './number'
import _file from './file'
import _common from './common'

const TYPE_NAME = ['common','object', 'array', 'file']
// const TYPE_NAME = ['string', 'number', 'integer','object', 'array',  'boolean', 'file']

const TYPE = {
    'common': _common,
    'object': _object,
    // 'string': _string,
    'array': _array,
    // 'boolean': _boolean,
    // 'integer': _integer,
    // 'number': _number,
    'file': _file
}
export {TYPE ,TYPE_NAME}
