/// <reference path="../../node_modules/graphschematojson/src/types.d.ts"/>
import { getEntities, getImports, getIdKey } from '../entity'

const createdoc = (name) => `
        /**
         *  @param {object} root
         *  @param {{data: Create${name}Input}} args
         */`

const updatedoc = (name) => `
        /**
         *  @param {object} root
         *  @param {{data: Update${name}Input}} args
         */
        `
export const getResolver = (
    /** @type {{name: string, type: Object.<string, Type>, isJS: boolean}} */
    {
        name,
        type,
        isJS = false
    }) =>
`
        ${isJS ? updatedoc(name): ''}
        async create${name}(root${!isJS ? ': object' : ''}, {data}${!isJS ? `: {data: Create${name}Input}`: ''}, context${!isJS ? `: object` : ''}) {
            Object.setPrototypeOf(data, {})
            return await context.repositories['${name}'].save(data)
        },
        ${isJS ? createdoc(name): ''}
        async update${name}(root${!isJS ? ': object' : ''}, {data}${!isJS ? `: {data: Update${name}Input}` : ''}) {
            Object.setPrototypeOf(data, {})
            return await getConnection()
                            .createQueryBuilder()
                            .update(${name})
                            .set(data)
                            .execute()
        },
        
        async delete${name}(root, {id}, context) {
            const result = await context.repositories['${name}'].delete(id)
            return id
        },`
/**
 *      
 *  @function
 *  @param {Object.<string, Type | Enum>} types
 *  @return {string}
 */
export default (
    /** @type {{ types: Object.<string, Type | Enum>, isJS: boolean}} */
    {
        types,
        isJS = false
    }) =>

`
import {getConnection, getRepository} from 'typeorm'
${Object.keys(getEntities(types))
    .map(typeKey => `import {${typeKey}} from './${typeKey}'`).join('\n')
}

export default {
    Mutation: {
        ${Object.keys(getEntities(types))
            .map(typeKey => getResolver({name: typeKey, type: types[typeKey], isJS})).join('\n')
        }
    }
}
`