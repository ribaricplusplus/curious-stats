function handleError() {
  let error = chrome.runtime.lastError;
  delete chrome.runtime.lastError;
  chrome.runtime.sendMessage({
    action: 'error',
    error
  });
}
chrome.runtime.onMessage.addListener(function(message) {
  if (message.action === 'inject-content-script') {
    console.log('Injecting...');
    chrome.tabs.executeScript(
      {
        file: 'js/script.js'
      },
      function() {
        //An error occurred within the script.
        if (chrome.runtime.lastError !== undefined) handleError();
      }
    );
  }
});
