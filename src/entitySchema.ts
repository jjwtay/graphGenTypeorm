import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions'
import { ObjectSchema } from 'graphschematojson/dist/object'
import { fromTypes as fromTypesColumns } from './column'
import { fromTypes as fromTypesRelations } from './relation'
import { ENTITY } from './consts'
import * as R from 'ramda'

export const fromObject = R.applySpec<EntitySchemaOptions<{}>>({
    name: R.prop('name'),
    columns: fromTypesColumns,
    relations: fromTypesRelations
})

export const fromEntitiesObject = R.mapObjIndexed((entity: ObjectSchema, name): EntitySchemaOptions<{}> => fromObject(R.assoc('name', name, entity)))

export const getEntities = R.pickBy(R.where({ directives: R.has(ENTITY) }))

export const fromTypes = R.pipe<
    Record<string, ObjectSchema>,
    Record<string, ObjectSchema>,
    Record<string, EntitySchemaOptions<{}>>
    > (
    getEntities,
    fromEntitiesObject
)