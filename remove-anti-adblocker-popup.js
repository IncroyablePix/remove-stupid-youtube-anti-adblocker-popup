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
    let lastPageChangeTimestamp = new Date();

    function calculateTimeDelta() {
        const currentTime = new Date();
        const timeDelta = currentTime - lastPageChangeTimestamp;
        const timeDeltaInSeconds = timeDelta / 1000;
        lastPageChangeTimestamp = currentTime; // Update the variable with current time
    }

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

    function restartAfterForcePause() {
        let currentTime = new Date();
        let timeDelta = currentTime - lastPageChangeTimestamp;
        let timeDeltaInSeconds = timeDelta / 1000;

        if (timeDeltaInSeconds < 2) {
            const video = document.querySelector(".video-stream");
            video?.play();
        }
    }

	function removeNode(node) {
		node.remove();
        restartAfterForcePause();
	}

	function preservePlayingState() {
        const video = document.querySelector(".video-stream");
		video?.addEventListener("pause", event => {
			restartAfterForcePause();
		});
	}

    function observePageChange() {
        const videoElement = document.querySelector('.video-stream');
        const src = videoElement?.getAttribute?.("src") ?? "";

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === "attributes" && mutation.attributeName === "src") {
                    const newSrc = mutation.target.getAttribute("src");
                    calculateTimeDelta();
                }
            });
        });

        const config = { attributes: true, attributeFilter: ["src"] };
        observer.observe(videoElement, config);
    }

	waitForElement("ytd-popup-container").then(removeNode);
	waitForElement("tp-yt-iron-overlay-backdrop").then(removeNode);
    calculateTimeDelta();
    observePageChange();
	preservePlayingState();
})();
