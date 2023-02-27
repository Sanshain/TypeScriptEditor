declare type InitialOptions = ({
    editor?: AceAjax.Editor;
    selector?: undefined;
} | {
    editor?: undefined;
    selector?: string;
}) & {
    entryFile?: string;
    content?: string;
    signatureToolTip?: boolean;
    fontSize?: string;
    libFiles?: string[];
};
declare function dropMode(editor: AceAjax.Editor): AceAjax.Editor;
declare function initialize(options: InitialOptions): ts.LanguageServiceHost;

export { dropMode, initialize };
