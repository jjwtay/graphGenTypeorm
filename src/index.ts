import { fromTypes } from './entitySchema'
import * as R from 'ramda'
import { Schema } from 'graphschematojson/dist';
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions'

export const fromSchema = (schema: Schema) => fromTypes(schema.types)
