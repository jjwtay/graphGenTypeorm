/// <reference path="../../node_modules/graphschematojson/src/types.d.ts"/>
import { getEntities, getImports, getIdKey } from '../entity'
import { lowerFirst } from './query'
import { getType } from './field';
import * as consts from '../consts'
import * as schemaConsts from 'graphschematojson/src/consts'


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
        async ${lowerFirst(name)}s(root${!isJS ? ': object' : ''}, args${!isJS ? ': object' : ''}, context${!isJS ? ': object' : ''}) {
            return await context.repositories['${name}'].find()
        },
        ${isJS ? getTypeDoc(name) : ''}
        async ${lowerFirst(name)}(root${!isJS ? ': object' : ''}, args${!isJS ? ': object' : ''}, context${!isJS ? ': object' : ''}) {
            return await context.repositories['${name}'].findOne(args['${getIdKey(type.fields)}'])
        },`

export const getFieldResolverField = (
    /** @type {{name: string, field: string, type: Type, isJS: boolean}} */
    {
        name,
        field,
        type,
        isJS
    }) => {

        if (type.type !== schemaConsts.ENUM) {
return `
        async ${field}(${lowerFirst(name)}) {
            return await getRepository(${name})
                            .find({${getIdKey(type.fields)}: ${lowerFirst(name)}[${getIdKey(type.fields)}]})
        },
`
        
        }
        return ''
    }

export const getFieldResolver = (
    /** @type {{name: string, type: Type, isJS: boolean}} */
    {
        name,
        type,
        isJS = false
    }) =>
`
    ${name}: {
        ${Object.keys(type.fields).reduce((fields, fieldKey) => {
            if (!consts.BASIC_TYPES.includes(type.fields[fieldKey].type)) {
                return fields.concat(getFieldResolverField({name, field: fieldKey, type, isJS}))
            }
            return fields
        }, []).join('\n')}
    },
`


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
    },
    ${Object.keys(getEntities(types))
        .map(typeKey => getFieldResolver({name: typeKey, type: types[typeKey], isJS})).join('\n')
    }
}
`