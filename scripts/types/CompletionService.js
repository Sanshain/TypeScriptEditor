"use strict";
exports.__esModule = true;
exports.CompletionService = void 0;
var EditorPosition_1 = require("./EditorPosition");
var tsProject_1 = require("./lib/ace/mode/typescript/tsProject");
var tsProject = (0, tsProject_1.getTSProject)();
var CompletionService = /** @class */ (function () {
    // public $tsProject = tsProject;
    function CompletionService(editor) {
        this.editor = editor;
        this.editorPos = new EditorPosition_1.EditorPosition(editor);
        // this.$tsProject = tsProject;
    }
    CompletionService.prototype.getCompilation = function (script, charpos, isMemberCompletion) {
        var compInfo = tsProject.languageService.getCompletionsAtPosition(script, charpos, {});
        return compInfo;
    };
    ;
    CompletionService.prototype.getCursorCompilation = function (script, cursor) {
        var isMemberCompletion, matches, pos, text;
        pos = this.editorPos.getPositionChars(cursor);
        text = this.editor.session.getLine(cursor.row).slice(0, cursor.column);
        isMemberCompletion = false;
        matches = text.match(/\.([a-zA-Z_0-9\$]*$)/);
        if (matches && matches.length > 0) {
            this.matchText = matches[1];
            isMemberCompletion = true;
            pos -= this.matchText.length;
        }
        else {
            matches = text.match(/[a-zA-Z_0-9\$]*$/);
            this.matchText = matches[0];
        }
        return this.getCompilation(script, pos, isMemberCompletion);
    };
    ;
    CompletionService.prototype.getCurrentPositionCompilation = function (script) {
        return this.getCursorCompilation(script, this.editor.getCursorPosition());
    };
    ;
    return CompletionService;
}());
exports.CompletionService = CompletionService;
