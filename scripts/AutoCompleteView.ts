declare var $:any;
import {AutoComplete}  from "./AutoComplete";

export class AutoCompleteView{

    private selectedClassName = 'ace_autocomplete_selected';

    public wrap: HTMLDivElement;
    public listElement: HTMLUListElement;

    constructor(public editor: AceAjax.Editor ,public autoComplete:AutoComplete){
        this.wrap = document.createElement('div');
        this.listElement = document.createElement('ul');
        this.wrap.className = 'ace_autocomplete';
        this.wrap.style.display = 'none';
        this.listElement.style.listStyleType = 'none';
        this.wrap.style.position = 'fixed';
        this.wrap.style.zIndex = '1000';
        this.wrap.appendChild(this.listElement);
    }

    show() {
        return this.wrap.style.display = 'block';
    };

    hide (){
        return this.wrap.style.display = 'none';
    };

    setPosition (coords: { pageY: number; pageX: string; }) {
        var bottom: number, editorBottom: number, top: number;
        top = coords.pageY + 20;
        editorBottom = this.editor.container.getBoundingClientRect().top + this.editor.container.offsetHeight;        
        // editorBottom = $(this.editor.container).offset().top + $(this.editor.container).height();
        bottom = top + this.wrap.offsetHeight;
        // bottom = top + $(this.wrap).height();
        if (bottom < editorBottom) {
            this.wrap.style.top = top + 'px';
            return this.wrap.style.left = coords.pageX + 'px';
        } else {
            this.wrap.style.top = (top - this.wrap.offsetHeight - 20) + 'px';
            // this.wrap.style.top = (top - $(this.wrap).height() - 20) + 'px';
            return this.wrap.style.left = coords.pageX + 'px';
        }
    };

    current () {
        var child: any, children: NodeListOf<ChildNode>, i: string | number;
        children = this.listElement.childNodes;
        for (i in children) {
            child = children[i];
            if (child.className === this.selectedClassName) return child;
        }
        return null;
    };

    focusNext () {
        var curr, focus;
        curr = this.current();
        focus = curr.nextSibling;
        if (focus) {
            curr.className = '';
            focus.className = this.selectedClassName;
            return this.adjustPosition();
        }
    };

    focusPrev () {
        var curr, focus;
        curr = this.current();
        focus = curr.previousSibling;
        if (focus) {
            curr.className = '';
            focus.className = this.selectedClassName;
            return this.adjustPosition();
        }
    };

    ensureFocus () {
        if (!this.current()) {
            if (this.listElement.firstChild) {
                //@ts-expect-error
                this.listElement.firstChild.className = this.selectedClassName;
                return this.adjustPosition();
            }
        }
    };

    adjustPosition() {
        var elm: HTMLElement | null, elmOuterHeight, newMargin, pos, preMargin, wrapHeight;
        elm = this.current();
        if (elm) {
            newMargin = '';
            wrapHeight = this.wrap.offsetHeight;
            // wrapHeight = $(this.wrap).height();
            elmOuterHeight = elm.offsetHeight;
            // elmOuterHeight = $(elm).outerHeight();            
            preMargin = +getComputedStyle(this.listElement).marginTop.replace('px', '')
            // preMargin = parseInt($(this.listElement).css("margin-top").replace('px', ''), 10);
            
            pos = {left: elm.offsetLeft, top: elm.offsetTop} 
            // pos = $(elm).position();
            if (pos.top >= (wrapHeight - elmOuterHeight)) {
                newMargin = (preMargin - elmOuterHeight) + 'px';
                this.listElement.style.marginTop = newMargin;
                // $(this.listElement).css("margin-top", newMargin);                
            }
            if (pos.top < 0) {
                newMargin = (-pos.top + preMargin) + 'px';
                this.listElement.style.marginTop = newMargin;
                // return $(this.listElement).css("margin-top", newMargin);
            }
        }
    };


}