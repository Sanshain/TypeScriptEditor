
// We are running in the worker?
// Load up ts ourselves
if (typeof importScripts !== 'undefined' && globalThis.ts === undefined) {
    // Path needs to be relative to `ace/worker`
    
    /// :::legacy (dont work:)
    // importScripts('../mode/typescript/typescriptServices.js')
    // importScripts('./mode/typescript/typescriptServices.js')

    /// :::too (слишком) new:
    // importScripts('https://unpkg.com/typescript@latest/lib/typescriptServices.js')

    /// :::below works: 
    
    /// :absolute path (unpractical):
    // importScripts(location.origin + '/scripts/lib/ace/mode/typescript/typescriptServices.js');        
    /// :starting from ver 4.6.4 the remote script is not downloading (on low speed connection may be download old vers like 2.1.1 - its only 1mb instead of 3mb minified):
    importScripts('https://cdnjs.cloudflare.com/ajax/libs/typescript/4.6.4/typescript.min.js')
    /// :nearly origin:
    // importScripts('https://unpkg.com/typescript@1.5.3/bin/typescript.js')
}

import {createLanguageServiceHost, LanguageServiceHost} from "./languageServiceHost";

/**
 * Wraps up `langaugeService` `languageServiceHost` in a single package
 */
class TsProject {
    public languageServiceHost: LanguageServiceHost;
    public languageService: ts.LanguageService;

    constructor() {
        this.languageServiceHost = createLanguageServiceHost('', "typescripts/lib.d.ts");
        this.languageService = ts.createLanguageService(this.languageServiceHost, ts.createDocumentRegistry(
            // true,
            // ''
        ));
        this.languageServiceHost.setCompilationSettings({
          // jsx: 1,
            jsx: 4,
        //   jsx: 5,
          baseUrl: "./",
          esModuleInterop: true
          // rootDir: ''
          // include: ['./**/*.ts']
        });
        // "esModuleInterop": true,?
    }
}

var tsProject: TsProject = null;
export function getTSProject() {
    return tsProject ? tsProject : tsProject = new TsProject();
}