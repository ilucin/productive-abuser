webpackJsonp([2],{"7GIF":function(t){t.exports={snake:"snake__3TJP5",snake_iframe:"snake_iframe__3xskJ"}},X7Cd:function(t,e,n){"use strict";function o(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function r(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}function i(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function c(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e}function a(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)}Object.defineProperty(e,"__esModule",{value:!0});var s=n("KM04"),u=n("7GIF"),f=n.n(u),p=function(t){function e(){return o(this,t.apply(this,arguments))}return r(e,t),e.prototype.render=function(t){var e=t.config,n=encodeURIComponent(btoa(JSON.stringify(e)));return Object(s.h)("div",{class:f.a.snake},Object(s.h)("iframe",{src:"https://ilucin.github.io/snake?config="+n,class:f.a.snake_iframe,sandbox:"allow-scripts"}))},e}(s.Component),l=n("5Iuc"),b=n("+UHd"),h=n("D9/9");n.d(e,"default",function(){return O});var y=Object.assign||function(t){for(var e=1;e<arguments.length;e++){var n=arguments[e];for(var o in n)Object.prototype.hasOwnProperty.call(n,o)&&(t[o]=n[o])}return t},O=function(t){function e(){i(this,e);var n=c(this,t.call(this));return n.state={config:y({},l.a)},n}return a(e,t),e.prototype.componentWillMount=function(){var t=this;this.pa=new b.a(l.a),this.pa.connect(function(e){return t.onProductiveMessage(e)})},e.prototype.componentWillUnmount=function(){this.pa.disconnect()},e.prototype.onProductiveMessage=function(t){Object(h.a)(t)},e.prototype.render=function(t,e){var n=e.config;return Object(s.h)(p,{config:n})},e}(s.Component)}});
//# sourceMappingURL=route-snake.chunk.de903.js.map