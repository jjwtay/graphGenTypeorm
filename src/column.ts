import { EntitySchemaColumnOptions, Entity } from 'typeorm'
import { ObjectSchema } from 'graphschematojson/dist/object'
import * as R from 'ramda'
import { COLUMN, PRIMARY_GENERATED_COLUMN } from './consts'

export const isPrimary = (obj: any) => {
    return R.propOr(false, 'primary')
}

export const columnToSchemaField = (schema: any) => {
    return R.path(['directives', COLUMN ], schema)
}

export const getType = (type: string) => {
    const types: { [key: string]: string } = {
        Int: 'int',
        String: 'string'
    }

    return types[type] || 'unknown'
}

export const primaryGeneratedToSchemaField = R.applySpec<EntitySchemaColumnOptions>({
        type: R.pipe<{ type: string }, string, string> (R.prop('type'), getType),
        primary: R.always(true),
        generated: R.T
    })

export const from = R.ifElse(
    R.pipe(R.prop('directives'), R.has(COLUMN)),
    columnToSchemaField,
    primaryGeneratedToSchemaField
)


export const fromObj = R.mapObjIndexed<ObjectSchema, EntitySchemaColumnOptions>((column, name) => from(column))

export const getColumns: (obj: { fields: {[key: string]: ObjectSchema }}) => { [key: string]: ObjectSchema } = R.pipe(
    R.prop('fields'),
    R.filter(
        R.where({
            directives: R.anyPass([
                R.has(COLUMN),
                R.has(PRIMARY_GENERATED_COLUMN)
            ])
        })
    )
)

export const fromTypes = R.pipe(
    getColumns,
    fromObj
)