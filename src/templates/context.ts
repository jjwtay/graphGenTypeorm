import * as R from 'ramda'
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions'

export const toTS = () => `
import { Connection } from 'typeorm'

export interface Context {
    connection: Connection
}
`