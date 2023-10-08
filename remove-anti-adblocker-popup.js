// ==UserScript==
// @name     		Delete YouTube anti-adblock nodes
// @match    		https://www.youtube.com/*
// @match    		https://m.youtube.com/*
// @description     Keep using your favourite ad-blocker on YouTube without getting nagged by the new annoying popup
// @description:fr  Continuez à utiliser votre bloqueur de pubs sur YouTube sans vous faire embêter par le nouveau popup
// @version         1.0.0
// @author          IncroyablePix (https://github.com/IncroyablePix)
// @grant    		GM_addStyle
// @grant    		GM.getValue
// ==/UserScript==
//- The @grant directives are needed to restore the proper sandbox.

(() => {
	function waitForElement(selector) {
		return new Promise(resolve => {
			if (document.querySelector(selector)) {
				return resolve(document.querySelector(selector));
			}

			const observer = new MutationObserver(() => {
				if (document.querySelector(selector)) {
					observer.disconnect();
					resolve(document.querySelector(selector));
				}
			});

			observer.observe(document.body, {
				childList: true,
				subtree: true
			});
		});
	}

	function removeNode(node) {
		node.remove();
	}

	waitForElement("ytd-popup-container").then(removeNode);
	waitForElement("tp-yt-iron-overlay-backdrop").then(removeNode);
})();
