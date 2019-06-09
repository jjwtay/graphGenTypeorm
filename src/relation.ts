import * as R from 'ramda'
import { RELATIONSHIP } from './consts'
import { EntitySchemaRelationOptions } from 'typeorm'
import { ObjectSchema } from 'graphschematojson/dist/object'

export const from = R.pipe(
    R.path(['directives', RELATIONSHIP]),
    R.applySpec<EntitySchemaRelationOptions>({
        type: R.prop('type'),
        target: R.prop('target')
    })
)

export const fromObject = R.mapObjIndexed((relation, name) => from(relation))

export const getRelationships: (obj: { fields: {[key: string]: ObjectSchema }}) => { [key: string]: ObjectSchema } = R.pipe(
    R.prop('fields'),
    R.filter(R.where({ directives: R.has(RELATIONSHIP) }))
)

export const fromTypes = R.pipe(
    getRelationships,
    fromObject
)