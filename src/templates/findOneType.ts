import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions'
import { typeOrmToTs } from '../consts'
import * as R from 'ramda'
import { EntitySchemaColumnOptions } from 'typeorm';

export default <T extends {}>(entitySchema: EntitySchemaOptions<T>) => R.pipe<
        EntitySchemaOptions<T>,
        Record<string, EntitySchemaColumnOptions>,
        Record<string, EntitySchemaColumnOptions>,
        [string, EntitySchemaColumnOptions][],
        string[],
        string,
        string,
        string
    > (
        R.propOr({}, 'columns'),
        R.pickBy(R.whereEq({ primary: true })),
        R.toPairs,
        R.map(([name, column]) => `   ${column.name || name}: ${typeOrmToTs[column.type as string]}`),
        R.join('\n'),
        R.concat(`export interface FindOne${entitySchema.name} {`),
        (str: string) => `${str} }`
    )(entitySchema)