document.addEventListener("DOMContentLoaded", function() {
  const downloadButton = document.getElementById("download-button");
  downloadButton.addEventListener("click", extractData);
});

async function extractData() {
  const tabs = await new Promise(resolve => {
    chrome.tabs.query({}, tabs => resolve(tabs));
  });

  const tabData = [];
  for (const tab of tabs) {
    tabData.push({
      url: tab.url,
      title: tab.title
    });
  }

  const data = JSON.stringify(tabData, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const blobURL = URL.createObjectURL(blob);

  chrome.downloads.download({
    url: blobURL,
    filename: "tab_data.json"
  }, function(downloadId) {
    const messageContainer = document.getElementById("message");
    if (downloadId !== undefined) {
      messageContainer.innerText = "Data extracted successfully and saved as tab_data.json in the Downloads folder!";
    } else {
      messageContainer.innerText = "Data extraction failed. Please try again.";
    }
  });
}
