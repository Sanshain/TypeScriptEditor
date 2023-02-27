export declare class EditorPosition {
    editor: any;
    getPositionChars: Function;
    getAcePositionFromChars: Function;
    getCurrentCharPosition: Function;
    getCurrentLeftChar: Function;
    getPositionChar: Function;
    getPositionLeftChar: Function;
    constructor(editor: any);
    getLinesChars(lines: any): any;
    getChars(doc: any, pos: any): any;
    getPosition(doc: any, chars: any): {
        row: any;
        column: number;
    };
}
