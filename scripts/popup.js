let TF_graph = false;
let TF_text = false;

document.getElementById("DentistryGraph").onclick = async function () {
  if (TF_graph == false) {
    TF_graph = !TF_graph;
  } else if (TF_graph == true) TF_graph = !TF_graph;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { TF_graph: TF_graph, TF_text: TF_text },
      function (response) {
        console.log(response.status);
      }
    );
  });
};

document.getElementById("DentistryText").onclick = async function () {
  if (TF_text == false) {
    TF_text = !TF_text;
  } else if (TF_text == true) TF_text = !TF_text;
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { TF_text: TF_text, TF_graph: TF_graph },
      function (response) {
        console.log(response.status);
      }
    );
  });
};
