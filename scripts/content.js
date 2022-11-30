const body = document.querySelector("body");
const img = body.querySelectorAll("img");

console.log(img_link);

for (let i = 0; i < img.length; i++) {
  img_link[i] = img[i].src;
}

const ErrorTitle = [];
const ErrorText = [];
const errBar = [];
const errBarText = [];

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
let chartStatus = "";

let context;
let myChart;

let RESdata;

resData = async (link, i) => {
  await fetch("https://kwhcclab.com:20701/api/chambit/graph", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url: link }),
  })
    .then((response) => response.json())
    .then((RESdata) => {
      console.log(RESdata);
      chartStatus = RESdata.status;
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
        chartDiv[i].id = "chartDiv";
        chart[i] = document.createElement("canvas");
        chart[i].id = "chart" + i;
        chart[i].width = img[i].width;
        chart[i].height = img[i].height;
        chartDiv[i].appendChild(chart[i]);
        ex[i].insertAdjacentElement("afterend", chartDiv[i]);
        chartX = RESdata.xlabels;
        chartY = [RESdata.ylabels[-1], RESdata.ylabels[0]];
        chartCount = RESdata.chartDataList.length;
        chartDATAS = RESdata.chartDataList;
        chartERROR = RESdata.errorChartList;

        graph_redraw(i, chartX, chartY);
        addData(myChart, chartCount, chartDATAS);

        ErrorTitle[i] = document.createElement("p");
        ErrorTitle[i].textContent = `오류가 존재합니다`;
        ErrorTitle[i].id = "addText";
        chartDiv[i].insertAdjacentElement("afterend", ErrorTitle[i]);

        for (let j = 0; j < chartERROR.length; j++) {
          let Bcolor =
            "#" +
            ToHex(chartERROR[j].color[2]) +
            ToHex(chartERROR[j].color[1]) +
            ToHex(chartERROR[j].color[0]);

          errBarText[j] =
            "<span style = 'color:" +
            Bcolor +
            "; '>" +
            "●" +
            "</span>" +
            "<span>" +
            ' "' +
            "<span style = 'font-weight: bold;'>" +
            chartERROR[j].legend +
            "</span>" +
            '" 범례의 "' +
            "<span style = 'font-weight: bold;'>" +
            chartERROR[j].xlabel +
            "</span>" +
            '"막대에서 명시된 텍스트보다 "' +
            "<span style = 'font-weight: bold;'>" +
            chartERROR[j].errorDiff.toFixed(1) +
            "</span>" +
            '"만큼 차이가 존재하는 것으로 추정됩니다' +
            "<span/><br/>";
        }

        errBar[i] = document.createElement("p");

        for (let q = 0; q < chartERROR.length; q++) {
          errBar[i].innerHTML += errBarText[q];
        }
        errBar[i].id = "addErrText";
        ErrorTitle[i].insertAdjacentElement("afterend", errBar[i]);
      } else {
        ErrorTitle[i].textContent = "그 외 오류";
        img[i].insertAdjacentElement("afterend", ErrorTitle[i]);
      }
    });
};

for (let i = 0; i < img.length; i++) {
  ErrorTitle[i] = document.createElement("p");
  ErrorTitle[i].id = "addText";
  RESdata = resData(img_link[i], i);
}

graph_redraw = (count, chartX, chartY) => {
  context = document.getElementById("chart" + count).getContext("2d");
  myChart = new Chart(context, {
    plugins: [ChartDataLabels],
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
      plugins: {
        datalabels: {
          display: true,
          color: "black",
          align: "end",
          anchor: "end",
        },
      },
    },
  });
};

addData = (myChart, chartCount, chartDATAS) => {
  for (let i = 0; i < chartCount; i++) {
    chartCOLOR[i] = chartDATAS[i].legendColor;
    chartlabel[i] = chartDATAS[i].legend;
    chartDATA[i] = chartDATAS[i].valueTexts;

    let Bcolor =
      "#" +
      ToHex(chartCOLOR[i][2]) +
      ToHex(chartCOLOR[i][1]) +
      ToHex(chartCOLOR[i][0]);

    myChart.data.datasets.push({
      label: chartlabel[i],
      data: chartDATA[i],
      backgroundColor: Bcolor,
    });
  }

  myChart.update();
};

ToHex = (N) => {
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
};

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  console.log(req);
  let TF_graph;
  let TF_text;
  TF_graph = req.TF_graph;
  TF_text = req.TF_text;
  let chart;
  let chartP;
  let text;
  if (TF_graph) {
    console.log(TF_graph);
    chart = document.querySelectorAll("#chartDiv");
    chartP = document.querySelectorAll("#addP");
    for (let i = 0; i < chart.length; i++) {
      chart[i].style.display = "none";
      chartP[i].style.display = "none";
    }
  } else if (!TF_graph) {
    console.log(TF_graph);
    chart = document.querySelectorAll("#chartDiv");
    chartP = document.querySelectorAll("#addP");
    for (let i = 0; i < chart.length; i++) {
      chart[i].style.display = "";
      chartP[i].style.display = "";
    }
  }
  if (TF_text) {
    console.log(TF_text);
    text = document.querySelectorAll("#addErrText");
    console.log(text);
    for (let i = 0; i < text.length; i++) {
      text[i].style.display = "none";
    }
  } else if (!TF_text) {
    console.log(TF_text);
    text = document.querySelectorAll("#addErrText");
    for (let i = 0; i < text.length; i++) {
      text[i].style.display = "";
    }
  }
});
