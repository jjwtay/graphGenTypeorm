/// <reference path="../../node_modules/graphschematojson/src/types.d.ts"/>
/** @module templates/model */

import { getDecorators } from './decorator.js'
import { getFields } from './field.js'
import { getImports } from '../entity.js'

/**
 * @function
 * @param {Imports} imports 
 * @return {string}
 */
export const importsToImports = (imports) =>
    Object.keys(imports).map(importKey => 
        `import {${imports[importKey].named.join(', ')}} from '${importKey}'\n`
    ).join('')

/**
 * @function
 * @param {string} name
 * @param {Type} model
 * @return {string}
 */
export default (name, model) =>

`
${importsToImports(getImports(name, model))}

${getDecorators(model.directives)}
export class ${name} {

${getFields(model.fields)}

}
`

