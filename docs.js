// Function to apply transition effect to elements with class 'kix-cursor'
function applyTransitionEffect(delay, easing) {
  const cursors = document.getElementsByClassName("kix-cursor");

  for (let cursor of cursors) {
    if (cursor) {
      // Apply transition effect to each cursor
      if (!cursor.style.transition.includes(`${delay}ms ${easing}`)) {
        cursor.style.transition = `all ${delay}ms ${easing}`;
      }
    }
  }
}

// Monitor changes to dynamically reapply styles
function startCursorObserver(delay, easing) {
  const observer = new MutationObserver(() => applyTransitionEffect(delay, easing));
  observer.observe(document.body, { childList: true, subtree: true });
}

// Initialize the script
browser.storage.local.get(['transitionDelay', 'transitionEasing']).then((data) => {
  const delay = parseInt(data.transitionDelay, 10) || 100; // Default to 100ms if not set
  const easing = data.transitionEasing || 'ease'; // Default to 'ease' if not set

  // Initial application and start observing changes
  applyTransitionEffect(delay, easing);
  startCursorObserver(delay, easing);
});
