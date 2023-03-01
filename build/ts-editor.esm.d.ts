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
    position?: AceAjax.Position;
    fileNavigator?: Record<string, string> & {
        _active: string;
    };
};
declare function loadLibFiles(libFiles?: string[]): ts.LanguageServiceHost;
declare function loadContent(filename: string, content: string, keepExistContent?: boolean): void;
declare function changeSelectFileName(filename: string): void;
declare const tsServiceHandler: {
    loadPackages: typeof loadLibFiles;
    loadContent: typeof loadContent;
    changeSelectFileName: typeof changeSelectFileName;
    removeFile: (fileName: string) => void;
    getLoadedFilenames: () => string[];
    hasFile: (fileName: any) => boolean;
    updateFile: (fileName: string, content: string) => void;
    _$editFile: (fileName: string, minChar: number, limChar: number, newText: string) => void;
    setCompilationSettings: (settings: ts.CompilerOptions) => void;
    getCompilationSettings: () => ts.CompilerOptions;
};
declare function dropMode(editor: AceAjax.Editor): AceAjax.Editor;
declare function initialize(options: InitialOptions): [typeof tsServiceHandler, AceAjax.Editor];

export { dropMode, initialize };
