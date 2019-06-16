import { Connection } from 'typeorm'

export interface Context {
    connection: Connection
}
