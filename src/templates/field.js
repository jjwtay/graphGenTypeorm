/// <reference path="../../node_modules/graphschematojson/src/types.d.ts"/>
/** @module templates/field */

import { getDecorators } from './decorator'

/**
 * @function
 * @return {string}
 */
export const getFields = (
    /** @type {{fields: Object.<string, Field>, isJS: boolean}} */
    {
        fields,
        isJS = false
    }) =>
        Object.keys(fields).map(name => getField({name, field: fields[name], isJS})).join('')

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

const jsDoc = (field) =>

`
    /**
     *  @type {${getType(field)}}
     */`

/**
 * @return {string}
 */
export const getField = (
    /** @type {{name: string, field: Field, isJS: boolean}} */
    {
        name,
        field,
        isJS = false
    }) =>

`
    ${isJS ? jsDoc(field): ''}
    ${getDecorators(field.directives, '\n    ')}
    ${name} ${!isJS ? ': ' + getType(field) : ''}
`