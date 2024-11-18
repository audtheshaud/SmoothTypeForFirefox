// Function to apply transition effect to elements with class 'kix-cursor'
function applyTransitionEffect(delay, easing) {
  const cursors = document.getElementsByClassName("kix-cursor");

  for (let cursor of cursors) {
    if (cursor) {
      // Check if the transition property is already set to the desired value
      if (cursor.style.transition !== `all ${delay}ms ${easing}`) {
        // Apply the transition effect to each cursor
        cursor.style.transition = `all ${delay}ms ${easing}`;
      }
    }
  }
}

// Listen for messages from the popup to update settings dynamically
browser.runtime.onMessage.addListener((message) => {
  if (message.action === 'updateSettings') {
    const { delay, easing } = message;
    applyTransitionEffect(delay, easing);
  }
});

// Load initial settings when the content script is first injected
browser.storage.local.get(['transitionDelay', 'transitionEasing']).then((data) => {
  const delay = parseInt(data.transitionDelay, 10) || 80; // Default to 80ms if not set
  const easing = data.transitionEasing || 'ease'; // Default to 'ease' if not set

  // Initial application and start observing changes
  applyTransitionEffect(delay, easing);
  startCursorObserver(delay, easing);

 // Observe DOM changes and reapply the transition effect
  const observer = new MutationObserver(() => applyTransitionEffect(delay, easing));
  observer.observe(document.body, { childList: true, subtree: true });
});