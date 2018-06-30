/// <reference path="../../node_modules/graphschematojson/src/types.d.ts"/>
/** @module templates/field */

import { getDecorators } from './decorator'

/**
 * @param {Object.<string, Field>} fields 
 * @return {string}
 */
export const getFields = (fields) =>
    Object.keys(fields).map(fieldKey => getField(fieldKey, fields[fieldKey])).join('')

/**
 * @param {Field} field
 * @return {string}
 */
export const getType = (field) => {
    const baseMap = {
        Int: 'number',
        Float: 'number',
        String: 'string',
        Boolean: 'boolean'
    }
    const type = baseMap[field.type] ? baseMap[field.type] : field.type
    return field.isList ? `${type}[]` : type
}
    
/**
 * @param {string} name
 * @param {Field} field
 * @return {string}
 */
export const getField = (name, field) =>

`
    ${getDecorators(field.directives, '\n    ')}
    ${name}: ${getType(field)}
`