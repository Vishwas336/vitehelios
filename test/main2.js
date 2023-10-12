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
// Just generate uniform random numbers
const whiteNoise = d3.randomUniform(0, 1);
let data = Array.from({ length: 10000 }, () => [randomX(), randomY(), whiteNoise()]);
let quadtree = d3.quadtree()
  .extent(d3.extent(data, ([x, y,_]) => [x, y]))
  .addAll(data);

const r = 1.5; // Radius of circle

d3.select(context.canvas)
  .call(d3.zoom()
    .scaleExtent([1, 20])
    .on("zoom", ({ transform }) => zoomed(transform)));

  
function search(quadtree, xmin, ymin, xmax, ymax) {
  const results = [];
  quadtree.visit((node, x1, y1, x2, y2) => {
    if (!node.length) {
      do {
        let d = node.data;
        if (d[0] >= xmin && d[0] < xmax && d[1] >= ymin && d[1] < ymax) {
          results.push(d);
        }
      } while (node = node.next);
    }
    return x1 >= xmax || y1 >= ymax || x2 < xmin || y2 < ymin;
  });
  return results;
}

function zoomed(transform) {
  // console.log(transform)
  context.save();
  context.clearRect(0, 0, width, height);
  context.translate(transform.x, transform.y);
  context.scale(transform.k, transform.k);
  context.beginPath();

  let origin = transform.invert([0, 0]);
  let endingPoint = transform.invert([width, height]);
  console.log(origin,endingPoint)

  let x0 = origin[0];
  let y0 = origin[1];

  let x1 = endingPoint[0];
  let y1 = endingPoint[1];

  // reduce size of rectangle by 0.9
  let dx = (x1 - x0) * 0.1;
  let dy = (y1 - y0) * 0.1;

  x0 += dx;
  x1 -= dx;
  y0 += dy;
  y1 -= dy;

  let samplePoints = search(quadtree, x0, y0, x1, y1);
  // shuffle the sample points according to pre calculated white noise
  samplePoints.sort((a, b) => a[2] - b[2]);
  // limit the number of sample points to 1000

  if(samplePoints.length>1000){
    samplePoints.length = 1000;
  }

  for (const [x, y] of samplePoints) {
    context.moveTo(x + r, y);
    context.arc(x, y, r, 0, 2 * Math.PI);
  }


  context.fill();


  context.save();
  context.beginPath();
  context.moveTo(x0, y0);
  context.lineTo(x0, y1);
  context.lineTo(x1, y1);
  context.lineTo(x1, y0);
  context.closePath();
  // red stroke width 3
  context.strokeStyle = "red";
  context.lineWidth = 3;
  context.stroke();
  context.restore();
  context.restore();
}

zoomed(d3.zoomIdentity);