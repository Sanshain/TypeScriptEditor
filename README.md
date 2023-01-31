TypeScript Editor
=========================================
TypeScript Playground build on ace editor


## About development environment

### How it was originally?

I started developing without knowing anything about how ace editor works inside. Initially, in the forked repository were only ace source files corresponding to the ace/lib directory of the original - these were commonjs files wrapped to callback called define function like that

```js
define(function(require, exports, module){
  // commonjs source code
});
```

As far as I knew, ace editor has its own requirejs analog built in, which can work with similar constructions. But also the original requirejs was loaded to the page and all this worked magically on the fly without assembling into a single file. 

All this was a great way to develop, although it looked extremely strange and frightening, since typescript files lay directly among the ace lib commonjs files wrapped in define. In order to bring them to a state understandable to the browser, it is enough to enter in the script directory:

```
tsc [-w]
```

This command converts each typescript file to the corresponding requirejs file. And that's it.

Eighty-seven js files dynamically loaded themselves to the loaded page. This is convenient when developing, because when changing one small ts file, the generation of the corresponding js file with the corresponding piece of code was applied instantly and immediately displayed on the page. But this approach did not meet my requirements for production. It didn't suit me. that 87 requests were sent to the server when uploaded. And I started digging to collect all these files into single bundles.

### How it works?

There is a file in the original repository CONTRIBUTING.md a file that didn't contain any useful information (I didn't touch it, left it as it is). I also didn't find any detailed information on the ace editor build in the original editor repo. Almost all of the information described below was found by the poke method.

I needed this sandbox to work with a cdn bundle. And this story can be divided into two plots: **autocomplete** and **error tracing**

#### Autocomplete (briefly)

Look up to `rollup.config.js` - last config in array. Shortly, I wrote two plugins: the first one cleans the js file from the `define function` wrapper. Second... the second one would not have been needed, but in one of the files after processing by the first plugin, `return` turned out to be outside the function. So it was decided that second plugin will wrap its contents in iife (because code in the file does not export anything, just mutates prototypes). The common js module was also added to the config. These manipulations were enough to make the feature with the autocomplit work.

#### Error tracing

Everything is much more interesting here. The ace bundle completely refused to work in the environment of existing scripts that were in the original repo (which is quite expected), but pointed out to me the missing: 

- *worker-typescript.js*
- *mode-typescript.js*

To find out how ace works and how it is assembled, I cloned the original ace repo next to the current repository (I could have created a mono repo with submodules, but I didn't see such a need). And after painstaking analysis of the ace sources, I discovered a few things:

- No popular build systems are used for the building - instead a self-written script is used (`Makefile.dryice.js` in the root), which pulls a package `architect-build` inside - apparently, a tool created by the developer for himself or internal needs <del>and does who knows what</del>.

- Then it's more interesting. When starting `Makefile.dryice.js` common js files from the `src` directory are copied to the `lib/ace` directory and at the same time their contents are also wrapped in the callback of the above-mentioned `define` function (the contents of the `lib/ace` folder, as you might guess, and taken as the basis for development by the author of the original TypeScriptEditor repository). And only then, based on the generated contents of the `lib/ace` folder, cdn bundles are generated in a separate folder. (Such a division of sources into two folders might seem strange, and I have repeatedly caught myself thinking that those files that are stored in `lib/ace` are most likely also generated based on something from the sources. But if you delete it, then the assembly process breaks down. I didn't find any information about any separate command or script for generating the source content of `lib/ace` in the ace repository README (and there's nowhere else to look, except to dig through all the sources - but that wasn't my goal). My doubts were confirmed by the fact that the ace/lib directory lies in .gitignore. But then a logical question arises: if this folder is in .gitignore, why store it in the repository? Therefore, not wanting to delve further, I decided to consider the folder `lib/ace` as part of the ace editor sources along with the contents of `src`)

- File `mode-typescript.js ` generated based on file `src/mode/typescript.js `. Thus `typescript.js ` initially responsible for syntax highlighting and the creation of the worker (it specifies the path to the script for the worker to work. it is important)

- File `worker-typescript.js ` generated based on two files: `lib/ace/worker/worker.js` (it is the entry point if run in the original mode described at the beginning) and `lib/ace/mode/typescript_worker.js` (each of them is built separately during the build process, the first is built to iife, the second - to amd, then these two files will merge into one!).

Since the ace editor build process was not transparent from the very beginning, I created a rollup config, then it can be seen that synchronized the typescript_worker build with copying the above files to the ace repository nearby, building it and copying it back

Of course, I could have taken a different path and developed directly in the ace repository in the src folder, but since the original basaart repository originally had a working example, I did not dare to do this because of the possible version mismatch and the likelihood of futility of all work. So I decided to leave it as it is.

### Notes: 

- The typescript version was updated from 1.5.2 to 4.6.4. On later versions (^4.7.0), the error 'Cannot read undefined properties (reading 'target') from CompilerOptions inside getEmitScriptTarget` falls out

## Using:

### Build: 

```shell
rollup -c
```

### using: 

```js
tsIDEInitialize({selector: 'selector', entryFile: 'app.ts', content: content})
```

### Last sanbox from basarat:

http://basarat.github.io/TypeScriptEditor/

