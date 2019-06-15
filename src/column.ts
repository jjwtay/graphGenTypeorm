import { EntitySchemaColumnOptions, Entity, EntitySchema } from 'typeorm'
import { FieldSchema } from 'graphschematojson/dist/field'
import { ObjectSchema } from 'graphschematojson/dist/object'
import * as R from 'ramda'
import * as consts from './consts'

type Column = Pick<EntitySchemaColumnOptions, Exclude<keyof EntitySchemaColumnOptions, "type">> & { type?: string }
type PrimaryColumn = Pick<Column, Exclude<keyof Column, "primary">>
type PrimaryGeneratedColumn =  Pick<PrimaryColumn, Exclude<keyof PrimaryColumn, "generated" >>

export  type ColumnField = {
    directives: {
        [consts.COLUMN]: Partial<EntitySchemaColumnOptions>
        [key: string]: any
    }
} & FieldSchema

export type PrimaryGeneratedField = {
    directives: {
        [consts.PRIMARY_GENERATED_COLUMN]: PrimaryGeneratedColumn
        [key: string]: any
    }
} & FieldSchema

export type PrimaryField = {
    directives: {
        [consts.PRIMARY_COLUMN]: PrimaryColumn
        [key: string]: any
    }
} & FieldSchema

export type CreateDateField = {
    directives: {
        [consts.CREATE_DATE_COLUMN]: Pick<Column, Exclude<keyof Column, "createDate">>
        [key: string]: any
    }
}

export type UpdateDateField =  {
    directives: {
        [consts.UPDATE_DATE_COLUMN]: Pick<Column, Exclude<keyof Column, "updateDate">>
        [key: string]: any
    }
}

export const isPrimary: (obj: EntitySchemaColumnOptions) => boolean = R.propOr(false, 'primary')

export const isGenerated:(obj: EntitySchemaColumnOptions) => boolean = R.propOr(false, 'generated')

export const isNullable: (obj: EntitySchemaColumnOptions) => boolean = R.propOr(false, 'nullable')

export const getType = (type:  string) => {

    const types: Record<string, string> = {
        Int: 'int',
        Float: 'float',
        String: 'varchar'
    }

    return types[type] || 'unknown'
}

/** Get value for  whether column is nullable or not. */
export const getNullable = (obj: ColumnField) => obj.directives[consts.COLUMN].nullable || obj.isNullable

export const getColumn = (obj: ColumnField)  => obj.directives[consts.COLUMN]

/** Convert a FieldSchema with Column Directive into TypeORM EntitySchemaColumnOptions Object */
export const fromColumnField = (obj: ColumnField) => ({
    ...getColumn(obj),
    type: obj.directives[consts.COLUMN].type || getType(obj.type),
    nullable: getNullable(obj) || undefined
})

/** Convert a FieldSchema with PrimaryGeneratedColumn Directive into TypeORM EntitySchemaColumnOptions Object */
export const fromPrimaryGeneratedField = (obj: PrimaryGeneratedField) => ({
    ...obj.directives[consts.PRIMARY_GENERATED_COLUMN],
    type: getType(obj.type),
    primary: true,
    generated: true
})

/** Convert a FieldSchema with PrimaryColumn Directive into TypeORM EntitySchemaColumnOptions Object */
export const fromPrimaryField = (obj: PrimaryField) => ({
    ...obj.directives[consts.PRIMARY_COLUMN],
    type: getType(obj.type),
    primary: true
})

export const fromCreateDateField = (obj: CreateDateField) => ({
    ...obj.directives[consts.CREATE_DATE_COLUMN],
    type: obj.directives[consts.CREATE_DATE_COLUMN].type || 'timestamp with time zone',
    createDate: true
})

export const fromUpdateDateField = (obj: UpdateDateField) => ({
    ...obj.directives[consts.UPDATE_DATE_COLUMN],
    type: obj.directives[consts.UPDATE_DATE_COLUMN].type || 'timestamp with time zone',
    updateDate: true
})

/** Convert a FieldSchema into a TypeORM EntitySchemaColumnOptions Object. */
export const fromField: (obj: FieldSchema) => EntitySchemaColumnOptions = R.cond([
    [R.pipe(R.prop('directives'), R.has(consts.COLUMN)), fromColumnField],
    [R.pipe(R.prop('directives'), R.has(consts.PRIMARY_GENERATED_COLUMN)), fromPrimaryGeneratedField],
    [R.pipe(R.prop('directives'), R.has(consts.CREATE_DATE_COLUMN)), fromCreateDateField],
    [R.pipe(R.prop('directives'), R.has(consts.UPDATE_DATE_COLUMN)), fromUpdateDateField],
    [R.T, fromPrimaryField]
])

export const fromColumnsObject = R.mapObjIndexed<FieldSchema, EntitySchemaColumnOptions>((column, name) => fromField(column))

export const getColumns = R.pipe<ObjectSchema, Record<string, FieldSchema>, Record<string, FieldSchema>>(
    R.prop('fields'),
    R.pickBy(
        R.where({
            directives: R.anyPass([
                R.has(consts.COLUMN),
                R.has(consts.PRIMARY_GENERATED_COLUMN),
                R.has(consts.PRIMARY_COLUMN),
                R.has(consts.CREATE_DATE_COLUMN),
                R.has(consts.UPDATE_DATE_COLUMN)
            ])
        })
    )
)

export const fromTypes = R.pipe(
    getColumns,
    fromColumnsObject
)