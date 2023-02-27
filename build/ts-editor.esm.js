function readFile(path, cb) {
    fetch(path).then(function (r) { return r.text(); }).then(function (r) {
        cb(r);
    }).catch(function (err) {
        console.warn(arguments);
    });
}

/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

    var comparePoints = function(p1, p2) {
        return p1.row - p2.row || p1.column - p2.column;
    };
    /**
     * This object is used in various places to indicate a region within the editor. To better visualize how this works, imagine a rectangle. Each quadrant of the rectangle is analogus to a range, as ranges contain a starting row and starting column, and an ending row, and ending column.
     * @class Range
     **/

    /**
     * Creates a new `Range` object with the given starting and ending row and column points.
     * @param {Number} startRow The starting row
     * @param {Number} startColumn The starting column
     * @param {Number} endRow The ending row
     * @param {Number} endColumn The ending column
     *
     * @constructor
     **/
    var Range = function(startRow, startColumn, endRow, endColumn) {
        this.start = {
            row: startRow,
            column: startColumn
        };

        this.end = {
            row: endRow,
            column: endColumn
        };
    };

    (function() {
        /**
         * Returns `true` if and only if the starting row and column, and ending row and column, are equivalent to those given by `range`.
         * @param {Range} range A range to check against
         *
         * @return {Boolean}
         **/
        this.isEqual = function(range) {
            return this.start.row === range.start.row &&
                this.end.row === range.end.row &&
                this.start.column === range.start.column &&
                this.end.column === range.end.column;
        };

        /**
         *
         * Returns a string containing the range's row and column information, given like this:
         * ```
         *    [start.row/start.column] -> [end.row/end.column]
         * ```
         * @return {String}
         **/
        this.toString = function() {
            return ("Range: [" + this.start.row + "/" + this.start.column +
                "] -> [" + this.end.row + "/" + this.end.column + "]");
        };

        /**
         *
         * Returns `true` if the `row` and `column` provided are within the given range. This can better be expressed as returning `true` if:
         * ```javascript
         *    this.start.row <= row <= this.end.row &&
         *    this.start.column <= column <= this.end.column
         * ```
         * @param {Number} row A row to check for
         * @param {Number} column A column to check for
         * @returns {Boolean}
         * @related Range.compare
         **/

        this.contains = function(row, column) {
            return this.compare(row, column) == 0;
        };

        /**
         * Compares `this` range (A) with another range (B).
         * @param {Range} range A range to compare with
         *
         * @related Range.compare
         * @returns {Number} This method returns one of the following numbers:<br/>
         * <br/>
         * * `-2`: (B) is in front of (A), and doesn't intersect with (A)<br/>
         * * `-1`: (B) begins before (A) but ends inside of (A)<br/>
         * * `0`: (B) is completely inside of (A) OR (A) is completely inside of (B)<br/>
         * * `+1`: (B) begins inside of (A) but ends outside of (A)<br/>
         * * `+2`: (B) is after (A) and doesn't intersect with (A)<br/>
         * * `42`: FTW state: (B) ends in (A) but starts outside of (A)
         **/
        this.compareRange = function(range) {
            var cmp,
                end = range.end,
                start = range.start;

            cmp = this.compare(end.row, end.column);
            if (cmp == 1) {
                cmp = this.compare(start.row, start.column);
                if (cmp == 1) {
                    return 2;
                } else if (cmp == 0) {
                    return 1;
                } else {
                    return 0;
                }
            } else if (cmp == -1) {
                return -2;
            } else {
                cmp = this.compare(start.row, start.column);
                if (cmp == -1) {
                    return -1;
                } else if (cmp == 1) {
                    return 42;
                } else {
                    return 0;
                }
            }
        };

        /**
         * Checks the row and column points of `p` with the row and column points of the calling range.
         *
         * @param {Range} p A point to compare with
         *
         * @related Range.compare
         * @returns {Number} This method returns one of the following numbers:<br/>
         * * `0` if the two points are exactly equal<br/>
         * * `-1` if `p.row` is less then the calling range<br/>
         * * `1` if `p.row` is greater than the calling range<br/>
         * <br/>
         * If the starting row of the calling range is equal to `p.row`, and:<br/>
         * * `p.column` is greater than or equal to the calling range's starting column, this returns `0`<br/>
         * * Otherwise, it returns -1<br/>
         *<br/>
        * If the ending row of the calling range is equal to `p.row`, and:<br/>
        * * `p.column` is less than or equal to the calling range's ending column, this returns `0`<br/>
        * * Otherwise, it returns 1<br/>
        **/
        this.comparePoint = function(p) {
            return this.compare(p.row, p.column);
        };

        /**
         * Checks the start and end points of `range` and compares them to the calling range. Returns `true` if the `range` is contained within the caller's range.
         * @param {Range} range A range to compare with
         *
         * @returns {Boolean}
         * @related Range.comparePoint
         **/
        this.containsRange = function(range) {
            return this.comparePoint(range.start) == 0 && this.comparePoint(range.end) == 0;
        };

        /**
         * Returns `true` if passed in `range` intersects with the one calling this method.
         * @param {Range} range A range to compare with
         *
         * @returns {Boolean}
         **/
        this.intersects = function(range) {
            var cmp = this.compareRange(range);
            return (cmp == -1 || cmp == 0 || cmp == 1);
        };

        /**
         * Returns `true` if the caller's ending row point is the same as `row`, and if the caller's ending column is the same as `column`.
         * @param {Number} row A row point to compare with
         * @param {Number} column A column point to compare with
         *
         * @returns {Boolean}
         **/
        this.isEnd = function(row, column) {
            return this.end.row == row && this.end.column == column;
        };

        /**
         * Returns `true` if the caller's starting row point is the same as `row`, and if the caller's starting column is the same as `column`.
         * @param {Number} row A row point to compare with
         * @param {Number} column A column point to compare with
         *
         * @returns {Boolean}
         **/
        this.isStart = function(row, column) {
            return this.start.row == row && this.start.column == column;
        };

        /**
         * Sets the starting row and column for the range.
         * @param {Number} row A row point to set
         * @param {Number} column A column point to set
         *
         **/
        this.setStart = function(row, column) {
            if (typeof row == "object") {
                this.start.column = row.column;
                this.start.row = row.row;
            } else {
                this.start.row = row;
                this.start.column = column;
            }
        };

        /**
         * Sets the starting row and column for the range.
         * @param {Number} row A row point to set
         * @param {Number} column A column point to set
         *
         **/
        this.setEnd = function(row, column) {
            if (typeof row == "object") {
                this.end.column = row.column;
                this.end.row = row.row;
            } else {
                this.end.row = row;
                this.end.column = column;
            }
        };

        /**
         * Returns `true` if the `row` and `column` are within the given range.
         * @param {Number} row A row point to compare with
         * @param {Number} column A column point to compare with
         *
         *
         * @returns {Boolean}
         * @related Range.compare
         **/
        this.inside = function(row, column) {
            if (this.compare(row, column) == 0) {
                if (this.isEnd(row, column) || this.isStart(row, column)) {
                    return false;
                } else {
                    return true;
                }
            }
            return false;
        };

        /**
         * Returns `true` if the `row` and `column` are within the given range's starting points.
         * @param {Number} row A row point to compare with
         * @param {Number} column A column point to compare with
         *
         * @returns {Boolean}
         * @related Range.compare
         **/
        this.insideStart = function(row, column) {
            if (this.compare(row, column) == 0) {
                if (this.isEnd(row, column)) {
                    return false;
                } else {
                    return true;
                }
            }
            return false;
        };

        /**
         * Returns `true` if the `row` and `column` are within the given range's ending points.
         * @param {Number} row A row point to compare with
         * @param {Number} column A column point to compare with
         *
         * @returns {Boolean}
         * @related Range.compare
         *
         **/
        this.insideEnd = function(row, column) {
            if (this.compare(row, column) == 0) {
                if (this.isStart(row, column)) {
                    return false;
                } else {
                    return true;
                }
            }
            return false;
        };

        /**
         * Checks the row and column points with the row and column points of the calling range.
         * @param {Number} row A row point to compare with
         * @param {Number} column A column point to compare with
         *
         *
         * @returns {Number} This method returns one of the following numbers:<br/>
         * `0` if the two points are exactly equal <br/>
         * `-1` if `p.row` is less then the calling range <br/>
         * `1` if `p.row` is greater than the calling range <br/>
         *  <br/>
         * If the starting row of the calling range is equal to `p.row`, and: <br/>
         * `p.column` is greater than or equal to the calling range's starting column, this returns `0`<br/>
         * Otherwise, it returns -1<br/>
         * <br/>
         * If the ending row of the calling range is equal to `p.row`, and: <br/>
         * `p.column` is less than or equal to the calling range's ending column, this returns `0` <br/>
         * Otherwise, it returns 1
         **/
        this.compare = function(row, column) {
            if (!this.isMultiLine()) {
                if (row === this.start.row) {
                    return column < this.start.column ? -1 : (column > this.end.column ? 1 : 0);
                }            }

            if (row < this.start.row)
                return -1;

            if (row > this.end.row)
                return 1;

            if (this.start.row === row)
                return column >= this.start.column ? 0 : -1;

            if (this.end.row === row)
                return column <= this.end.column ? 0 : 1;

            return 0;
        };

        /**
         * Checks the row and column points with the row and column points of the calling range.
         * @param {Number} row A row point to compare with
         * @param {Number} column A column point to compare with
         *
         * @returns {Number} This method returns one of the following numbers:<br/>
         * <br/>
         * `0` if the two points are exactly equal<br/>
         * `-1` if `p.row` is less then the calling range<br/>
         * `1` if `p.row` is greater than the calling range, or if `isStart` is `true`.<br/>
         * <br/>
         * If the starting row of the calling range is equal to `p.row`, and:<br/>
         * `p.column` is greater than or equal to the calling range's starting column, this returns `0`<br/>
         * Otherwise, it returns -1<br/>
         * <br/>
         * If the ending row of the calling range is equal to `p.row`, and:<br/>
         * `p.column` is less than or equal to the calling range's ending column, this returns `0`<br/>
         * Otherwise, it returns 1
         *
         **/
        this.compareStart = function(row, column) {
            if (this.start.row == row && this.start.column == column) {
                return -1;
            } else {
                return this.compare(row, column);
            }
        };

        /**
         * Checks the row and column points with the row and column points of the calling range.
         * @param {Number} row A row point to compare with
         * @param {Number} column A column point to compare with
         *
         *
         * @returns {Number} This method returns one of the following numbers:<br/>
         * `0` if the two points are exactly equal<br/>
         * `-1` if `p.row` is less then the calling range<br/>
         * `1` if `p.row` is greater than the calling range, or if `isEnd` is `true.<br/>
         * <br/>
         * If the starting row of the calling range is equal to `p.row`, and:<br/>
         * `p.column` is greater than or equal to the calling range's starting column, this returns `0`<br/>
         * Otherwise, it returns -1<br/>
         *<br/>
        * If the ending row of the calling range is equal to `p.row`, and:<br/>
        * `p.column` is less than or equal to the calling range's ending column, this returns `0`<br/>
        * Otherwise, it returns 1
        */
        this.compareEnd = function(row, column) {
            if (this.end.row == row && this.end.column == column) {
                return 1;
            } else {
                return this.compare(row, column);
            }
        };

        /**
         * Checks the row and column points with the row and column points of the calling range.
         * @param {Number} row A row point to compare with
         * @param {Number} column A column point to compare with
         *
         *
         * @returns {Number} This method returns one of the following numbers:<br/>
         * * `1` if the ending row of the calling range is equal to `row`, and the ending column of the calling range is equal to `column`<br/>
         * * `-1` if the starting row of the calling range is equal to `row`, and the starting column of the calling range is equal to `column`<br/>
         * <br/>
         * Otherwise, it returns the value after calling [[Range.compare `compare()`]].
         *
         **/
        this.compareInside = function(row, column) {
            if (this.end.row == row && this.end.column == column) {
                return 1;
            } else if (this.start.row == row && this.start.column == column) {
                return -1;
            } else {
                return this.compare(row, column);
            }
        };

        /**
         * Returns the part of the current `Range` that occurs within the boundaries of `firstRow` and `lastRow` as a new `Range` object.
         * @param {Number} firstRow The starting row
         * @param {Number} lastRow The ending row
         *
         *
         * @returns {Range}
        **/
        this.clipRows = function(firstRow, lastRow) {
            if (this.end.row > lastRow)
                var end = {row: lastRow + 1, column: 0};
            else if (this.end.row < firstRow)
                var end = {row: firstRow, column: 0};

            if (this.start.row > lastRow)
                var start = {row: lastRow + 1, column: 0};
            else if (this.start.row < firstRow)
                var start = {row: firstRow, column: 0};

            return Range.fromPoints(start || this.start, end || this.end);
        };

        /**
         * Changes the row and column points for the calling range for both the starting and ending points.
         * @param {Number} row A new row to extend to
         * @param {Number} column A new column to extend to
         *
         *
         * @returns {Range} The original range with the new row
        **/
        this.extend = function(row, column) {
            var cmp = this.compare(row, column);

            if (cmp == 0)
                return this;
            else if (cmp == -1)
                var start = {row: row, column: column};
            else
                var end = {row: row, column: column};

            return Range.fromPoints(start || this.start, end || this.end);
        };

        this.isEmpty = function() {
            return (this.start.row === this.end.row && this.start.column === this.end.column);
        };

        /**
         *
         * Returns `true` if the range spans across multiple lines.
         * @returns {Boolean}
        **/
        this.isMultiLine = function() {
            return (this.start.row !== this.end.row);
        };

        /**
         *
         * Returns a duplicate of the calling range.
         * @returns {Range}
        **/
        this.clone = function() {
            return Range.fromPoints(this.start, this.end);
        };

        /**
         *
         * Returns a range containing the starting and ending rows of the original range, but with a column value of `0`.
         * @returns {Range}
        **/
        this.collapseRows = function() {
            if (this.end.column == 0)
                return new Range(this.start.row, 0, Math.max(this.start.row, this.end.row-1), 0)
            else
                return new Range(this.start.row, 0, this.end.row, 0)
        };

        /**
         * Given the current `Range`, this function converts those starting and ending points into screen positions, and then returns a new `Range` object.
         * @param {EditSession} session The `EditSession` to retrieve coordinates from
         *
         *
         * @returns {Range}
        **/
        this.toScreenRange = function(session) {
            var screenPosStart = session.documentToScreenPosition(this.start);
            var screenPosEnd = session.documentToScreenPosition(this.end);

            return new Range(
                screenPosStart.row, screenPosStart.column,
                screenPosEnd.row, screenPosEnd.column
            );
        };
        
        
        /* experimental */
        this.moveBy = function(row, column) {
            this.start.row += row;
            this.start.column += column;
            this.end.row += row;
            this.end.column += column;
        };

    }).call(Range.prototype);

    /**
     * Creates and returns a new `Range` based on the row and column of the given parameters.
     * @param {Range} start A starting point to use
     * @param {Range} end An ending point to use
     *
     * @returns {Range}
    **/
    Range.fromPoints = function(start, end) {
        return new Range(start.row, start.column, end.row, end.column);
    };
    Range.comparePoints = comparePoints;

    Range.comparePoints = function(p1, p2) {
        return p1.row - p2.row || p1.column - p2.column;
    };

    var Range_1 = Range;

/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

var EventEmitter = {};
var stopPropagation = function() { this.propagationStopped = true; };
var preventDefault = function() { this.defaultPrevented = true; };

EventEmitter._emit =
EventEmitter._dispatchEvent = function(eventName, e) {
    this._eventRegistry || (this._eventRegistry = {});
    this._defaultHandlers || (this._defaultHandlers = {});

    var listeners = this._eventRegistry[eventName] || [];
    var defaultHandler = this._defaultHandlers[eventName];
    if (!listeners.length && !defaultHandler)
        return;

    if (typeof e != "object" || !e)
        e = {};

    if (!e.type)
        e.type = eventName;
    if (!e.stopPropagation)
        e.stopPropagation = stopPropagation;
    if (!e.preventDefault)
        e.preventDefault = preventDefault;

    listeners = listeners.slice();
    for (var i=0; i<listeners.length; i++) {
        listeners[i](e, this);
        if (e.propagationStopped)
            break;
    }
    
    if (defaultHandler && !e.defaultPrevented)
        return defaultHandler(e, this);
};


EventEmitter._signal = function(eventName, e) {
    var listeners = (this._eventRegistry || {})[eventName];
    if (!listeners)
        return;
    listeners = listeners.slice();
    for (var i=0; i<listeners.length; i++)
        listeners[i](e, this);
};

EventEmitter.once = function(eventName, callback) {
    var _self = this;
    callback && this.addEventListener(eventName, function newCallback() {
        _self.removeEventListener(eventName, newCallback);
        callback.apply(null, arguments);
    });
};


EventEmitter.setDefaultHandler = function(eventName, callback) {
    var handlers = this._defaultHandlers;
    if (!handlers)
        handlers = this._defaultHandlers = {_disabled_: {}};
    
    if (handlers[eventName]) {
        var old = handlers[eventName];
        var disabled = handlers._disabled_[eventName];
        if (!disabled)
            handlers._disabled_[eventName] = disabled = [];
        disabled.push(old);
        var i = disabled.indexOf(callback);
        if (i != -1) 
            disabled.splice(i, 1);
    }
    handlers[eventName] = callback;
};
EventEmitter.removeDefaultHandler = function(eventName, callback) {
    var handlers = this._defaultHandlers;
    if (!handlers)
        return;
    var disabled = handlers._disabled_[eventName];
    
    if (handlers[eventName] == callback) {
        handlers[eventName];
        if (disabled)
            this.setDefaultHandler(eventName, disabled.pop());
    } else if (disabled) {
        var i = disabled.indexOf(callback);
        if (i != -1)
            disabled.splice(i, 1);
    }
};

EventEmitter.on =
EventEmitter.addEventListener = function(eventName, callback, capturing) {
    this._eventRegistry = this._eventRegistry || {};

    var listeners = this._eventRegistry[eventName];
    if (!listeners)
        listeners = this._eventRegistry[eventName] = [];

    if (listeners.indexOf(callback) == -1)
        listeners[capturing ? "unshift" : "push"](callback);
    return callback;
};

EventEmitter.off =
EventEmitter.removeListener =
EventEmitter.removeEventListener = function(eventName, callback) {
    this._eventRegistry = this._eventRegistry || {};

    var listeners = this._eventRegistry[eventName];
    if (!listeners)
        return;

    var index = listeners.indexOf(callback);
    if (index !== -1)
        listeners.splice(index, 1);
};

EventEmitter.removeAllListeners = function(eventName) {
    if (this._eventRegistry) this._eventRegistry[eventName] = [];
};

var EventEmitter_1 = EventEmitter;

var AutoCompleteView = (function () {
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
    AutoCompleteView.prototype.hide = function () {
        return this.wrap.style.display = 'none';
    };
    AutoCompleteView.prototype.setPosition = function (coords) {
        var bottom, editorBottom, top;
        top = coords.pageY + 20;
        editorBottom = this.editor.container.getBoundingClientRect().top + this.editor.container.offsetHeight;
        bottom = top + this.wrap.offsetHeight;
        if (bottom < editorBottom) {
            this.wrap.style.top = top + 'px';
            return this.wrap.style.left = coords.pageX + 'px';
        }
        else {
            this.wrap.style.top = (top - this.wrap.offsetHeight - 20) + 'px';
            return this.wrap.style.left = coords.pageX + 'px';
        }
    };
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
    AutoCompleteView.prototype.ensureFocus = function () {
        if (!this.current()) {
            if (this.listElement.firstChild) {
                this.listElement.firstChild.className = this.selectedClassName;
                return this.adjustPosition();
            }
        }
    };
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
    return AutoCompleteView;
}());

var keys = {};

/*
 *  Based on code from:
 *
 * XRegExp 1.5.0
 * (c) 2007-2010 Steven Levithan
 * MIT License
 * <http://xregexp.com>
 * Provides an augmented, extensible, cross-browser implementation of regular expressions,
 * including support for additional syntax, flags, and methods
 */
 
(function(require, exports, module) {

    //---------------------------------
    //  Private variables
    //---------------------------------

    var real = {
            exec: RegExp.prototype.exec,
            test: RegExp.prototype.test,
            match: String.prototype.match,
            replace: String.prototype.replace,
            split: String.prototype.split
        },
        compliantExecNpcg = real.exec.call(/()??/, "")[1] === undefined, // check `exec` handling of nonparticipating capturing groups
        compliantLastIndexIncrement = function () {
            var x = /^/g;
            real.test.call(x, "");
            return !x.lastIndex;
        }();

    if (compliantLastIndexIncrement && compliantExecNpcg)
        return;

    //---------------------------------
    //  Overriden native methods
    //---------------------------------

    // Adds named capture support (with backreferences returned as `result.name`), and fixes two
    // cross-browser issues per ES3:
    // - Captured values for nonparticipating capturing groups should be returned as `undefined`,
    //   rather than the empty string.
    // - `lastIndex` should not be incremented after zero-length matches.
    RegExp.prototype.exec = function (str) {
        var match = real.exec.apply(this, arguments),
            name, r2;
        if ( typeof(str) == 'string' && match) {
            // Fix browsers whose `exec` methods don't consistently return `undefined` for
            // nonparticipating capturing groups
            if (!compliantExecNpcg && match.length > 1 && indexOf(match, "") > -1) {
                r2 = RegExp(this.source, real.replace.call(getNativeFlags(this), "g", ""));
                // Using `str.slice(match.index)` rather than `match[0]` in case lookahead allowed
                // matching due to characters outside the match
                real.replace.call(str.slice(match.index), r2, function () {
                    for (var i = 1; i < arguments.length - 2; i++) {
                        if (arguments[i] === undefined)
                            match[i] = undefined;
                    }
                });
            }
            // Attach named capture properties
            if (this._xregexp && this._xregexp.captureNames) {
                for (var i = 1; i < match.length; i++) {
                    name = this._xregexp.captureNames[i - 1];
                    if (name)
                       match[name] = match[i];
                }
            }
            // Fix browsers that increment `lastIndex` after zero-length matches
            if (!compliantLastIndexIncrement && this.global && !match[0].length && (this.lastIndex > match.index))
                this.lastIndex--;
        }
        return match;
    };

    // Don't override `test` if it won't change anything
    if (!compliantLastIndexIncrement) {
        // Fix browser bug in native method
        RegExp.prototype.test = function (str) {
            // Use the native `exec` to skip some processing overhead, even though the overriden
            // `exec` would take care of the `lastIndex` fix
            var match = real.exec.call(this, str);
            // Fix browsers that increment `lastIndex` after zero-length matches
            if (match && this.global && !match[0].length && (this.lastIndex > match.index))
                this.lastIndex--;
            return !!match;
        };
    }

    //---------------------------------
    //  Private helper functions
    //---------------------------------

    function getNativeFlags (regex) {
        return (regex.global     ? "g" : "") +
               (regex.ignoreCase ? "i" : "") +
               (regex.multiline  ? "m" : "") +
               (regex.extended   ? "x" : "") + // Proposed for ES4; included in AS3
               (regex.sticky     ? "y" : "");
    }

    function indexOf (array, item, from) {
        if (Array.prototype.indexOf) // Use the native array method if available
            return array.indexOf(item, from);
        for (var i = from || 0; i < array.length; i++) {
            if (array[i] === item)
                return i;
        }
        return -1;
    }

})();

// https://github.com/kriskowal/es5-shim
// Copyright 2009-2012 by contributors, MIT License



/*
 * Brings an environment as close to ECMAScript 5 compliance
 * as is possible with the facilities of erstwhile engines.
 *
 * Annotated ES5: http://es5.github.com/ (specific links below)
 * ES5 Spec: http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf
 * Required reading: http://javascriptweblog.wordpress.com/2011/12/05/extending-javascript-natives/
 */

//
// Function
// ========
//

// ES-5 15.3.4.5
// http://es5.github.com/#x15.3.4.5

function Empty() {}

if (!Function.prototype.bind) {
    Function.prototype.bind = function bind(that) { // .length is 1
        // 1. Let Target be the this value.
        var target = this;
        // 2. If IsCallable(Target) is false, throw a TypeError exception.
        if (typeof target != "function") {
            throw new TypeError("Function.prototype.bind called on incompatible " + target);
        }
        // 3. Let A be a new (possibly empty) internal list of all of the
        //   argument values provided after thisArg (arg1, arg2 etc), in order.
        // XXX slicedArgs will stand in for "A" if used
        var args = slice.call(arguments, 1); // for normal call
        // 4. Let F be a new native ECMAScript object.
        // 11. Set the [[Prototype]] internal property of F to the standard
        //   built-in Function prototype object as specified in 15.3.3.1.
        // 12. Set the [[Call]] internal property of F as described in
        //   15.3.4.5.1.
        // 13. Set the [[Construct]] internal property of F as described in
        //   15.3.4.5.2.
        // 14. Set the [[HasInstance]] internal property of F as described in
        //   15.3.4.5.3.
        var bound = function () {

            if (this instanceof bound) {
                // 15.3.4.5.2 [[Construct]]
                // When the [[Construct]] internal method of a function object,
                // F that was created using the bind function is called with a
                // list of arguments ExtraArgs, the following steps are taken:
                // 1. Let target be the value of F's [[TargetFunction]]
                //   internal property.
                // 2. If target has no [[Construct]] internal method, a
                //   TypeError exception is thrown.
                // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.
                // 5. Return the result of calling the [[Construct]] internal
                //   method of target providing args as the arguments.

                var result = target.apply(
                    this,
                    args.concat(slice.call(arguments))
                );
                if (Object(result) === result) {
                    return result;
                }
                return this;

            } else {
                // 15.3.4.5.1 [[Call]]
                // When the [[Call]] internal method of a function object, F,
                // which was created using the bind function is called with a
                // this value and a list of arguments ExtraArgs, the following
                // steps are taken:
                // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                //   property.
                // 2. Let boundThis be the value of F's [[BoundThis]] internal
                //   property.
                // 3. Let target be the value of F's [[TargetFunction]] internal
                //   property.
                // 4. Let args be a new list containing the same values as the
                //   list boundArgs in the same order followed by the same
                //   values as the list ExtraArgs in the same order.
                // 5. Return the result of calling the [[Call]] internal method
                //   of target providing boundThis as the this value and
                //   providing args as the arguments.

                // equiv: target.call(this, ...boundArgs, ...args)
                return target.apply(
                    that,
                    args.concat(slice.call(arguments))
                );

            }

        };
        if(target.prototype) {
            Empty.prototype = target.prototype;
            bound.prototype = new Empty();
            // Clean up dangling references.
            Empty.prototype = null;
        }
        // XXX bound.length is never writable, so don't even try
        //
        // 15. If the [[Class]] internal property of Target is "Function", then
        //     a. Let L be the length property of Target minus the length of A.
        //     b. Set the length own property of F to either 0 or L, whichever is
        //       larger.
        // 16. Else set the length own property of F to 0.
        // 17. Set the attributes of the length own property of F to the values
        //   specified in 15.3.5.1.

        // TODO
        // 18. Set the [[Extensible]] internal property of F to true.

        // TODO
        // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
        // 20. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
        //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
        //   false.
        // 21. Call the [[DefineOwnProperty]] internal method of F with
        //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
        //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
        //   and false.

        // TODO
        // NOTE Function objects created using Function.prototype.bind do not
        // have a prototype property or the [[Code]], [[FormalParameters]], and
        // [[Scope]] internal properties.
        // XXX can't delete prototype in pure-js.

        // 22. Return F.
        return bound;
    };
}

// Shortcut to an often accessed properties, in order to avoid multiple
// dereference that costs universally.
// _Please note: Shortcuts are defined after `Function.prototype.bind` as we
// us it in defining shortcuts.
var call = Function.prototype.call;
var prototypeOfArray = Array.prototype;
var prototypeOfObject = Object.prototype;
var slice = prototypeOfArray.slice;
// Having a toString local variable name breaks in Opera so use _toString.
var _toString = call.bind(prototypeOfObject.toString);
var owns = call.bind(prototypeOfObject.hasOwnProperty);

// If JS engine supports accessors creating shortcuts.
var defineGetter;
var defineSetter;
var lookupGetter;
var lookupSetter;
var supportsAccessors;
if ((supportsAccessors = owns(prototypeOfObject, "__defineGetter__"))) {
    defineGetter = call.bind(prototypeOfObject.__defineGetter__);
    defineSetter = call.bind(prototypeOfObject.__defineSetter__);
    lookupGetter = call.bind(prototypeOfObject.__lookupGetter__);
    lookupSetter = call.bind(prototypeOfObject.__lookupSetter__);
}

//
// Array
// =====
//

// ES5 15.4.4.12
// http://es5.github.com/#x15.4.4.12
// Default value for second param
// [bugfix, ielt9, old browsers]
// IE < 9 bug: [1,2].splice(0).join("") == "" but should be "12"
if ([1,2].splice(0).length != 2) {
    if(function() { // test IE < 9 to splice bug - see issue #138
        function makeArray(l) {
            var a = new Array(l+2);
            a[0] = a[1] = 0;
            return a;
        }
        var array = [], lengthBefore;
        
        array.splice.apply(array, makeArray(20));
        array.splice.apply(array, makeArray(26));

        lengthBefore = array.length; //46
        array.splice(5, 0, "XXX"); // add one element

        lengthBefore + 1 == array.length;

        if (lengthBefore + 1 == array.length) {
            return true;// has right splice implementation without bugs
        }
        // else {
        // IE8 bug
        // }
    }()) {//IE 6/7
        var array_splice = Array.prototype.splice;
        Array.prototype.splice = function(start, deleteCount) {
            if (!arguments.length) {
                return [];
            } else {
                return array_splice.apply(this, [
                    start === void 0 ? 0 : start,
                    deleteCount === void 0 ? (this.length - start) : deleteCount
                ].concat(slice.call(arguments, 2)))
            }
        };
    } else {//IE8
        // taken from http://docs.sencha.com/ext-js/4-1/source/Array2.html
        Array.prototype.splice = function(pos, removeCount){
            var length = this.length;
            if (pos > 0) {
                if (pos > length)
                    pos = length;
            } else if (pos == void 0) {
                pos = 0;
            } else if (pos < 0) {
                pos = Math.max(length + pos, 0);
            }

            if (!(pos+removeCount < length))
                removeCount = length - pos;

            var removed = this.slice(pos, pos+removeCount);
            var insert = slice.call(arguments, 2);
            var add = insert.length;            

            // we try to use Array.push when we can for efficiency...
            if (pos === length) {
                if (add) {
                    this.push.apply(this, insert);
                }
            } else {
                var remove = Math.min(removeCount, length - pos);
                var tailOldPos = pos + remove;
                var tailNewPos = tailOldPos + add - remove;
                var tailCount = length - tailOldPos;
                var lengthAfterRemove = length - remove;

                if (tailNewPos < tailOldPos) { // case A
                    for (var i = 0; i < tailCount; ++i) {
                        this[tailNewPos+i] = this[tailOldPos+i];
                    }
                } else if (tailNewPos > tailOldPos) { // case B
                    for (i = tailCount; i--; ) {
                        this[tailNewPos+i] = this[tailOldPos+i];
                    }
                } // else, add == remove (nothing to do)

                if (add && pos === lengthAfterRemove) {
                    this.length = lengthAfterRemove; // truncate array
                    this.push.apply(this, insert);
                } else {
                    this.length = lengthAfterRemove + add; // reserves space
                    for (i = 0; i < add; ++i) {
                        this[pos+i] = insert[i];
                    }
                }
            }
            return removed;
        };
    }
}

// ES5 15.4.3.2
// http://es5.github.com/#x15.4.3.2
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
if (!Array.isArray) {
    Array.isArray = function isArray(obj) {
        return _toString(obj) == "[object Array]";
    };
}

// The IsCallable() check in the Array functions
// has been replaced with a strict check on the
// internal class of the object to trap cases where
// the provided function was actually a regular
// expression literal, which in V8 and
// JavaScriptCore is a typeof "function".  Only in
// V8 are regular expression literals permitted as
// reduce parameters, so it is desirable in the
// general case for the shim to match the more
// strict and common behavior of rejecting regular
// expressions.

// ES5 15.4.4.18
// http://es5.github.com/#x15.4.4.18
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/forEach

// Check failure of by-index access of string characters (IE < 9)
// and failure of `0 in boxedString` (Rhino)
var boxedString = Object("a"),
    splitString = boxedString[0] != "a" || !(0 in boxedString);

if (!Array.prototype.forEach) {
    Array.prototype.forEach = function forEach(fun /*, thisp*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            thisp = arguments[1],
            i = -1,
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(); // TODO message
        }

        while (++i < length) {
            if (i in self) {
                // Invoke the callback function with call, passing arguments:
                // context, property value, property key, thisArg object
                // context
                fun.call(thisp, self[i], i, object);
            }
        }
    };
}

// ES5 15.4.4.19
// http://es5.github.com/#x15.4.4.19
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
if (!Array.prototype.map) {
    Array.prototype.map = function map(fun /*, thisp*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0,
            result = Array(length),
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self)
                result[i] = fun.call(thisp, self[i], i, object);
        }
        return result;
    };
}

// ES5 15.4.4.20
// http://es5.github.com/#x15.4.4.20
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
if (!Array.prototype.filter) {
    Array.prototype.filter = function filter(fun /*, thisp */) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                    object,
            length = self.length >>> 0,
            result = [],
            value,
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self) {
                value = self[i];
                if (fun.call(thisp, value, i, object)) {
                    result.push(value);
                }
            }
        }
        return result;
    };
}

// ES5 15.4.4.16
// http://es5.github.com/#x15.4.4.16
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
if (!Array.prototype.every) {
    Array.prototype.every = function every(fun /*, thisp */) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0,
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self && !fun.call(thisp, self[i], i, object)) {
                return false;
            }
        }
        return true;
    };
}

// ES5 15.4.4.17
// http://es5.github.com/#x15.4.4.17
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
if (!Array.prototype.some) {
    Array.prototype.some = function some(fun /*, thisp */) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0,
            thisp = arguments[1];

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        for (var i = 0; i < length; i++) {
            if (i in self && fun.call(thisp, self[i], i, object)) {
                return true;
            }
        }
        return false;
    };
}

// ES5 15.4.4.21
// http://es5.github.com/#x15.4.4.21
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function reduce(fun /*, initial*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        // no value to return if no initial value and an empty array
        if (!length && arguments.length == 1) {
            throw new TypeError("reduce of empty array with no initial value");
        }

        var i = 0;
        var result;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i++];
                    break;
                }

                // if array contains no values, no initial value to return
                if (++i >= length) {
                    throw new TypeError("reduce of empty array with no initial value");
                }
            } while (true);
        }

        for (; i < length; i++) {
            if (i in self) {
                result = fun.call(void 0, result, self[i], i, object);
            }
        }

        return result;
    };
}

// ES5 15.4.4.22
// http://es5.github.com/#x15.4.4.22
// https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
if (!Array.prototype.reduceRight) {
    Array.prototype.reduceRight = function reduceRight(fun /*, initial*/) {
        var object = toObject(this),
            self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                object,
            length = self.length >>> 0;

        // If no callback function or if callback is not a callable function
        if (_toString(fun) != "[object Function]") {
            throw new TypeError(fun + " is not a function");
        }

        // no value to return if no initial value, empty array
        if (!length && arguments.length == 1) {
            throw new TypeError("reduceRight of empty array with no initial value");
        }

        var result, i = length - 1;
        if (arguments.length >= 2) {
            result = arguments[1];
        } else {
            do {
                if (i in self) {
                    result = self[i--];
                    break;
                }

                // if array contains no values, no initial value to return
                if (--i < 0) {
                    throw new TypeError("reduceRight of empty array with no initial value");
                }
            } while (true);
        }

        do {
            if (i in this) {
                result = fun.call(void 0, result, self[i], i, object);
            }
        } while (i--);

        return result;
    };
}

// ES5 15.4.4.14
// http://es5.github.com/#x15.4.4.14
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
if (!Array.prototype.indexOf || ([0, 1].indexOf(1, 2) != -1)) {
    Array.prototype.indexOf = function indexOf(sought /*, fromIndex */ ) {
        var self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                toObject(this),
            length = self.length >>> 0;

        if (!length) {
            return -1;
        }

        var i = 0;
        if (arguments.length > 1) {
            i = toInteger(arguments[1]);
        }

        // handle negative indices
        i = i >= 0 ? i : Math.max(0, length + i);
        for (; i < length; i++) {
            if (i in self && self[i] === sought) {
                return i;
            }
        }
        return -1;
    };
}

// ES5 15.4.4.15
// http://es5.github.com/#x15.4.4.15
// https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
if (!Array.prototype.lastIndexOf || ([0, 1].lastIndexOf(0, -3) != -1)) {
    Array.prototype.lastIndexOf = function lastIndexOf(sought /*, fromIndex */) {
        var self = splitString && _toString(this) == "[object String]" ?
                this.split("") :
                toObject(this),
            length = self.length >>> 0;

        if (!length) {
            return -1;
        }
        var i = length - 1;
        if (arguments.length > 1) {
            i = Math.min(i, toInteger(arguments[1]));
        }
        // handle negative indices
        i = i >= 0 ? i : length - Math.abs(i);
        for (; i >= 0; i--) {
            if (i in self && sought === self[i]) {
                return i;
            }
        }
        return -1;
    };
}

//
// Object
// ======
//

// ES5 15.2.3.2
// http://es5.github.com/#x15.2.3.2
if (!Object.getPrototypeOf) {
    // https://github.com/kriskowal/es5-shim/issues#issue/2
    // http://ejohn.org/blog/objectgetprototypeof/
    // recommended by fschaefer on github
    Object.getPrototypeOf = function getPrototypeOf(object) {
        return object.__proto__ || (
            object.constructor ?
            object.constructor.prototype :
            prototypeOfObject
        );
    };
}

// ES5 15.2.3.3
// http://es5.github.com/#x15.2.3.3
if (!Object.getOwnPropertyDescriptor) {
    var ERR_NON_OBJECT = "Object.getOwnPropertyDescriptor called on a " +
                         "non-object: ";
    Object.getOwnPropertyDescriptor = function getOwnPropertyDescriptor(object, property) {
        if ((typeof object != "object" && typeof object != "function") || object === null)
            throw new TypeError(ERR_NON_OBJECT + object);
        // If object does not owns property return undefined immediately.
        if (!owns(object, property))
            return;

        var descriptor, getter, setter;

        // If object has a property then it's for sure both `enumerable` and
        // `configurable`.
        descriptor =  { enumerable: true, configurable: true };

        // If JS engine supports accessor properties then property may be a
        // getter or setter.
        if (supportsAccessors) {
            // Unfortunately `__lookupGetter__` will return a getter even
            // if object has own non getter property along with a same named
            // inherited getter. To avoid misbehavior we temporary remove
            // `__proto__` so that `__lookupGetter__` will return getter only
            // if it's owned by an object.
            var prototype = object.__proto__;
            object.__proto__ = prototypeOfObject;

            var getter = lookupGetter(object, property);
            var setter = lookupSetter(object, property);

            // Once we have getter and setter we can put values back.
            object.__proto__ = prototype;

            if (getter || setter) {
                if (getter) descriptor.get = getter;
                if (setter) descriptor.set = setter;

                // If it was accessor property we're done and return here
                // in order to avoid adding `value` to the descriptor.
                return descriptor;
            }
        }

        // If we got this far we know that object has an own property that is
        // not an accessor so we set it as a value and return descriptor.
        descriptor.value = object[property];
        return descriptor;
    };
}

// ES5 15.2.3.4
// http://es5.github.com/#x15.2.3.4
if (!Object.getOwnPropertyNames) {
    Object.getOwnPropertyNames = function getOwnPropertyNames(object) {
        return Object.keys(object);
    };
}

// ES5 15.2.3.5
// http://es5.github.com/#x15.2.3.5
if (!Object.create) {
    var createEmpty;
    if (Object.prototype.__proto__ === null) {
        createEmpty = function () {
            return { "__proto__": null };
        };
    } else {
        // In old IE __proto__ can't be used to manually set `null`
        createEmpty = function () {
            var empty = {};
            for (var i in empty)
                empty[i] = null;
            empty.constructor =
            empty.hasOwnProperty =
            empty.propertyIsEnumerable =
            empty.isPrototypeOf =
            empty.toLocaleString =
            empty.toString =
            empty.valueOf =
            empty.__proto__ = null;
            return empty;
        };
    }

    Object.create = function create(prototype, properties) {
        var object;
        if (prototype === null) {
            object = createEmpty();
        } else {
            if (typeof prototype != "object")
                throw new TypeError("typeof prototype["+(typeof prototype)+"] != 'object'");
            var Type = function () {};
            Type.prototype = prototype;
            object = new Type();
            // IE has no built-in implementation of `Object.getPrototypeOf`
            // neither `__proto__`, but this manually setting `__proto__` will
            // guarantee that `Object.getPrototypeOf` will work as expected with
            // objects created using `Object.create`
            object.__proto__ = prototype;
        }
        if (properties !== void 0)
            Object.defineProperties(object, properties);
        return object;
    };
}

// ES5 15.2.3.6
// http://es5.github.com/#x15.2.3.6

// Patch for WebKit and IE8 standard mode
// Designed by hax <hax.github.com>
// related issue: https://github.com/kriskowal/es5-shim/issues#issue/5
// IE8 Reference:
//     http://msdn.microsoft.com/en-us/library/dd282900.aspx
//     http://msdn.microsoft.com/en-us/library/dd229916.aspx
// WebKit Bugs:
//     https://bugs.webkit.org/show_bug.cgi?id=36423

function doesDefinePropertyWork(object) {
    try {
        Object.defineProperty(object, "sentinel", {});
        return "sentinel" in object;
    } catch (exception) {
        // returns falsy
    }
}

// check whether defineProperty works if it's given. Otherwise,
// shim partially.
if (Object.defineProperty) {
    var definePropertyWorksOnObject = doesDefinePropertyWork({});
    var definePropertyWorksOnDom = typeof document == "undefined" ||
        doesDefinePropertyWork(document.createElement("div"));
    if (!definePropertyWorksOnObject || !definePropertyWorksOnDom) {
        var definePropertyFallback = Object.defineProperty;
    }
}

if (!Object.defineProperty || definePropertyFallback) {
    var ERR_NON_OBJECT_DESCRIPTOR = "Property description must be an object: ";
    var ERR_NON_OBJECT_TARGET = "Object.defineProperty called on non-object: ";
    var ERR_ACCESSORS_NOT_SUPPORTED = "getters & setters can not be defined " +
                                      "on this javascript engine";

    Object.defineProperty = function defineProperty(object, property, descriptor) {
        if ((typeof object != "object" && typeof object != "function") || object === null)
            throw new TypeError(ERR_NON_OBJECT_TARGET + object);
        if ((typeof descriptor != "object" && typeof descriptor != "function") || descriptor === null)
            throw new TypeError(ERR_NON_OBJECT_DESCRIPTOR + descriptor);

        // make a valiant attempt to use the real defineProperty
        // for I8's DOM elements.
        if (definePropertyFallback) {
            try {
                return definePropertyFallback.call(Object, object, property, descriptor);
            } catch (exception) {
                // try the shim if the real one doesn't work
            }
        }

        // If it's a data property.
        if (owns(descriptor, "value")) {
            // fail silently if "writable", "enumerable", or "configurable"
            // are requested but not supported
            /*
            // alternate approach:
            if ( // can't implement these features; allow false but not true
                !(owns(descriptor, "writable") ? descriptor.writable : true) ||
                !(owns(descriptor, "enumerable") ? descriptor.enumerable : true) ||
                !(owns(descriptor, "configurable") ? descriptor.configurable : true)
            )
                throw new RangeError(
                    "This implementation of Object.defineProperty does not " +
                    "support configurable, enumerable, or writable."
                );
            */

            if (supportsAccessors && (lookupGetter(object, property) ||
                                      lookupSetter(object, property)))
            {
                // As accessors are supported only on engines implementing
                // `__proto__` we can safely override `__proto__` while defining
                // a property to make sure that we don't hit an inherited
                // accessor.
                var prototype = object.__proto__;
                object.__proto__ = prototypeOfObject;
                // Deleting a property anyway since getter / setter may be
                // defined on object itself.
                delete object[property];
                object[property] = descriptor.value;
                // Setting original `__proto__` back now.
                object.__proto__ = prototype;
            } else {
                object[property] = descriptor.value;
            }
        } else {
            if (!supportsAccessors)
                throw new TypeError(ERR_ACCESSORS_NOT_SUPPORTED);
            // If we got that far then getters and setters can be defined !!
            if (owns(descriptor, "get"))
                defineGetter(object, property, descriptor.get);
            if (owns(descriptor, "set"))
                defineSetter(object, property, descriptor.set);
        }

        return object;
    };
}

// ES5 15.2.3.7
// http://es5.github.com/#x15.2.3.7
if (!Object.defineProperties) {
    Object.defineProperties = function defineProperties(object, properties) {
        for (var property in properties) {
            if (owns(properties, property))
                Object.defineProperty(object, property, properties[property]);
        }
        return object;
    };
}

// ES5 15.2.3.8
// http://es5.github.com/#x15.2.3.8
if (!Object.seal) {
    Object.seal = function seal(object) {
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// ES5 15.2.3.9
// http://es5.github.com/#x15.2.3.9
if (!Object.freeze) {
    Object.freeze = function freeze(object) {
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// detect a Rhino bug and patch it
try {
    Object.freeze(function () {});
} catch (exception) {
    Object.freeze = (function freeze(freezeObject) {
        return function freeze(object) {
            if (typeof object == "function") {
                return object;
            } else {
                return freezeObject(object);
            }
        };
    })(Object.freeze);
}

// ES5 15.2.3.10
// http://es5.github.com/#x15.2.3.10
if (!Object.preventExtensions) {
    Object.preventExtensions = function preventExtensions(object) {
        // this is misleading and breaks feature-detection, but
        // allows "securable" code to "gracefully" degrade to working
        // but insecure code.
        return object;
    };
}

// ES5 15.2.3.11
// http://es5.github.com/#x15.2.3.11
if (!Object.isSealed) {
    Object.isSealed = function isSealed(object) {
        return false;
    };
}

// ES5 15.2.3.12
// http://es5.github.com/#x15.2.3.12
if (!Object.isFrozen) {
    Object.isFrozen = function isFrozen(object) {
        return false;
    };
}

// ES5 15.2.3.13
// http://es5.github.com/#x15.2.3.13
if (!Object.isExtensible) {
    Object.isExtensible = function isExtensible(object) {
        // 1. If Type(O) is not Object throw a TypeError exception.
        if (Object(object) === object) {
            throw new TypeError(); // TODO message
        }
        // 2. Return the Boolean value of the [[Extensible]] internal property of O.
        var name = '';
        while (owns(object, name)) {
            name += '?';
        }
        object[name] = true;
        var returnValue = owns(object, name);
        delete object[name];
        return returnValue;
    };
}

// ES5 15.2.3.14
// http://es5.github.com/#x15.2.3.14
if (!Object.keys) {
    // http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
    var hasDontEnumBug = true,
        dontEnums = [
            "toString",
            "toLocaleString",
            "valueOf",
            "hasOwnProperty",
            "isPrototypeOf",
            "propertyIsEnumerable",
            "constructor"
        ],
        dontEnumsLength = dontEnums.length;

    for (var key in {"toString": null}) {
        hasDontEnumBug = false;
    }

    Object.keys = function keys(object) {

        if (
            (typeof object != "object" && typeof object != "function") ||
            object === null
        ) {
            throw new TypeError("Object.keys called on a non-object");
        }

        var keys = [];
        for (var name in object) {
            if (owns(object, name)) {
                keys.push(name);
            }
        }

        if (hasDontEnumBug) {
            for (var i = 0, ii = dontEnumsLength; i < ii; i++) {
                var dontEnum = dontEnums[i];
                if (owns(object, dontEnum)) {
                    keys.push(dontEnum);
                }
            }
        }
        return keys;
    };

}

//
// most of es5-shim Date section is removed since ace doesn't need it, it is too intrusive and it causes problems for users
// ====
//

// ES5 15.9.4.4
// http://es5.github.com/#x15.9.4.4
if (!Date.now) {
    Date.now = function now() {
        return new Date().getTime();
    };
}


//
// String
// ======
//

// ES5 15.5.4.20
// http://es5.github.com/#x15.5.4.20
var ws = "\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003" +
    "\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028" +
    "\u2029\uFEFF";
if (!String.prototype.trim || ws.trim()) {
    // http://blog.stevenlevithan.com/archives/faster-trim-javascript
    // http://perfectionkills.com/whitespace-deviations/
    ws = "[" + ws + "]";
    var trimBeginRegexp = new RegExp("^" + ws + ws + "*"),
        trimEndRegexp = new RegExp(ws + ws + "*$");
    String.prototype.trim = function trim() {
        return String(this).replace(trimBeginRegexp, "").replace(trimEndRegexp, "");
    };
}

//
// Util
// ======
//

// ES5 9.4
// http://es5.github.com/#x9.4
// http://jsperf.com/to-integer

function toInteger(n) {
    n = +n;
    if (n !== n) { // isNaN
        n = 0;
    } else if (n !== 0 && n !== (1/0) && n !== -(1/0)) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
    }
    return n;
}

// ES5 9.9
// http://es5.github.com/#x9.9
var toObject = function (o) {
    if (o == null) { // this matches both null and undefined
        throw new TypeError("can't convert "+o+" to object");
    }
    return Object(o);
};

var oop = {};

/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

(function (exports) {

exports.inherits = function(ctor, superCtor) {
    ctor.super_ = superCtor;
    ctor.prototype = Object.create(superCtor.prototype, {
        constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
};

exports.mixin = function(obj, mixin) {
    for (var key in mixin) {
        obj[key] = mixin[key];
    }
    return obj;
};

exports.implement = function(proto, mixin) {
    exports.mixin(proto, mixin);
};
}(oop));

/*! @license
==========================================================================
SproutCore -- JavaScript Application Framework
copyright 2006-2009, Sprout Systems Inc., Apple Inc. and contributors.

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
DEALINGS IN THE SOFTWARE.

SproutCore and the SproutCore logo are trademarks of Sprout Systems, Inc.

For more information about SproutCore, visit http://www.sproutcore.com


==========================================================================
@license */

(function (exports) {



var oop$1 = oop;

/*
 * Helper functions and hashes for key handling.
 */
var Keys = (function() {
    var ret = {
        MODIFIER_KEYS: {
            16: 'Shift', 17: 'Ctrl', 18: 'Alt', 224: 'Meta'
        },

        KEY_MODS: {
            "ctrl": 1, "alt": 2, "option" : 2, "shift": 4,
            "super": 8, "meta": 8, "command": 8, "cmd": 8
        },

        FUNCTION_KEYS : {
            8  : "Backspace",
            9  : "Tab",
            13 : "Return",
            19 : "Pause",
            27 : "Esc",
            32 : "Space",
            33 : "PageUp",
            34 : "PageDown",
            35 : "End",
            36 : "Home",
            37 : "Left",
            38 : "Up",
            39 : "Right",
            40 : "Down",
            44 : "Print",
            45 : "Insert",
            46 : "Delete",
            96 : "Numpad0",
            97 : "Numpad1",
            98 : "Numpad2",
            99 : "Numpad3",
            100: "Numpad4",
            101: "Numpad5",
            102: "Numpad6",
            103: "Numpad7",
            104: "Numpad8",
            105: "Numpad9",
            '-13': "NumpadEnter",
            112: "F1",
            113: "F2",
            114: "F3",
            115: "F4",
            116: "F5",
            117: "F6",
            118: "F7",
            119: "F8",
            120: "F9",
            121: "F10",
            122: "F11",
            123: "F12",
            144: "Numlock",
            145: "Scrolllock"
        },

        PRINTABLE_KEYS: {
           32: ' ',  48: '0',  49: '1',  50: '2',  51: '3',  52: '4', 53:  '5',
           54: '6',  55: '7',  56: '8',  57: '9',  59: ';',  61: '=', 65:  'a',
           66: 'b',  67: 'c',  68: 'd',  69: 'e',  70: 'f',  71: 'g', 72:  'h',
           73: 'i',  74: 'j',  75: 'k',  76: 'l',  77: 'm',  78: 'n', 79:  'o',
           80: 'p',  81: 'q',  82: 'r',  83: 's',  84: 't',  85: 'u', 86:  'v',
           87: 'w',  88: 'x',  89: 'y',  90: 'z', 107: '+', 109: '-', 110: '.',
          186: ';', 187: '=', 188: ',', 189: '-', 190: '.', 191: '/', 192: '`',
          219: '[', 220: '\\',221: ']', 222: '\''
        }
    };

    // A reverse map of FUNCTION_KEYS
    var name, i;
    for (i in ret.FUNCTION_KEYS) {
        name = ret.FUNCTION_KEYS[i].toLowerCase();
        ret[name] = parseInt(i, 10);
    }

    // A reverse map of PRINTABLE_KEYS
    for (i in ret.PRINTABLE_KEYS) {
        name = ret.PRINTABLE_KEYS[i].toLowerCase();
        ret[name] = parseInt(i, 10);
    }

    // Add the MODIFIER_KEYS, FUNCTION_KEYS and PRINTABLE_KEYS to the KEY
    // variables as well.
    oop$1.mixin(ret, ret.MODIFIER_KEYS);
    oop$1.mixin(ret, ret.PRINTABLE_KEYS);
    oop$1.mixin(ret, ret.FUNCTION_KEYS);

    // aliases
    ret.enter = ret["return"];
    ret.escape = ret.esc;
    ret.del = ret["delete"];

    // workaround for firefox bug
    ret[173] = '-';
    
    (function() {
        var mods = ["cmd", "ctrl", "alt", "shift"];
        for (var i = Math.pow(2, mods.length); i--;) {            
            ret.KEY_MODS[i] = mods.filter(function(x) {
                return i & ret.KEY_MODS[x];
            }).join("-") + "-";
        }
    })();

    ret.KEY_MODS[0] = "";
    ret.KEY_MODS[-1] = "input-";

    return ret;
})();
oop$1.mixin(exports, Keys);

exports.keyCodeToString = function(keyCode) {
    // Language-switching keystroke in Chrome/Linux emits keyCode 0.
    var keyString = Keys[keyCode];
    if (typeof keyString != "string")
        keyString = String.fromCharCode(keyCode);
    return keyString.toLowerCase();
};
}(keys));

var useragent$1 = {};

/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

(function (exports) {

/*
 * I hate doing this, but we need some way to determine if the user is on a Mac
 * The reason is that users have different expectations of their key combinations.
 *
 * Take copy as an example, Mac people expect to use CMD or APPLE + C
 * Windows folks expect to use CTRL + C
 */
exports.OS = {
    LINUX: "LINUX",
    MAC: "MAC",
    WINDOWS: "WINDOWS"
};

/*
 * Return an exports.OS constant
 */
exports.getOS = function() {
    if (exports.isMac) {
        return exports.OS.MAC;
    } else if (exports.isLinux) {
        return exports.OS.LINUX;
    } else {
        return exports.OS.WINDOWS;
    }
};

// this can be called in non browser environments (e.g. from ace/requirejs/text)
if (typeof navigator != "object")
    return;

var os = (navigator.platform.match(/mac|win|linux/i) || ["other"])[0].toLowerCase();
var ua = navigator.userAgent;

// Is the user using a browser that identifies itself as Windows
exports.isWin = (os == "win");

// Is the user using a browser that identifies itself as Mac OS
exports.isMac = (os == "mac");

// Is the user using a browser that identifies itself as Linux
exports.isLinux = (os == "linux");

// Windows Store JavaScript apps (aka Metro apps written in HTML5 and JavaScript) do not use the "Microsoft Internet Explorer" string in their user agent, but "MSAppHost" instead.
exports.isIE = 
    (navigator.appName == "Microsoft Internet Explorer" || navigator.appName.indexOf("MSAppHost") >= 0)
    ? parseFloat((ua.match(/(?:MSIE |Trident\/[0-9]+[\.0-9]+;.*rv:)([0-9]+[\.0-9]+)/)||[])[1])
    : parseFloat((ua.match(/(?:Trident\/[0-9]+[\.0-9]+;.*rv:)([0-9]+[\.0-9]+)/)||[])[1]); // for ie
    
exports.isOldIE = exports.isIE && exports.isIE < 9;

// Is this Firefox or related?
exports.isGecko = exports.isMozilla = (window.Controllers || window.controllers) && window.navigator.product === "Gecko";

// oldGecko == rev < 2.0 
exports.isOldGecko = exports.isGecko && parseInt((ua.match(/rv\:(\d+)/)||[])[1], 10) < 4;

// Is this Opera 
exports.isOpera = window.opera && Object.prototype.toString.call(window.opera) == "[object Opera]";

// Is the user using a browser that identifies itself as WebKit 
exports.isWebKit = parseFloat(ua.split("WebKit/")[1]) || undefined;

exports.isChrome = parseFloat(ua.split(" Chrome/")[1]) || undefined;

exports.isAIR = ua.indexOf("AdobeAIR") >= 0;

exports.isIPad = ua.indexOf("iPad") >= 0;

exports.isTouchPad = ua.indexOf("TouchPad") >= 0;

exports.isChromeOS = ua.indexOf(" CrOS ") >= 0;
}(useragent$1));

/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

var keyUtil = keys;
var useragent = useragent$1;
var KEY_MODS = keyUtil.KEY_MODS;

function HashHandler(config, platform) {
    this.platform = platform || (useragent.isMac ? "mac" : "win");
    this.commands = {};
    this.commandKeyBinding = {};
    this.addCommands(config);
    this.$singleCommand = true;
}

function MultiHashHandler(config, platform) {
    HashHandler.call(this, config, platform);
    this.$singleCommand = false;
}

MultiHashHandler.prototype = HashHandler.prototype;

(function() {
    

    this.addCommand = function(command) {
        if (this.commands[command.name])
            this.removeCommand(command);

        this.commands[command.name] = command;

        if (command.bindKey)
            this._buildKeyHash(command);
    };

    this.removeCommand = function(command, keepCommand) {
        var name = command && (typeof command === 'string' ? command : command.name);
        command = this.commands[name];
        if (!keepCommand)
            delete this.commands[name];

        // exhaustive search is brute force but since removeCommand is
        // not a performance critical operation this should be OK
        var ckb = this.commandKeyBinding;
        for (var keyId in ckb) {
            var cmdGroup = ckb[keyId];
            if (cmdGroup == command) {
                delete ckb[keyId];
            } else if (Array.isArray(cmdGroup)) {
                var i = cmdGroup.indexOf(command);
                if (i != -1) {
                    cmdGroup.splice(i, 1);
                    if (cmdGroup.length == 1)
                        ckb[keyId] = cmdGroup[0];
                }
            }
        }
    };

    this.bindKey = function(key, command, position) {
        if (typeof key == "object") {
            if (position == undefined)
                position = key.position;
            key = key[this.platform];
        }
        if (!key)
            return;
        if (typeof command == "function")
            return this.addCommand({exec: command, bindKey: key, name: command.name || key});
        
        key.split("|").forEach(function(keyPart) {
            var chain = "";
            if (keyPart.indexOf(" ") != -1) {
                var parts = keyPart.split(/\s+/);
                keyPart = parts.pop();
                parts.forEach(function(keyPart) {
                    var binding = this.parseKeys(keyPart);
                    var id = KEY_MODS[binding.hashId] + binding.key;
                    chain += (chain ? " " : "") + id;
                    this._addCommandToBinding(chain, "chainKeys");
                }, this);
                chain += " ";
            }
            var binding = this.parseKeys(keyPart);
            var id = KEY_MODS[binding.hashId] + binding.key;
            this._addCommandToBinding(chain + id, command, position);
        }, this);
    };
    
    function getPosition(command) {
        return typeof command == "object" && command.bindKey
            && command.bindKey.position || 0;
    }
    this._addCommandToBinding = function(keyId, command, position) {
        var ckb = this.commandKeyBinding, i;
        if (!command) {
            delete ckb[keyId];
        } else if (!ckb[keyId] || this.$singleCommand) {
            ckb[keyId] = command;
        } else {
            if (!Array.isArray(ckb[keyId])) {
                ckb[keyId] = [ckb[keyId]];
            } else if ((i = ckb[keyId].indexOf(command)) != -1) {
                ckb[keyId].splice(i, 1);
            }

            if (typeof position != "number") {
                if (position || command.isDefault)
                    position = -100;
                else
                   position = getPosition(command);
            }
            var commands = ckb[keyId];
            for (i = 0; i < commands.length; i++) {
                var other = commands[i];
                var otherPos = getPosition(other);
                if (otherPos > position)
                    break;
            }
            commands.splice(i, 0, command);
        }
    };

    this.addCommands = function(commands) {
        commands && Object.keys(commands).forEach(function(name) {
            var command = commands[name];
            if (!command)
                return;
            
            if (typeof command === "string")
                return this.bindKey(command, name);

            if (typeof command === "function")
                command = { exec: command };

            if (typeof command !== "object")
                return;

            if (!command.name)
                command.name = name;

            this.addCommand(command);
        }, this);
    };

    this.removeCommands = function(commands) {
        Object.keys(commands).forEach(function(name) {
            this.removeCommand(commands[name]);
        }, this);
    };

    this.bindKeys = function(keyList) {
        Object.keys(keyList).forEach(function(key) {
            this.bindKey(key, keyList[key]);
        }, this);
    };

    this._buildKeyHash = function(command) {
        this.bindKey(command.bindKey, command);
    };

    // accepts keys in the form ctrl+Enter or ctrl-Enter
    // keys without modifiers or shift only 
    this.parseKeys = function(keys) {
        var parts = keys.toLowerCase().split(/[\-\+]([\-\+])?/).filter(function(x){return x});
        var key = parts.pop();

        var keyCode = keyUtil[key];
        if (keyUtil.FUNCTION_KEYS[keyCode])
            key = keyUtil.FUNCTION_KEYS[keyCode].toLowerCase();
        else if (!parts.length)
            return {key: key, hashId: -1};
        else if (parts.length == 1 && parts[0] == "shift")
            return {key: key.toUpperCase(), hashId: -1};

        var hashId = 0;
        for (var i = parts.length; i--;) {
            var modifier = keyUtil.KEY_MODS[parts[i]];
            if (modifier == null) {
                if (typeof console != "undefined")
                    console.error("invalid modifier " + parts[i] + " in " + keys);
                return false;
            }
            hashId |= modifier;
        }
        return {key: key, hashId: hashId};
    };

    this.findKeyCommand = function findKeyCommand(hashId, keyString) {
        var key = KEY_MODS[hashId] + keyString;
        return this.commandKeyBinding[key];
    };

    this.handleKeyboard = function(data, hashId, keyString, keyCode) {
        var key = KEY_MODS[hashId] + keyString;
        var command = this.commandKeyBinding[key];
        if (data.$keyChain) {
            data.$keyChain += " " + key;
            command = this.commandKeyBinding[data.$keyChain] || command;
        }
        
        if (command) {
            if (command == "chainKeys" || command[command.length - 1] == "chainKeys") {
                data.$keyChain = data.$keyChain || key;
                return {command: "null"};
            }
        }
        
        if (data.$keyChain) {
            if ((!hashId || hashId == 4) && keyString.length == 1)
                data.$keyChain = data.$keyChain.slice(0, -key.length - 1); // wait for input
            else if (hashId == -1 || keyCode > 0)
                data.$keyChain = ""; // reset keyChain
        }
        return {command: command};
    };
    
    this.getStatusText = function(editor, data) {
        return data.$keyChain || "";
    };

}).call(HashHandler.prototype);

var HashHandler_1 = HashHandler;

var AutoComplete = (function () {
    function AutoComplete(editor, script, completionService) {
        var _this = this;
        this.editor = editor;
        this.script = script;
        this.completionService = completionService;
        this.isActive = function () {
            return _this._active;
        };
        this.setScriptName = function (name) {
            _this.scriptName = name;
        };
        this.show = function () {
            _this.listElement = _this.view.listElement;
            _this.editor.container.appendChild(_this.view.wrap);
            _this.listElement.innerHTML = '';
        };
        this.hide = function () {
            _this.view.hide();
        };
        this.compilation = function (cursor) {
            var compilationInfo = _this.completionService.getCursorCompilation(_this.scriptName, cursor);
            var text = _this.completionService.matchText;
            var coords = _this.editor.renderer.textToScreenCoordinates(cursor.row, cursor.column - text.length);
            _this.view.setPosition(coords);
            _this.inputText = text;
            if (!compilationInfo)
                console.log('`compilationInfo` is undefined');
            var compilations = (compilationInfo || { entries: [] }).entries;
            if (_this.inputText.length > 0 && compilationInfo) {
                compilations = compilationInfo.entries.filter(function (elm) {
                    return elm.name.toLowerCase().indexOf(_this.inputText.toLowerCase()) == 0;
                });
            }
            var matchFunc = function (elm) {
                return elm.name.indexOf(_this.inputText) == 0 ? 1 : 0;
            };
            var matchCompare = function (a, b) {
                return matchFunc(b) - matchFunc(a);
            };
            var textCompare = function (a, b) {
                if (a.name == b.name) {
                    return 0;
                }
                else {
                    return (a.name > b.name) ? 1 : -1;
                }
            };
            var compare = function (a, b) {
                var ret = matchCompare(a, b);
                return (ret != 0) ? ret : textCompare(a, b);
            };
            compilations = compilations.sort(compare);
            compilations = compilations.filter(function (k) { return !~k.name.indexOf('_'); });
            _this.showCompilation(compilations);
            return compilations.length;
        };
        this.refreshCompletions = function (e) {
            var cursor = _this.editor.getCursorPosition();
            var data = e;
            var newText = _this.editor.getSession().getTextRange(new Range_1(data.start.row, data.start.column, data.end.row, data.end.column));
            if (e.action == "insert") {
                cursor.column += 1;
            }
            else if (e.action == "remove") {
                if (newText == '\n') {
                    _this.deactivate();
                    return;
                }
            }
            _this.compilation(cursor);
        };
        this.showCompilation = function (infos) {
            if (infos.length > 0) {
                _this.view.show();
                var html = '';
                for (var n in infos) {
                    var info = infos[n];
                    var name = '<span class="label-name">' + info.name + '</span>';
                    var type = '<span class="label-type">' + info.kind + '</span>';
                    var kind = '<span class="label-kind label-kind-' + info.kind + '">' + info.kind.charAt(0) + '</span>';
                    html += '<li data-name="' + info.name + '">' + kind + name + type + '</li>';
                }
                _this.listElement.innerHTML = html;
                _this.view.ensureFocus();
            }
            else {
                _this.view.hide();
            }
        };
        this.active = function () {
            _this.show();
            var count = _this.compilation(_this.editor.getCursorPosition());
            if (!(count > 0)) {
                _this.hide();
                return;
            }
            _this.editor.keyBinding.addKeyboardHandler(_this.handler);
        };
        this.deactivate = function () {
            _this.editor.keyBinding.removeKeyboardHandler(_this.handler);
        };
        oop.implement(this, EventEmitter_1);
        this.handler = new HashHandler_1();
        this.view = new AutoCompleteView(editor, this);
        this.scriptName = script;
        this._active = false;
        this.inputText = '';
        this.handler.attach = function () {
            editor.addEventListener("change", _this.refreshCompletions);
            _this._emit("attach", { sender: _this });
            _this._active = true;
        };
        this.handler.detach = function () {
            editor.removeEventListener("change", _this.refreshCompletions);
            _this.view.hide();
            _this._emit("detach", { sender: _this });
            _this._active = false;
        };
        var self = this;
        this.handler.handleKeyboard = function (data, hashId, key, keyCode) {
            if (hashId == -1) {
                if (" -=,[]_/()!';:<>".indexOf(key) != -1) {
                    self.deactivate();
                }
                return null;
            }
            var command = self.handler.findKeyCommand(hashId, key);
            if (!command) {
                var defaultCommand = editor.commands.findKeyCommand(hashId, key);
                if (defaultCommand) {
                    if (defaultCommand.name == "backspace") {
                        return null;
                    }
                    self.deactivate();
                }
                return null;
            }
            if (typeof command != "string") {
                var args = command.args;
                command = command.command;
            }
            if (typeof command == "string") {
                command = this.commands[command];
            }
            return { command: command, args: args };
        };
        var Keybinding = {
            "Up|Ctrl-p": "focusprev",
            "Down|Ctrl-n": "focusnext",
            "esc|Ctrl-g": "cancel",
            "Return|Tab": "insertComplete"
        };
        this.handler.bindKeys(Keybinding);
        this.handler.addCommands({
            focusnext: function (editor) {
                self.view.focusNext();
            },
            focusprev: function (editor) {
                self.view.focusPrev();
            },
            cancel: function (editor) {
                self.deactivate();
            },
            insertComplete: function (editor) {
                editor.removeEventListener("change", self.refreshCompletions);
                var curr = self.view.current();
                for (var i = 0; i < self.inputText.length; i++) {
                    editor.remove("left");
                }
                if (curr) {
                    editor.insert(curr.getAttribute("data-name"));
                }
                self.deactivate();
            }
        });
    }
    return AutoComplete;
}());

var EditorPosition = (function () {
    function EditorPosition(editor) {
        var _this = this;
        this.editor = editor;
        this.getPositionChars = function (pos) {
            var doc;
            doc = editor.getSession().getDocument();
            return _this.getChars(doc, pos);
        };
        this.getAcePositionFromChars = function (chars) {
            var doc;
            doc = editor.getSession().getDocument();
            return _this.getPosition(doc, chars);
        };
        this.getCurrentCharPosition = function () {
            return _this.getPositionChars(editor.getCursorPosition());
        };
        this.getCurrentLeftChar = function () {
            return _this.getPositionLeftChar(editor.getCursorPosition());
        };
        this.getPositionChar = function (cursor) {
            var range;
            range = {
                start: {
                    row: cursor.row,
                    column: cursor.column
                },
                end: {
                    row: cursor.row,
                    column: cursor.column + 1
                }
            };
            return editor.getSession().getDocument().getTextRange(range);
        };
        this.getPositionLeftChar = function (cursor) {
            var range;
            range = {
                start: {
                    row: cursor.row,
                    column: cursor.column
                },
                end: {
                    row: cursor.row,
                    column: cursor.column - 1
                }
            };
            return editor.getSession().getDocument().getTextRange(range);
        };
    }
    EditorPosition.prototype.getLinesChars = function (lines) {
        var count;
        count = 0;
        lines.forEach(function (line) {
            return count += line.length + 1;
        });
        return count;
    };
    EditorPosition.prototype.getChars = function (doc, pos) {
        return this.getLinesChars(doc.getLines(0, pos.row - 1)) + pos.column;
    };
    EditorPosition.prototype.getPosition = function (doc, chars) {
        var count, i, line, lines, row;
        lines = doc.getAllLines();
        count = 0;
        row = 0;
        for (i in lines) {
            line = lines[i];
            if (chars < (count + (line.length + 1))) {
                return {
                    row: row,
                    column: chars - count
                };
            }
            count += line.length + 1;
            row += 1;
        }
        return {
            row: row,
            column: chars - count
        };
    };
    return EditorPosition;
}());

function clone(target) {
    return assign(Array.isArray(target) ? [] : {}, target);
}
function assign(target) {
    var items = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        items[_i - 1] = arguments[_i];
    }
    return items.reduce(function (target, source) {
        return Object.keys(source).reduce(function (target, key) {
            target[key] = source[key];
            return target;
        }, target);
    }, target);
}
function createLanguageServiceHost(currentDir, defaultLibFileName) {
    var compilationSettings;
    var fileNameToScript = Object.create(null);
    function addScript(fileName, content) {
        var script = createScriptInfo(content);
        fileNameToScript[fileName] = script;
    }
    function removeScript(fileName) {
        delete fileNameToScript[fileName];
    }
    function removeAll() {
        fileNameToScript = Object.create(null);
    }
    function hasScript(fileName) {
        return !!fileNameToScript[fileName];
    }
    function updateScript(fileName, content) {
        var script = fileNameToScript[fileName];
        if (script) {
            if (script.getContent() == content) {
                return;
            }
            script.updateContent(content);
            return;
        }
        throw new Error('No script with name \'' + fileName + '\'');
    }
    function editScript(fileName, minChar, limChar, newText) {
        var script = fileNameToScript[fileName];
        if (script) {
            script.editContent(minChar, limChar, newText);
            return;
        }
        throw new Error('No script with name \'' + fileName + '\'');
    }
    function setScriptIsOpen(fileName, isOpen) {
        var script = fileNameToScript[fileName];
        if (script) {
            script.setIsOpen(isOpen);
            return;
        }
        throw new Error('No script with name \'' + fileName + '\'');
    }
    function setCompilationSettings(settings) {
        compilationSettings = Object.freeze(clone(settings));
    }
    function getScriptContent(fileName) {
        var script = fileNameToScript[fileName];
        if (script) {
            return script.getContent();
        }
        return null;
    }
    function getScriptVersion(fileName) {
        var script = fileNameToScript[fileName];
        if (script) {
            return '' + script.getVersion();
        }
        return '0';
    }
    function getScriptSnapshot(fileName) {
        var script = fileNameToScript[fileName];
        if (script) {
            return script.getScriptSnapshot();
        }
        return null;
    }
    return {
        log: function () { return null; },
        error: function () { return null; },
        trace: function () { return null; },
        addScript: addScript,
        removeScript: removeScript,
        removeAll: removeAll,
        updateScript: updateScript,
        hasScript: hasScript,
        editScript: editScript,
        getScriptContent: getScriptContent,
        setCompilationSettings: setCompilationSettings,
        setScriptIsOpen: setScriptIsOpen,
        getCompilationSettings: function () { return compilationSettings; },
        getScriptFileNames: function () { return Object.keys(fileNameToScript); },
        getCurrentDirectory: function () { return currentDir; },
        getDefaultLibFileName: function () { return defaultLibFileName; },
        getScriptVersion: getScriptVersion,
        getScriptSnapshot: getScriptSnapshot,
    };
}
function createScriptInfo(content) {
    var scriptVersion = 1;
    var editRanges = [];
    var isOpen = false;
    var _lineStarts;
    var _lineStartIsDirty = true;
    function getLineStarts() {
        if (_lineStartIsDirty) {
            _lineStarts = ts.computeLineStarts(content);
            _lineStartIsDirty = false;
        }
        return _lineStarts;
    }
    function updateContent(newContent) {
        if (newContent !== content) {
            content = newContent;
            _lineStartIsDirty = true;
            editRanges = [];
            scriptVersion++;
        }
    }
    function editContent(minChar, limChar, newText) {
        var prefix = content.substring(0, minChar);
        var middle = newText;
        var suffix = content.substring(limChar);
        content = prefix + middle + suffix;
        _lineStartIsDirty = true;
        editRanges.push({
            span: { start: minChar, length: limChar - minChar },
            newLength: newText.length
        });
        scriptVersion++;
    }
    function getScriptSnapshot() {
        getLineStarts();
        var textSnapshot = content;
        var version = scriptVersion;
        editRanges.slice();
        function getChangeRange(oldSnapshot) {
            var unchanged = { span: { start: 0, length: 0 }, newLength: 0 };
            function collapseChangesAcrossMultipleVersions(changes) {
                if (changes.length === 0) {
                    return unchanged;
                }
                if (changes.length === 1) {
                    return changes[0];
                }
                var change0 = changes[0];
                var oldStartN = change0.span.start;
                var oldEndN = change0.span.start + change0.span.length;
                var newEndN = oldStartN + change0.newLength;
                for (var i = 1; i < changes.length; i++) {
                    var nextChange = changes[i];
                    var oldStart1 = oldStartN;
                    var oldEnd1 = oldEndN;
                    var newEnd1 = newEndN;
                    var oldStart2 = nextChange.span.start;
                    var oldEnd2 = nextChange.span.start + nextChange.span.length;
                    var newEnd2 = oldStart2 + nextChange.newLength;
                    oldStartN = Math.min(oldStart1, oldStart2);
                    oldEndN = Math.max(oldEnd1, oldEnd1 + (oldEnd2 - newEnd1));
                    newEndN = Math.max(newEnd2, newEnd2 + (newEnd1 - oldEnd2));
                }
                return { span: { start: oldStartN, length: oldEndN - oldStartN }, newLength: newEndN - oldStartN };
            }
            var scriptVersion = oldSnapshot.version || 0;
            if (scriptVersion === version) {
                return unchanged;
            }
            var initialEditRangeIndex = editRanges.length - (version - scriptVersion);
            if (initialEditRangeIndex < 0) {
                return null;
            }
            var entries = editRanges.slice(initialEditRangeIndex);
            return collapseChangesAcrossMultipleVersions(entries);
        }
        return {
            getText: function (start, end) { return textSnapshot.substring(start, end); },
            getLength: function () { return textSnapshot.length; },
            getChangeRange: getChangeRange,
        };
    }
    return {
        getContent: function () { return content; },
        getVersion: function () { return scriptVersion; },
        getIsOpen: function () { return isOpen; },
        setIsOpen: function (val) { return isOpen = val; },
        getScriptSnapshot: getScriptSnapshot,
        updateContent: updateContent,
        editContent: editContent
    };
}

if (typeof importScripts !== 'undefined' && globalThis.ts === undefined) {
    importScripts('https://cdnjs.cloudflare.com/ajax/libs/typescript/4.6.4/typescript.min.js');
}
var TsProject = (function () {
    function TsProject() {
        this.languageServiceHost = createLanguageServiceHost('', "typescripts/lib.d.ts");
        this.languageService = ts.createLanguageService(this.languageServiceHost, ts.createDocumentRegistry());
    }
    return TsProject;
}());
var tsProject$2 = null;
function getTSProject() {
    return tsProject$2 ? tsProject$2 : tsProject$2 = new TsProject();
}

var tsProject$1 = getTSProject();
var CompletionService = (function () {
    function CompletionService(editor) {
        this.editor = editor;
        this.editorPos = new EditorPosition(editor);
    }
    CompletionService.prototype.getCompilation = function (script, charpos, isMemberCompletion) {
        var compInfo = tsProject$1.languageService.getCompletionsAtPosition(script, charpos, {});
        return compInfo;
    };
    CompletionService.prototype.getCursorCompilation = function (script, cursor) {
        var isMemberCompletion, matches, pos, text;
        pos = this.editorPos.getPositionChars(cursor);
        text = this.editor.session.getLine(cursor.row).slice(0, cursor.column);
        isMemberCompletion = false;
        matches = text.match(/\.([a-zA-Z_0-9\$]*$)/);
        if (matches && matches.length > 0) {
            this.matchText = matches[1];
            isMemberCompletion = true;
            pos -= this.matchText.length;
        }
        else {
            matches = text.match(/[a-zA-Z_0-9\$]*$/);
            this.matchText = matches[0];
        }
        return this.getCompilation(script, pos, isMemberCompletion);
    };
    CompletionService.prototype.getCurrentPositionCompilation = function (script) {
        return this.getCursorCompilation(script, this.editor.getCursorPosition());
    };
    return CompletionService;
}());

/* ***** BEGIN LICENSE BLOCK *****
 * Distributed under the BSD license:
 *
 * Copyright (c) 2010, Ajax.org B.V.
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *     * Redistributions of source code must retain the above copyright
 *       notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above copyright
 *       notice, this list of conditions and the following disclaimer in the
 *       documentation and/or other materials provided with the distribution.
 *     * Neither the name of Ajax.org B.V. nor the
 *       names of its contributors may be used to endorse or promote products
 *       derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL AJAX.ORG B.V. BE LIABLE FOR ANY
 * DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * ***** END LICENSE BLOCK ***** */

/* deprecated */
var deferredCall = function(fcn) {
    var timer = null;
    var callback = function() {
        timer = null;
        fcn();
    };

    var deferred = function(timeout) {
        deferred.cancel();
        timer = setTimeout(callback, timeout || 0);
        return deferred;
    };

    deferred.schedule = deferred;

    deferred.call = function() {
        this.cancel();
        fcn();
        return deferred;
    };

    deferred.cancel = function() {
        clearTimeout(timer);
        timer = null;
        return deferred;
    };
    
    deferred.isPending = function() {
        return timer;
    };

    return deferred;
};

function defaultFormatCodeOptions() {
    return {
        IndentSize: 4,
        TabSize: 4,
        NewLineCharacter: "\n",
        ConvertTabsToSpaces: true,
        InsertSpaceAfterCommaDelimiter: true,
        InsertSpaceAfterSemicolonInForStatements: true,
        InsertSpaceBeforeAndAfterBinaryOperators: true,
        InsertSpaceAfterKeywordsInControlFlowStatements: true,
        InsertSpaceAfterFunctionKeywordForAnonymousFunctions: false,
        InsertSpaceAfterOpeningAndBeforeClosingNonemptyParenthesis: false,
        PlaceOpenBraceOnNewLineForFunctions: false,
        PlaceOpenBraceOnNewLineForControlBlocks: false,
        IndentStyle: 0,
        InsertSpaceAfterOpeningAndBeforeClosingNonemptyBrackets: false,
        InsertSpaceAfterOpeningAndBeforeClosingTemplateStringBraces: false
    };
}
var ace = window.ace;
var aceEditorPosition = null;
var signatureToolTip = null;
var originalTextInput = null;
var closuredEvents = {};
var editor = null;
var selectFileName = "";
var syncStop = false;
var autoComplete = null;
var refMarkers = [];
var errorMarkers = [];
var tsProject = getTSProject();
function loadLibFiles(libFiles) {
    var libFiles = libFiles || [
        "/typescripts/4.9.5/lib.dom.d.ts",
        "/typescripts/4.9.5/lib.es5.d.ts",
        "/typescripts/4.9.5/lib.dom.iterable.d.ts",
    ];
    libFiles.forEach(function (libname) {
        if (tsProject.languageServiceHost.hasScript(libname) === false) {
            readFile(libname, function (content) {
                tsProject.languageServiceHost.addScript(libname, content);
            });
        }
    });
    workerOnCreate(function () {
        libFiles.forEach(function (libname) {
            readFile(libname, function (content) {
                var params = {
                    data: {
                        name: libname,
                        content: content
                    }
                };
                editor.getSession().$worker.emit("addLibrary", params);
            });
        });
    });
    return tsProject.languageServiceHost;
}
function loadFile(filename) {
    readFile(filename, function (content) {
        loadContent(filename, content);
    });
}
function loadContent(filename, content, keepExistContent) {
    selectFileName = filename;
    syncStop = true;
    if (!keepExistContent) {
        var data = content.replace(/\r\n?/g, "\n");
        editor.setValue(data);
        editor.moveCursorTo(0, 0);
    }
    tsProject.languageServiceHost.addScript(filename, editor.getSession().getDocument().getValue());
    syncStop = false;
}
function startAutoComplete(editor) {
    if (autoComplete.isActive() == false) {
        autoComplete.setScriptName(selectFileName);
        autoComplete.active();
    }
}
function onUpdateDocument(e) {
    if (selectFileName) {
        if (!syncStop) {
            syncTypeScriptServiceContent(selectFileName, e);
            updateMarker(e);
        }
    }
}
function updateMarker(data) {
    var action = data.action;
    var action = data.action;
    aceEditorPosition.getPositionChars(data.start);
    aceEditorPosition.getPositionChars(data.end);
    var newText = editor.getSession().getTextRange(new Range_1(data.start.row, data.start.column, data.end.row, data.end.column));
    var markers = editor.getSession().getMarkers(true);
    var line_count = 0;
    var isNewLine = editor.getSession().getDocument().isNewLine;
    if (action == "insert") {
        if (isNewLine(newText)) {
            line_count = 1;
        }
    }
    else if (action == "remove") {
        if (isNewLine(newText)) {
            line_count = -1;
        }
    }
    if (line_count != 0) {
        var markerUpdate = function (id) {
            var marker = markers[id];
            var row = data.start.row;
            if (line_count > 0) {
                row = +1;
            }
            if (marker && marker.range.start.row > row) {
                marker.range.start.row += line_count;
                marker.range.end.row += line_count;
            }
        };
        errorMarkers.forEach(markerUpdate);
        refMarkers.forEach(markerUpdate);
        editor.onChangeFrontMarker();
    }
}
function syncTypeScriptServiceContent(script, data) {
    var action = data.action;
    var start = aceEditorPosition.getPositionChars(data.start);
    var end = aceEditorPosition.getPositionChars(data.end);
    var newText = editor.getSession().getTextRange(new Range_1(data.start.row, data.start.column, data.end.row, data.end.column));
    if (action == "insert") {
        editLanguageService(script, start, start, newText);
    }
    else if (action == "remove") {
        editLanguageService(script, start, end, "");
    }
    else {
        console.error('unknown action:', action);
    }
}
function editLanguageService(name, minChar, limChar, newText) {
    tsProject.languageServiceHost.editScript(name, minChar, limChar, newText);
}
function onChangeCursor(e) {
    if (!syncStop) {
        try {
            deferredShowOccurrences.schedule(200);
        }
        catch (ex) {
        }
    }
}
function languageServiceIndent() {
    var cursor = editor.getCursorPosition();
    var lineNumber = cursor.row;
    var text = editor.session.getLine(lineNumber);
    var matches = text.match(/^[\t ]*/);
    var preIndent = 0;
    var wordLen = 0;
    if (matches) {
        wordLen = matches[0].length;
        for (var i = 0; i < matches[0].length; i++) {
            var elm = matches[0].charAt(i);
            var spaceLen = (elm == " ") ? 1 : editor.session.getTabSize();
            preIndent += spaceLen;
        }
    }
    var smartIndent = tsProject.languageService.getIndentationAtPosition(selectFileName, lineNumber, defaultFormatCodeOptions());
    if (preIndent > smartIndent) {
        editor.indent();
    }
    else {
        var indent = smartIndent - preIndent;
        if (indent > 0) {
            editor.getSelection().moveCursorLineStart();
            editor.commands.exec("inserttext", editor, { text: " ", times: indent });
        }
        if (cursor.column > wordLen) {
            cursor.column += indent;
        }
        else {
            cursor.column = indent + wordLen;
        }
        editor.getSelection().moveCursorToPosition(cursor);
    }
}
function refactor() {
    var references = tsProject.languageService.getOccurrencesAtPosition(selectFileName, aceEditorPosition.getCurrentCharPosition());
    references.forEach(function (ref) {
        var getpos = aceEditorPosition.getAcePositionFromChars;
        var start = getpos(ref.textSpan.start);
        var end = getpos(ref.textSpan.start + ref.textSpan.length);
        var range = new Range_1(start.row, start.column, end.row, end.column);
        editor.selection.addRange(range);
    });
}
function showOccurrences() {
    var session = editor.getSession();
    refMarkers.forEach(function (id) {
        session.removeMarker(id);
    });
    var references = tsProject.languageService.getOccurrencesAtPosition(selectFileName, aceEditorPosition.getCurrentCharPosition());
    if (!references) {
        return;
    }
    references.forEach(function (ref) {
        var getpos = aceEditorPosition.getAcePositionFromChars;
        var start = getpos(ref.textSpan.start);
        var end = getpos(ref.textSpan.start + ref.textSpan.length);
        var range = new Range_1(start.row, start.column, end.row, end.column);
        refMarkers.push(session.addMarker(range, "typescript-ref", "text", true));
    });
}
var deferredShowOccurrences = deferredCall(showOccurrences);
function workerOnCreate(func, timeout) {
    if (editor.getSession().$worker) {
        func(editor.getSession().$worker);
    }
    else {
        setTimeout(function () {
            workerOnCreate(func);
        });
    }
}
function dropMode(editor) {
    editor.removeEventListener("change", onUpdateDocument);
    editor.removeEventListener("changeSelection", onChangeCursor);
    editor.session.selection.off('changeCursor', enableHinter);
    ['autoComplete', 'refactor', 'indent'].forEach(function (w) { return editor.commands.removeCommand(w, true); });
    editor.onTextInput = originalTextInput;
    editor.removeEventListener('mousedown', closuredEvents['mousedown']);
    editor.session.off('compileErrors', closuredEvents['compileErrors']);
    return editor;
}
function initialize(options) {
    options = options || {};
    var selector = options.selector || "editor";
    editor = options.editor || ace.edit(selector);
    if (!options.editor)
        editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode('ace/mode/typescript');
    if (selector)
        document.getElementById(selector).style.fontSize = options.fontSize || '14px';
    var languageService = loadLibFiles(options.libFiles);
    if (options.content) {
        loadContent(options.entryFile || 'app.ts', options.content, !!options.editor);
    }
    else {
        loadFile(options.entryFile || "samples/greeter.ts");
    }
    editor.addEventListener("change", onUpdateDocument);
    editor.addEventListener("changeSelection", onChangeCursor);
    if (options.signatureToolTip) {
        editor.session.selection.on('changeCursor', enableHinter);
    }
    editor.commands.addCommands([
        {
            name: "autoComplete",
            bindKey: "Ctrl-Space",
            exec: function (editor) {
                startAutoComplete();
            }
        },
        {
            name: "refactor",
            bindKey: "F2",
            exec: function (editor) {
                refactor();
            }
        },
        {
            name: "indent",
            bindKey: "Tab",
            exec: function (editor) {
                languageServiceIndent();
            },
        }
    ]);
    aceEditorPosition = new EditorPosition(editor);
    autoComplete = new AutoComplete(editor, selectFileName, new CompletionService(editor));
    originalTextInput = editor.onTextInput;
    editor.onTextInput = function (text) {
        originalTextInput.call(editor, text);
        var pos = editor.getCursorPosition();
        var token = editor.session.getTokenAt(pos.row, pos.column);
        if (token && token.value.length > 1 && token.value.match(/\w[\w\d_\$]+/)) {
            editor.execCommand("autoComplete");
            return;
        }
        if (text == ".") {
            editor.execCommand("autoComplete");
        }
        else if (editor.getSession().getDocument().isNewLine(text)) {
            var lineNumber = editor.getCursorPosition().row;
            var prettierOptions = defaultFormatCodeOptions();
            var indent = tsProject.languageService.getIndentationAtPosition(selectFileName, lineNumber, prettierOptions);
            if (indent > 0) {
                editor.commands.exec("inserttext", editor, { text: " ", times: prettierOptions.IndentSize - 5 });
            }
        }
    };
    editor.addEventListener("mousedown", closuredEvents["mousedown"] = function (e) {
        if (autoComplete.isActive()) {
            autoComplete.deactivate();
        }
    });
    editor.getSession().on("compiled", function (e) {
    });
    editor.getSession().on("compileErrors", closuredEvents["compileErrors"] = function (e) {
        var session = editor.getSession();
        errorMarkers.forEach(function (id) {
            session.removeMarker(id);
        });
        e.data.forEach(function (error) {
            var getpos = aceEditorPosition.getAcePositionFromChars;
            var start = getpos(error.minChar);
            var end = getpos(error.limChar);
            var range = new Range_1(start.row, start.column, end.row, end.column);
            errorMarkers.push(session.addMarker(range, "typescript-error", "text", true));
        });
    });
    return languageService;
}
function enableHinter(e) {
    if (signatureToolTip) {
        if (signatureToolTip.parentElement)
            signatureToolTip.parentElement.removeChild(signatureToolTip);
        else if (signatureToolTip.remove) {
            signatureToolTip.remove();
        }
    }
    var pos = editor.getCursorPosition();
    var range = editor.session.getTextRange(new Range_1(0, 0, pos.row, pos.column));
    var arr = range.split('\n');
    var flatPos = arr.length + arr.reduce(function (acc, line) { return acc + line.length; }, 0);
    var token = editor.session.getTokenAt(pos.row, pos.column);
    if (token && token.value == '(') {
        var info = tsProject.languageService.getDefinitionAtPosition("samples/greeter.ts", flatPos - 2);
        if (info && info.length) {
            if (~['function', 'method'].indexOf(info[0].kind)) {
                var quickInfo = tsProject.languageService.getQuickInfoAtPosition("samples/greeter.ts", flatPos - 2);
                if (quickInfo && Array.isArray(quickInfo.displayParts)) {
                    var params = quickInfo.displayParts.filter(function (k) { return k.kind == 'parameterName'; }).map(function (k) { return k.text; });
                    var textInputBound = editor['textInput'].getElement().getBoundingClientRect();
                    signatureToolTip = editor.container.appendChild(document.createElement('div'));
                    signatureToolTip.className = 'tooltip';
                    signatureToolTip.style.top = textInputBound.top + 2 + 'px';
                    signatureToolTip.style.left = textInputBound.left + 10 + 'px';
                    signatureToolTip.innerText = info[0].name + '(' + params.toString().split(',').join(', ') + ')';
                }
            }
        }
    }
}

export { dropMode, initialize };
