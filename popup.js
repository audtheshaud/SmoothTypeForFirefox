document.addEventListener('DOMContentLoaded', () => {
  const settingsDiv = document.getElementById('settings');
  const unsupportedDiv = document.getElementById('unsupported');
  const delayInput = document.getElementById('delay');
  const easingSelect = document.getElementById('easing');
  const saveButton = document.getElementById('save');

  browser.tabs.query({active: true, currentWindow: true}, (tabs) => {
    const currentTab = tabs[0];
    if (currentTab && currentTab.url) {
      const isSupported = checkSupport(currentTab.url);
      updateUI(isSupported);
    } else {
      updateUI(false);
    }
  });

  function updateUI(isSupported) {
    if (isSupported) {
      settingsDiv.classList.remove('hidden');
      unsupportedDiv.classList.add('hidden');

      // Load the saved delay and easing values from storage
      browser.storage.local.get(['transitionDelay', 'transitionEasing']).then((data) => {
        delayInput.value = data.transitionDelay || 80; // Default to 80ms
        easingSelect.value = data.transitionEasing || 'ease'; // Default to 'ease'
      });

      // Save the new delay and easing values and apply them immediately
      saveButton.addEventListener('click', () => {
        const delay = parseInt(delayInput.value, 10);
        const easing = easingSelect.value;

        // Save settings to storage
        browser.storage.local.set({ transitionDelay: delay, transitionEasing: easing }).then(() => {
          // Send a message to the content script to apply the new settings
          browser.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            const currentTab = tabs[0];
            browser.tabs.sendMessage(currentTab.id, { action: 'updateSettings', delay, easing });
          });
        });
      });
    } else {
      settingsDiv.classList.add('hidden');
      unsupportedDiv.classList.remove('hidden');
    }
  }
});

// Make sure to include the checkSupport function in your popup.js as well
function checkSupport(url) {
  const supportedUrls = [
    "https://docs.google.com/document/",
    "http://docs.google.com/document/",
    "https://docs.google.com/spreadsheets/",
    "http://docs.google.com/spreadsheets/",
    "https://www.overleaf.com/project/",
    "http://www.overleaf.com/project/"
  ];
  return supportedUrls.some(supportedUrl => url.startsWith(supportedUrl));
}