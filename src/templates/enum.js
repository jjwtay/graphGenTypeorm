/// <reference path="../../node_modules/graphschematojson/src/types.d.ts"/>
/** @module templates/enum */

/**
 * @param {string} name
 * @param {Enum} enumType
 * @return {string}
 */
export default ({name, enumType, isJS = false}) => !isJS ?

`export enum ${name} {
${enumType.fields.map(field => `    ${field}`).join(',\n')}   
}` :

`
/**
 * @type {{[key: string]: number}}
 */
export const ${name} = {

${enumType.fields.map((field, index) => `   ${field}: ${index + 1}`).join(',\n')}
}`

