"use strict";
exports.__esModule = true;
exports.readFile = exports.javascriptRun = void 0;
function javascriptRun(js) {
    var external = window.open();
    var script = external.window.document.createElement("script");
    script.textContent = js;
    external.window.document.body.appendChild(script);
}
exports.javascriptRun = javascriptRun;
function readFile(path, cb) {
    fetch(path).then(function (r) { return r.text(); }).then(function (r) {
        cb(r);
    })["catch"](function (err) {
        console.warn(arguments);
    });
    // $.ajax({
    //     type: "GET",
    //     url: path,
    //     success: cb,
    //     error: ((jqXHR, textStatus) => console.log(textStatus))
    // });
}
exports.readFile = readFile;
