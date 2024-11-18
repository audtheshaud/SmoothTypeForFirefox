// Function to apply transition effect to elements with class 'active-cell-border' and their parents
function applyTransitionEffectToActiveCells(delay) {
  const targetElements = document.getElementsByClassName("active-cell-border");

  for (let element of targetElements) {
    if (element.classList.contains("active-cell-border")) {
      let parent = element.parentElement;

      while (parent) {
        if (!parent.style.transition.includes(`${delay}ms`)) {
          parent.style.transition = `all ${delay}ms`;
        }
        parent = parent.parentElement;
      }
    }
  }
}

// Listen for messages from the popup to update settings dynamically
browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'updateSettings') {
    const { delay } = message;
    applyTransitionEffectToActiveCells(delay);
  }
});

// Load initial settings when the content script is first injected
browser.storage.local.get(['transitionDelay'])
  .then((data) => {
    const delay = parseInt(data.transitionDelay, 10) || 80; // Default to 80ms if not set
    applyTransitionEffectToActiveCells(delay);

    // Observe DOM changes and reapply the transition effect
    const observer = new MutationObserver(() => applyTransitionEffectToActiveCells(delay));
    observer.observe(document.body, { childList: true, subtree: true });
  })
  .catch((error) => {
    console.error('Error loading transition delay from storage:', error);
  });
