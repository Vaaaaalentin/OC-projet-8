/*global NodeList */
(function (window) {
	'use strict';

	/**
	* Get the first element corrresponding to a CSS selector
	* @global
	* @function
	*
	* @param {string} selector - CSS selector expression
	* @param {object} scope - Context to search in. If empty, document context is used as default
	* @return {object} HTMLElement object or null
	*/
	window.qs = function (selector, scope) {
		return (scope || document).querySelector(selector);
	};

	/**
	* Get all elements corresponding to a CSS selector
	* @global
	* @function
	*
	* @param {string} selector - CSS selector expression
	* @param {object} scope - Context to search in. If empty, document context is used as default
	* @return {array} An array containing HTMLElement objects
	*/
	window.qsa = function (selector, scope) {
		return (scope || document).querySelectorAll(selector);
	};

	/**
	* addEventListener wrapper
	* @global
	* @function
	*
	* @param {object} target - HTMLElement object to which we want to bind an event
	* @param {string} type - Event type to listen to
	* @param {function} callback - Function to call when the event is trigger
	* @param {boolean | undefined} useCapture - Value indicating that events of this type will be dispatched to the registered listener before being dispatched to any EventTarget beneath it in the DOM tree.
	*/
	window.$on = function (target, type, callback, useCapture) {
		target.addEventListener(type, callback, !!useCapture);
	};

	/**
	* Attach a handler to event for all elements that match the selector,
	* now or in the future, based on a root element
	* @global
	* @function
	*
	* @param {object} target - HTMLElement object to which we want to bind an event
	* @param {string} selector - Selector
	* @param {string} type - Event type to listen to
	* @param {function} handler - Function to call when the event is trigger
	*/
	window.$delegate = function (target, selector, type, handler) {
		function dispatchEvent(event) {
			var targetElement = event.target;
			var potentialElements = window.qsa(selector, target);
			var hasMatch = Array.prototype.indexOf.call(potentialElements, targetElement) >= 0;

			if (hasMatch) {
				handler.call(targetElement, event);
			}
		}

		// https://developer.mozilla.org/en-US/docs/Web/Events/blur
		var useCapture = type === 'blur' || type === 'focus';

		window.$on(target, type, dispatchEvent, useCapture);
	};

	/**
	* Find the element's parent with the given tag name:
	* $parent(qs('a'), 'div');
	* @global
	* @function
	*
	* @param {object} element - HTMLElement object we use as a strarting point
	* @param {string} tagName - Element's parent tag
	*/
	window.$parent = function (element, tagName) {
		if (!element.parentNode) {
			return;
		}
		if (element.parentNode.tagName.toLowerCase() === tagName.toLowerCase()) {
			return element.parentNode;
		}
		return window.$parent(element.parentNode, tagName);
	};

	// Allow for looping on nodes by chaining:
	// qsa('.foo').forEach(function () {})
	NodeList.prototype.forEach = Array.prototype.forEach;
})(window);
