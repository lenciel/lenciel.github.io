let canvasWidth = 640;
let canvasHeight = 360;
let xv = 10;
let yv = 10;
let maxNum = 20;
let maxNum2 = 10000000;
let fontOffSet = 15;
let axisOffSetRatio = 0.25;
let axisFontSize = 15;
let axisXOffset = canvasWidth * axisOffSetRatio;
let axisYOffset = canvasHeight * (1 - axisOffSetRatio);
let maxY = 5.6;
let axisFontOffSet = axisFontSize * 0.8;
let equationXOffset = 55;
let equationYOffset = 55;
let arrowSize = 7;
let gridPeriod = 8;
let equationFontSize = "22px";
let equationHeight = 30;

if (window.screen.width < 640) {
  canvasWidth = 320;
  canvasHeight = 180;
  fontOffSet = 15;

  axisOffSetRatio = 0.25;
  axisFontSize = 15;
  axisXOffset = canvasWidth * axisOffSetRatio;
  axisYOffset = canvasHeight * (1 - axisOffSetRatio);
  axisFontOffSet = axisFontSize * 0.8;
  equationXOffset = 15;
  equationYOffset = 15;
  equationFontSize = "16px";
  equationHeight = 18;
}

function setLineDash(sketch, list) {
  sketch.drawingContext.setLineDash(list);
}
// function drawEquation(sketch, texId, parentId, i) {
//   document.getElementById(texId).remove();
//   let tex = sketch.createElement("div");
//   tex.id(texId);
//   tex.style("font-size", equationFontSize);
//   tex.style("font-family", "KaTeX-Main");
//   tex.style("font-weight", "bold");
//   tex.style("color", "rgb(0 182 248)");
//   tex.position(axisXOffset + equationXOffset, equationHeight + equationYOffset);
//   tex.parent(parentId);

//   katex.render(
//     "(1+1*\\frac{100\\%}{" + i + "})^{" + i + "} = " + Math.pow(1 + 1 / i, i),
//     tex.elt
//   );
// }

function drawEquation(texId, parentId, value) {
  document.getElementById(texId).remove();
  let texEl = document.createElement("Div");
  texEl.setAttribute("id", texId);
  let texContainerEl = document.getElementById(parentId);
  texContainerEl.appendChild(texEl);

  katex.render(
    "(1+1*\\frac{100\\%}{" +
      value +
      "})^{" +
      value +
      "} = " +
      Math.pow(1 + 1 / value, value),
    texEl
  );
}

function drawGrid(sketch) {
  var x = Math.floor(canvasWidth / xv);
  var y = Math.floor(canvasHeight / yv);
  for (var i = 0; i < x; i++) {
    sketch.line(i * xv, 0, i * xv, canvasHeight);
  }
  for (var j = 0; j < y; j++) {
    sketch.line(0, j * yv, canvasWidth, j * yv);
  }
}
function drawHeavyGrid(sketch) {
  var x = Math.floor(canvasWidth / xv);
  var y = Math.floor(canvasHeight / yv);
  var i = 0;
  while (i < x) {
    sketch.line(i * xv, 0, i * xv, canvasHeight);
    i = i + gridPeriod;
  }
  var j = 0;
  while (j < y) {
    sketch.line(0, j * yv, canvasWidth, j * yv);
    j = j + gridPeriod;
  }
}
function drawXAxisArrow(sketch) {
  sketch.push();
  sketch.stroke("black");
  sketch.strokeWeight(1);
  sketch.fill("black");
  sketch.translate(canvasWidth - arrowSize, axisYOffset);
  sketch.triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  sketch.pop();

  sketch.textFont("Verdana");
  sketch.textSize(axisFontSize);
  sketch.text(
    "x",
    canvasWidth - (axisFontOffSet * 3) / 2,
    axisYOffset - axisFontOffSet / 2
  );
}

function drawYAxisArrow(sketch) {
  sketch.push();
  sketch.stroke("black");
  sketch.strokeWeight(1);
  sketch.fill("black");
  sketch.translate(axisXOffset, arrowSize);
  sketch.triangle(-arrowSize / 2, 0, arrowSize / 2, 0, 0, -arrowSize);
  sketch.pop();
  sketch.textFont("Verdana");
  sketch.textSize(axisFontSize);
  sketch.text(
    "f(x)",
    axisXOffset + axisFontOffSet / 2,
    0 + (axisFontOffSet * 3) / 2
  );
}

function drawAxis(sketch) {
  //x axis has an offset on the y direction
  sketch.line(0, axisYOffset, canvasWidth, axisYOffset);

  //y axis has an offset on the x direction
  sketch.line(axisXOffset, 0, axisXOffset, canvasHeight);

  drawXAxisArrow(sketch);

  drawYAxisArrow(sketch);
}

function drawRefLine(sketch) {
  setLineDash(sketch, [5, 5]);
  let ratio = 2.5 / maxY;
  sketch.line(
    0,
    axisYOffset * (1 - ratio),
    canvasWidth,
    axisYOffset * (1 - ratio)
  );
  setLineDash(sketch, []);

  sketch.textFont("Courier New", axisFontSize);
  sketch.text(
    "2.5",
    canvasWidth - fontOffSet * 2,
    axisYOffset * (1 - ratio) + fontOffSet
  );
}

function drawFuncLine(sketch, max) {
  // Draw function curve
  sketch.noFill();
  sketch.stroke(0, 182, 248);
  // sketch.stroke(80, 84, 90);
  sketch.strokeWeight(1.5);
  sketch.beginShape();
  for (t = 1; t <= max; t++) {
    let ratio = Math.pow(1 + 1 / t, t) / maxY;
    let x = t * ((canvasWidth - axisXOffset) / max) + axisXOffset;
    let y = axisYOffset * (1 - ratio);
    sketch.vertex(x, y);
  }

  sketch.endShape();
}

function drawPoint(sketch, max, value) {
  // Draw moving points on graph
  let equationValue = Math.pow(1 + 1 / value, value);
  let x = value * ((canvasWidth - axisXOffset) / max) + axisXOffset;
  let y = axisYOffset * (1 - equationValue / maxY);
  sketch.noStroke();

  sketch.fill(0, 182, 248);
  sketch.circle(x, y, 15);
  setLineDash(sketch, [5, 5]);
  sketch.stroke(126);
  // sketch.stroke(208, 100, 138);
  sketch.stroke(0, 182, 248);
  sketch.strokeWeight(0.8);
  // sketch.line(axisXOffset, y, x, y);
  sketch.line(x, y, x, axisYOffset);
  setLineDash(sketch, []);

  sketch.stroke(0, 182, 248);
  sketch.textFont("Courier New", axisFontSize);
  sketch.text(value, x - fontOffSet / 3, axisYOffset + fontOffSet);
  sketch.text(
    "(" + value + " , " + equationValue + ")",
    x + fontOffSet,
    y + fontOffSet
  );
  // sketch.text(equationValue, axisXOffset - fontOffSet, y + fontOffSet / 3);
}

function drawStaticGraph(sketch) {
  sketch.noFill();
  //draw grids
  sketch.stroke(234, 234, 234);
  sketch.strokeWeight(0.2);
  drawGrid(sketch);
  sketch.strokeWeight(0.5);
  drawHeavyGrid(sketch);

  //draw axis
  sketch.stroke(34, 34, 34);
  sketch.strokeWeight(1);
  drawAxis(sketch);

  //draw function curve
  sketch.stroke(208, 100, 138);
  sketch.strokeWeight(2);
  drawRefLine(sketch);
}

function drawEverything(sketch, texId, parentId, max, step, value) {
  drawStaticGraph(sketch);
  drawFuncLine(sketch, max, step);
  // drawEquation(sketch, texId, parentId, value);
  drawEquation(texId, parentId, value);
  drawPoint(sketch, max, value);
}

const s1 = (sketch1) => {
  sketch1.setup = () => {
    var cnv1 = sketch1.createCanvas(canvasWidth, canvasHeight);
    cnv1.parent("id-canvas-container-1");

    ionRangeSlider("#id-slider-1", {
      skin: "round",
      min: 1,
      // grid: true,
      // grid_margin: false,
      max: maxNum,
      from: 1,
      prettify_enabled: false,
      hide_min_max: true,
      onStart: function (data) {
        // fired then range slider is ready
        drawEverything(
          sketch1,
          "id-tex-1",
          "id-tex-container-1",
          data.max,
          1,
          data.from
        );
      },
      onChange: function (data) {
        sketch1.clear();
        drawEverything(
          sketch1,
          "id-tex-1",
          "id-tex-container-1",
          data.max,
          1,
          data.from
        );
      },
      onFinish: function (data) {
        // fired on pointer release
      },
      onUpdate: function (data) {
        // fired on changing slider with Update method
      },
    });
  };
};
let myp5 = new p5(s1);

const s2 = (sketch2) => {
  sketch2.setup = () => {
    // let custom_values = [1, 10, 100, 1000, 10000, 100000, 1000000, maxNum2];
    // let my_from = custom_values.indexOf(1);
    // let my_to = custom_values.indexOf(maxNum2);
    ionRangeSlider("#id-slider-2", {
      skin: "round",
      // grid: true,
      // grid_margin: false,
      min: 1,
      max: maxNum2,
      from: 1,
      // from: my_from,
      // to: my_to,
      // values: custom_values,
      prettify_enabled: false,
      hide_min_max: true,
      onStart: function (data) {
        // drawEquation("id-tex-2", "id-tex-container-2", data.from_value);
        drawEquation("id-tex-2", "id-tex-container-2", data.from);
      },
      onChange: function (data) {
        // drawEquation("id-tex-2", "id-tex-container-2", data.from_value);
        drawEquation("id-tex-2", "id-tex-container-2", data.from);
      },
      onFinish: function (data) {},
      onUpdate: function (data) {
        // fired on changing slider with Update method
      },
    });
  };
};
let myp52 = new p5(s2);
