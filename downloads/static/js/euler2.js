var slider1Data = 271171;
var slider2Data = 386712;
var nlbase = 10000000;

function updateEl(elId, katexStr) {
  let el = document.getElementById(elId);
  el.innerHTML = "";
  katex.render(katexStr, el);
}

function npLog(value) {
  return nlbase * Math.log(nlbase / value);
}

function npLogR(value) {
  return nlbase * Math.pow(1 - 1 / nlbase, value);
}

function drawEquation() {
  //   console.log("npLog(8184478)=" + npLog(8184478));
  //   console.log("npLogR(2003456)=" + npLogR(2003456));
  //   console.log(npLogR(8720122));
  //   console.log(npLog(8720122));
  //   console.log(Math.sqrt(8184478 * 2135938));
  let s1Text = slider1Data.toString();
  let s2Text = slider2Data.toString();
  let avg = (npLog(slider1Data) + npLog(slider2Data)) / 2;
  let NText = npLogR(avg).toString();
  let sqrt = Math.sqrt(slider1Data * slider2Data);
  updateEl("id-tex-2-1", "a=" + s1Text);
  updateEl("id-tex-2-2", "b=" + s2Text);
  updateEl("id-tex-2-3", "S=\\frac{NapLog(a)+NapLog(b)}{2}=" + avg.toString());
  updateEl("id-tex-2-4", "N=10^7(1-10^{-7})^{S}=" + NText);
  updateEl("id-tex-2-5", "L=\\sqrt{a*b}=" + sqrt);
  updateEl("id-tex-2-6", "L-N=" + (sqrt - NText).toString());
}

rangeSlider1 = ionRangeSlider("#id-slider-2-1", {
  skin: "round",
  grid: true,
  grid_margin: false,
  min: 100000,
  max: 2000000,
  from: slider1Data,
  prettify_enabled: false,
  hide_min_max: true,
  onStart: function (data) {
    slider1Data = data.from;
    drawEquation();
  },
  onChange: function (data) {
    slider1Data = data.from;
    drawEquation();
  },
  onFinish: function (data) {},
  onUpdate: function (data) {},
});

ionRangeSlider("#id-slider-2-2", {
  skin: "round",
  grid: true,
  grid_margin: false,
  min: 100000,
  max: 2000000,
  from: slider2Data,
  prettify_enabled: false,
  hide_min_max: true,
  onStart: function (data) {
    slider2Data = data.from;
    drawEquation();
  },
  onChange: function (data) {
    slider2Data = data.from;
    drawEquation();
  },
  onFinish: function (data) {},
  onUpdate: function (data) {},
});
