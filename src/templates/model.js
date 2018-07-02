/// <reference path="../../node_modules/graphschematojson/src/types.d.ts"/>
/** @module templates/model */

import { getDecorators } from './decorator.js'
import { getFields } from './field.js'
import { getImports } from '../entity.js'
import * as consts from '../consts'
import { inspect } from 'util'

/**
 * @function
 * @param {Imports} imports 
 * @return {string}
 */
export const importsToImports = (imports) =>
    Object.keys(imports).map(importKey => 
        `import {${imports[importKey].named.join(', ')}} from '${importKey}'\n`
    ).join('')
    
export const getColumns = (type) => Object.keys(type.fields).reduce((fields, fieldName) => {
    if (type.fields[fieldName].directives.hasOwnProperty(consts.PRIMARY_GENERATED_COLUMN)) {
        return {...fields, [fieldName]: type.fields[fieldName]}
    } else if (type.fields[fieldName].directives.hasOwnProperty(consts.COLUMN)) {
        return {...fields, [fieldName]: type.fields[fieldName]}
    }

    return fields
}, {})

export const getRelColumns = (type) => Object.keys(type.fields).reduce((fields, fieldName) => {
    if (type.fields[fieldName].directives.hasOwnProperty(consts.ONE_TO_ONE)) {
        return {...fields, [fieldName]: type.fields[fieldName]}
    } else if (type.fields[fieldName].directives.hasOwnProperty(consts.ONE_TO_MANY)) {
        return {...fields, [fieldName]: type.fields[fieldName]}
    } else if (type.fields[fieldName].directives.hasOwnProperty(consts.MANY_TO_ONE)) {
        return {...fields, [fieldName]: type.fields[fieldName]}
    } else if (type.fields[fieldName].directives.hasOwnProperty(consts.MANY_TO_MANY)) {
        return {...fields, [fieldName]: type.fields[fieldName]}
    }
    return fields
}, {})

const getRelType = field => {
    if (field.directives[consts.ONE_TO_ONE]) {
        return 'one-to-one'
    } else if (field.directives[consts.ONE_TO_MANY]) {
        return 'one-to-many'
    } else if (field.directives[consts.MANY_TO_ONE]) {
        return 'many-to-one'
    } else if (field.directives[consts.MANY_TO_MANY]) {
        return 'many-to-many'
    } else {
        return false
    }
}

export const getType = field => {
    if (field.directives.hasOwnProperty(consts.PRIMARY_GENERATED_COLUMN)) {
        return 'int'
    } else if (field.directives.hasOwnProperty(consts.COLUMN)) {
        if (field.directives[consts.COLUMN].hasOwnProperty('type')) {
            return field.directives[consts.COLUMN].type
        } 
    }
    const typeMap = {
        Int: 'int',
        String: 'varchar',
        Boolean: 'boolean'
    }
    return typeMap[field.type] ? typeMap[field.type]: 'varchar'
}
/**
 * @param {string} name
 * @param {Type} type 
 */
export const typeToEntity = (name, type) => ({
    name,
    columns: Object.keys(getColumns(type)).reduce((columns, fieldName) => {
        console.log(fieldName)
        return {
            ...columns,
            [fieldName]: {
                primary: type.fields[fieldName].directives.hasOwnProperty(consts.PRIMARY_GENERATED_COLUMN) ? true : false,
                type: getType(type.fields[fieldName]),
                generated: type.fields[fieldName].directives.hasOwnProperty(consts.PRIMARY_GENERATED_COLUMN) ? true : false,
            }
        }
    } , {}),
    relations: Object.keys(getRelColumns(type)).reduce((relationships, fieldName) => {

        return {
                ...relationships,
                [fieldName]: {
                    joinTable: type.fields[fieldName].directives[consts.JOIN_COLUMN] ? true : false,
                    target: type.fields[fieldName].type,
                    cascade: false,
                    type: getRelType(type.fields[fieldName])
                }
            }
        

    }, {})
})

export default (
/** @type {{name: string, model: Type, isJS: boolean}} */
{
    name,
    model,
    isJS = false
}) => isJS ?


`
import { EntitySchema } from 'typeorm'

export const ${name} = new EntitySchema(${inspect(typeToEntity(name, model), {compact: false})})

export default ${name}
`
:
`
${importsToImports(getImports(name, model))}

${isJS ? '/** @class */' : ''}
${getDecorators(model.directives)}
export class ${name} {

${getFields({fields: model.fields, isJS})}

}
`

