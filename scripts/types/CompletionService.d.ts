import { EditorPosition } from './EditorPosition';
export declare class CompletionService {
    editor: any;
    editorPos: EditorPosition;
    matchText: string;
    constructor(editor: any);
    getCompilation(script: any, charpos: any, isMemberCompletion: any): any;
    getCursorCompilation(script: any, cursor: any): any;
    getCurrentPositionCompilation(script: any): any;
}
