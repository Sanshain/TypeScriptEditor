define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.readFile = exports.javascriptRun = void 0;
    function javascriptRun(js) {
        var external = window.open();
        var script = external.window.document.createElement("script");
        script.textContent = js;
        external.window.document.body.appendChild(script);
    }
    exports.javascriptRun = javascriptRun;
    function readFile(path, cb) {
        $.ajax({
            type: "GET",
            url: path,
            success: cb,
            error: (function (jqXHR, textStatus) { return console.log(textStatus); })
        });
    }
    exports.readFile = readFile;
});
