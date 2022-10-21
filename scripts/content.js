//img 태그 인식
const image = document.querySelectorAll("img");

//이미지 아래에 추가할 <p>태그 생성
const text_ = [];

for (var i = 0; i < image.length; i++) {
  //text_.classList.add("color-secondary-text", "type--caption");
  text_[i] = document.createElement("p");
  text_[i].textContent = image[i].alt + `: text add`;
  console.log(text_[i], i, image[i]);
  //텍스트 삽입
  image[i].insertAdjacentElement("afterend", text_[i]);
}
