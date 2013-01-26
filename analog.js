/*!
 * Copyright 2013 Amir Grozki
 * Released under the MIT license
 *
 * Date: 2013-1-25
 */

;(function (name, ns, definition, $) {
    var theModule = definition($),
        // this is considered "safe":
        hasDefine = typeof define === 'function' && define.amd,
        // hasDefine = typeof define === 'function',
        hasExports = typeof module !== 'undefined' && module.exports;

    if (hasDefine) { // AMD Module
        define(theModule);
    } else if (hasExports) { // Node.js Module
        module.exports = theModule;
    } else if (ns) { // Assign to common namespaces or simply the global object (window)
        (this[ns] = this[ns] || {})[name] = theModule;
    } else {
        this[name] = theModule;
    }
})('AnalogStick', undefined, function($) {
    
    var module = this;

    /*var matrix3d = function(a1, b1, c1, d1, a2, b2, c2, d2, a3, b3, c3, d3, tx, ty, tz, d4) {
        return 'matrix3d(' + [].slice.call(arguments).join(',') + ')';
    };*/

    var AnalogStick = function (selector, options) {

        var opts = this.options = $.extend({}, this.defaults, options),
            vector = this.vector = [0, 0],
            offset = [0, 0],
            capture = false,
            center,
            el,
            stickDom,
            transformOriginProp = prefix('transformOrigin'),
            transformProp = prefix('transform');

        function prefix(style) {
            var vendors = ['ms', 'Moz', 'webkit', 'o'],
                tmp = document.createElement("div");

            if (tmp.style[style]) {
                return style;
            }

            style = style.charAt(0).toUpperCase() + style.slice(1);

            for (var x = 0; x < vendors.length; ++x) {
                if (typeof tmp.style[vendors[x] + style] != 'undefined') {
                    return vendors[x] + style;
                }
            }
        }

        function resetStick() {
            offset = [0, 0];
            vector = [0, 0];
            stickDom.style[transformProp] = '';
        }

        function initStick() {
            var stick, stickWidth, stickHeight, stickOffset;

            stick = $('<div class="stick"/>');

            stickDom = stick[0];
            stickDom.style[transformOriginProp] = '50% 50% 0';

            stickWidth = (el.width() || opts.defaultSize) * opts.relativeSize;
            stickHeight = (el.height() || opts.defaultSize) * opts.relativeSize;

            stick.css({
                width: stickWidth,
                height: stickHeight,
                left: (el.width() - stickWidth) / 2,
                top: (el.height() - stickHeight) / 2,
                position: 'absolute',
            });

            el.append(stick);

            stickOffset = stick.offset();

            center = [stickOffset.left + stickWidth / 2, stickOffset.top + stickHeight / 2];
        }

        el = $(selector)
            .css('position', 'relative');

        initStick();

        resetStick();
        
        $(document)
            .on('mouseup touchend', function(e) {
                e.preventDefault();
                
                capture = false;
                
                resetStick();
            })
            .on('mousemove touchmove', function(e) {
                if (e.changedTouches) {
                    e = e.changedTouches[0];
                }

                if (capture) {
                    var dx = e.pageX - center[0],
                        dy = e.pageY - center[1],
                        distance = Math.min(Math.sqrt(dx*dx + dy*dy), opts.movementRadius),
                        magnitude = distance / opts.movementRadius,
                        angle = Math.atan2(dy, dx),
                        a = opts.stickAngle;

                    dx = Math.cos(angle);
                    dy = Math.sin(angle);

                    offset = [dx * distance, dy * distance];
                    vector = [dx * magnitude, -dy * magnitude];

                    stickDom.style[transformProp] = 'rotateX(' + -dy * magnitude * a + 'deg) rotateY(' + dx * magnitude * a + 'deg) translate3d(' + offset[0] + 'px, ' + offset[1] + 'px, 0)';
                    /*matrix3d(cos(a*dx),
                        sin(a*dy)*sin(a*dx),
                        cos(a*dx)*sin(a*dy),
                        0,
                        0,
                        cos(a * dx),
                        -sin(a*dx),
                        0,
                        -sin(a*dy),
                        sin(a * dx)*cos(a*dy),
                        cos(a*dy)*cos(a*dx),
                        0,
                        that.offset[0], 
                        that.offset[1], 
                        0, 
                        1);*/
                }
            });

        el.on('mousedown touchstart', function(e) {
            e.preventDefault();
            capture = true;
        });
    };

    AnalogStick.prototype = {
        defaults: {
            defaultSize: 100,
            relativeSize: 0.8,
            movementRadius: 25,
            stickAngle: 30
        },
        getVector: function() {
            return this.vector;
        }
    };

    return AnalogStick;

}, window.Zepto || window.jQuery);