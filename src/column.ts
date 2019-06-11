import { EntitySchemaColumnOptions, Entity, EntitySchema } from 'typeorm'
import { FieldSchema } from 'graphschematojson/dist/field'
import * as R from 'ramda'
import { COLUMN, PRIMARY_GENERATED_COLUMN } from './consts'

export  type ColumnField = {
    directives: {
        [COLUMN]: Partial<EntitySchemaColumnOptions>
        [key: string]: any
    }
} & FieldSchema

export const isPrimary: (obj: EntitySchemaColumnOptions) => boolean = R.propOr(false, 'primary')

export const isGenerated:(obj: EntitySchemaColumnOptions) => boolean = R.propOr(false, 'generated')

export const isNullable: (obj: EntitySchemaColumnOptions) => boolean = R.propOr(false, 'nullable')


export const getType = (type:  string) => {

    const types: { [key: string]: string } = {
        Int: 'int',
        Float: 'float',
        String: 'varchar'
    }

    return types[type] || 'unknown'
}


export const getNullable = (obj: ColumnField) => obj.directives[COLUMN].nullable || obj.isNullable

export const getColumn = (obj: ColumnField)  => obj.directives[COLUMN]

export const columnToSchemaField = (obj: ColumnField) => ({
    ...getColumn(obj),
    type: obj.directives[COLUMN].type || getType(obj.type),
    nullable: getNullable(obj)
})

export const primaryGeneratedToSchemaField = R.applySpec<EntitySchemaColumnOptions>({
    type: R.pipe<{ type: string }, string, string> (R.prop('type'), getType),
    primary: R.always(true),
    generated: R.T
})

export const from: (obj: FieldSchema) => EntitySchemaColumnOptions = R.ifElse(
    R.pipe(R.prop('directives'), R.has(COLUMN)),
    columnToSchemaField,
    primaryGeneratedToSchemaField
)

export const fromObj = R.mapObjIndexed<FieldSchema, EntitySchemaColumnOptions>((column, name) => from(column))

export const getColumns: (obj: { fields: {[key: string]: FieldSchema }}) => { [key: string]: FieldSchema } = R.pipe(
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