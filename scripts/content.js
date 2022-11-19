const img = document.querySelectorAll("img");
const img_link = [
  "https://postfiles.pstatic.net/MjAyMjExMTdfMjAy/MDAxNjY4Njg5NjM1Nzcw.xMbQz9aRsDwT0mIOf0kNPAG8Ne146XukGRmORVzhXJ8g.l_aWEzIK1dcVbHYTTkLgDfBtkIH7hcQxuMyUVkISpm4g.PNG.dlwldmscjstk/errortest.png?type=w580",
  "https://postfiles.pstatic.net/MjAyMjExMThfMTU4/MDAxNjY4NzY1MjM0ODMy.oIM9EFxEahIBe6BJuXrWwDqo5qB6Yf1V4gcQhgqXtU8g.MCbIoaSGKdouod2gBE2xyL1fftFqu4UcpUnPbHNLpL0g.JPEG.dlwldmscjstk/cat.jpg?type=w580",
  "https://postfiles.pstatic.net/MjAyMjExMThfMzkg/MDAxNjY4NzY1MTc4Njk1.UajJ5lfLy6g5PWQpgHcbUz45sVjr1C9y88b2I9jq6skg.f7rT6QdvU3KHKFvJPWijys0W6Bkw402xWjuc9RhBeLEg.PNG.dlwldmscjstk/image5.png?type=w580",
  "https://postfiles.pstatic.net/MjAyMjExMTlfMTY2/MDAxNjY4ODM4NjAyNDY3.z2pt8liJ8t1_JfkxDa9QVJ1sodKsyPEpXNyutHTMwc4g.qrMvs7MbL-NE9xXFnAfLJRf10o8pVkroM4pEYtX2xlIg.PNG.dlwldmscjstk/errortest.png?type=w580",
  "https://postfiles.pstatic.net/MjAyMjExMThfMjgx/MDAxNjY4NzY1MjI5NjEz.UQbIL30i4PVGoUSDe7aPizaDB8hH0Tgy3iuVzCJ9-m8g.YnQeghS6i7aOzJeIcfNxNmasRd8_3n0CMnwJcDRQ-jsg.PNG.dlwldmscjstk/img6.png?type=w580",
  "https://postfiles.pstatic.net/MjAyMjExMThfMTU4/MDAxNjY4NzY1MjM0ODMy.oIM9EFxEahIBe6BJuXrWwDqo5qB6Yf1V4gcQhgqXtU8g.MCbIoaSGKdouod2gBE2xyL1fftFqu4UcpUnPbHNLpL0g.JPEG.dlwldmscjstk/cat.jpg?type=w580",
];
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
let chartStatus = "";

let context;
let myChart;

let RESdata;

resData = async (link, i) => {
  console.log(link, i);
  await fetch("http://kwhcclab.com:20701/api/chambit/graph", {
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
      console.log(chartStatus);
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
        chartX = RESdata.xlabels;
        chartY = [RESdata.ylabels[-1], RESdata.ylabels[0]];
        chartCount = RESdata.chartDataList.length;
        chartDATAS = RESdata.chartDataList;
        chartERROR = RESdata.errorChartList;

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
    });
};

console.log(chartStatus);
for (let i = 0; i < img.length; i++) {
  ErrorTitle[i] = document.createElement("p");
  ErrorTitle[i].id = "addText";
  RESdata = resData(img_link[i], i);
}

graph_redraw = (count, chartX, chartY) => {
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
};

addData = (myChart, chartCount, chartDATAS) => {
  for (let i = 0; i < chartCount; i++) {
    chartCOLOR[i] = chartDATAS[i].legendColor;
    chartlabel[i] = chartDATAS[i].legend;
    chartDATA[i] = chartDATAS[i].valueTexts;

    console.log(chartCOLOR);

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
