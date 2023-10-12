import * as d3 from "d3"
function draw(context, points, t) {
    let nbtotal = points.length;
  
    if (points.length > nbCities) {
      points = points.slice();
      d3.quickselect(
        points,
        nbCities,
        0,
        points.length - 1,
        (a, b) => b.size - a.size
      );
      points.splice(nbCities, points.length - 1);
    }
    
    if (background) {
      context.globalAlpha = 1;
      context.drawImage(image, 0, 0, width, height);
      context.fill();
    }
    
    let nbrendered = points.length;
    context.globalAlpha = 0.5;
    context.fillStyle = background ? 'yellow' : 'black';
    const k = 1 / (500 * t.k);
    
    for (let i = 0; i < points.length; i++) {
      const d = points[i];
      const v = d.size * k;
      context.beginPath();
      context.arc(
        d[0],
        d[1],
        Math.sqrt(v),
        0,
        2 * Math.PI
      ); // Color, size, anything can be changed.
      context.fill();
    }
  }
  
let canvasSelect = d3.select("body")
.append("canvas")
.attr("width", window.innerWidth)
.attr("height", window.innerHeight);

let context = canvasSelect.node().getContext("2d");

let width = canvasSelect.property("width");
let height = canvasSelect.property("height");

// Create random points and save them to dataX, dataY

  const nbCities = 10; 
  const background = true; 
  const image = new Image(); 

  const tau = 2 * Math.PI; 
  
  // Sample points data
  const points = [
    { size: 10, 0: 50, 1: 50 },
    { size: 20, 0: 100, 1: 100 },
    // Add more points as needed
  ];
  
  // Example call to draw function
  draw(context, points, { k: 1 });//
  