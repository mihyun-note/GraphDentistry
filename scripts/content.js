//img 태그 인식
const img = document.querySelectorAll("img");

//이미지 아래에 추가할 text를 담을 배열
const text_ = [];

//이미지 아래에 추가할 chart를 담을 배열
const chartDiv = [];
const chart = [];

//예시 텍스트(테스트용)
const ex = [];

//chart 데이터를 담을 변수
let chartX = [];
let chartY = [];
let chartDATA = [];
let chartCOLOR = [];

for (var i = 0; i < img.length; i++) {
  //text_.classList.add("color-secondary-text", "type--caption");
  text_[i] = document.createElement("p");
  text_[i].textContent = img[i].alt + `: text add`;
  text_[i].id = "addText";
  //console.log(text_[i], i, img[i]);

  //img개수만큼 mychart document추가
  chartDiv[i] = document.createElement("div");
  chart[i] = document.createElement("canvas");

  chart[i].id = "chart" + i;
  //div태그안에 canvas 삽입
  chartDiv[i].appendChild(chart[i]);

  //img아래에 <div><canvas></canvas></div> 삽입
  img[i].insertAdjacentElement("afterend", chartDiv[i]);

  chartX[i] = ["1", "2", "3", "4", "5"];
  chartY[i] = [0, 50];
  chartDATA[i] = [21, 19, 25, 26, 25 + i];
  chartCOLOR[i] = ["rgba(255, 99, 132, 0.5)", "rgba(54, 162, 235, 0.5)"];
  //chart그리기 함수
  graph_redraw(i, chartX[i], chartY[i], chartDATA[i], chartCOLOR[i]);

  //텍스트 삽입
  chartDiv[i].insertAdjacentElement("afterend", text_[i]);

  ex[i] = document.createElement("p");
  ex[i].textContent = "그래프 교정";
  img[i].insertAdjacentElement("afterend", ex[i]);
  ex[i].id = "addP";
}

function graph_redraw(count, chartX, chartY, chartDATA, chartCOLOR) {
  var context = document.getElementById("chart" + count).getContext("2d");
  var myChart = new Chart(context, {
    type: "bar",
    data: {
      labels: chartX,
      datasets: [
        {
          label: "test1", //차트 제목
          fill: false,
          data: chartDATA,
          backgroundColor: chartCOLOR,
          borderColor: chartCOLOR,
          borderWidth: 1,
        },
      ],
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
