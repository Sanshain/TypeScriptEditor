
// We are running in the worker?
// Load up ts ourselves
if (typeof importScripts !== 'undefined' && globalThis.ts === undefined) {
    // Path needs to be relative to `ace/worker`
    // importScripts('../mode/typescript/typescriptServices.js')
    // importScripts('./mode/typescript/typescriptServices.js')
    // importScripts(document.location.origin + '/scripts/lib/ace/mode/typescript/typescriptServices.ts');
    
    // importScripts('https://cdnjs.cloudflare.com/ajax/libs/typescript/4.9.4/typescript.min.js')
    // importScripts('https://unpkg.com/typescript@latest/lib/typescriptServices.js')    
    importScripts('https://unpkg.com/typescript@1.5.3/bin/typescript.js')
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
        this.languageService = ts.createLanguageService(this.languageServiceHost, ts.createDocumentRegistry());
    }
}

var tsProject: TsProject = null;
export function getTSProject() {
    return tsProject ? tsProject : tsProject = new TsProject();
}