(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ReactiveAuth = (function () {
    function ReactiveAuth(name, defaultHandler) {
        if (name === void 0) { name = 'sessionId'; }
        if (defaultHandler === void 0) { defaultHandler = console.log; }
        this.cookieValRe = new RegExp("(?:(?:^|.*;\\s*)" + name + "\\s*=\\s*([^;]*).*$)|^.*$", '');
        this.cookieVal = this.getCookie();
        this.updateHandler = defaultHandler;
        this.expireHandler = defaultHandler;
    }
    ReactiveAuth.prototype.subscribe = function (frequency, updateCb, expireCb) {
        var _this = this;
        if (frequency === void 0) { frequency = 3000; }
        this.createEventListeners(updateCb, expireCb);
        if (this.subscription) {
            clearInterval(this.subscription);
        }
        this.subscription = setInterval(function () {
            var currentBrowserCookieVal = _this.getCookie();
            if (!currentBrowserCookieVal && _this.cookieVal) {
                window.dispatchEvent(new CustomEvent('expireAuth', {
                    detail: {
                        message: 'Auth Cookie Expired',
                        oldValue: _this.cookieVal,
                        currentValue: currentBrowserCookieVal
                    },
                    bubbles: true,
                    cancelable: true
                }));
            }
            else if (_this.cookieVal !== currentBrowserCookieVal) {
                window.dispatchEvent(new CustomEvent('updateAuth', {
                    detail: {
                        message: 'Auth Cookie Updated',
                        oldValue: _this.cookieVal,
                        currentValue: currentBrowserCookieVal
                    },
                    bubbles: true,
                    cancelable: true
                }));
            }
            _this.cookieVal = currentBrowserCookieVal;
        }, frequency);
        return this.subscription;
    };
    ReactiveAuth.prototype.unsubscribe = function () {
        clearInterval(this.getSubscription());
        this.subscription = undefined;
        window.removeEventListener('updateAuth', this.updateHandler);
        window.removeEventListener('expireAuth', this.expireHandler);
    };
    ReactiveAuth.prototype.getSubscription = function () {
        if (!this.subscription) {
            throw new ReferenceError('ReactiveAuth#getSubscription(): No subscriptions found on window. Call subscribe() to create one.');
        }
        return this.subscription;
    };
    ReactiveAuth.prototype.createEventListeners = function (updateCb, expireCb) {
        if (updateCb) {
            this.updateHandler = updateCb;
        }
        if (expireCb) {
            this.expireHandler = expireCb;
        }
        window.addEventListener('updateAuth', this.updateHandler, false);
        window.addEventListener('expireAuth', this.expireHandler, false);
    };
    ReactiveAuth.prototype.getCookie = function () {
        return document.cookie.replace(this.cookieValRe, '$1') || undefined;
    };
    return ReactiveAuth;
}());
exports.default = ReactiveAuth;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ReactiveAuth_1 = __webpack_require__(0);
exports.default = ReactiveAuth_1.default;
exports.ReactiveAuth = ReactiveAuth_1.default;


/***/ })
/******/ ]);
});