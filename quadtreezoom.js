import * as d3 from 'd3';

let canvas = d3.select("body")
.append("canvas")
.attr("width", window.innerWidth)
.attr("height", window.innerHeight);
const context = canvas.node().getContext('2d');
const width = canvas.width;
const height = canvas.height;

// Generate 10,000 random points
const randomPoints = Array.from({ length: 10000 }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 5 + 1, // Random radius for circles
}));

// Initialize a Quadtree with the random points
const quadtree = d3.quadtree()
    .extent([[0, 0], [width, height]])
    .addAll(randomPoints);

// Create a function to render points
function renderPoints(points) {
    context.clearRect(0, 0, width, height);
    context.fillStyle = 'blue';

    for (const point of points) {
        context.beginPath();
        context.arc(point.x, point.y, point.radius, 0, Math.PI * 2);
        context.fill();
    }
}

d3.select(context.canvas)
  .call(d3.zoom()
    .scaleExtent([1, 20])
    .on("zoom", ({transform}) => zoomed(transform)));
// Create a function to handle zoom
function zoomed(transform) {
    const zoomedPoints = [];
    context.translate(transform.x, transform.y);
    context.scale(transform.k, transform.k);

    // Calculate the new visible area based on the zoom
    const x0 = transform.invert([0, 0])[0];
    const y0 = transform.invert([0, 0])[1];
    const x1 = transform.invert([width, height])[0];
    const y1 = transform.invert([width, height])[1];

    // Search the Quadtree for points in the visible area
    quadtree.visit((node, x0, y0, x1, y1) => {
        if (!node.length) {
            do {
                const point = node.data;
                if (
                    point.x >= x0 && point.x <= x1 &&
                    point.y >= y0 && point.y <= y1
                ) {
                    zoomedPoints.push(point);
                }
            } while (node = node.next);
        }
        return x0 >= x1 || y0 >= y1 || x1 < x0 || y1 < y0;
    });

    // Limit the number of points to 1000
    if (zoomedPoints.length > 1000) {
        zoomedPoints.length = 1000;
    }

    // Render the zoomed points
    renderPoints(zoomedPoints);
}


// Initially render all points
zoomed(d3.zoomIdentity);