import * as d3 from "d3"


let canvasSelect = d3.select("body")
.append("canvas")
.attr("width", 960)
.attr("height", 500);

let context = canvasSelect.node().getContext("2d");
let width = canvasSelect.property("width");
let height = canvasSelect.property("height");

// Create random points and save them to dataX, dataY
const randomX = d3.randomNormal(width / 2, 80);
const randomY = d3.randomNormal(height / 2, 80);
let data = Array.from({length: 5000}, () => [randomX(), randomY()]);


const r = 1.5; // Radius of circle

d3.select(context.canvas)
  .call(d3.zoom()
    .scaleExtent([1, 20])
    .on("zoom", ({transform}) => zoomed(transform)));

function zoomed(transform) {
  const { x, y, k } = transform;
  console.log(`Camera Position (x, y): (${x}, ${y})`);
  console.log(`Zoom Scale (k): ${k}`);
  context.save();
  context.clearRect(0, 0, width, height);
  context.translate(transform.x, transform.y);
  context.scale(transform.k, transform.k);
  context.beginPath();
  for (const [x, y] of data) {
    context.moveTo(x + r, y);
    context.arc(x, y, r, 0, 2 * Math.PI);
  }
  context.fill();
  context.restore();


  context.save();
  context.beginPath();
  let cx = width / 2;
  let cy = height / 2;
  context.moveTo(cx-50, cy-50);
  context.lineTo(cx-50, cy+50);
  context.lineTo(cx+50, cy+50);
  context.lineTo(cx+50, cy-50);
  context.lineTo(cx-50, cy-50);
  // red stroke width 3
  context.strokeStyle = "red";
  context.lineWidth = 3;
  context.stroke();
  context.restore();
}

zoomed(d3.zoomIdentity);