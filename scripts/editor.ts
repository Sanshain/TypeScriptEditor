import { javascriptRun, readFile } from "./utils";

// import ace = require('./lib/ace/ace');
import {Range as AceRange} from './lib/ace/range';
import {AutoComplete} from './AutoComplete';
// import lang = require("./lib/ace/lib/lang");
import {EditorPosition} from './EditorPosition';
import {CompletionService} from './CompletionService';
import { deferredCall } from "./lib/ace/lib/lang";


type InitialOptions = ({ editor?: AceAjax.Editor, selector?: undefined } | { editor?: undefined, selector?: string }) & {
    entryFile?: string,
    content?: string,
    signatureToolTip?: boolean,
    fontSize?: string,
    libFiles?: string[],
    position?: AceAjax.Position,
    fileNavigator?: Record<string, string> & {_active: string}
}


function defaultFormatCodeOptions(): ts.FormatCodeOptions {
    return {
        IndentSize: 4,
        TabSize: 4,
        NewLineCharacter: "\n",
        ConvertTabsToSpaces: true,

        InsertSpaceAfterCommaDelimiter: true,
        InsertSpaceAfterSemicolonInForStatements: true,
        InsertSpaceBeforeAndAfterBinaryOperators: true,
        InsertSpaceAfterKeywordsInControlFlowStatements: true,
        InsertSpaceAfterFunctionKeywordForAnonymousFunctions: false,
        InsertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis: false,
        PlaceOpenBraceOnNewLineForFunctions: false,
        PlaceOpenBraceOnNewLineForControlBlocks: false,

        IndentStyle: 0,
        InsertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets: false,
        InsertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces: false
    };
}

const ace = window.ace;

var aceEditorPosition = null;

let signatureToolTip: HTMLElement = null;
let originalTextInput: (s: string) => void = null;
let closuredEvents: { [k in 'compileErrors' | 'mousedown']?: Function } = {};
let fileNavigator: Record<string, string> & { _active: string } = null;


var editor:AceAjax.Editor = null;
var docUpdateCount = 0;


var selectFileName = "";

var syncStop = false; //for stop sync on loadfile
var autoComplete = null;
var refMarkers = [];
var errorMarkers =[];

// Start updating latest
import {getTSProject} from "./lib/ace/mode/typescript/tsProject";
import { extend } from './lib/ace/mode/coffee/nodes';
var tsProject = getTSProject();

/**
 * @description load initial lib files to languageServiceHost if not exists and to worker (w/o checking on exists) on first loading
 */
function loadLibFiles(libFiles?: string[]): ts.LanguageServiceHost {

    var libFiles = libFiles || [
        // "typescripts/lib.d.ts",
        "/typescripts/4.9.5/lib.dom.d.ts",
        "/typescripts/4.9.5/lib.es5.d.ts",
        // "/typescripts/4.9.5/lib.es2015.iterable.d.ts",      // Map, Set, WeakMap
        "/typescripts/4.9.5/lib.dom.iterable.d.ts",         // FormData (+ Symbol as Iterator, some WebGL2context types)
        // "/typescripts/4.9.5/lib.es2015.promise.d.ts",       // Promise.reject, Promise.resolve
        // "/typescripts/4.9.5/lib.es2015.proxy.d.ts",
        // "/typescripts/4.9.5/lib.es2015.reflect.d.ts",
    ];
    
    // Load files here 
    libFiles.forEach(function (libname) {
        if (tsProject.languageServiceHost.hasScript(libname) === false) {
            readFile(libname, function (content) {
                tsProject.languageServiceHost.addScript(libname, content);
            });   
        }
    });

    // Load files in the worker
    workerOnCreate(function(){//TODO use worker init event
        libFiles.forEach(function(libname){
            readFile(libname, function(content){
                var params = {
                    data: {
                        name:libname,
                        content:content
                    }
                };
                editor.getSession().$worker.emit("addLibrary", params );
            });
        });
    }, 100);

    return tsProject.languageServiceHost
}

function loadFile(filename: string) {
    readFile(filename, function(content){
        loadContent(filename, content);
    });
}


/**
 * 
 * @param filename 
 * @param content - content for type checking
 * @param keepExistContent - flag to keep editor content if exists inside origin Ace 
 */
function loadContent(filename: string, content: string, keepExistContent?: boolean) {
    selectFileName = filename;
    syncStop = true;    
    if (!keepExistContent) {
        var data = content.replace(/\r\n?/g, "\n");
        editor.session.setValue(data);
        // editor.moveCursorTo(0, 0);
    }
    tsProject.languageServiceHost.addScript(filename, editor.getSession().getDocument().getValue());
    syncStop = false;
}

function getFileContent(name:string) {
    return tsProject.languageServiceHost.getScriptContent(name);
}

function getSelectFileName() {
    return selectFileName;
}

function changeSelectFileName(filename: string) {
    selectFileName = filename;
    // editor.session.$worker.changeActiveFile({ data: filename })
    editor.session.$worker.emit('changeActiveFile', {data: filename})
}

const tsServiceHandler = {
    /**
     * @description
    * - add script to languageServiceHost
    * - apply $worker.emit("addLibrary")
     */
    loadPackages: loadLibFiles,
    /**
     * @description loadContent alias - use to load entry file name and content
     * - add script to languageServiceHost
     * - set file as selectFileName (active file for autocomplete) 
     *
     * - require use with adding to worker like loadLibFiles for correct type checking
     * @example editor.getSession().$worker.emit("addLibrary", {data: { name:libname, content:content }} );
     * @info keep also in mind `removeLibrary` and `updateModule` emit commands
     */
    loadContent: loadContent,

    changeSelectFileName,
    removeFile: tsProject.languageServiceHost.removeScript,

    getLoadedFilenames: tsProject.languageServiceHost.getScriptFileNames,
    getFileContent,
    getSelectFileName,

    hasFile: tsProject.languageServiceHost.hasScript,
    updateFile: tsProject.languageServiceHost.updateScript,
    
    setCompilationSettings: tsProject.languageServiceHost.setCompilationSettings,
    getCompilationSettings: tsProject.languageServiceHost.getCompilationSettings,    
    _$editFile: tsProject.languageServiceHost.editScript,                           // not fixed file name yet (look up TODO-s inside)
}

function startAutoComplete(editor){
    if (autoComplete.isActive() == false){
        autoComplete.setScriptName(selectFileName);
        autoComplete.active();
    }
}

function onUpdateDocument(e: AceAjax.EditorChangeEvent) {
    if (selectFileName) {
        if (!syncStop) {
            syncTypeScriptServiceContent(selectFileName, e);
            updateMarker(e);
        }
    }
}

// TODO check column
function updateMarker(data: AceAjax.EditorChangeEvent) {    

    var action = data.action;
    var action = data.action;
    var start = aceEditorPosition.getPositionChars(data.start);
    var end = aceEditorPosition.getPositionChars(data.end);    
    var newText = editor.getSession().getTextRange(new AceRange(data.start.row, data.start.column, data.end.row, data.end.column));
    
    var markers = editor.getSession().getMarkers(true);
    var line_count = 0;
    var isNewLine = editor.getSession().getDocument().isNewLine;

    if(action == "insert"){
        if(isNewLine(newText)){
            line_count = 1;
        }
    }else if (action == "remove") {
        if(isNewLine(newText)){
            line_count = -1;
        }
    }
    
    if (line_count != 0) {
        

        var markerUpdate = function(id){
            var marker = markers[id];
            var row = data.start.row;

            if(line_count > 0){
                row = +1;
            }

            if(marker && marker.range.start.row > row ){
                marker.range.start.row += line_count ;
                marker.range.end.row += line_count ;
            }
        };

        errorMarkers.forEach(markerUpdate);                
        refMarkers.forEach(markerUpdate);
        (<any>editor).onChangeFrontMarker();
    }

}

//sync LanguageService content and ace editor content
function syncTypeScriptServiceContent(script, data:AceAjax.EditorChangeEvent){

    var action = data.action;
    var start = aceEditorPosition.getPositionChars(data.start);
    var end = aceEditorPosition.getPositionChars(data.end);
    var newText = editor.getSession().getTextRange(new AceRange(data.start.row, data.start.column, data.end.row, data.end.column));
    if(action == "insert"){
        editLanguageService(script, start,start,newText);
    }else if (action == "remove") {        
        editLanguageService(script, start,end,"");
    }
    else{
        console.error('unknown action:',action)
    }
};


function editLanguageService(name: string, minChar: number, limChar: number, newText: string){
    tsProject.languageServiceHost.editScript(name, minChar, limChar, newText);
}

function onChangeCursor(e){
    if(!syncStop){
        try{
            deferredShowOccurrences.schedule(200);            
        }catch (ex){
            //TODO
        }
    }
};

function languageServiceIndent(){
    var cursor = editor.getCursorPosition();
    var lineNumber = cursor.row;

    var text  = editor.session.getLine(lineNumber);
    var matches = text.match(/^[\t ]*/);
    var preIndent = 0;
    var wordLen = 0;

    if(matches){
        wordLen = matches[0].length;
        for(var i = 0; i < matches[0].length; i++){
            var elm = matches[0].charAt(i);
            var spaceLen = (elm == " ") ? 1: editor.session.getTabSize();
            preIndent += spaceLen;
        };
    }

    var smartIndent = tsProject.languageService.getIndentationAtPosition(selectFileName, lineNumber, defaultFormatCodeOptions());

    if(preIndent > smartIndent){
        editor.indent();
    }else{
        var indent = smartIndent - preIndent;

        if(indent > 0){
            editor.getSelection().moveCursorLineStart();
            editor.commands.exec("inserttext", editor, {text:" ", times:indent});
        }

        if( cursor.column > wordLen){
            cursor.column += indent;
        }else{
            cursor.column = indent + wordLen;
        }

        editor.getSelection().moveCursorToPosition(cursor);
    }
}

function refactor(){
    var references = tsProject.languageService.getOccurrencesAtPosition(selectFileName, aceEditorPosition.getCurrentCharPosition());

    references.forEach(function(ref){
        var getpos = aceEditorPosition.getAcePositionFromChars;
        var start = getpos(ref.textSpan.start);
        var end = getpos(ref.textSpan.start + ref.textSpan.length);
        var range = new AceRange(start.row, start.column, end.row, end.column);
        editor.selection.addRange(range);
    });
}

function showOccurrences(){
    var session = editor.getSession();
    refMarkers.forEach(function (id){
        session.removeMarker(id);
    });
        
    let references = tsProject.languageService.getOccurrencesAtPosition(selectFileName, aceEditorPosition.getCurrentCharPosition());
    if(!references){
        // none found. This is a valid response
        return;
    }
    references.forEach(function(ref){
        //TODO check script name
        // console.log(ref.unitIndex);
        var getpos = aceEditorPosition.getAcePositionFromChars;
        var start = getpos(ref.textSpan.start);
        var end = getpos(ref.textSpan.start + ref.textSpan.length);
        var range = new AceRange(start.row, start.column, end.row, end.column);
        refMarkers.push(session.addMarker(range, "typescript-ref", "text", true));
    });
}

var deferredShowOccurrences = deferredCall(showOccurrences);

/** Keeps running the func till worker is present */
function workerOnCreate(func, timeout){
    if(editor.getSession().$worker){
        func(editor.getSession().$worker);
    }else{
        setTimeout(function(){
            workerOnCreate(func, timeout);
        });
    }
}


// /**
//  *
//  * @param editor
//  * @param {{
//  *  content?: string,                       // file content
//  *  entryFile?: string                      // entry file name
//  * }} options
//  */
// export function asMode(editor: AceAjax.Editor, options: { content?: string, entryFile?: string}){
//     options = options || {}
//     const selector = editor.container;
//     editor.session.setMode('ace/mode/typescript');

//     // document.getElementById(selector).style.fontSize = '14px';

//     loadLibFiles();
//     if (options.content) {
//         loadContent(options.entryFile || 'app.ts', options.content)
//     }

//     editor.addEventListener("change", onUpdateDocument);
//     editor.addEventListener("changeSelection", onChangeCursor);
// }


/**
 * @description Remove all ts-specific listeners
 * @param editor 
 * @returns 
 */
export function dropMode(editor: AceAjax.Editor): AceAjax.Editor {

    editor.removeEventListener("change", onUpdateDocument);
    editor.removeEventListener("changeSelection", onChangeCursor);

    editor.session.selection.off('changeCursor', enableHinter);
    
    ['autoComplete', 'refactor', 'indent'].forEach(w => editor.commands.removeCommand(w, true));

    editor.onTextInput = originalTextInput;

    // Object.entries(closuredEvents).forEach(([k, ev]) => editor.removeEventListener(k, ev))
    
    editor.removeEventListener('mousedown', closuredEvents['mousedown'])
    //@ts-expect-error // TODO update Ace types
    editor.session.off('compileErrors', closuredEvents['compileErrors'])

    return editor;
}


/**
 * 
 * @param options 
 * @example 
 * initialize({editor: editor})
 * 
 */
// export function initialize(options: InitialOptions): [ts.LanguageServiceHost, AceAjax.Editor] {
export function initialize(options: InitialOptions): [typeof tsServiceHandler, AceAjax.Editor] {
    
    options = options || {}
    fileNavigator = options.fileNavigator = options.fileNavigator || {
        _active: options.entryFile || 'app.ts'
    }
    const selector = options.selector || "editor";
    
    editor = options.editor || ace.edit(selector);    
    if (!options.editor) editor.setTheme("ace/theme/monokai");    
    editor.getSession().setMode('ace/mode/typescript');       
    
    
    // var outputEditor: AceAjax.Editor = ace.edit("output");
    // outputEditor.setTheme("ace/theme/monokai");
    // outputEditor.getSession().setMode('ace/mode/javascript');


    if (selector) {

        let wrapper = document.getElementById(selector)        
        if (wrapper) {
            wrapper.style.fontSize = options.fontSize || '14px';
        }
    }

    let languageService = loadLibFiles(options.libFiles);
    if (options.content || options.editor) {
        loadContent(options.entryFile || options.fileNavigator._active || 'app.ts', options.content || options.editor.getValue(), !!options.editor)
    }
    // if DEBUG
    else if(!options.editor) {        
        // if (options.contentFile)
        loadFile(options.entryFile || "samples/greeter.ts");
    }
    // endif
    

    editor.addEventListener("change", onUpdateDocument);
    editor.addEventListener("changeSelection", onChangeCursor);    
    
    if (options.signatureToolTip) {        
        editor.session.selection.on('changeCursor', enableHinter);
    }

    if (options.position) editor.moveCursorTo(options.position.row, options.position.column)

    editor.commands.addCommands([
        {
            name:"autoComplete",
            bindKey:"Ctrl-Space",
            exec:function(editor) {
                startAutoComplete(editor);
            }
        },
        {
            name: "refactor",
            bindKey: "F2",
            exec: function (editor) {
                refactor();
            }
        },
        {
            name: "indent",
            bindKey: "Tab",
            exec: function (editor) {
                languageServiceIndent();
            },
            // multiSelectAction: "forEach"
        }        
    ]);

    aceEditorPosition = new EditorPosition(editor);
    autoComplete = new AutoComplete(editor, selectFileName, new CompletionService(editor));

    // override editor onTextInput
    originalTextInput = editor.onTextInput;
    
    editor.onTextInput = function (text) {
        originalTextInput.call(editor, text);  

        let pos = editor.getCursorPosition();
        let token = editor.session.getTokenAt(pos.row, pos.column);
        
        if (token && token.value.length > 1 && token.value.match(/\w[\w\d_\$]+/)) {            
            
            editor.execCommand("autoComplete");
            return
        }

        if(text == "."){
            editor.execCommand("autoComplete");

        }else if (editor.getSession().getDocument().isNewLine(text)) {
            var lineNumber = editor.getCursorPosition().row;
            const prettierOptions: ts.FormatCodeOptions = defaultFormatCodeOptions();
            var indent = tsProject.languageService.getIndentationAtPosition(selectFileName, lineNumber, prettierOptions);
            
            if(indent > 0) {
                editor.commands.exec("inserttext", editor, { text: " ", times: prettierOptions.IndentSize - 5});
            }
        }
    };

    editor.addEventListener("mousedown", closuredEvents["mousedown"] = function (e) {
        
        if(autoComplete.isActive()){
            autoComplete.deactivate();
        }
    });

    editor.getSession().on("compiled", function(e){
        // outputEditor.getSession().doc.setValue(e.data);
    });

    editor.getSession().on("compileErrors", closuredEvents["compileErrors"] = function (e) {
        var session = editor.getSession();
        errorMarkers.forEach(function (id){
            session.removeMarker(id);
        });
        
        e.data.forEach(function(error: { minChar: any; limChar: any; }){
            var getpos = aceEditorPosition.getAcePositionFromChars;
            var start = getpos(error.minChar);
            var end = getpos(error.limChar);
            var range = new AceRange(start.row, start.column, end.row, end.column);
            errorMarkers.push(session.addMarker(range, "typescript-error", "text", true));            
        });
    });    
    
    // return [languageService, editor];
    return [tsServiceHandler, editor];

}




/**
 * @description adds listener to changeCursor, which waits for the start of the function when the user writes
 * @param e 
 */
function enableHinter(e: Event) {

    if (signatureToolTip) {
        if (signatureToolTip.parentElement)
            signatureToolTip.parentElement.removeChild(signatureToolTip);
        else if (signatureToolTip.remove) {
            signatureToolTip.remove();
        }
    }    
    
    let pos = editor.getCursorPosition();
    let range = editor.session.getTextRange(new AceRange(0, 0, pos.row, pos.column));
    let arr = range.split('\n');
    let flatPos = arr.length + arr.reduce((acc, line) => acc + line.length, 0);

    /// RESEARCH lines:

    // const dummyScriptName = "samples/greeter.ts"
    // let program = tsProject.languageService.getProgram()
    // var typeChecker = program.getTypeChecker();
    // var sf = program.getSourceFile(dummyScriptName);
    // let decl = sf.getNamedDeclarations(flatPos)  // is absent
    // console.log(decl);
    // let log = tsProject.languageService.getTypeDefinitionAtPosition("samples/greeter.ts", flatPos)  // return {name: type} for variables only
    // let log = tsProject.languageService.getQuickInfoAtPosition("samples/greeter.ts", flatPos,)  // r.displayParts.filter(k => k.kind == 'parameterName').map(k => k.text)
    // let log = tsProject.languageService.getDefinitionAtPosition("samples/greeter.ts", flatPos,)    // return {kind: 'method'|'function'}


    let token = editor.session.getTokenAt(pos.row, pos.column);

    if (token && token.value == '(') {

        // tooltip:
        let info = tsProject.languageService.getDefinitionAtPosition(fileNavigator._active || "samples/greeter.ts", flatPos - 2);        

        if (info && info.length) {            

            if (~['function', 'method'].indexOf(info[0].kind)) {

                let quickInfo = tsProject.languageService.getQuickInfoAtPosition(fileNavigator._active || "samples/greeter.ts", flatPos - 2);

                if (quickInfo && Array.isArray(quickInfo.displayParts)) {
                    let params = quickInfo.displayParts.filter(k => k.kind == 'parameterName').map(k => k.text);

                    const textInputBound: DOMRect = editor['textInput'].getElement().getBoundingClientRect();
                    signatureToolTip = editor.container.appendChild(document.createElement('div'));
                    signatureToolTip.className = 'tooltip';
                    signatureToolTip.style.top = textInputBound.top + 2 + 'px';
                    signatureToolTip.style.left = textInputBound.left + 10 + 'px';
                    signatureToolTip.innerText = info[0].name + '(' + params.toString().split(',').join(', ') + ')';
                }
            }
        }

    }
}

