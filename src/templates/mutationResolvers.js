/// <reference path="../../node_modules/graphschematojson/src/types.d.ts"/>
import { getEntities, getImports, getIdKey } from '../entity'

/**
 *  @function
 *  @param {Object.<string, Type | Enum>} types
 *  @return {string}
 */
export default (types) =>

`
import {getRepository} from 'typeorm'
${Object.keys(getEntities(types))
    .map(typeKey => `import {${typeKey}} from './${typeKey}'`).join('\n')
}

export default {
    Mutation: {

    }
}
`