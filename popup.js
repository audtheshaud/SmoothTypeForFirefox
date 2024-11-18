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

      // Load the saved delay and easing value from browser storage
      browser.storage.sync.get(['transitionDelay', 'transitionEasing'], (data) => {
        console.log('Loaded data:', data);  // Log to check what is loaded from storage
        if (data.transitionDelay) {
          delayInput.value = data.transitionDelay;
        }
        if (data.transitionEasing) {
          easingSelect.value = data.transitionEasing;
        }
      });

      // Save the delay and easing value to browser storage
      saveButton.addEventListener('click', () => {
        const delay = delayInput.value;
        const easing = easingSelect.value;
        browser.storage.local.set({ transitionDelay: delay, transitionEasing: easing }, () => {
          alert('Transition settings saved! The page will reload to apply changes.');
          browser.tabs.reload();  // This will reload the current tab to apply the changes
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