'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var DocumentPositionUtil;
(function (DocumentPositionUtil) {
    DocumentPositionUtil.getLinesChars = function (lines) {
        var count;
        count = 0;
        lines.forEach(function (line) {
            return count += line.length + 1;
        });
        return count;
    };
    DocumentPositionUtil.getChars = function (doc, pos) {
        return DocumentPositionUtil.getLinesChars(doc.getLines(0, pos.row - 1)) + pos.column;
    };
    DocumentPositionUtil.getPosition = function (doc, chars) {
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
})(DocumentPositionUtil || (DocumentPositionUtil = {}));

var oop$2 = {};

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
}(oop$2));

var lang$1 = {};

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

exports.last = function(a) {
    return a[a.length - 1];
};

exports.stringReverse = function(string) {
    return string.split("").reverse().join("");
};

exports.stringRepeat = function (string, count) {
    var result = '';
    while (count > 0) {
        if (count & 1)
            result += string;

        if (count >>= 1)
            string += string;
    }
    return result;
};

var trimBeginRegexp = /^\s\s*/;
var trimEndRegexp = /\s\s*$/;

exports.stringTrimLeft = function (string) {
    return string.replace(trimBeginRegexp, '');
};

exports.stringTrimRight = function (string) {
    return string.replace(trimEndRegexp, '');
};

exports.copyObject = function(obj) {
    var copy = {};
    for (var key in obj) {
        copy[key] = obj[key];
    }
    return copy;
};

exports.copyArray = function(array){
    var copy = [];
    for (var i=0, l=array.length; i<l; i++) {
        if (array[i] && typeof array[i] == "object")
            copy[i] = this.copyObject( array[i] );
        else 
            copy[i] = array[i];
    }
    return copy;
};

exports.deepCopy = function deepCopy(obj) {
    if (typeof obj !== "object" || !obj)
        return obj;
    var copy;
    if (Array.isArray(obj)) {
        copy = [];
        for (var key = 0; key < obj.length; key++) {
            copy[key] = deepCopy(obj[key]);
        }
        return copy;
    }
    var cons = obj.constructor;
    if (cons === RegExp)
        return obj;
    
    copy = cons();
    for (var key in obj) {
        copy[key] = deepCopy(obj[key]);
    }
    return copy;
};

exports.arrayToMap = function(arr) {
    var map = {};
    for (var i=0; i<arr.length; i++) {
        map[arr[i]] = 1;
    }
    return map;

};

exports.createMap = function(props) {
    var map = Object.create(null);
    for (var i in props) {
        map[i] = props[i];
    }
    return map;
};

/*
 * splice out of 'array' anything that === 'value'
 */
exports.arrayRemove = function(array, value) {
  for (var i = 0; i <= array.length; i++) {
    if (value === array[i]) {
      array.splice(i, 1);
    }
  }
};

exports.escapeRegExp = function(str) {
    return str.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
};

exports.escapeHTML = function(str) {
    return str.replace(/&/g, "&#38;").replace(/"/g, "&#34;").replace(/'/g, "&#39;").replace(/</g, "&#60;");
};

exports.getMatchOffsets = function(string, regExp) {
    var matches = [];

    string.replace(regExp, function(str) {
        matches.push({
            offset: arguments[arguments.length-2],
            length: str.length
        });
    });

    return matches;
};

/* deprecated */
exports.deferredCall = function(fcn) {
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


exports.delayedCall = function(fcn, defaultTimeout) {
    var timer = null;
    var callback = function() {
        timer = null;
        fcn();
    };

    var _self = function(timeout) {
        if (timer == null)
            timer = setTimeout(callback, timeout || defaultTimeout);
    };

    _self.delay = function(timeout) {
        timer && clearTimeout(timer);
        timer = setTimeout(callback, timeout || defaultTimeout);
    };
    _self.schedule = _self;

    _self.call = function() {
        this.cancel();
        fcn();
    };

    _self.cancel = function() {
        timer && clearTimeout(timer);
        timer = null;
    };

    _self.isPending = function() {
        return timer;
    };

    return _self;
};




exports.default = exports;
}(lang$1));

var range = {};

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
    var Range$1 = function(startRow, startColumn, endRow, endColumn) {
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

            return Range$1.fromPoints(start || this.start, end || this.end);
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

            return Range$1.fromPoints(start || this.start, end || this.end);
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
            return Range$1.fromPoints(this.start, this.end);
        };

        /**
         *
         * Returns a range containing the starting and ending rows of the original range, but with a column value of `0`.
         * @returns {Range}
        **/
        this.collapseRows = function() {
            if (this.end.column == 0)
                return new Range$1(this.start.row, 0, Math.max(this.start.row, this.end.row-1), 0)
            else
                return new Range$1(this.start.row, 0, this.end.row, 0)
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

            return new Range$1(
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

    }).call(Range$1.prototype);

    /**
     * Creates and returns a new `Range` based on the row and column of the given parameters.
     * @param {Range} start A starting point to use
     * @param {Range} end An ending point to use
     *
     * @returns {Range}
    **/
    Range$1.fromPoints = function(start, end) {
        return new Range$1(start.row, start.column, end.row, end.column);
    };
    Range$1.comparePoints = comparePoints;

    Range$1.comparePoints = function(p1, p2) {
        return p1.row - p2.row || p1.column - p2.column;
    };

    range.Range = Range$1;

var document = {};

var apply_delta = {};

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

apply_delta.applyDelta = function(docLines, delta, doNotValidate) {
    // disabled validation since it breaks autocompletion popup
    // if (!doNotValidate)
    //    validateDelta(docLines, delta);
    
    var row = delta.start.row;
    var startColumn = delta.start.column;
    var line = docLines[row] || "";
    switch (delta.action) {
        case "insert":
            var lines = delta.lines;
            if (lines.length === 1) {
                docLines[row] = line.substring(0, startColumn) + delta.lines[0] + line.substring(startColumn);
            } else {
                var args = [row, 1].concat(delta.lines);
                docLines.splice.apply(docLines, args);
                docLines[row] = line.substring(0, startColumn) + docLines[row];
                docLines[row + delta.lines.length - 1] += line.substring(startColumn);
            }
            break;
        case "remove":
            var endColumn = delta.end.column;
            var endRow = delta.end.row;
            if (row === endRow) {
                docLines[row] = line.substring(0, startColumn) + line.substring(endColumn);
            } else {
                docLines.splice(
                    row, endRow - row + 1,
                    line.substring(0, startColumn) + docLines[endRow].substring(endColumn)
                );
            }
            break;
    }
};

var event_emitter = {};

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

var EventEmitter$2 = {};
var stopPropagation = function() { this.propagationStopped = true; };
var preventDefault = function() { this.defaultPrevented = true; };

EventEmitter$2._emit =
EventEmitter$2._dispatchEvent = function(eventName, e) {
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


EventEmitter$2._signal = function(eventName, e) {
    var listeners = (this._eventRegistry || {})[eventName];
    if (!listeners)
        return;
    listeners = listeners.slice();
    for (var i=0; i<listeners.length; i++)
        listeners[i](e, this);
};

EventEmitter$2.once = function(eventName, callback) {
    var _self = this;
    callback && this.addEventListener(eventName, function newCallback() {
        _self.removeEventListener(eventName, newCallback);
        callback.apply(null, arguments);
    });
};


EventEmitter$2.setDefaultHandler = function(eventName, callback) {
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
EventEmitter$2.removeDefaultHandler = function(eventName, callback) {
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

EventEmitter$2.on =
EventEmitter$2.addEventListener = function(eventName, callback, capturing) {
    this._eventRegistry = this._eventRegistry || {};

    var listeners = this._eventRegistry[eventName];
    if (!listeners)
        listeners = this._eventRegistry[eventName] = [];

    if (listeners.indexOf(callback) == -1)
        listeners[capturing ? "unshift" : "push"](callback);
    return callback;
};

EventEmitter$2.off =
EventEmitter$2.removeListener =
EventEmitter$2.removeEventListener = function(eventName, callback) {
    this._eventRegistry = this._eventRegistry || {};

    var listeners = this._eventRegistry[eventName];
    if (!listeners)
        return;

    var index = listeners.indexOf(callback);
    if (index !== -1)
        listeners.splice(index, 1);
};

EventEmitter$2.removeAllListeners = function(eventName) {
    if (this._eventRegistry) this._eventRegistry[eventName] = [];
};

event_emitter.EventEmitter = EventEmitter$2;

var anchor = {};

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

var oop$1 = oop$2;
var EventEmitter$1 = event_emitter.EventEmitter;

/**
 *
 * Defines a floating pointer in the document. Whenever text is inserted or deleted before the cursor, the position of the anchor is updated.
 *
 * @class Anchor
 **/

/**
 * Creates a new `Anchor` and associates it with a document.
 *
 * @param {Document} doc The document to associate with the anchor
 * @param {Number} row The starting row position
 * @param {Number} column The starting column position
 *
 * @constructor
 **/

var Anchor$1 = anchor.Anchor = function(doc, row, column) {
    this.$onChange = this.onChange.bind(this);
    this.attach(doc);
    
    if (typeof column == "undefined")
        this.setPosition(row.row, row.column);
    else
        this.setPosition(row, column);
};

(function() {

    oop$1.implement(this, EventEmitter$1);

    /**
     * Returns an object identifying the `row` and `column` position of the current anchor.
     * @returns {Object}
     **/
    this.getPosition = function() {
        return this.$clipPositionToDocument(this.row, this.column);
    };

    /**
     *
     * Returns the current document.
     * @returns {Document}
     **/
    this.getDocument = function() {
        return this.document;
    };

    /**
     * experimental: allows anchor to stick to the next on the left
     */
    this.$insertRight = false;
    /**
     * Fires whenever the anchor position changes.
     *
     * Both of these objects have a `row` and `column` property corresponding to the position.
     *
     * Events that can trigger this function include [[Anchor.setPosition `setPosition()`]].
     *
     * @event change
     * @param {Object} e  An object containing information about the anchor position. It has two properties:
     *  - `old`: An object describing the old Anchor position
     *  - `value`: An object describing the new Anchor position
     *
     **/
    this.onChange = function(delta) {
        if (delta.start.row == delta.end.row && delta.start.row != this.row)
            return;

        if (delta.start.row > this.row)
            return;
            
        var point = $getTransformedPoint(delta, {row: this.row, column: this.column}, this.$insertRight);
        this.setPosition(point.row, point.column, true);
    };
    
    function $pointsInOrder(point1, point2, equalPointsInOrder) {
        var bColIsAfter = equalPointsInOrder ? point1.column <= point2.column : point1.column < point2.column;
        return (point1.row < point2.row) || (point1.row == point2.row && bColIsAfter);
    }
            
    function $getTransformedPoint(delta, point, moveIfEqual) {
        // Get delta info.
        var deltaIsInsert = delta.action == "insert";
        var deltaRowShift = (deltaIsInsert ? 1 : -1) * (delta.end.row    - delta.start.row);
        var deltaColShift = (deltaIsInsert ? 1 : -1) * (delta.end.column - delta.start.column);
        var deltaStart = delta.start;
        var deltaEnd = deltaIsInsert ? deltaStart : delta.end; // Collapse insert range.
        
        // DELTA AFTER POINT: No change needed.
        if ($pointsInOrder(point, deltaStart, moveIfEqual)) {
            return {
                row: point.row,
                column: point.column
            };
        }
        
        // DELTA BEFORE POINT: Move point by delta shift.
        if ($pointsInOrder(deltaEnd, point, !moveIfEqual)) {
            return {
                row: point.row + deltaRowShift,
                column: point.column + (point.row == deltaEnd.row ? deltaColShift : 0)
            };
        }
        
        // DELTA ENVELOPS POINT (delete only): Move point to delta start.
        // TODO warn if delta.action != "remove" ?
        
        return {
            row: deltaStart.row,
            column: deltaStart.column
        };
    }

    /**
     * Sets the anchor position to the specified row and column. If `noClip` is `true`, the position is not clipped.
     * @param {Number} row The row index to move the anchor to
     * @param {Number} column The column index to move the anchor to
     * @param {Boolean} noClip Identifies if you want the position to be clipped
     *
     **/
    this.setPosition = function(row, column, noClip) {
        var pos;
        if (noClip) {
            pos = {
                row: row,
                column: column
            };
        } else {
            pos = this.$clipPositionToDocument(row, column);
        }

        if (this.row == pos.row && this.column == pos.column)
            return;

        var old = {
            row: this.row,
            column: this.column
        };

        this.row = pos.row;
        this.column = pos.column;
        this._signal("change", {
            old: old,
            value: pos
        });
    };

    /**
     * When called, the `"change"` event listener is removed.
     *
     **/
    this.detach = function() {
        this.document.removeEventListener("change", this.$onChange);
    };
    this.attach = function(doc) {
        this.document = doc || this.document;
        this.document.on("change", this.$onChange);
    };

    /**
     * Clips the anchor position to the specified row and column.
     * @param {Number} row The row index to clip the anchor to
     * @param {Number} column The column index to clip the anchor to
     *
     **/
    this.$clipPositionToDocument = function(row, column) {
        var pos = {};

        if (row >= this.document.getLength()) {
            pos.row = Math.max(0, this.document.getLength() - 1);
            pos.column = this.document.getLine(pos.row).length;
        }
        else if (row < 0) {
            pos.row = 0;
            pos.column = 0;
        }
        else {
            pos.row = row;
            pos.column = Math.min(this.document.getLine(pos.row).length, Math.max(0, column));
        }

        if (column < 0)
            pos.column = 0;

        return pos;
    };

}).call(Anchor$1.prototype);

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

var oop = oop$2;
var applyDelta = apply_delta.applyDelta;
var EventEmitter = event_emitter.EventEmitter;
var Range = range.Range;
var Anchor = anchor.Anchor;

/**
 * Contains the text of the document. Document can be attached to several [[EditSession `EditSession`]]s. 
 * At its core, `Document`s are just an array of strings, with each row in the document matching up to the array index.
 *
 * @class Document
 **/

/**
 *
 * Creates a new `Document`. If `text` is included, the `Document` contains those strings; otherwise, it's empty.
 * @param {String | Array} text The starting text
 * @constructor
 **/

var Document$1 = function(textOrLines) {
    this.$lines = [""];

    // There has to be one line at least in the document. If you pass an empty
    // string to the insert function, nothing will happen. Workaround.
    if (textOrLines.length === 0) {
        this.$lines = [""];
    } else if (Array.isArray(textOrLines)) {
        this.insertMergedLines({row: 0, column: 0}, textOrLines);
    } else {
        this.insert({row: 0, column:0}, textOrLines);
    }
};

(function() {

    oop.implement(this, EventEmitter);

    /**
    * Replaces all the lines in the current `Document` with the value of `text`.
    *
    * @param {String} text The text to use
    **/
    this.setValue = function(text) {
        var len = this.getLength() - 1;
        this.remove(new Range(0, 0, len, this.getLine(len).length));
        this.insert({row: 0, column: 0}, text);
    };

    /**
    * Returns all the lines in the document as a single string, joined by the new line character.
    **/
    this.getValue = function() {
        return this.getAllLines().join(this.getNewLineCharacter());
    };

    /** 
    * Creates a new `Anchor` to define a floating point in the document.
    * @param {Number} row The row number to use
    * @param {Number} column The column number to use
    *
    **/
    this.createAnchor = function(row, column) {
        return new Anchor(this, row, column);
    };

    /** 
    * Splits a string of text on any newline (`\n`) or carriage-return (`\r`) characters.
    *
    * @method $split
    * @param {String} text The text to work with
    * @returns {String} A String array, with each index containing a piece of the original `text` string.
    *
    **/

    // check for IE split bug
    if ("aaa".split(/a/).length === 0) {
        this.$split = function(text) {
            return text.replace(/\r\n|\r/g, "\n").split("\n");
        };
    } else {
        this.$split = function(text) {
            return text.split(/\r\n|\r|\n/);
        };
    }


    this.$detectNewLine = function(text) {
        var match = text.match(/^.*?(\r\n|\r|\n)/m);
        this.$autoNewLine = match ? match[1] : "\n";
        this._signal("changeNewLineMode");
    };

    /**
    * Returns the newline character that's being used, depending on the value of `newLineMode`. 
    * @returns {String} If `newLineMode == windows`, `\r\n` is returned.  
    *  If `newLineMode == unix`, `\n` is returned.  
    *  If `newLineMode == auto`, the value of `autoNewLine` is returned.
    *
    **/
    this.getNewLineCharacter = function() {
        switch (this.$newLineMode) {
          case "windows":
            return "\r\n";
          case "unix":
            return "\n";
          default:
            return this.$autoNewLine || "\n";
        }
    };

    this.$autoNewLine = "";
    this.$newLineMode = "auto";
    /**
     * [Sets the new line mode.]{: #Document.setNewLineMode.desc}
     * @param {String} newLineMode [The newline mode to use; can be either `windows`, `unix`, or `auto`]{: #Document.setNewLineMode.param}
     *
     **/
    this.setNewLineMode = function(newLineMode) {
        if (this.$newLineMode === newLineMode)
            return;

        this.$newLineMode = newLineMode;
        this._signal("changeNewLineMode");
    };

    /**
    * [Returns the type of newlines being used; either `windows`, `unix`, or `auto`]{: #Document.getNewLineMode}
    * @returns {String}
    **/
    this.getNewLineMode = function() {
        return this.$newLineMode;
    };

    /**
    * Returns `true` if `text` is a newline character (either `\r\n`, `\r`, or `\n`).
    * @param {String} text The text to check
    *
    **/
    this.isNewLine = function(text) {
        return (text == "\r\n" || text == "\r" || text == "\n");
    };

    /**
    * Returns a verbatim copy of the given line as it is in the document
    * @param {Number} row The row index to retrieve
    *
    **/
    this.getLine = function(row) {
        return this.$lines[row] || "";
    };

    /**
    * Returns an array of strings of the rows between `firstRow` and `lastRow`. This function is inclusive of `lastRow`.
    * @param {Number} firstRow The first row index to retrieve
    * @param {Number} lastRow The final row index to retrieve
    *
    **/
    this.getLines = function(firstRow, lastRow) {
        return this.$lines.slice(firstRow, lastRow + 1);
    };

    /**
    * Returns all lines in the document as string array.
    **/
    this.getAllLines = function() {
        return this.getLines(0, this.getLength());
    };

    /**
    * Returns the number of rows in the document.
    **/
    this.getLength = function() {
        return this.$lines.length;
    };

    /**
    * Returns all the text within `range` as a single string.
    * @param {Range} range The range to work with.
    * 
    * @returns {String}
    **/
    this.getTextRange = function(range) {
        return this.getLinesForRange(range).join(this.getNewLineCharacter());
    };
    
    /**
    * Returns all the text within `range` as an array of lines.
    * @param {Range} range The range to work with.
    * 
    * @returns {Array}
    **/
    this.getLinesForRange = function(range) {
        var lines;
        if (range.start.row === range.end.row) {
            // Handle a single-line range.
            lines = [this.getLine(range.start.row).substring(range.start.column, range.end.column)];
        } else {
            // Handle a multi-line range.
            lines = this.getLines(range.start.row, range.end.row);
            lines[0] = (lines[0] || "").substring(range.start.column);
            var l = lines.length - 1;
            if (range.end.row - range.start.row == l)
                lines[l] = lines[l].substring(0, range.end.column);
        }
        return lines;
    };

    // Deprecated methods retained for backwards compatibility.
    this.insertLines = function(row, lines) {
        console.warn("Use of document.insertLines is deprecated. Use the insertFullLines method instead.");
        return this.insertFullLines(row, lines);
    };
    this.removeLines = function(firstRow, lastRow) {
        console.warn("Use of document.removeLines is deprecated. Use the removeFullLines method instead.");
        return this.removeFullLines(firstRow, lastRow);
    };
    this.insertNewLine = function(position) {
        console.warn("Use of document.insertNewLine is deprecated. Use insertMergedLines(position, [\'\', \'\']) instead.");
        return this.insertMergedLines(position, ["", ""]);
    };

    /**
    * Inserts a block of `text` at the indicated `position`.
    * @param {Object} position The position to start inserting at; it's an object that looks like `{ row: row, column: column}`
    * @param {String} text A chunk of text to insert
    * @returns {Object} The position ({row, column}) of the last line of `text`. If the length of `text` is 0, this function simply returns `position`. 
    *
    **/
    this.insert = function(position, text) {
        // Only detect new lines if the document has no line break yet.
        if (this.getLength() <= 1)
            this.$detectNewLine(text);
        
        return this.insertMergedLines(position, this.$split(text));
    };
    
    /**
    * Inserts `text` into the `position` at the current row. This method also triggers the `"change"` event.
    * 
    * This differs from the `insert` method in two ways:
    *   1. This does NOT handle newline characters (single-line text only).
    *   2. This is faster than the `insert` method for single-line text insertions.
    * 
    * @param {Object} position The position to insert at; it's an object that looks like `{ row: row, column: column}`
    * @param {String} text A chunk of text
    * @returns {Object} Returns an object containing the final row and column, like this:  
    *     ```
    *     {row: endRow, column: 0}
    *     ```
    **/
    this.insertInLine = function(position, text) {
        var start = this.clippedPos(position.row, position.column);
        var end = this.pos(position.row, position.column + text.length);
        
        this.applyDelta({
            start: start,
            end: end,
            action: "insert",
            lines: [text]
        }, true);
        
        return this.clonePos(end);
    };
    
    this.clippedPos = function(row, column) {
        var length = this.getLength();
        if (row === undefined) {
            row = length;
        } else if (row < 0) {
            row = 0;
        } else if (row >= length) {
            row = length - 1;
            column = undefined;
        }
        var line = this.getLine(row);
        if (column == undefined)
            column = line.length;
        column = Math.min(Math.max(column, 0), line.length);
        return {row: row, column: column};
    };
    
    this.clonePos = function(pos) {
        return {row: pos.row, column: pos.column};
    };
    
    this.pos = function(row, column) {
        return {row: row, column: column};
    };
    
    this.$clipPosition = function(position) {
        var length = this.getLength();
        if (position.row >= length) {
            position.row = Math.max(0, length - 1);
            position.column = this.getLine(length - 1).length;
        } else {
            position.row = Math.max(0, position.row);
            position.column = Math.min(Math.max(position.column, 0), this.getLine(position.row).length);
        }
        return position;
    };

    /**
    * Fires whenever the document changes.
    *
    * Several methods trigger different `"change"` events. Below is a list of each action type, followed by each property that's also available:
    *
    *  * `"insert"`
    *    * `range`: the [[Range]] of the change within the document
    *    * `lines`: the lines being added
    *  * `"remove"`
    *    * `range`: the [[Range]] of the change within the document
    *    * `lines`: the lines being removed
    *
    * @event change
    * @param {Object} e Contains at least one property called `"action"`. `"action"` indicates the action that triggered the change. Each action also has a set of additional properties.
    *
    **/
    
    /**
    * Inserts the elements in `lines` into the document as full lines (does not merge with existing line), starting at the row index given by `row`. This method also triggers the `"change"` event.
    * @param {Number} row The index of the row to insert at
    * @param {Array} lines An array of strings
    * @returns {Object} Contains the final row and column, like this:  
    *   ```
    *   {row: endRow, column: 0}
    *   ```  
    *   If `lines` is empty, this function returns an object containing the current row, and column, like this:  
    *   ``` 
    *   {row: row, column: 0}
    *   ```
    *
    **/
    this.insertFullLines = function(row, lines) {
        // Clip to document.
        // Allow one past the document end.
        row = Math.min(Math.max(row, 0), this.getLength());
        
        // Calculate insertion point.
        var column = 0;
        if (row < this.getLength()) {
            // Insert before the specified row.
            lines = lines.concat([""]);
            column = 0;
        } else {
            // Insert after the last row in the document.
            lines = [""].concat(lines);
            row--;
            column = this.$lines[row].length;
        }
        
        // Insert.
        this.insertMergedLines({row: row, column: column}, lines);
    };

    /**
    * Inserts the elements in `lines` into the document, starting at the position index given by `row`. This method also triggers the `"change"` event.
    * @param {Number} row The index of the row to insert at
    * @param {Array} lines An array of strings
    * @returns {Object} Contains the final row and column, like this:  
    *   ```
    *   {row: endRow, column: 0}
    *   ```  
    *   If `lines` is empty, this function returns an object containing the current row, and column, like this:  
    *   ``` 
    *   {row: row, column: 0}
    *   ```
    *
    **/    
    this.insertMergedLines = function(position, lines) {
        var start = this.clippedPos(position.row, position.column);
        var end = {
            row: start.row + lines.length - 1,
            column: (lines.length == 1 ? start.column : 0) + lines[lines.length - 1].length
        };
        
        this.applyDelta({
            start: start,
            end: end,
            action: "insert",
            lines: lines
        });
        
        return this.clonePos(end);
    };

    /**
    * Removes the `range` from the document.
    * @param {Range} range A specified Range to remove
    * @returns {Object} Returns the new `start` property of the range, which contains `startRow` and `startColumn`. If `range` is empty, this function returns the unmodified value of `range.start`.
    *
    **/
    this.remove = function(range) {
        var start = this.clippedPos(range.start.row, range.start.column);
        var end = this.clippedPos(range.end.row, range.end.column);
        this.applyDelta({
            start: start,
            end: end,
            action: "remove",
            lines: this.getLinesForRange({start: start, end: end})
        });
        return this.clonePos(start);
    };

    /**
     * Removes the specified columns from the `row`. This method also triggers a `"change"` event.
     * @param {Number} row The row to remove from
     * @param {Number} startColumn The column to start removing at 
     * @param {Number} endColumn The column to stop removing at
     * @returns {Object} Returns an object containing `startRow` and `startColumn`, indicating the new row and column values.<br/>If `startColumn` is equal to `endColumn`, this function returns nothing.
     *
     **/
    this.removeInLine = function(row, startColumn, endColumn) {
        var start = this.clippedPos(row, startColumn);
        var end = this.clippedPos(row, endColumn);
        
        this.applyDelta({
            start: start,
            end: end,
            action: "remove",
            lines: this.getLinesForRange({start: start, end: end})
        }, true);
        
        return this.clonePos(start);
    };

    /**
    * Removes a range of full lines. This method also triggers the `"change"` event.
    * @param {Number} firstRow The first row to be removed
    * @param {Number} lastRow The last row to be removed
    * @returns {[String]} Returns all the removed lines.
    *
    **/
    this.removeFullLines = function(firstRow, lastRow) {
        // Clip to document.
        firstRow = Math.min(Math.max(0, firstRow), this.getLength() - 1);
        lastRow  = Math.min(Math.max(0, lastRow ), this.getLength() - 1);
        
        // Calculate deletion range.
        // Delete the ending new line unless we're at the end of the document.
        // If we're at the end of the document, delete the starting new line.
        var deleteFirstNewLine = lastRow == this.getLength() - 1 && firstRow > 0;
        var deleteLastNewLine  = lastRow  < this.getLength() - 1;
        var startRow = ( deleteFirstNewLine ? firstRow - 1                  : firstRow                    );
        var startCol = ( deleteFirstNewLine ? this.getLine(startRow).length : 0                           );
        var endRow   = ( deleteLastNewLine  ? lastRow + 1                   : lastRow                     );
        var endCol   = ( deleteLastNewLine  ? 0                             : this.getLine(endRow).length ); 
        var range = new Range(startRow, startCol, endRow, endCol);
        
        // Store delelted lines with bounding newlines ommitted (maintains previous behavior).
        var deletedLines = this.$lines.slice(firstRow, lastRow + 1);
        
        this.applyDelta({
            start: range.start,
            end: range.end,
            action: "remove",
            lines: this.getLinesForRange(range)
        });
        
        // Return the deleted lines.
        return deletedLines;
    };

    /**
    * Removes the new line between `row` and the row immediately following it. This method also triggers the `"change"` event.
    * @param {Number} row The row to check
    *
    **/
    this.removeNewLine = function(row) {
        if (row < this.getLength() - 1 && row >= 0) {
            this.applyDelta({
                start: this.pos(row, this.getLine(row).length),
                end: this.pos(row + 1, 0),
                action: "remove",
                lines: ["", ""]
            });
        }
    };

    /**
    * Replaces a range in the document with the new `text`.
    * @param {Range} range A specified Range to replace
    * @param {String} text The new text to use as a replacement
    * @returns {Object} Returns an object containing the final row and column, like this:
    *     {row: endRow, column: 0}
    * If the text and range are empty, this function returns an object containing the current `range.start` value.
    * If the text is the exact same as what currently exists, this function returns an object containing the current `range.end` value.
    *
    **/
    this.replace = function(range, text) {
        if (!range instanceof Range)
            range = Range.fromPoints(range.start, range.end);
        if (text.length === 0 && range.isEmpty())
            return range.start;

        // Shortcut: If the text we want to insert is the same as it is already
        // in the document, we don't have to replace anything.
        if (text == this.getTextRange(range))
            return range.end;

        this.remove(range);
        var end;
        if (text) {
            end = this.insert(range.start, text);
        }
        else {
            end = range.start;
        }
        
        return end;
    };

    /**
    * Applies all changes in `deltas` to the document.
    * @param {Array} deltas An array of delta objects (can include "insert" and "remove" actions)
    **/
    this.applyDeltas = function(deltas) {
        for (var i=0; i<deltas.length; i++) {
            this.applyDelta(deltas[i]);
        }
    };
    
    /**
    * Reverts all changes in `deltas` from the document.
    * @param {Array} deltas An array of delta objects (can include "insert" and "remove" actions)
    **/
    this.revertDeltas = function(deltas) {
        for (var i=deltas.length-1; i>=0; i--) {
            this.revertDelta(deltas[i]);
        }
    };
    
    /**
    * Applies `delta` to the document.
    * @param {Object} delta A delta object (can include "insert" and "remove" actions)
    **/
    this.applyDelta = function(delta, doNotValidate) {
        var isInsert = delta.action == "insert";
        // An empty range is a NOOP.
        if (isInsert ? delta.lines.length <= 1 && !delta.lines[0]
            : !Range.comparePoints(delta.start, delta.end)) {
            return;
        }
        
        if (isInsert && delta.lines.length > 20000)
            this.$splitAndapplyLargeDelta(delta, 20000);
        
        // Apply.
        applyDelta(this.$lines, delta, doNotValidate);
        this._signal("change", delta);
    };
    
    this.$splitAndapplyLargeDelta = function(delta, MAX) {
        // Split large insert deltas. This is necessary because:
        //    1. We need to support splicing delta lines into the document via $lines.splice.apply(...)
        //    2. fn.apply() doesn't work for a large number of params. The smallest threshold is on chrome 40 ~42000.
        // we use 20000 to leave some space for actual stack
        // 
        // To Do: Ideally we'd be consistent and also split 'delete' deltas. We don't do this now, because delete
        //        delta handling is too slow. If we make delete delta handling faster we can split all large deltas
        //        as shown in https://gist.github.com/aldendaniels/8367109#file-document-snippet-js
        //        If we do this, update validateDelta() to limit the number of lines in a delete delta.
        var lines = delta.lines;
        var l = lines.length;
        var row = delta.start.row; 
        var column = delta.start.column;
        var from = 0, to = 0;
        do {
            from = to;
            to += MAX - 1;
            var chunk = lines.slice(from, to);
            if (to > l) {
                // Update remaining delta.
                delta.lines = chunk;
                delta.start.row = row + from;
                delta.start.column = column;
                break;
            }
            chunk.push("");
            this.applyDelta({
                start: this.pos(row + from, column),
                end: this.pos(row + to, column = 0),
                action: delta.action,
                lines: chunk
            }, true);
        } while(true);
    };
    
    /**
    * Reverts `delta` from the document.
    * @param {Object} delta A delta object (can include "insert" and "remove" actions)
    **/
    this.revertDelta = function(delta) {
        this.applyDelta({
            start: this.clonePos(delta.start),
            end: this.clonePos(delta.end),
            action: (delta.action == "insert" ? "remove" : "insert"),
            lines: delta.lines.slice()
        });
    };
    
    /**
     * Converts an index position in a document to a `{row, column}` object.
     *
     * Index refers to the "absolute position" of a character in the document. For example:
     *
     * ```javascript
     * var x = 0; // 10 characters, plus one for newline
     * var y = -1;
     * ```
     * 
     * Here, `y` is an index 15: 11 characters for the first row, and 5 characters until `y` in the second.
     *
     * @param {Number} index An index to convert
     * @param {Number} startRow=0 The row from which to start the conversion
     * @returns {Object} A `{row, column}` object of the `index` position
     */
    this.indexToPosition = function(index, startRow) {
        var lines = this.$lines || this.getAllLines();
        var newlineLength = this.getNewLineCharacter().length;
        for (var i = startRow || 0, l = lines.length; i < l; i++) {
            index -= lines[i].length + newlineLength;
            if (index < 0)
                return {row: i, column: index + lines[i].length + newlineLength};
        }
        return {row: l-1, column: lines[l-1].length};
    };

    /**
     * Converts the `{row, column}` position in a document to the character's index.
     *
     * Index refers to the "absolute position" of a character in the document. For example:
     *
     * ```javascript
     * var x = 0; // 10 characters, plus one for newline
     * var y = -1;
     * ```
     * 
     * Here, `y` is an index 15: 11 characters for the first row, and 5 characters until `y` in the second.
     *
     * @param {Object} pos The `{row, column}` to convert
     * @param {Number} startRow=0 The row from which to start the conversion
     * @returns {Number} The index position in the document
     */
    this.positionToIndex = function(pos, startRow) {
        var lines = this.$lines || this.getAllLines();
        var newlineLength = this.getNewLineCharacter().length;
        var index = 0;
        var row = Math.min(pos.row, lines.length);
        for (var i = startRow || 0; i < row; ++i)
            index += lines[i].length + newlineLength;

        return index + pos.column;
    };

}).call(Document$1.prototype);

var Document_1 = document.Document = Document$1;

var Mirror_1;
var Document = document.Document;
var lang = lang$1;
    
var Mirror = Mirror_1 = function(sender) {
    this.sender = sender;
    var doc = this.doc = new Document("");
    
    var deferredUpdate = this.deferredUpdate = lang.delayedCall(this.onUpdate.bind(this));
    
    var _self = this;
    sender.on("change", function(e) {
        var data = e.data;
        if (data[0].start) {
            doc.applyDeltas(data);
        } else {
            for (var i = 0; i < data.length; i += 2) {
                if (Array.isArray(data[i+1])) {
                    var d = {action: "insert", start: data[i], lines: data[i+1]};
                } else {
                    var d = {action: "remove", start: data[i], end: data[i+1]};
                }
                doc.applyDelta(d, true);
            }
        }
        if (_self.$timeout)
            return deferredUpdate.schedule(_self.$timeout);
        _self.onUpdate();
    });
};

(function() {
    
    this.$timeout = 500;
    
    this.setTimeout = function(timeout) {
        this.$timeout = timeout;
    };
    
    this.setValue = function(value) {
        this.doc.setValue(value);
        this.deferredUpdate.schedule(this.$timeout);
    };
    
    this.getValue = function(callbackId) {
        this.sender.callback(this.doc.getValue(), callbackId);
    };
    
    this.onUpdate = function() {
        // abstract method
    };
    
    this.isPending = function() {
        return this.deferredUpdate.isPending();
    };
    
}).call(Mirror.prototype);

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
        this.languageServiceHost.setCompilationSettings({
            jsx: 1,
            baseUrl: './'
        });
    }
    return TsProject;
}());
var tsProject$1 = null;
function getTSProject() {
    return tsProject$1 ? tsProject$1 : tsProject$1 = new TsProject();
}

var tsProject = getTSProject();
var activeFile = 'app.ts';
function setupInheritanceCall(sender) {
    this.sender = sender;
    var doc = this.doc = new Document_1("");
    var deferredUpdate = this.deferredUpdate = lang$1.deferredCall(this.onUpdate.bind(this));
    var _self = this;
    sender.on("change", function (e) {
        var data = e.data;
        if (data[0].start) {
            doc.applyDeltas(data);
        }
        else {
            for (var i = 0; i < data.length; i += 2) {
                var d;
                if (Array.isArray(data[i + 1])) {
                    d = { action: "insert", start: data[i], lines: data[i + 1] };
                }
                else {
                    d = { action: "remove", start: data[i], end: data[i + 1] };
                }
                doc.applyDelta(d, true);
            }
        }
        if (_self.$timeout)
            return deferredUpdate.schedule(_self.$timeout);
        _self.onUpdate();
    });
    sender.on("addLibrary", function (e) {
        _self.addlibrary(e.data.name, e.data.content);
        console.log('addLibrary');
    });
    sender.on("removeLibrary", function (e) {
        tsProject.languageServiceHost.removeScript(e.data.name);
        console.log('removeLibrary');
    });
    sender.on("updateModule", function (e) {
        tsProject.languageServiceHost.updateScript(e.data.name, e.data.content);
        console.log('updateModule');
    });
    sender.on("logModules", function () {
        console.log(tsProject.languageServiceHost.getScriptFileNames());
    });
    sender.on("logModule", function (e) {
        console.log(tsProject.languageServiceHost.getScriptContent(e.data.name));
    });
    sender.on("changeActiveFile", function (e) {
        activeFile = e.data.title;
    });
    this.setOptions();
    sender.emit("initAfter");
}
var TypeScriptWorker = (function () {
    function TypeScriptWorker(sender) {
        var _this = this;
        this.sender = sender;
        this.setOptions = function (options) {
            _this.options = options || {};
        };
        this.changeOptions = function (newOptions) {
            oop$2.mixin(_this.options, newOptions);
            _this.deferredUpdate.schedule(100);
        };
        this.addlibrary = function (name, content) {
            tsProject.languageServiceHost.addScript(name, content);
        };
        this.getCompletionsAtPosition = function (fileName, pos, isMemberCompletion, id) {
            var ret = tsProject.languageService.getCompletionsAtPosition(fileName, pos, {});
            _this.sender.callback(ret, id);
        };
        this.onUpdate = function () {
            var fileName = activeFile;
            if (tsProject.languageServiceHost.hasScript(fileName)) {
                tsProject.languageServiceHost.updateScript(fileName, _this.doc.getValue());
            }
            else {
                tsProject.languageServiceHost.addScript(fileName, _this.doc.getValue());
            }
            var services = tsProject.languageService;
            var output = services.getEmitOutput(fileName);
            var jsOutput = output.outputFiles.map(function (o) { return o.text; }).join('\n');
            var allDiagnostics = services
                .getCompilerOptionsDiagnostics()
                .concat(services.getSyntacticDiagnostics(fileName))
                .concat(services.getSemanticDiagnostics(fileName));
            _this.sender.emit("compiled", jsOutput);
            var annotations = [];
            allDiagnostics.forEach(function (error) {
                var pos = DocumentPositionUtil.getPosition(_this.doc, error.start);
                annotations.push({
                    row: pos.row,
                    column: pos.column,
                    text: typeof error.messageText === 'string' ? error.messageText : (typeof error.messageText == 'object' && Array.isArray(error.messageText.next) && error.messageText.next.length
                        ? (error.messageText['messageText'] + '\n' + error.messageText.next[0].messageText)
                        : error.messageText['messageText']),
                    minChar: error.start,
                    limChar: error.start + error.length,
                    type: "error",
                    raw: error.messageText
                });
            });
            _this.sender.emit("compileErrors", annotations);
        };
        setupInheritanceCall.call(this, sender);
    }
    return TypeScriptWorker;
}());
oop$2.inherits(TypeScriptWorker, Mirror_1);
(function () {
    var proto = this;
    ["getTypeAtPosition",
        "getSignatureAtPosition",
        "getDefinitionAtPosition"].forEach(function (elm) {
        proto[elm] = function (fileName, pos, id) {
            var ret = tsProject.languageService[elm](fileName, pos);
            this.sender.callback(ret, id);
        };
    });
    ["getReferencesAtPosition",
        "getOccurrencesAtPosition",
        "getImplementorsAtPosition"].forEach(function (elm) {
        proto[elm] = function (fileName, pos, id) {
            var referenceEntries = tsProject.languageService[elm](fileName, pos);
            var ret = referenceEntries.map(function (ref) {
                return {
                    unitIndex: ref.unitIndex,
                    minChar: ref.ast.minChar,
                    limChar: ref.ast.limChar
                };
            });
            this.sender.callback(ret, id);
        };
    });
    ["getNavigateToItems",
        "getScriptLexicalStructure",
        "getOutliningRegions "].forEach(function (elm) {
        proto[elm] = function (value, id) {
            var navs = tsProject.languageService[elm](value);
            this.sender.callback(navs, id);
        };
    });
}).call(TypeScriptWorker.prototype);

exports.TypeScriptWorker = TypeScriptWorker;
