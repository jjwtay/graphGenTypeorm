/// <reference path="../../node_modules/graphschematojson/src/types.d.ts"/>
/** @module templates/enum */

/**
 * @param {string} name
 * @param {Enum} enumType
 * @return {string}
 */
export default (name, enumType) =>

`export enum ${name} {
${enumType.fields.map(field => `    ${field}`).join(',\n')}   
}`