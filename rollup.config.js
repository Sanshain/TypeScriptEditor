//@ts-check
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

import amd from 'rollup-plugin-amd';
import replace from '@rollup/plugin-replace';


import typescript from '@rollup/plugin-typescript';
import { createFilter } from '@rollup/pluginutils';
// import typescript from 'rollup-plugin-typescript2';


import MagicString from 'magic-string'
// module.exports = {}





const smartConverter = {

    defineToCjs: function (options = {}) {

        const filter = createFilter(options.include, options.exclude);

        return {
            name: 'defineToCjs',
            transform(code, file) {

                if (!filter(file)) return;

                // let source = new MagicString(code)

                // cjs
                code = code.replace('define(function(require, exports, module) {', '').replace(/\}\);/g, (match, offset, _content) => {
                    if (_content.length - offset < 7) return '';
                    else {
                        return match;
                    }
                })

                return {
                    code: code,
                    map: { mappings: '' }
                };
            }
        };
    },

    defineToIIfe(options = {}) {

        const filter = createFilter(options.include, options.exclude);

        return {
            name: 'defineToIIfe',
            transform(code, file) {

                if (!filter(file)) return;

                // let source = new MagicString(code)

                // iife
                code = code.replace('define', '').replace(/\}\);/g, (match, offset, _content) => {
                    if (_content.length - offset < 7) return '})();';
                    else {
                        return match;
                    }
                })

                return {
                    code: code,
                    map: null
                };
            }
        };
    },

    addDefault(options = {}) {
        const filter = createFilter(options.include, options.exclude);

        return {
            name: 'addDefault',
            transform(code, file) {                

                if (!filter(file)) return;

                // let source = new MagicString(code)

                // iife
                code = code + '\n\nexports.default = exports;'

                return {
                    code: code,
                    map: null
                };
            }
        };
    }
}





export default [
    {
        // input: './scripts/lib/ace/worker-typescript.src.js',
        input: './scripts/lib/ace/mode/typescript/typescript_worker.ts',
        output: {
            file: './scripts/lib/ace/worker-typescript.js',
            format: 'iife'
        },
        plugins: [
            resolve({
                browser: true,                
            }),
            smartConverter.defineToCjs({
                include: [
                    './scripts/lib/ace/lib/lang.js',
                    './scripts/lib/ace/worker/mirror.js',
                    './scripts/lib/ace/range.js',
                    './scripts/lib/ace/lib/oop.js',
                    './scripts/lib/ace/document.js',
                    "./scripts/lib/ace/apply_delta.js",
                    './scripts/lib/ace/lib/event_emitter.js',
                    './scripts/lib/ace/anchor.js',
                ]
            }),
            // amd({
            //     include: [
            //         // './scripts/lib/ace/worker/mirror.js',
            //         // './scripts/lib/ace/lib/oop.js'                    
            //     ]
            // }),
            smartConverter.addDefault({
                include: [                    
                    './scripts/lib/ace/lib/lang.js'
                ]
            }),
            commonjs({}),
            typescript({
                // module: 'CommonJS',                 
                // tsconfig: false, 
                lib: ["es6", "dom"], //es5
                target: "es5",
                sourceMap: true,
                // compilerOptions: {
                //     preserveSymlinks: false
                // }            
            })
        ]
    },
    {
        input: './scripts/editor.ts',
        // input: './source/app.ts',
        output: {
            file: './build/ts-editor.js',
            format: 'iife',
            // sourcemap: true
        },
        plugins: [
            resolve({
                browser: true,
            }),
            smartConverter.defineToCjs({
                include: [
                    './scripts/lib/ace/keyboard/hash_handler.js',
                    './scripts/lib/ace/lib/event_emitter.js',
                    './scripts/lib/ace/lib/keys.js',

                    './scripts/lib/ace/range.js',
                    './scripts/lib/ace/lib/oop.js',
                    './scripts/lib/ace/lib/lang.js',

                    /// works with total disabling amd plugin ignore but w on 'define' errors

                    './scripts/lib/ace/lib/fixoldbrowsers.js',
                    // './scripts/lib/ace/lib/regexp.js',
                    './scripts/lib/ace/lib/es5-shim.js',
                    './scripts/lib/ace/lib/useragent.js',

                ]
            }),
            smartConverter.defineToIIfe({
                include: [
                    './scripts/lib/ace/lib/regexp.js',
                ]
            }),
            commonjs({}),
            // amd({
            //     exclude: [
            //         // './scripts/lib/ace/lib/keys.js',

            //         // './scripts/lib/ace/keyboard/hash_handler.js',

            //         /// works with four last includes in defineToCjs but w on 'define' errors
            //         './scripts/lib/ace/lib/regexp.js',
            //     ]
            // }),
            typescript({
                // module: 'CommonJS', 
                // tsconfig: false, 
                lib: ["es6", "dom"], //es5
                target: "es5",
                sourceMap: true,
                // compilerOptions: {
                //     preserveSymlinks: false
                // }            
            }),
        ]
    }];