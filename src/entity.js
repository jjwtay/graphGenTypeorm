/// <reference path="../node_modules/graphschematojson/src/types.d.ts"/>
/// <reference path="./types.d.ts"/>
import * as consts from './consts'

/**
 * 
 * @param {Object.<string, Type | Enum>} modelMap 
 */
export const getEnums = (modelMap) => {
    return Object.keys(modelMap).reduce((enumMap, modelKey) => {
        if (modelMap[modelKey].type === 'Enum' && modelMap[modelKey].directives.EntityEnum) {
            console.log(modelMap[modelKey])
            return {...enumMap, [modelKey]: modelMap[modelKey]}
        }
        return enumMap
    }, {})
}
/** 
 * @param {Object.<string, Type | Enum>} modelMap
 * @return {Object.<string, Type>}
 */
export const getEntities = (modelMap) =>
    Object.keys(modelMap).reduce((newModelMap, modelKey) => {
        if (modelMap[modelKey].type !== 'Enum' && /** @type {Type} */(modelMap[modelKey]).directives['Entity']) {
            return {...newModelMap, [modelKey]: modelMap[modelKey]}
        }
        return newModelMap
    }, {})

/** @type {ImportObj} */
export const defaultImportObj = {
    default: undefined,
    named: undefined,
    from: ''
}

/**
 * 
 * @param {Object.<string, Directive>} directives 
 * @returns {string[]}
 */
export const getDirectiveTypeOrmImports = (directives) =>
    Object.keys(directives).reduce((imports, directiveKey) => {
        if (consts.NAMED_EXPORTS.includes(directiveKey)) {
            return imports.concat([directiveKey])
        }
        return imports
    }, [])
/**
 * 
 * @param {Object.<string, Field>} fields
 * @returns {string[]} 
 */
export const getFieldTypeORMImports = (fields) =>
    Object.keys(fields).reduce((imports, fieldKey) => 
        imports.concat(getDirectiveTypeOrmImports(fields[fieldKey].directives))
    , [])
/**
 * 
 * @param {Type} model
 * @returns {ImportObj}
 */
export const getTypeORMImports = (model) => ({
    named: ['Entity']
                .concat(getFieldTypeORMImports(model.fields)
                .concat(getDirectiveTypeOrmImports(model.directives)))
                .filter((elem, pos, arr) => arr.indexOf(elem) == pos),
    from: 'typeorm'
})

/**
 * @param {string} name
 * @param {Type} model
 */
export const getRelImports = (name, model) =>
    Object.keys(model.fields).reduce((imports, fieldKey) => {
        if (!consts.BASIC_TYPES.includes(model.fields[fieldKey].type)) {
            return {
                ...imports,
                [`./${model.fields[fieldKey].type}`]: {
                    named: [model.fields[fieldKey].type],
                    from: `./${model.fields[fieldKey].type}`
                }
            }
        }
        return imports
    }, {})

/**
 * @param {string} name
 * @param {Type} model 
 * @returns {Imports}
 */
export const getImports = (name, model) => ({
    typeorm: getTypeORMImports(model),
    ...getRelImports(name, model)
})
/**
 * 
 * @param {Object.<string, Field>} fields 
 * @return {string}
 */
export const getIdKey = (fields) =>
    Object.keys(fields).find(fieldKey => {
        if (fields[fieldKey].directives[consts.PRIMARY_GENERATED_COLUMN]) {
            return true
        }
    })
/**
 * @function 
 * @param {Object.<string, Field>} fields
 * @return {Field}
 */
export const getId = (fields) =>
    fields[getIdKey(fields)]



