/// <reference types="ace" />
import { AutoComplete } from "./AutoComplete";
export declare class AutoCompleteView {
    editor: AceAjax.Editor;
    autoComplete: AutoComplete;
    private selectedClassName;
    wrap: HTMLDivElement;
    listElement: HTMLUListElement;
    constructor(editor: AceAjax.Editor, autoComplete: AutoComplete);
    show(): string;
    hide(): string;
    setPosition(coords: {
        pageY: number;
        pageX: string;
    }): string;
    current(): any;
    focusNext(): void;
    focusPrev(): void;
    ensureFocus(): void;
    adjustPosition(): void;
}
