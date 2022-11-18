//img 태그 인식
const img = document.querySelectorAll("img");

//이미지 아래에 추가할 오류 내역을 담을 배열
const ErrorTitle = [];
const ErrorText = [];

//이미지 아래에 추가할 chart를 담을 배열
const chartDiv = [];
const chart = [];

//예시 텍스트(테스트용)
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

//예시 데이터
let RESdata = {
  status: "ERROR_FOUND",
  errorChartList: [
    {
      legend: "비행기2",
      text: 44.0,
      data: 45.3,
      errorDiff: 1.2999992,
      color: [252, 141, 98],
      xlabel: "수",
    },
  ],
  xlabels: ["월", "화", "수", "목", "금", "토", "일"],
  ylabels: [50.0, 40.0, 30.0, 20.0, 10.0, 0.0],
  chartDatas: [
    {
      legend: "비행기1",
      legendColor: [102, 194, 165],
      valueTexts: [21, 34, 48, 46, 38, 37, 30],
    },
    {
      legend: "비행기2",
      legendColor: [252, 141, 98],
      valueTexts: [23, 35, 44, 47, 40, 34, 37],
    },
  ],
};

for (var i = 0; i < img.length; i++) {
  ErrorTitle[i] = document.createElement("p");
  ErrorTitle[i].id = "addText";

  /*!!통신 자리!!------------------


  fetch("url").then((res)=>{
  return res.text();
  }).then((res)=>{
  console.log(res)
  })

  -------------------------------*/

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

    //img개수만큼 mychart document추가
    chartDiv[i] = document.createElement("div");
    chart[i] = document.createElement("canvas");
    chart[i].id = "chart" + i;
    chartDiv[i].appendChild(chart[i]);
    ex[i].insertAdjacentElement("afterend", chartDiv[i]);

    chartX = RESdata["xlabels"];
    chartY = [RESdata["ylabels"][-1], RESdata["ylabels"][0]];
    chartCount = RESdata["chartDatas"].length;
    chartDATAS = RESdata["chartDatas"];
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
      responsive: false,
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
  //RGB color Hex코드로 변환

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
