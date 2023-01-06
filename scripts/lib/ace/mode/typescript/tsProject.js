define(["require", "exports", "./languageServiceHost"], function (require, exports, languageServiceHost_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getTSProject = void 0;
    if (typeof importScripts !== 'undefined') {
        importScripts('../mode/typescript/typescriptServices.js');
    }
    var TsProject = (function () {
        function TsProject() {
            this.languageServiceHost = (0, languageServiceHost_1.createLanguageServiceHost)('', "typescripts/lib.d.ts");
            this.languageService = ts.createLanguageService(this.languageServiceHost, ts.createDocumentRegistry());
        }
        return TsProject;
    }());
    var tsProject = null;
    function getTSProject() {
        return tsProject ? tsProject : tsProject = new TsProject();
    }
    exports.getTSProject = getTSProject;
});
