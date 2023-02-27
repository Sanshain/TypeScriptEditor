export function javascriptRun(js) {
    var external = window.open();
    var script = external.window.document.createElement("script");
    script.textContent = js;
    external.window.document.body.appendChild(script);
}

export function readFile(path, cb) {
    
    fetch(path).then(r => r.text()).then(r => {
        
        cb(r)
    }).catch(function (err) {
        
        console.warn(arguments);        
    })

    // $.ajax({
    //     type: "GET",
    //     url: path,
    //     success: cb,
    //     error: ((jqXHR, textStatus) => console.log(textStatus))
    // });

}