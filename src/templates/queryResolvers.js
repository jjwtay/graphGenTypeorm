/// <reference path="../../node_modules/graphschematojson/src/types.d.ts"/>
import { getEntities, getImports, getIdKey } from '../entity'
import { lowerFirst } from './query'
import { getType } from './field';


export const getTypeDoc = (typeStr) =>

`
        /**
         *  @function
         *  @param {object} root
         *  @param {object} args
         *  @return {Promise<${typeStr}>}
         */`
/**
 * 
 * @param {string} name 
 * @param {Type} type 
 */
export const getResolver = (
    /** @type {{name: string, type: Type, isJS: boolean}} */
    {
        name,
        type,
        isJS = false
    }) =>
`
        ${isJS ? getTypeDoc(name + '[]'): ''}
        async ${lowerFirst(name)}s(root${!isJS ? ': object' : ''}, args${!isJS ? ': object' : ''}) {
            return await getRepository(${name}).find()
        },
        ${isJS ? getTypeDoc(name) : ''}
        async ${lowerFirst(name)}(root${!isJS ? ': object' : ''}, args${!isJS ? ': object' : ''}) {
            return await getRepository(${name}).findOne(args['${getIdKey(type.fields)}'])
        },`


export default (
    /** @type {{types: Object.<string, Type | Enum >, isJS: boolean}} */
    {
        types,
        isJS = false
    }) =>

`
import {getRepository} from 'typeorm'
${Object.keys(getEntities(types))
    .map(typeKey => `import {${typeKey}} from './${typeKey}'`).join('\n')
}

export default {
    Query: {
        ${Object.keys(getEntities(types))
            .map(typeKey => getResolver({name: typeKey, type: types[typeKey], isJS})).join('\n')
           
        }
    }
}
`