//img 태그 인식
const image = document.querySelectorAll("img");

//이미지 아래에 추가할 <p>태그 생성
const text_ = document.createElement("p");

for (var i = 0; i < image.length; i++) {
  //text_.classList.add("color-secondary-text", "type--caption");
  text_.textContent = image[i].alt + `: text add`;

  //텍스트 삽입
  image[i].insertAdjacentElement("afterend", text_);
}
