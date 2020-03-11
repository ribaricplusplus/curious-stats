/**
 * Message identifiers:
 * inject-content-script: When the content script needs to be injected.
 * data-obtained: Content script sent data
 */

function handleError() {
  let urlCell = document.getElementById('website-url');
  urlCell.innerHTML = `<span style="color: red">Could not obtain information about the active website.</span>`;
  chrome.runtime.lastError = undefined;
}

function messageResponse(message) {
  if (message.action === 'error') {
    handleError();
  }
}

// Data is the message
function dataReceived(data) {
  if (data.action === 'data-obtained') {
    let urlCell = document.getElementById('website-url');
    if (chrome.runtime.lastError !== undefined) {
      handleError();
    } else {
      urlCell.innerHTML = data.url;
      displayData(data);
      cleanUp();
    }
  }
}

function createDisplayRow(label, data) {
  let displayRow = document.createElement('tr');
  let displayLabel = document.createElement('th');
  displayLabel.innerHTML = label;
  let displayData = document.createElement('td');
  displayData.innerHTML = data;
  displayRow.appendChild(displayLabel);
  displayRow.appendChild(displayData);
  return displayRow;
}

function displayData(data) {
  let aboutTable = document.getElementById('about-you');
  for (let info of data.aboutYou) {
    if (info.data === null) continue;
    let infoRow = createDisplayRow(info.label, info.data);
    aboutTable.appendChild(infoRow);
  }
  let aboutWebsiteTable = document.getElementById('about-website');
  for (let info of data.aboutWebsite) {
    if (info.data === null) continue;
    let infoRow = createDisplayRow(info.label, info.data);
    aboutWebsiteTable.appendChild(infoRow);
  }
}

function cleanUp() {
  if (chrome.runtime.lastError !== undefined) handleError();
  chrome.runtime.onMessage.removeListener(dataReceived);
  chrome.runtime.onMessage.removeListener(messageResponse);
}

// Register listener for a content script message
chrome.runtime.onMessage.addListener(dataReceived);

//Register listener for errors from within extension
chrome.runtime.onMessage.addListener(messageResponse);

// Send message to bg script to inject content script
chrome.runtime.sendMessage({ action: 'inject-content-script' });

if (chrome.runtime.lastError !== undefined) handleError();
