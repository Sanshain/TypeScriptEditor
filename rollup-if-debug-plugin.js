//@ts-check

import { createFilter } from '@rollup/pluginutils';
import MagicString from 'magic-string';


/**
 * 
 * @param {{
 *      include?: string,
 *      exclude?: string,
 *      release: boolean,
 *      verbose?: boolean
 * }} options 
 * @returns {{name: string, transform: Function}}
 */
export function ifDebug(options = { verbose: false, release: true }) {

    const filter = createFilter(options.include, options.exclude);
    // TODO: let branch = exec('git rev-parse --abbrev-ref HEAD') -> branches

    return {
        name: 'rollup-if-debug',
        /**
         * 
         * @param {string} code 
         * @param {string} file 
         * @returns {{code: string, map?: {mappings: MagicString|''|null}}}
         * @_returns {Promise<{code: string, map?: {mappings: MagicString|''|null}}>}
         */
        transform(code, file) {

            if (!filter(file) || !options.release) return;

            let source = new MagicString(code)

            // ~~ if `([\w,_ \(\)\="'\.\+]+)`

            source.replaceAll(/\/\/ if DEBUG([\s\S]+)\/\/ endif/g, function (block, content) {
                
                options.verbose && console.log(file);

                return '';
            })

            let generatedCode = source.toString()

            let r = { code: generatedCode, map: source.generateMap({ hires: false, file: file }) };

            //@ts-expect-error
            return r;
        }
    };
}