// define(["require", "exports", "./mode/typescript/DocumentPositionUtil.ts", "./lib/oop", "./worker/mirror", "./lib/lang", "./document", "./mode/typescript/tsProject.ts"], function (require, exports, DocumentPositionUtil_1, oop, mirror_1, lang, document_1, tsProject_1) {

    "use strict";    
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TypeScriptWorker = void 0;
    var tsProject = (0, tsProject_1.getTSProject)();
    function setupInheritanceCall(sender) {
        this.sender = sender;
        var doc = this.doc = new document_1.Document("");
        var deferredUpdate = this.deferredUpdate = lang.deferredCall(this.onUpdate.bind(this));
        var _self = this;
        sender.on("change", function (e) {
            var data = e.data;
            if (data[0].start) {
                doc.applyDeltas(data);
            }
            else {
                for (var i = 0; i < data.length; i += 2) {
                    var d;
                    if (Array.isArray(data[i + 1])) {
                        d = { action: "insert", start: data[i], lines: data[i + 1] };
                    }
                    else {
                        d = { action: "remove", start: data[i], end: data[i + 1] };
                    }
                    doc.applyDelta(d, true);
                }
            }
            if (_self.$timeout)
                return deferredUpdate.schedule(_self.$timeout);
            _self.onUpdate();
        });
        sender.on("addLibrary", function (e) {
            _self.addlibrary(e.data.name, e.data.content);
        });
        this.setOptions();
        sender.emit("initAfter");
    }
    ;
    var TypeScriptWorker = (function () {
        function TypeScriptWorker(sender) {
            var _this = this;
            this.sender = sender;
            this.setOptions = function (options) {
                _this.options = options || {};
            };
            this.changeOptions = function (newOptions) {
                oop.mixin(_this.options, newOptions);
                _this.deferredUpdate.schedule(100);
            };
            this.addlibrary = function (name, content) {
                tsProject.languageServiceHost.addScript(name, content);
            };
            this.getCompletionsAtPosition = function (fileName, pos, isMemberCompletion, id) {
                var ret = tsProject.languageService.getCompletionsAtPosition(fileName, pos);
                _this.sender.callback(ret, id);
            };
            this.onUpdate = function () {
                var fileName = "temp.ts";
                if (tsProject.languageServiceHost.hasScript(fileName)) {
                    tsProject.languageServiceHost.updateScript(fileName, _this.doc.getValue());
                }
                else {
                    tsProject.languageServiceHost.addScript(fileName, _this.doc.getValue());
                }
                var services = tsProject.languageService;
                var output = services.getEmitOutput(fileName);
                var jsOutput = output.outputFiles.map(function (o) { return o.text; }).join('\n');
                var allDiagnostics = services.getCompilerOptionsDiagnostics()
                    .concat(services.getSyntacticDiagnostics(fileName))
                    .concat(services.getSemanticDiagnostics(fileName));
                _this.sender.emit("compiled", jsOutput);
                var annotations = [];
                allDiagnostics.forEach(function (error) {
                    var pos = DocumentPositionUtil_1.DocumentPositionUtil.getPosition(_this.doc, error.start);
                    annotations.push({
                        row: pos.row,
                        column: pos.column,
                        text: error.messageText,
                        minChar: error.start,
                        limChar: error.start + error.length,
                        type: "error",
                        raw: error.messageText
                    });
                });
                _this.sender.emit("compileErrors", annotations);
            };
            setupInheritanceCall.call(this, sender);
        }
        return TypeScriptWorker;
    }());
    exports.TypeScriptWorker = TypeScriptWorker;
    oop.inherits(TypeScriptWorker, mirror_1.Mirror);
    (function () {
        var proto = this;
        ["getTypeAtPosition",
            "getSignatureAtPosition",
            "getDefinitionAtPosition"].forEach(function (elm) {
            proto[elm] = function (fileName, pos, id) {
                var ret = tsProject.languageService[elm](fileName, pos);
                this.sender.callback(ret, id);
            };
        });
        ["getReferencesAtPosition",
            "getOccurrencesAtPosition",
            "getImplementorsAtPosition"].forEach(function (elm) {
            proto[elm] = function (fileName, pos, id) {
                var referenceEntries = tsProject.languageService[elm](fileName, pos);
                var ret = referenceEntries.map(function (ref) {
                    return {
                        unitIndex: ref.unitIndex,
                        minChar: ref.ast.minChar,
                        limChar: ref.ast.limChar
                    };
                });
                this.sender.callback(ret, id);
            };
        });
        ["getNavigateToItems",
            "getScriptLexicalStructure",
            "getOutliningRegions "].forEach(function (elm) {
            proto[elm] = function (value, id) {
                var navs = tsProject.languageService[elm](value);
                this.sender.callback(navs, id);
            };
        });
    }).call(TypeScriptWorker.prototype);
// });
