"use strict";
exports.__esModule = true;
exports.AutoCompleteView = void 0;
var AutoCompleteView = /** @class */ (function () {
    function AutoCompleteView(editor, autoComplete) {
        this.editor = editor;
        this.autoComplete = autoComplete;
        this.selectedClassName = 'ace_autocomplete_selected';
        this.wrap = document.createElement('div');
        this.listElement = document.createElement('ul');
        this.wrap.className = 'ace_autocomplete';
        this.wrap.style.display = 'none';
        this.listElement.style.listStyleType = 'none';
        this.wrap.style.position = 'fixed';
        this.wrap.style.zIndex = '1000';
        this.wrap.appendChild(this.listElement);
    }
    AutoCompleteView.prototype.show = function () {
        return this.wrap.style.display = 'block';
    };
    ;
    AutoCompleteView.prototype.hide = function () {
        return this.wrap.style.display = 'none';
    };
    ;
    AutoCompleteView.prototype.setPosition = function (coords) {
        var bottom, editorBottom, top;
        top = coords.pageY + 20;
        editorBottom = this.editor.container.getBoundingClientRect().top + this.editor.container.offsetHeight;
        // editorBottom = $(this.editor.container).offset().top + $(this.editor.container).height();
        bottom = top + this.wrap.offsetHeight;
        // bottom = top + $(this.wrap).height();
        if (bottom < editorBottom) {
            this.wrap.style.top = top + 'px';
            return this.wrap.style.left = coords.pageX + 'px';
        }
        else {
            this.wrap.style.top = (top - this.wrap.offsetHeight - 20) + 'px';
            // this.wrap.style.top = (top - $(this.wrap).height() - 20) + 'px';
            return this.wrap.style.left = coords.pageX + 'px';
        }
    };
    ;
    AutoCompleteView.prototype.current = function () {
        var child, children, i;
        children = this.listElement.childNodes;
        for (i in children) {
            child = children[i];
            if (child.className === this.selectedClassName)
                return child;
        }
        return null;
    };
    ;
    AutoCompleteView.prototype.focusNext = function () {
        var curr, focus;
        curr = this.current();
        focus = curr.nextSibling;
        if (focus) {
            curr.className = '';
            focus.className = this.selectedClassName;
            return this.adjustPosition();
        }
    };
    ;
    AutoCompleteView.prototype.focusPrev = function () {
        var curr, focus;
        curr = this.current();
        focus = curr.previousSibling;
        if (focus) {
            curr.className = '';
            focus.className = this.selectedClassName;
            return this.adjustPosition();
        }
    };
    ;
    AutoCompleteView.prototype.ensureFocus = function () {
        if (!this.current()) {
            if (this.listElement.firstChild) {
                //@ts-expect-error
                this.listElement.firstChild.className = this.selectedClassName;
                return this.adjustPosition();
            }
        }
    };
    ;
    AutoCompleteView.prototype.adjustPosition = function () {
        var elm, elmOuterHeight, newMargin, pos, preMargin, wrapHeight;
        elm = this.current();
        if (elm) {
            newMargin = '';
            wrapHeight = this.wrap.offsetHeight;
            elmOuterHeight = elm.offsetHeight;
            preMargin = +getComputedStyle(this.listElement).marginTop.replace('px', '');
            pos = { left: elm.offsetLeft, top: elm.offsetTop };
            if (pos.top >= (wrapHeight - elmOuterHeight)) {
                newMargin = (preMargin - elmOuterHeight) + 'px';
                this.listElement.style.marginTop = newMargin;
            }
            if (pos.top < 0) {
                newMargin = (-pos.top + preMargin) + 'px';
                this.listElement.style.marginTop = newMargin;
            }
        }
    };
    ;
    return AutoCompleteView;
}());
exports.AutoCompleteView = AutoCompleteView;
