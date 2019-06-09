import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions'
import { ObjectSchema } from 'graphschematojson/dist/object'
import { fromTypes as fromTypesColumns } from './column'
import { fromTypes as fromTypesRelations } from './relation'
import { ENTITY } from './consts'
import * as R from 'ramda'

export const from = R.applySpec<EntitySchemaOptions<{}>>({
    name: R.prop('name'),
    columns: fromTypesColumns,
    relations: fromTypesRelations
})

export const fromObj = R.mapObjIndexed<ObjectSchema, EntitySchemaOptions<{}>>((entity, name) => from(R.assoc('name', name, entity)))

export const getEntitySchemas: (obj: { [key: string]: ObjectSchema }) => { [key: string]: ObjectSchema } = R.filter(R.where({ directives: R.has(ENTITY) }))

export const fromTypes = R.pipe(
    getEntitySchemas,
    fromObj
)





