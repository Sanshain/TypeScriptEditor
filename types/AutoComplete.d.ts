/// <reference types="ace" />
import { CompletionService } from "./CompletionService";
export declare class AutoComplete {
    editor: any;
    script: any;
    completionService: CompletionService;
    listElement: any;
    inputText: string;
    _active: boolean;
    handler: any;
    view: any;
    scriptName: any;
    _emit: any;
    constructor(editor: any, script: any, completionService: CompletionService);
    isActive: () => boolean;
    setScriptName: (name: any) => void;
    show: () => void;
    hide: () => void;
    compilation: (cursor: any) => any;
    refreshCompletions: (e: AceAjax.EditorChangeEvent) => void;
    showCompilation: (infos: ts.CompletionEntry[]) => void;
    active: () => void;
    deactivate: () => void;
}
