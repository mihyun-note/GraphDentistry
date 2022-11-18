const img = document.querySelectorAll("img");

const ErrorTitle = [];
const ErrorText = [];

const chartDiv = [];
const chart = [];

const ex = [];

//chart 데이터를 담을 변수
let chartX = [];
let chartY = [];
let chartDATAS = [];
let chartCOLOR = [];
let chartDATA = [];
let chartlabel = [];
let chartERROR = [];
let chartStatus;

let context;
let myChart;

let RESdata;

function resData(link) {
  fetch("http://kwhcclab.com:20701/api/chambit/graph", {
    method: "POST",
    headers: {
      "Content-Type": "text/plain",
    },
    body: link,
  }).then((res) => {
    res = res.json();
    res.then((RESdata) => {
      return RESdata;
    });
  });
}

for (var i = 0; i < img.length; i++) {
  ErrorTitle[i] = document.createElement("p");
  ErrorTitle[i].id = "addText";

  RESdata = resData(img[i].src);

  chartStatus = RESdata["status"];

  if (chartStatus == "NOT_BAR") {
    ErrorTitle[i].textContent = "막대그래프가 아닙니다";
    img[i].insertAdjacentElement("afterend", ErrorTitle[i]);
  } else if (chartStatus == "NO_ERROR") {
    ErrorTitle[i].textContent = "교정할 오류가 없습니다";
    img[i].insertAdjacentElement("afterend", ErrorTitle[i]);
  } else if (chartStatus == "ERROR_FOUND") {
    ex[i] = document.createElement("p");
    ex[i].textContent = "오류 교정 그래프";
    ex[i].id = "addP";
    img[i].insertAdjacentElement("afterend", ex[i]);

    chartDiv[i] = document.createElement("div");
    chart[i] = document.createElement("canvas");
    chart[i].id = "chart" + i;
    chart[i].width = img[i].width;
    chart[i].height = img[i].height;
    chartDiv[i].appendChild(chart[i]);
    ex[i].insertAdjacentElement("afterend", chartDiv[i]);

    chartX = RESdata["xlabels"];
    chartY = [RESdata["ylabels"][-1], RESdata["ylabels"][0]];
    chartCount = RESdata["chartDataList"].length;
    chartDATAS = RESdata["chartDataList"];
    chartERROR = RESdata["errorChartList"];

    graph_redraw(i, chartX, chartY);
    addData(myChart, chartCount, chartDATAS);

    ErrorTitle[i] = document.createElement("p");
    ErrorTitle[i].textContent = `위 이미지에서 오류가 존재합니다`;
    ErrorTitle[i].id = "addText";
    chartDiv[i].insertAdjacentElement("afterend", ErrorTitle[i]);
  } else {
    ErrorTitle[i].textContent = "그 외 오류";
    img[i].insertAdjacentElement("afterend", ErrorTitle[i]);
  }
}

function graph_redraw(count, chartX, chartY) {
  context = document.getElementById("chart" + count).getContext("2d");
  myChart = new Chart(context, {
    type: "bar",
    data: {
      labels: chartX,
    },
    options: {
      responsive: true,
      scales: {
        yAxes: {
          min: chartY[0],
          max: chartY[1],
        },
      },
    },
  });
}

function addData(myChart, chartCount, chartDATAS) {
  for (let i = 0; i < chartCount; i++) {
    chartCOLOR[i] = chartDATAS[i]["legendColor"];
    chartlabel[i] = chartDATAS[i]["legend"];
    chartDATA[i] = chartDATAS[i]["valueTexts"];

    let Bcolor =
      "#" +
      ToHex(chartCOLOR[i][0]) +
      ToHex(chartCOLOR[i][1]) +
      ToHex(chartCOLOR[i][2]);

    myChart.data.datasets.push({
      label: chartlabel[i],
      data: chartDATA[i],
      backgroundColor: Bcolor,
    });
  }

  myChart.update();
}

function ToHex(N) {
  if (N == null) return "00";
  N = parseInt(N);
  if (N == 0) return "00";

  N = Math.max(0, N);
  N = Math.min(N, 255);
  N = Math.round(N);

  return (
    "0123456789ABCDEF".charAt((N - (N % 16)) / 16) +
    "0123456789ABCDEF".charAt(N % 16)
  );
}
