document.addEventListener(
  "DOMContentLoaded",
  () => {
    let graphBtn = document.getElementById("DentistryGraph");
    let textBtn = document.getElementById("DentistryText");

    graphBtn.addEventListener("change", (event) => {
      let tabId = getTabId();

      if (event.target.checked) {
        console.log("그래프 체크");
        chrome.scripting.executeScript({
          target: { tabId: tabId },
          code: "document.querySelectorAll('#chartDiv').style.display = 'block'",
        });
      } else {
        console.log("그래프 체크 취소");
        chrome.scripting.executeScript({
          code: "document.querySelectorAll('#chartDiv').style.display = 'none'",
        });
      }
    });

    textBtn.addEventListener("change", (event) => {
      if (event.target.checked) {
        console.log("오류 내역 체크");
      } else {
        console.log("오류 내역 체크 취소");
      }
    });
  },
  false
);
