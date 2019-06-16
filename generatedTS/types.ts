import { QueryArgs } from 'graphql_typeorm/dist/query'
import { Context } from './context'

export type ResolverFunction<S, T, U, V> = (parent: S, args: T, context: U) => V

export interface Author {
    id: number
    name: string
    rating?: number
    books: Book[]
}

export interface FindOneAuthor {
    id: number
}

export interface CreateUpdateAuthor {
    id: number
}

export type AuthorResolver = {
    Query: {
        author: ResolverFunction<any, { input: FindOneAuthor }, Context, Promise<Author>>
        authors: ResolverFunction<any, QueryArgs<Author>, Context, Promise<Author[]>>
    }
    Mutation: {
        createAuthor: ResolverFunction<any, { input: CreateUpdateAuthor }, Context, Promise<Author>>
        updateAuthor: ResolverFunction<
            any,
            { id: FindOneAuthor; patch: CreateUpdateAuthor },
            Context,
            Promise<Author>
        >
    }
}

export interface Book {
    id: number
    title: string
    author: Author
}

export interface FindOneBook {
    id: number
}

export interface CreateUpdateBook {
    id: number
}

export type BookResolver = {
    Query: {
        book: ResolverFunction<any, { input: FindOneBook }, Context, Promise<Book>>
        books: ResolverFunction<any, QueryArgs<Book>, Context, Promise<Book[]>>
    }
    Mutation: {
        createBook: ResolverFunction<any, { input: CreateUpdateBook }, Context, Promise<Book>>
        updateBook: ResolverFunction<
            any,
            { id: FindOneBook; patch: CreateUpdateAuthor },
            Context,
            Promise<Book>
        >
    }
}

export interface User {
    first: string
    last: string
    createdAt: Date
    updatedAt: Date
}

export interface FindOneUser {
    first: string
    last: string
}

export interface CreateUpdateUser {
    first: string
    last: string
}

export type UserResolver = {
    Query: {
        user: ResolverFunction<any, { input: FindOneUser }, Context, Promise<User>>
        users: ResolverFunction<any, QueryArgs<User>, Context, Promise<User[]>>
    }
    Mutation: {
        createUser: ResolverFunction<any, { input: CreateUpdateUser }, Context, Promise<User>>
        updateUser: ResolverFunction<
            any,
            { id: FindOneUser; patch: CreateUpdateAuthor },
            Context,
            Promise<User>
        >
    }
}
