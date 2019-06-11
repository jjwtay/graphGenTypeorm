import * as R from 'ramda'
import { RELATIONSHIP } from './consts'
import { EntitySchemaRelationOptions } from 'typeorm'
import { ObjectSchema } from 'graphschematojson/dist/object'
import { FieldSchema } from 'graphschematojson/dist/field'

export const fromField = R.pipe(
    R.path(['directives', RELATIONSHIP]),
    R.applySpec<EntitySchemaRelationOptions>({
        type: R.prop('type'),
        target: R.prop('target')
    })
)

export const fromFieldsObject = R.mapObjIndexed((relation, name) => fromField(relation))

export const getRelationships = R.pipe<ObjectSchema, Record<string,FieldSchema>, Record<string, FieldSchema>>(
    R.prop('fields'),
    R.pickBy(R.where({ directives: R.has(RELATIONSHIP) }))
)

export const fromTypes = R.pipe(
    getRelationships,
    fromFieldsObject
)