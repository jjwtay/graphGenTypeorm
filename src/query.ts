import { FindConditions } from 'typeorm/find-options/FindConditions'
import { FindOperator } from 'typeorm/find-options/FindOperator'
import * as R from 'ramda'
import { Equal, MoreThan, MoreThanOrEqual, Any, LessThan as LessThanORM, LessThanOrEqual as LessThanOrEqualORM, Not } from 'typeorm'
import { createBrotliDecompress } from 'zlib';

export type FieldType = string | number

export interface Equals<T extends FieldType> {
    $eq: T
}

export interface GreaterThan {
    $gt: number
}

export interface GreaterThanOrEqual {
    $gte: number
}

export interface In<T extends FieldType> {
    $in: T[]
}

export interface LessThan {
    $lt: number
}

export interface LessThanOrEqual {
    $lte: number
}

export interface NotEqual<T extends FieldType> {
    $ne: T
}

export interface NotIn<T extends FieldType> {
    $nin: T[]
}

export type NumberQuery = Equals<number> | GreaterThan | GreaterThanOrEqual | LessThan | LessThanOrEqual | In<number> | NotEqual<number> | NotIn<number>

export type StringQuery = Equals<string> | In<string> | NotEqual<string> | NotIn<string>

export type Query<T> = {
    readonly [P in keyof T]?: T[P] | (T[P] extends number ? NumberQuery : T[P] extends string ? StringQuery : Query<T[P]>)
}

export type SortDirection = 'ASC' | 'DESC'


export type Sort<T> = {
    name: keyof T
    id: SortDirection
}

export type QueryArgs<T> = {
    where: Query<T>
    order: Sort<T>
    take: number
    skip: number
}

export const createWhere = <T extends {}>(query: QueryArgs<T>) =>
    R.mapObjIndexed<FieldType | StringQuery | NumberQuery, FindOperator<T>>((value, key) => {
    if (R.has('$eq')) {
        return Equal((value as Equals<number> | Equals<string>).$eq)
    } else if (R.has('$gt')) {
        return MoreThan((value as GreaterThan).$gt)
    } else if (R.has('$gte')) {
        return MoreThanOrEqual((value as GreaterThanOrEqual).$gte)
    } else if (R.has('$in')) {
        return Any((value as any).$in)
    } else if (R.has('$lt')) {
        return LessThanORM((value as LessThan).$lt)
    } else if (R.has('$lte')) {
        return LessThanOrEqualORM((value as LessThanOrEqual).$lte)
    } else if (R.has('$ne')) {
        return Not(Equal((value as NotEqual<string> | NotEqual<number>).$ne))
    } else if (R.has('$nin')) {
        return Not(Any((value as any).$nin))
    }
    return Equal(value)
}, query.where)

export const createOrder = <T>(query: QueryArgs<T>) => query.order || {}

export const createQuery: <T>(query: QueryArgs<T>) => FindConditions<T> = R.applySpec({
    where: createWhere,
    order: createOrder,
    skip: R.propOr(0, 'skip'),
    take: R.propOr(1E100, 'take')
})