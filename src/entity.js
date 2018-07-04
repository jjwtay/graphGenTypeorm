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


/**
 * 
 * @param {string} str 
 * @return {string}
 */
export const lowerFirst = (str) => str.charAt(0).toLowerCase() + str.slice(1)

export const getQueryResolvers = (schema) => ({
    Query: Object.keys(getEntities(schema)).reduce((queries, entityName) => ({
        ...queries,
        async [lowerFirst(entityName + 's')](root, args, context) {
            return await context.repositories[entityName].find()
        },
        async [lowerFirst(entityName)](root, {id}, context) {
            return await context.repositories[entityName].findOne(id)
        }
    }), {})
})

export const getMutationResolvers = (schema) => ({
    Mutation: Object.keys(getEntities(schema)).reduce((mutations, entityName) => ({
        ...mutations,

        async [`create${entityName}`](root, {data}, context) {
            const repository = context.repositories[entityName]
            const obj = repository.create(data)
            return await repository.save(obj)
        },
        async [`update${entityName}`](root, {data}, context) {
            const repository = context.repositories[entityName]
            const obj = await repository.findOne(data.id)
            const updated = await repository.save(Object.assign(obj, data))
            return await repository.findOne(data.id)
        },
        async [`delete${entityName}`](root, {id}, context) {
            const result = await context.repositories[entityName].delete(id)
            return id
        }
    }), {})
})

export const getKeyByValue = (value, object) => {
    return Object.keys(object).find(key => object[key] === value);
}

export const relMap = {
    [consts.ONE_TO_ONE]: 'one-to-one',
    [consts.ONE_TO_MANY]: 'one-to-many',
    [consts.MANY_TO_ONE]: 'many-to-one',
    [consts.MANY_TO_MANY]: 'many-to-many'
}

export const getRelType = field => {
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

export const getColumns = (type) =>
    Object.keys(type.fields).reduce((fields, fieldName) => {
        if (type.fields[fieldName].directives.hasOwnProperty(consts.PRIMARY_GENERATED_COLUMN)) {
            return {...fields, [fieldName]: type.fields[fieldName]}
        } else if (type.fields[fieldName].directives.hasOwnProperty(consts.COLUMN)) {
            return {...fields, [fieldName]: type.fields[fieldName]}
        }

        return fields
    }, {})

export const getRelColumns = (type) =>
    Object.keys(type.fields).reduce((fields, fieldName) => {
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
/**
 * @param {string} name
 * @param {Type} type 
 */
export const getEntitySchema = (name, type) => ({
    name,
    columns: Object.keys(getColumns(type)).reduce((columns, fieldName) => ({
        ...columns,
        [fieldName]: {
            primary: type.fields[fieldName].directives.hasOwnProperty(consts.PRIMARY_GENERATED_COLUMN) ? true : false,
            type: getType(type.fields[fieldName]),
            generated: type.fields[fieldName].directives.hasOwnProperty(consts.PRIMARY_GENERATED_COLUMN) ? true : false,
        }
    }) , {}),
    relations: Object.keys(getRelColumns(type)).reduce((relationships, fieldName) => {
        const relType = getRelType(type.fields[fieldName])
        const relDirectiveKey = getKeyByValue(relType, relMap)
        const inverseSide = type.fields[fieldName].directives[relDirectiveKey].inverseSide

        return {
                ...relationships,
                [fieldName]: {
                    joinTable: type.fields[fieldName].directives[consts.JOIN_COLUMN] ? true : false,
                    target: type.fields[fieldName].type,
                    cascade: type.fields[fieldName].directives[consts.JOIN_COLUMN] ? true : false,
                    type: relType,
                    inverseSide: inverseSide,
                    lazy: true,
                }
            }
    }, {})
})

export const getRepositories = ({schema, connection}) =>
    Object.keys(getEntities(schema)).reduce((repositories, entityName) => ({
        ...repositories,
        [entityName]: connection.getRepository(entityName)
    }), {})

export const getEntitySchemas = (schema) =>
    Object.keys(getEntities(schema)).map((entityKey) =>
        getEntitySchema(entityKey, schema[entityKey]), [])