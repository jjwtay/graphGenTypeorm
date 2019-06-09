import { readFileSync, writeFileSync, readdirSync, existsSync, mkdirSync } from 'fs'
import prettier from 'prettier'
import { toTS, toJS } from './templates/model'
import { toTS as toInterface } from './templates/types'
import { toSchema } from 'graphschematojson/dist'
import { EntitySchemaOptions } from 'typeorm/entity-schema/EntitySchemaOptions'
import { fromSchema } from '.'
import * as R from 'ramda'

interface Config {
    outDir: string
    file?: string
    dir?: string
    format: 'ts' | 'js'
}

interface CliArgs extends Config {
    config?: string
}

const getArgs = R.reduce<string, CliArgs>((acc, arg: string) => {
    const split = arg.split('=')

    if (split.length === 2) {
        return R.assoc(split[0], split[1], acc)
    }
    return acc
}, { format: 'ts', outDir: './generated' })

const mergeConfig = (args: CliArgs) => {
    if (args.config) {
        return R.mergeLeft(import(args.config), args)
    }
    return args
}

R.pipe(
    getArgs,
    mergeConfig,
    (config: CliArgs) => {
        if (!config.file && !config.dir) {
            throw new Error('Must provide an input file or directory for .graphql or .gql files')
        }

        let schema = ''
        if (config.file) {
            schema = readFileSync(config.file, 'utf8')
        } else {
            const files = readdirSync(config.dir as string)

            schema = files
                .filter(file => file.includes('.graphql') || file.includes('.gql'))
                .map(file => readFileSync(`${config.dir}/${file}`, 'utf8'))
                .join('\n')
        }

        const jsObj = toSchema(schema)
        const types = fromSchema(jsObj)

        if (!existsSync(`${config.outDir}`)) {
            mkdirSync(config.outDir)
            mkdirSync(`${config.outDir}/models`)
        }

        if (config.format === 'ts') {
            // generate ts models
            R.mapObjIndexed((entity, name) => {
                writeFileSync(`${config.outDir}/models/${name}.ts`, prettier.format(toTS(entity), {
                    singleQuote: true,
                    printWidth: 100,
                    tabWidth: 4,
                    parser: 'typescript',
                    semi: false
                }))
            }, types)

        } else if (config.format === 'js') {
            // generate js models
            R.mapObjIndexed((entity, name) => {
                writeFileSync(`${config.outDir}/models/${name}.js`, prettier.format(toJS(entity), {
                    singleQuote: true,
                    printWidth: 100,
                    tabWidth: 4,
                    semi: false
                }))
            }, types)

            const typeFile = R.pipe<
                typeof types,
                { [key: string]: string },
                string[],
                string
            > (
                R.mapObjIndexed((entity: EntitySchemaOptions<{}>, name) => toInterface(entity)),
                R.values,
                R.join('\n')
            )(types)

            writeFileSync(`${config.outDir}/models/types.ts`, prettier.format(typeFile, {
                singleQuote: true,
                printWidth: 100,
                tabWidth: 4,
                parser: 'typescript',
                semi: false             
            }))
        } else {
            throw new Error('Output format has not been provided and cannot be inferred.')
        }
    }
)(process.argv)