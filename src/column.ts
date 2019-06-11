import { EntitySchemaColumnOptions, Entity, EntitySchema } from 'typeorm'
import { FieldSchema } from 'graphschematojson/dist/field'
import { ObjectSchema } from 'graphschematojson/dist/object'
import * as R from 'ramda'
import { COLUMN, PRIMARY_GENERATED_COLUMN } from './consts'

export  type ColumnField = {
    directives: {
        [COLUMN]: Partial<EntitySchemaColumnOptions>
        [key: string]: any
    }
} & FieldSchema

export type PrimaryField = {
    directives:  {
        [PRIMARY_GENERATED_COLUMN]: Partial<EntitySchemaColumnOptions>
        [key: string]: any
    }
} & FieldSchema

export const isPrimary: (obj: EntitySchemaColumnOptions) => boolean = R.propOr(false, 'primary')

export const isGenerated:(obj: EntitySchemaColumnOptions) => boolean = R.propOr(false, 'generated')

export const isNullable: (obj: EntitySchemaColumnOptions) => boolean = R.propOr(false, 'nullable')
//export const getNullable = (obj: ColumnField) => obj.isNullable

export const getType = (type:  string) => {

    const types: Record<string, string> = {
        Int: 'int',
        Float: 'float',
        String: 'varchar'
    }

    return types[type] || 'unknown'
}

/** Get value for  whether column is nullable or not. */
export const getNullable = (obj: ColumnField) => obj.directives[COLUMN].nullable || obj.isNullable

export const getColumn = (obj: ColumnField)  => obj.directives[COLUMN]

/** Convert a FieldSchema with Column Directive into TypeORM EntitySchemaColumnOptions Object */
export const fromColumnField = (obj: ColumnField) => ({
    ...getColumn(obj),
    type: obj.directives[COLUMN].type || getType(obj.type),
    nullable: getNullable(obj) || undefined
})

/** Convert a FieldSchema with Primary Directive into TypeORM EntitySchemaColumnOptions Object */
export const fromPrimaryField = (obj: PrimaryField) => ({
    ...obj.directives[PRIMARY_GENERATED_COLUMN],
    type: getType(obj.type),
    primary: true,
    generated: true
})

/** Convert a FieldSchema into a TypeORM EntitySchemaColumnOptions Object. */
export const fromField: (obj: FieldSchema) => EntitySchemaColumnOptions = R.ifElse(
    R.pipe(R.prop('directives'), R.has(COLUMN)),
    fromColumnField,
    fromPrimaryField
)

export const fromColumnsObject = R.mapObjIndexed<FieldSchema, EntitySchemaColumnOptions>((column, name) => fromField(column))

export const getColumns = R.pipe<ObjectSchema, Record<string, FieldSchema>, Record<string, FieldSchema>>(
    R.prop('fields'),
    R.pickBy(
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
    fromColumnsObject
)