type InitialOptions = ({
    editor?: AceAjax.Editor;
    selector?: undefined;
} | {
    editor?: undefined;
    selector?: string;
}) & {
    entryFile?: string;
    content?: string;
    libFiles?: string[];
    aliasedLibFiles?: Record<string, string>;
    fileNavigator?: Record<string, string> & {
        _active: string;
    };
    signatureToolTip?: boolean;
    typeDefenitionOnHovering?: boolean | {
        selector: string;
    };
    autocompleteStart?: number;
    position?: AceAjax.Position;
    fontSize?: string;
    tabSize?: number;
};
declare function loadLibFiles(sourceFiles?: string[], aliases?: Record<string, string>): ts.LanguageServiceHost;
declare function loadContent(filename: string, content: string, keepExistContent?: boolean): void;
declare function getFileContent(name: string): string;
declare function getSelectFileName(): string;
declare function changeSelectFileName(filename: string): void;
declare const tsServiceHandler: {
    loadPackages: typeof loadLibFiles;
    loadContent: typeof loadContent;
    changeSelectFileName: typeof changeSelectFileName;
    removeFile: (fileName: string) => void;
    getLoadedFilenames: () => string[];
    getFileContent: typeof getFileContent;
    getSelectFileName: typeof getSelectFileName;
    hasFile: (fileName: any) => boolean;
    updateFile: (fileName: string, content: string) => void;
    setCompilationSettings: (settings: ts.CompilerOptions) => void;
    getCompilationSettings: () => ts.CompilerOptions;
    _$editFile: (fileName: string, minChar: number, limChar: number, newText: string) => void;
};
declare function dropMode(editor: AceAjax.Editor): AceAjax.Editor;
declare function initialize(options: InitialOptions): [typeof tsServiceHandler, AceAjax.Editor];

export { dropMode, initialize };
