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


export default (
/** @type {{name: string, model: Type, isJS: boolean}} */
{
    name,
    model,
    isJS = false
}) =>

`
${importsToImports(getImports(name, model))}

${isJS ? '/** @class */' : ''}
${getDecorators(model.directives)}
export class ${name} {

${getFields({fields: model.fields, isJS})}

}
`

