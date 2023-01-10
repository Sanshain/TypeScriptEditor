//@ts-check
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

import amd from 'rollup-plugin-amd';
import replace from '@rollup/plugin-replace';
// import rollup from 'rollup'


import typescript from '@rollup/plugin-typescript';
import { createFilter } from '@rollup/pluginutils';
// import typescript from 'rollup-plugin-typescript2';


import MagicString from 'magic-string'
import { uglify } from "rollup-plugin-uglify";
// module.exports = {}


import path from 'path';
import fs from 'fs';
const execSync = require('child_process').execSync;


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

const MINIFY = false;



export default [
    {
        // input: './scripts/lib/ace/worker-typescript.src.js',
        input: './scripts/lib/ace/mode/typescript/typescript_worker.ts',
        output: {
            file: './scripts/lib/ace/mode/typescript/typescript_worker.cjs.js',
            // file: './scripts/lib/ace/worker-typescript.js', <= its wrong because:
            //      lib/ace/worker.js is entrypoint =>
            //          => build 'lib/ace/(worker/worker.js + mode/typescript_worker.js)' => worker-typescript.js
            //      src/mode/typescript.js is entrypoint =>
            //          => mode-typescript.js
            
            // The generated file is playing role of content for 'lib/ace/mode/typescript_worker.js' wrapped to define func

            // format: 'iife'
            format: 'cjs'
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
            }),
            (function(target, dest) {
                return {
                    name: 'ace-builder',
                    /**
                     * Wrap generated cjs file to define func => save to origin ace project => build origin ace project => copy generated to the origin dir worker-typescript.js
                     * 
                     * @param {{file: string}} opts - options
                     * @param {{[fileName: string]: {code: string}}} bundle - generated cjs content for 'typescript_worker.js'
                     */
                    generateBundle(opts, bundle) {                        

                        const file = path.parse(opts.file).base
                        let code = bundle[file].code
                        code = `define(function(require, exports, module) {\n\n${code}\n\n});`                        
                        fs.writeFileSync(target, code);     //// => ace/lib/ace/mode/typescript_worker                      /// => worker-typescript.js
                        
                        [
                            'typescript.js',
                            'typescript/typescript_create_worker.js'
                        ]
                            .forEach(_file => {
                                const definedTsMode = fs.readFileSync(`./scripts/lib/ace/mode/${_file}`);
                                const tsModeCjs = smartConverter.defineToCjs().transform(definedTsMode.toString(), _file)
                                fs.writeFileSync(`../ace/src/mode/${_file}`, tsModeCjs.code);                          /// => mode-typescript.js
                            })
                        
                        let output = execSync('node ../ace/Makefile.dryice.js' + (MINIFY ? ' -m' : ''));
                        console.log(output.toString());

                        ['mode', 'worker'].forEach(mode => {

                            fs.copyFile(`../ace/build/src${MINIFY ? '-min' : ''}/${mode}-typescript.js`, `./scripts/lib/ace/${mode}-typescript.js`, function (err) {
                                if (err) throw err;
                                console.log(`${mode}-typescript.js was copied to the "scripts/lib/ace/" directory`);
                            })
                        })

                    }
                }
            })('../ace/lib/ace/mode/typescript_worker.js')
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
            })
        ].concat(MINIFY ? [
            uglify({
                mangle: false
            })
        ] : [])
    }];