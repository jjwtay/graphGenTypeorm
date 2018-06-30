/// <reference path="../../node_modules/graphschematojson/src/types.d.ts"/>
import { getEntities, getImports, getIdKey } from '../entity'
import { lowerFirst } from './query'

/**
 * 
 * @param {string} name 
 * @param {Type} type 
 */
export const getResolver = (name, type) => 
`

        async ${lowerFirst(name)}s(root: object, args: object) {
            return await getRepository(${name}).find()
        },

        async ${lowerFirst(name)}(root: object, args: object) {
            return await getRepository(${name}).findOne(args['${getIdKey(type.fields)}'])
        },`


export default (types) =>

`
import {getRepository} from 'typeorm'
${Object.keys(getEntities(types))
    .map(typeKey => `import {${typeKey}} from './${typeKey}'`).join('\n')
}

export default {
    Query: {
        ${Object.keys(getEntities(types))
            .map(typeKey => getResolver(typeKey, types[typeKey])).join('\n')
           
        }
    }
}
`