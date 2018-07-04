/// <reference path="../../node_modules/graphschematojson/src/types.d.ts"/>

import { getIdKey, getId, getEntities } from '../entity'

/**
 * 
 * @param {string} str 
 * @return {string}
 */
export const lowerFirst = (str) => str.charAt(0).toLowerCase() + str.slice(1);
/**
 * @param {string} name
 * @param {Type} entity 
 * @return {string}
 */
export const createQueries = (name, entity) =>

`
    ${lowerFirst(name)}s: [${name}]
    ${lowerFirst(name)}(${getIdKey(entity.fields)}: ${getId(entity.fields).type }) : ${name}
`
/**
 * @param {Object.<string, Type | Enum>} entities
 * @returns {string}
 */
export default (entities) =>

`
type Query {
${Object.keys(getEntities(entities)).map(entityKey => createQueries(entityKey, entities[entityKey])).join('\n')}
}
`