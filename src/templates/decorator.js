/// <reference path="../../node_modules/graphschematojson/src/types.d.ts"/>
/** @module templates/decorator */

import util from 'util'
import * as consts from '../consts'

/**
 * @function
 * @param {Object.<string, Directive>} directives 
 * @param {string} suffix
 * @return {string}
 */
export const getDecorators = (directives, suffix = '\n') =>
    Object.keys(directives).reduce((decorators, directiveKey) => {
        if (consts.NAMED_EXPORTS.includes(directiveKey)) {
            return decorators.concat(getDecorator(directiveKey, directives[directiveKey]))
        }
        return decorators
    }, []).join(suffix)
    
    
    //.map(directiveKey => getDecorator(directiveKey, directives[directiveKey])).join(suffix)

/**
 * 
 * @param {string} name 
 * @param {Directive} decorator 
 */
const decoratorToString = (name, decorator) => {
    if (consts.REL_FIELDS.includes(name)) {
        return `${decorator.type}, ${decorator.map}`
    }
    return `${util.inspect(decorator)}`
}
/**
 * @function
 * @param {string} name
 * @param {Directive} decorator
 * @return {string}
 */
export const getDecorator = (name, decorator) =>
    Object.keys(decorator).length === 0 ?
        `@${name}()` :

        `@${name}(${decoratorToString(name, decorator)})`