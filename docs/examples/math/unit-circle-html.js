/**
* @title Unit Circle
* @description This interactive demonstrates the properties of the unit circle in relation to the trigonometric functions - sine, cosine, and tangent.
* @tags [math]
* @weight 1
*/
import Interactive from '../../Interactive.js';
import { getScriptName } from '../../Util.js';
import SVG from '../../SVG.js';
let radius = 80;
let margin = 20;
let container = document.getElementById(getScriptName());
container.style.display = 'grid';
container.style.gridTemplateColumns = `${2 * (radius + margin)}px ${2 * Math.PI * radius}px`;
container.style.gridGap = '1rem';
// Initialize the interactive
let circleInteractive = new Interactive(getScriptName());
circleInteractive.width = 2 * (radius + margin);
circleInteractive.height = 2 * (radius + margin);
circleInteractive.border = true;
circleInteractive.originX = radius + margin;
circleInteractive.originY = radius + margin;
let xAxis = circleInteractive.line(-(radius + margin), 0, radius + margin, 0);
let yAxis = circleInteractive.line(0, -(radius + margin), 0, radius + margin);
let circle = circleInteractive.circle(0, 0, radius);
let control = circleInteractive.control(radius, 0);
control.constrainTo(circle);
let line = circleInteractive.line(0, 0, radius, 0);
line.addDependency(control);
line.update = function () {
    line.x2 = control.x;
    line.y2 = control.y;
};
let rightTriangle = circleInteractive.path('');
rightTriangle.addDependency(control);
rightTriangle.update = function () {
    rightTriangle.d = `M 0 0
                      L ${control.x} 0
                      L ${control.x} ${control.y}
                      Z`;
};
rightTriangle.update();
rightTriangle.style.fill = '#f8f8f8';
let chartInteractive = new Interactive(getScriptName());
chartInteractive.width = 2 * Math.PI * radius;
chartInteractive.height = 2 * (radius + margin);
chartInteractive.border = true;
// chartInteractive.originX = 0;
// chartInteractive.originY = chartInteractive.height/2;
let graph = chartInteractive.plot(false);
graph.function = Math.sin;
graph.originX = 0;
graph.originY = chartInteractive.height / 2;
graph.scale(2 * Math.PI / chartInteractive.width, chartInteractive.width / (2 * Math.PI));
chartInteractive.text(8, chartInteractive.height / 2 - margin, "0");
chartInteractive.text(chartInteractive.width / 2, chartInteractive.height / 2 - margin, "π");
chartInteractive.text(chartInteractive.width - 28, chartInteractive.height / 2 - margin, "2π");
let chartControl = chartInteractive.control(0, chartInteractive.height / 2);
chartControl.addDependency(graph, control);
chartControl.update = function () {
    // chartControl.x = circle.r*getAngle();
    let point = chartControl.constrain({ x: chartControl.x, y: chartControl.y }, { x: circle.r * getAngle(), y: 0 });
    chartControl.x = point.x;
    chartControl.y = point.y;
    // chartControl.translate( chartControl.x, chartControl.y);
};
// Constrain the control to follow the path of the graph
chartControl.constrain = (oldPos, newPos) => {
    let x = (newPos.x + chartInteractive.width) % chartInteractive.width;
    let y = (-circle.r * graph.function(newPos.x / circle.r) + chartInteractive.height / 2);
    return { x: x, y: y };
};
// Override the chart control to instead update the data of the unit circle
// control and then propegate the change through the dependency graph.
chartControl.onchange = function () {
    let angle = 2 * Math.PI * chartControl.x / (chartInteractive.width);
    control.x = radius * Math.cos(angle);
    control.y = -radius * Math.sin(angle);
    control.updateDependents();
};
let info = new Interactive(getScriptName());
info.width = 2 * (radius + margin);
info.height = 2 * (radius + margin);
info.border = true;
let x = 20;
let thetaDisplay = info.text(x, info.height * 1 / 5, "θ = ...");
let xDisplay = info.text(x, info.height * 2 / 5, "x = ...");
let yDisplay = info.text(x, info.height * 3 / 5, "y = ...");
thetaDisplay.addDependency(control);
thetaDisplay.update = function () {
    thetaDisplay.contents = `θ = ${getAngle().toFixed(2)}`;
};
xDisplay.addDependency(control);
xDisplay.update = function () {
    xDisplay.contents = `x = ${(control.x / circle.r).toFixed(2)}`;
};
yDisplay.addDependency(control);
yDisplay.update = function () {
    yDisplay.contents = `y = ${(-control.y / circle.r).toFixed(2)}`;
};
let requestID = 0;
let animating = false;
let animate = info.button(3 * x, info.height * 4 / 5, "animate");
animate.onclick = function () {
    let step = function (timestamp) {
        chartControl.x += 1;
        chartControl.onchange();
        requestID = window.requestAnimationFrame(step);
    };
    if (animating) {
        window.cancelAnimationFrame(requestID);
        animating = false;
    }
    else {
        animating = true;
        requestID = window.requestAnimationFrame(step);
    }
};
let functions = new Interactive(getScriptName());
functions.width = 2 * Math.PI * radius;
functions.height = 2 * (radius + margin);
functions.border = true;
// TODO: replace with radio input
// let cosInput = functions.checkBox( x + 16, functions.height*2/6, "cos(θ)", false);
// let sinInput = functions.checkBox( x + 16, functions.height*3/6, "sin(θ)", false);
// let tanInput = functions.checkBox( x + 16, functions.height*4/6, "tan(θ)", false);
let radio = functions.radioControl(['cos(θ)', 'sin(θ)', 'tan(θ)'], x + 16, functions.height / 2 - 16);
radio.style.fontFamily = 'monospace';
radio.style.fontSize = '18px';
// TODO: replace with interchangeable functions katex or external SVG
let group = functions.group();
group.root.setAttribute('transform', `translate(${2 * radius},${functions.height * 2 / 6})`);
let cos = cosineSVG();
let sin = sineSVG();
let tan = tangentSVG();
group.root.appendChild(cos);
group.root.appendChild(sin);
group.root.appendChild(tan);
radio.onchange = function () {
    cos.style.display = 'none';
    sin.style.display = 'none';
    tan.style.display = 'none';
    switch (radio.index) {
        case 0:
            cos.style.display = '';
            graph.function = Math.cos;
            break;
        case 1:
            sin.style.display = '';
            graph.function = Math.sin;
            break;
        case 2:
            tan.style.display = '';
            graph.function = Math.tan;
            break;
    }
    graph.draw();
};
radio.onchange();
// Set the angle to be one radian
control.x = circle.r * Math.cos(1);
control.y = -circle.r * Math.sin(1);
control.updateDependents();
// Gets the normalized angle between zero and tau. TODO: Maybe transform the
// coordinate system so that the positive y-direction is up instead of down.
// UPDATE: transform = 'scale(1,-1)' applied to the main svg  didn't quite work
// as expected: the text element was upside down, but maybe that could be
// reversed? bleh.
function getAngle() {
    if (control.y <= 0) {
        return Math.abs(Math.atan2(control.y, control.x));
    }
    else {
        return Math.PI * 2 - Math.atan2(control.y, control.x);
    }
}
function tangentSVG() {
    return SVG.parseSVG(`<svg id="bb0285fc-d748-47cf-a94a-98b3778a2270" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" width="150.68" height="73.98" viewBox="0 0 150.68 73.98"><defs><style>.ac405426-a6c9-45ca-9e0e-ccf1136aba0e{fill:#333;}.bc64f476-72d0-495a-85d9-bc2420c9ef5a{fill:none;stroke:#333;stroke-linecap:round;stroke-miterlimit:10;}</style></defs><title>tangent</title><path class="ac405426-a6c9-45ca-9e0e-ccf1136aba0e" d="M101.73,25.8A5,5,0,0,1,103,22.36a4.74,4.74,0,0,1,3.06-1.66,4.61,4.61,0,0,1,.55-.05,4.55,4.55,0,0,1,3.32,1.41,5.11,5.11,0,0,1,1.54,3.72,6,6,0,0,1-.11,1,4.64,4.64,0,0,1-1.25,2.41,4.72,4.72,0,0,1-3.5,1.51,5.1,5.1,0,0,1-1.17-.13,4.8,4.8,0,0,1-2.68-1.75A4.85,4.85,0,0,1,101.73,25.8ZM107,21.49a1.58,1.58,0,0,0-.35,0,3,3,0,0,0-1.25.26,2.87,2.87,0,0,0-1.48,2.4c0,.26,0,.73,0,1.41a7.51,7.51,0,0,0,.42,3,2.41,2.41,0,0,0,2.31,1.34c1.78,0,2.68-1.2,2.68-3.59v-.7a11.33,11.33,0,0,0-.11-1.94A2.61,2.61,0,0,0,107,21.49Z"/><path class="ac405426-a6c9-45ca-9e0e-ccf1136aba0e" d="M112.91,33.76h.31c.57,0,.91-.1,1-.3v-.61c0-.18,0-.4,0-.65s0-.53,0-.86V25.16c0-.42,0-.82,0-1.18s0-.64,0-.85v-.34a.74.74,0,0,0-.32-.57,2.71,2.71,0,0,0-1-.18h-.39v-.51c0-.34,0-.5,0-.5l.22,0,.64,0,.81,0,.82-.06.66-.05.24,0h.06v.58l0,.57.17-.16a5.11,5.11,0,0,1,3-1,4,4,0,0,1,.7,0,4.28,4.28,0,0,1,2.58,1.65,5.16,5.16,0,0,1,1,3.26c0,.27,0,.53,0,.77A5.09,5.09,0,0,1,122.49,29a5.17,5.17,0,0,1-2.19,1.54,4.21,4.21,0,0,1-1.36.22,3.94,3.94,0,0,1-2.64-1l-.18-.15V31.5c0,1.27,0,1.93,0,2a.53.53,0,0,0,.27.24,8.27,8.27,0,0,0,1.07.06h.36v1h-.18a20.09,20.09,0,0,0-2.46-.07,20.19,20.19,0,0,0-2.47.07h-.17v-1Zm8.53-8a5.25,5.25,0,0,0-.67-2.68,2.42,2.42,0,0,0-1.64-1.34H119l-.16,0a3.39,3.39,0,0,0-2.71,1.43v5.26a2.74,2.74,0,0,0,2.46,1.59,2.23,2.23,0,0,0,1.68-.82A4.71,4.71,0,0,0,121.44,25.71Z"/><path class="ac405426-a6c9-45ca-9e0e-ccf1136aba0e" d="M125.14,33.76h.31c.57,0,.91-.1,1-.3v-.61c0-.18,0-.4,0-.65s0-.53,0-.86V25.16c0-.42,0-.82,0-1.18s0-.64,0-.85v-.34a.74.74,0,0,0-.32-.57,2.71,2.71,0,0,0-1-.18h-.39v-.51c0-.34,0-.5,0-.5l.22,0,.64,0,.81,0,.82-.06.66-.05.24,0h.07v.58l0,.57.17-.16a5.11,5.11,0,0,1,3-1,3.93,3.93,0,0,1,.7,0,4.28,4.28,0,0,1,2.58,1.65,5.16,5.16,0,0,1,1,3.26,6.29,6.29,0,0,1,0,.77,5,5,0,0,1-3.26,4,4.17,4.17,0,0,1-1.36.22,3.94,3.94,0,0,1-2.64-1l-.18-.15V31.5c0,1.27,0,1.93,0,2a.53.53,0,0,0,.27.24,8.43,8.43,0,0,0,1.08.06h.35v1h-.18a20.09,20.09,0,0,0-2.46-.07,20.31,20.31,0,0,0-2.47.07h-.17v-1Zm8.54-8A5.36,5.36,0,0,0,133,23a2.44,2.44,0,0,0-1.64-1.34h-.15l-.16,0a3.4,3.4,0,0,0-2.71,1.43v5.26a2.74,2.74,0,0,0,2.47,1.59,2.22,2.22,0,0,0,1.67-.82A4.72,4.72,0,0,0,133.68,25.71Z"/><path class="ac405426-a6c9-45ca-9e0e-ccf1136aba0e" d="M107.26,55.23a1.16,1.16,0,0,1-1.68,0,1.16,1.16,0,0,1-.33-.83,1.77,1.77,0,0,1,.18-.71,2,2,0,0,1,1.14-.92,5.84,5.84,0,0,1,2.09-.33,4.69,4.69,0,0,1,2.52.66,3.08,3.08,0,0,1,1.4,1.72,2.36,2.36,0,0,1,.12.69c0,.26,0,1.1,0,2.52s0,2.27,0,2.52a1.33,1.33,0,0,0,.12.56.47.47,0,0,0,.44.31.45.45,0,0,0,.42-.31,3.36,3.36,0,0,0,.13-1.21v-.79h.88V60a6.59,6.59,0,0,1-.06,1,2.13,2.13,0,0,1-.73,1,2,2,0,0,1-1.25.41,1.4,1.4,0,0,1-1-.39,2,2,0,0,1-.59-.93V61s-.13.14-.26.3l-.29.32a3.78,3.78,0,0,1-2.5.9,4.17,4.17,0,0,1-2-.49,2.44,2.44,0,0,1-1.21-1.27,2.12,2.12,0,0,1-.18-.84,2.63,2.63,0,0,1,.86-1.89,4.08,4.08,0,0,1,1.26-.84,10.85,10.85,0,0,1,3.82-.81h.31v-.48a3.3,3.3,0,0,0-.13-1.1,2.1,2.1,0,0,0-2.13-1.57c-1,0-1.48.06-1.48.18a1.11,1.11,0,0,1,.49,1A1.14,1.14,0,0,1,107.26,55.23Zm3.6,3.22c0-.85,0-1.28,0-1.28l-.11,0c-2,.13-3.29.73-3.85,1.78a2.07,2.07,0,0,0-.24,1,1.66,1.66,0,0,0,.53,1.26,1.77,1.77,0,0,0,1.29.5A2.27,2.27,0,0,0,110,61.2a2.56,2.56,0,0,0,.83-1.3A14.35,14.35,0,0,0,110.86,58.45Z"/><path class="ac405426-a6c9-45ca-9e0e-ccf1136aba0e" d="M120.23,52.57a4.38,4.38,0,0,1,2.91,1.08V51.41c0-1.53,0-2.32,0-2.38a.73.73,0,0,0-.32-.56,2.5,2.5,0,0,0-1-.19h-.4v-.5c0-.34,0-.51,0-.51l.22,0,.63,0,.82,0,.81-.06.66-.05.24,0h.07v6.69c0,4.48,0,6.75,0,6.79a.77.77,0,0,0,.32.59,2.55,2.55,0,0,0,1,.18h.39v1l-1.68.11c-1.09.07-1.67.11-1.72.13h-.16V61.33l-.17.15A4.3,4.3,0,0,1,120,62.54a4,4,0,0,1-2.73-1,5.16,5.16,0,0,1-1.68-3.16c0-.12,0-.38,0-.77A5,5,0,0,1,117,54,4.35,4.35,0,0,1,120.23,52.57Zm2.84,2.2a3,3,0,0,0-2.48-1.38,2.71,2.71,0,0,0-1.92.79,2.91,2.91,0,0,0-.74,1.34,9.85,9.85,0,0,0-.18,2.13,4.69,4.69,0,0,0,.92,3.35,2.28,2.28,0,0,0,1.72.72,2.82,2.82,0,0,0,1.47-.41A3.09,3.09,0,0,0,123,60.16l.09-.13Z"/><path class="ac405426-a6c9-45ca-9e0e-ccf1136aba0e" d="M127.71,65.88a6.13,6.13,0,0,0,.8.11,1.6,1.6,0,0,0,.46-.06c.61-.22,1-.87,1.1-1.94,0-.18,0-1.77,0-4.8s0-4.57,0-4.66a.7.7,0,0,0-.37-.56,3.24,3.24,0,0,0-1-.14h-.44v-.51c0-.34,0-.51,0-.51l.08,0h.27l.37,0,.47,0,.54,0,.85-.05.68-.06.26,0h.08v5.68c0,3.22,0,5,0,5.35a3.15,3.15,0,0,1-.12.85,3.37,3.37,0,0,1-1.23,1.69,3.52,3.52,0,0,1-2.14.67,3,3,0,0,1-1.73-.52,1.64,1.64,0,0,1-.75-1.42,1.13,1.13,0,0,1,1.16-1.17,1.15,1.15,0,0,1,.85.35,1.11,1.11,0,0,1,.34.84A1.25,1.25,0,0,1,127.71,65.88Zm2.91-18.3a1.45,1.45,0,0,1,.9.38,1.27,1.27,0,0,1,.35.94,1.18,1.18,0,0,1-.59,1.12,1.38,1.38,0,0,1-1.43,0,1.17,1.17,0,0,1-.6-1.12,1.25,1.25,0,0,1,.39-1A1.42,1.42,0,0,1,130.62,47.58Z"/><line class="bc64f476-72d0-495a-85d9-bc2420c9ef5a" x1="95.32" y1="41.37" x2="142.68" y2="41.37"/><path class="ac405426-a6c9-45ca-9e0e-ccf1136aba0e" d="M11.1,34.2v-.33H12v4.05h3v1H12V42.1c0,1.83,0,2.87,0,3.11a1.82,1.82,0,0,0,.14.7,1.09,1.09,0,0,0,1.08.85c.64,0,1-.52,1.18-1.56a9.21,9.21,0,0,0,0-1v-.77h.88v.77a6.84,6.84,0,0,1-.11,1.45,3,3,0,0,1-.83,1.43,2.13,2.13,0,0,1-1.53.55,2.5,2.5,0,0,1-2.7-2.42c0-.1,0-1.19,0-3.25v-3H8.4v-.81h.19A2,2,0,0,0,10,37.41,4.85,4.85,0,0,0,11.1,34.2Z"/><path class="ac405426-a6c9-45ca-9e0e-ccf1136aba0e" d="M20,40.34a1.15,1.15,0,0,1-.85.35,1.12,1.12,0,0,1-.84-.35,1.17,1.17,0,0,1-.33-.84,1.72,1.72,0,0,1,.18-.7,1.94,1.94,0,0,1,1.14-.92,5.88,5.88,0,0,1,2.09-.33,4.69,4.69,0,0,1,2.52.66,3.09,3.09,0,0,1,1.4,1.71,2.5,2.5,0,0,1,.12.7c0,.25,0,1.09,0,2.51s0,2.28,0,2.52a1.3,1.3,0,0,0,.12.56.45.45,0,0,0,.44.31.44.44,0,0,0,.42-.31A3.28,3.28,0,0,0,26.52,45v-.79h.88v.86a6.41,6.41,0,0,1-.06,1,2.09,2.09,0,0,1-.73,1,2,2,0,0,1-1.25.4,1.41,1.41,0,0,1-1-.38,1.89,1.89,0,0,1-.58-.94v-.08a3,3,0,0,0-.27.29c-.13.16-.23.26-.28.32a3.81,3.81,0,0,1-2.51.9,4.28,4.28,0,0,1-2-.48,2.49,2.49,0,0,1-1.21-1.28,2,2,0,0,1-.17-.83,2.62,2.62,0,0,1,.85-1.89,4.08,4.08,0,0,1,1.26-.84,10.69,10.69,0,0,1,3.83-.81h.3V41a3.34,3.34,0,0,0-.13-1.1,2.11,2.11,0,0,0-2.13-1.56c-1,0-1.48.06-1.48.18a1.08,1.08,0,0,1,.49,1A1.18,1.18,0,0,1,20,40.34Zm3.59,3.21a12.07,12.07,0,0,0,0-1.27.2.2,0,0,0-.11,0c-2,.13-3.29.72-3.85,1.78a2,2,0,0,0-.24,1,1.65,1.65,0,0,0,.53,1.25,1.79,1.79,0,0,0,1.3.51,2.25,2.25,0,0,0,1.5-.53,2.42,2.42,0,0,0,.83-1.3A11.42,11.42,0,0,0,23.55,43.55Z"/><path class="ac405426-a6c9-45ca-9e0e-ccf1136aba0e" d="M31.69,46.08c.12.21.47.31,1,.31h.66v1h-.18a24.36,24.36,0,0,0-2.46-.06,24.64,24.64,0,0,0-2.47.06h-.17v-1h.66c.57,0,.91-.1,1-.31V45.4c0-.2,0-.44,0-.69s0-.55,0-.86v-.91c0-.46,0-.95,0-1.47s0-.95,0-1.28v-.51a.7.7,0,0,0-.32-.56,2.46,2.46,0,0,0-1-.19h-.39v-.5c0-.34,0-.51,0-.51l.22,0,.63,0,.8,0,.79-.05.64-.06.24,0h.07v.88a7.29,7.29,0,0,0,0,.83l0,0A3.88,3.88,0,0,1,35,37.68a2.56,2.56,0,0,1,2.79,2.48q0,.17,0,3.06c0,1.88,0,2.83,0,2.86a.44.44,0,0,0,.26.24,6.91,6.91,0,0,0,1.08.07h.35v1h-.17a24.64,24.64,0,0,0-2.47-.06,24.36,24.36,0,0,0-2.46.06H34.2v-1h.53c.78,0,1.17-.12,1.17-.35,0,0,0-1,0-3s0-3-.05-3.14a2,2,0,0,0-.49-1,1.52,1.52,0,0,0-1.05-.32,2.35,2.35,0,0,0-1.73.75,3.16,3.16,0,0,0-.91,1.94v.41c0,.25,0,.58,0,1s0,.77,0,1.13v.69c0,.24,0,.46,0,.65s0,.36,0,.52v.51Z"/><path class="ac405426-a6c9-45ca-9e0e-ccf1136aba0e" d="M47.12,52.7c0,.14-.14.2-.4.2h-.29l-.61-.53q-4-3.6-4-10.47A17.51,17.51,0,0,1,42.5,37a11.81,11.81,0,0,1,3.32-5.57l.35-.3a2.59,2.59,0,0,0,.26-.23h.29c.18,0,.29,0,.33.07a.21.21,0,0,1,.07.13c0,.06-.08.17-.25.33Q43.47,35,43.46,41.9t3.41,10.47C47,52.54,47.12,52.65,47.12,52.7Z"/><path class="ac405426-a6c9-45ca-9e0e-ccf1136aba0e" d="M55.37,31.91h.44A2.39,2.39,0,0,1,57.65,33a6.31,6.31,0,0,1,.86,3.54,8.09,8.09,0,0,1,0,1A16.12,16.12,0,0,1,57,42.94a12.11,12.11,0,0,1-1.75,2.72,6.49,6.49,0,0,1-2,1.65,2.88,2.88,0,0,1-1.19.31h-.15a2.13,2.13,0,0,1-1.61-.68A5.62,5.62,0,0,1,49.12,43a11.75,11.75,0,0,1,.22-2.22,14.42,14.42,0,0,1,3.32-7.19A4.72,4.72,0,0,1,55.37,31.91Zm.35,8.74.11-.38H51.54l0,.16a18.4,18.4,0,0,0-.69,4.07,3.1,3.1,0,0,0,.53,2.07.85.85,0,0,0,.64.26c.59,0,1.2-.48,1.85-1.43A15.88,15.88,0,0,0,55.72,40.65ZM56.77,35c0-1.5-.39-2.24-1.16-2.24a2.07,2.07,0,0,0-1.5.94,12.19,12.19,0,0,0-1.87,4,10.41,10.41,0,0,0-.44,1.63l2.14,0,2.13,0a7.8,7.8,0,0,0,.4-1.72A14.67,14.67,0,0,0,56.77,35Z"/><path class="ac405426-a6c9-45ca-9e0e-ccf1136aba0e" d="M60,30.92l.08,0h.49l.61.53q4,3.62,4,10.47a17.62,17.62,0,0,1-.63,4.89,11.89,11.89,0,0,1-3.33,5.58l-.35.3-.26.23h-.27a.84.84,0,0,1-.34,0c-.05,0-.07-.1-.07-.22l.24-.29q3.41-3.54,3.41-10.45T60.12,31.45l-.24-.28A.26.26,0,0,1,60,30.92Z"/><path class="ac405426-a6c9-45ca-9e0e-ccf1136aba0e" d="M74,39.77a.48.48,0,0,1,.3-.44h14a.48.48,0,0,1,.33.44.52.52,0,0,1-.31.42l-7,0h-7A.43.43,0,0,1,74,39.77ZM74,44a.43.43,0,0,1,.35-.44h14l.1.07.11.09a.36.36,0,0,1,.06.11.33.33,0,0,1,0,.17.49.49,0,0,1-.33.44h-14A.49.49,0,0,1,74,44Z"/></svg>`);
}
function cosineSVG() {
    return SVG.parseSVG(`<svg id="f591df06-f1ea-4c75-a50e-782d3148e860" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" width="150.68" height="73.98" viewBox="0 0 150.68 73.98"><defs><style>.aec8cc31-db26-4c09-b755-17c89d4b81b7{fill:#333;}.be96c213-0e39-4826-95db-a8fc3460bd10{fill:none;stroke:#333;stroke-linecap:round;stroke-miterlimit:10;}</style></defs><title>cosine</title><path class="aec8cc31-db26-4c09-b755-17c89d4b81b7" d="M107.42,23.45a1.15,1.15,0,0,1-.85.35,1.08,1.08,0,0,1-.83-.35,1.2,1.2,0,0,1-.33-.84,1.66,1.66,0,0,1,.17-.7,2,2,0,0,1,1.15-.93,5.8,5.8,0,0,1,2.09-.33,4.68,4.68,0,0,1,2.51.66,3,3,0,0,1,1.4,1.72,2.42,2.42,0,0,1,.12.69c0,.26,0,1.1,0,2.52s0,2.28,0,2.52a1.18,1.18,0,0,0,.13.56.44.44,0,0,0,.44.31.42.42,0,0,0,.41-.31,3.28,3.28,0,0,0,.14-1.21v-.79h.88v.86a7.36,7.36,0,0,1-.07,1,2.07,2.07,0,0,1-2,1.43,1.45,1.45,0,0,1-1-.38,1.89,1.89,0,0,1-.58-.94v-.09l-.27.3-.28.32a3.81,3.81,0,0,1-2.51.9,4.31,4.31,0,0,1-2-.48A2.53,2.53,0,0,1,104.94,29a2.29,2.29,0,0,1-.17-.84,2.61,2.61,0,0,1,.86-1.89,4.07,4.07,0,0,1,1.25-.83,10.68,10.68,0,0,1,3.83-.82H111v-.48a3.25,3.25,0,0,0-.14-1.1,2.13,2.13,0,0,0-.77-1.15,2.22,2.22,0,0,0-1.36-.41c-1,0-1.47.05-1.47.17a1.1,1.1,0,0,1,.48,1A1.17,1.17,0,0,1,107.42,23.45Zm3.6,3.21a10.32,10.32,0,0,0,0-1.28l-.11,0c-2,.14-3.29.73-3.85,1.79a2,2,0,0,0-.24,1,1.67,1.67,0,0,0,.53,1.25,1.79,1.79,0,0,0,1.3.51,2.25,2.25,0,0,0,1.5-.53,2.46,2.46,0,0,0,.83-1.3A12.76,12.76,0,0,0,111,26.66Z"/><path class="aec8cc31-db26-4c09-b755-17c89d4b81b7" d="M120.39,20.78a4.37,4.37,0,0,1,2.9,1.08V19.62c0-1.53,0-2.32,0-2.38a.72.72,0,0,0-.32-.56,2.71,2.71,0,0,0-1-.19h-.39V16c0-.34,0-.51,0-.51l.22,0,.64,0,.81-.05.82,0,.66-.06.24,0h.06v6.69c0,4.49,0,6.75,0,6.8a.76.76,0,0,0,.31.58,2.71,2.71,0,0,0,1,.19h.4v1l-1.68.11c-1.1.07-1.67.12-1.73.13h-.15V29.54l-.18.15a4.3,4.3,0,0,1-2.86,1.06,4,4,0,0,1-2.73-1,5.2,5.2,0,0,1-1.67-3.17,6.83,6.83,0,0,1,0-.77,5,5,0,0,1,1.36-3.57A4.37,4.37,0,0,1,120.39,20.78Zm2.84,2.2a3,3,0,0,0-2.49-1.38,2.67,2.67,0,0,0-1.91.79,2.83,2.83,0,0,0-.74,1.34,9.25,9.25,0,0,0-.19,2.14,4.63,4.63,0,0,0,.93,3.34,2.25,2.25,0,0,0,1.71.73,2.87,2.87,0,0,0,1.48-.42,3.17,3.17,0,0,0,1.12-1.15l.09-.13Z"/><path class="aec8cc31-db26-4c09-b755-17c89d4b81b7" d="M127.87,34.09a6.08,6.08,0,0,0,.79.11,1.56,1.56,0,0,0,.46-.06c.62-.22,1-.87,1.1-1.94,0-.17.05-1.77.05-4.79s0-4.58,0-4.67a.68.68,0,0,0-.37-.56,3.16,3.16,0,0,0-1-.14h-.44v-.51c0-.34,0-.5,0-.5l.09,0h.26l.38,0,.47,0,.54,0,.85-.06.68-.05.25,0h.09v5.68c0,3.23,0,5,0,5.36a2.49,2.49,0,0,1-.12.84,3.37,3.37,0,0,1-1.23,1.69,3.51,3.51,0,0,1-2.13.67,3,3,0,0,1-1.74-.52,1.63,1.63,0,0,1-.75-1.42,1.12,1.12,0,0,1,.33-.83,1.14,1.14,0,0,1,.84-.33,1.18,1.18,0,0,1,1.19,1.18A1.27,1.27,0,0,1,127.87,34.09Zm2.9-18.3a1.38,1.38,0,0,1,.9.39,1.2,1.2,0,0,1,.36.93,1.17,1.17,0,0,1-.6,1.12,1.2,1.2,0,0,1-.7.2,1.26,1.26,0,0,1-.73-.2,1.18,1.18,0,0,1-.59-1.12,1.28,1.28,0,0,1,.38-1A1.43,1.43,0,0,1,130.77,15.79Z"/><path class="aec8cc31-db26-4c09-b755-17c89d4b81b7" d="M105.1,61c.11.2.46.3,1,.3h.66v1h-.17a20.44,20.44,0,0,0-2.47-.07,20.09,20.09,0,0,0-2.46.07h-.18v-1h.66c.57,0,.92-.1,1-.3V59.57c0-.28,0-.6,0-1s0-.72,0-1.1V53.33c0-.61,0-1.15,0-1.64s0-.93,0-1.33V49a.73.73,0,0,0-.32-.56,2.5,2.5,0,0,0-1-.19h-.4v-.5c0-.34,0-.51,0-.51l.22,0,.63,0,.82,0,.81-.06.66-.05.24,0H105v7.19a4,4,0,0,1,3.17-1.65q2.7,0,3,2.49c0,.1,0,1.12,0,3.06s0,2.83,0,2.86a.53.53,0,0,0,.27.24,8.27,8.27,0,0,0,1.07.06h.36v1h-.18a20.09,20.09,0,0,0-2.46-.07,20.19,20.19,0,0,0-2.47.07h-.17v-1h.52c.78,0,1.17-.11,1.17-.35,0,0,0-1,0-3s0-3,0-3.15a2,2,0,0,0-.5-1,1.43,1.43,0,0,0-1-.32,2.39,2.39,0,0,0-1.74.75,3.15,3.15,0,0,0-.9,1.93v.41c0,.26,0,.58,0,1s0,.77,0,1.12v.69c0,.25,0,.46,0,.65s0,.36,0,.52V61Z"/><path class="aec8cc31-db26-4c09-b755-17c89d4b81b7" d="M113.93,64.05a1.09,1.09,0,0,1,.78-.3,1,1,0,0,1,.77.32,1.06,1.06,0,0,1,.31.78,1.1,1.1,0,0,1-.18.59.83.83,0,0,1-.41.38c-.06,0-.06.05,0,.08a.88.88,0,0,0,.44.09,1.51,1.51,0,0,0,.63-.13,2.22,2.22,0,0,0,1.06-.88,9,9,0,0,0,.81-1.74l.38-.94-1.59-4-1.65-4.11q-.15-.33-1.14-.33h-.53v-1h.16a14.7,14.7,0,0,0,2.11.07,21.23,21.23,0,0,0,2.44-.07h.18v1h-.2c-.69,0-1,.12-1,.37l2.23,5.63s.33-.86,1-2.53l1-2.51V54.6a.67.67,0,0,0-.27-.56,1,1,0,0,0-.66-.21h-.06v-1h.13a17.43,17.43,0,0,0,1.87,0c.81,0,1.4,0,1.78,0h.11v1h-.24a1.89,1.89,0,0,0-1.65.88s-.35.84-1,2.43-1.27,3.25-2,5a24.45,24.45,0,0,1-1.36,3.07,3.32,3.32,0,0,1-2,1.58,2.45,2.45,0,0,1-.46,0,2.11,2.11,0,0,1-1.48-.53,1.83,1.83,0,0,1-.59-1.4A1,1,0,0,1,113.93,64.05Z"/><path class="aec8cc31-db26-4c09-b755-17c89d4b81b7" d="M125.6,65.55h.31c.57,0,.92-.1,1-.31v-.6c0-.18,0-.4,0-.65s0-.54,0-.86V57c0-.43,0-.82,0-1.18s0-.64,0-.85v-.35a.73.73,0,0,0-.32-.56,2.64,2.64,0,0,0-1-.18h-.4v-.51c0-.34,0-.51,0-.51l.22,0,.64,0,.82,0,.81-.05.66-.06.24,0h.07v.57l0,.58.18-.16a5.07,5.07,0,0,1,3-1,3.92,3.92,0,0,1,.71,0,4.19,4.19,0,0,1,2.57,1.65,5.15,5.15,0,0,1,1,3.25,6.08,6.08,0,0,1,0,.77,5,5,0,0,1-1.07,2.47A5,5,0,0,1,133,62.32a4.45,4.45,0,0,1-1.36.22,3.94,3.94,0,0,1-2.64-1l-.18-.15v1.87q0,1.91,0,1.95a.46.46,0,0,0,.26.25,8.54,8.54,0,0,0,1.08.06h.35v1h-.18a50.46,50.46,0,0,0-4.92,0h-.18v-1Zm8.54-8a5.33,5.33,0,0,0-.67-2.68,2.48,2.48,0,0,0-1.64-1.35h-.31a3.41,3.41,0,0,0-2.71,1.43v5.26a2.74,2.74,0,0,0,2.47,1.58,2.25,2.25,0,0,0,1.67-.81A4.72,4.72,0,0,0,134.14,57.5Z"/><line class="be96c213-0e39-4826-95db-a8fc3460bd10" x1="95.32" y1="41.37" x2="142.68" y2="41.37"/><path class="aec8cc31-db26-4c09-b755-17c89d4b81b7" d="M16.55,40.37a1.17,1.17,0,0,1-.85.32,1.11,1.11,0,0,1-.84-.34,1.24,1.24,0,0,1,0-1.66c.08-.07.11-.12.1-.13s-.07,0-.21-.05a8.32,8.32,0,0,0-1.07-.08,2.24,2.24,0,0,0-1.76.7,4.76,4.76,0,0,0-1,3.45,5.14,5.14,0,0,0,.68,2.84A2.78,2.78,0,0,0,14,46.76a2,2,0,0,0,1-.22,2.55,2.55,0,0,0,1.28-1.71c0-.12.06-.19.11-.22a.75.75,0,0,1,.35,0H17c.09.09.13.16.13.2a2.91,2.91,0,0,1-.55,1.3,3.54,3.54,0,0,1-3.1,1.58,4.5,4.5,0,0,1-2.09-.5A4.86,4.86,0,0,1,8.77,43.4c0-.09,0-.32,0-.71s0-.62,0-.72a5.11,5.11,0,0,1,1.81-3.37,4.55,4.55,0,0,1,2.92-1.05c1.89,0,3,.49,3.32,1.49a1.46,1.46,0,0,1,.07.51A1.05,1.05,0,0,1,16.55,40.37Z"/><path class="aec8cc31-db26-4c09-b755-17c89d4b81b7" d="M18.38,42.69a5,5,0,0,1,1.28-3.44,4.78,4.78,0,0,1,3.06-1.66,4.39,4.39,0,0,1,.55,0A4.58,4.58,0,0,1,26.59,39a5.07,5.07,0,0,1,1.54,3.72,6.14,6.14,0,0,1-.11,1,4.78,4.78,0,0,1-1.24,2.41,4.86,4.86,0,0,1-2.37,1.37,4.41,4.41,0,0,1-1.14.13,4.6,4.6,0,0,1-1.17-.13,4.78,4.78,0,0,1-2.68-1.75A4.83,4.83,0,0,1,18.38,42.69Zm5.28-4.31-.35,0a3.11,3.11,0,0,0-1.25.26A2.92,2.92,0,0,0,20.58,41c0,.27,0,.74,0,1.41a7.51,7.51,0,0,0,.42,3,2.42,2.42,0,0,0,2.31,1.34q2.68,0,2.68-3.58v-.71a10.23,10.23,0,0,0-.11-1.93A2.62,2.62,0,0,0,23.66,38.38Z"/><path class="aec8cc31-db26-4c09-b755-17c89d4b81b7" d="M33,38.29c-1.35,0-2,.48-2,1.43a1,1,0,0,0,0,.38,1.34,1.34,0,0,0,.68.76,7.28,7.28,0,0,0,1.5.43,5.66,5.66,0,0,1,1.71.48A3.17,3.17,0,0,1,36.64,44a2.92,2.92,0,0,1,0,.53A3.6,3.6,0,0,1,36.36,46a3.31,3.31,0,0,1-3.24,1.63,3.46,3.46,0,0,1-2.28-.79l-.18.15-.2.2a2.84,2.84,0,0,1-.26.24l-.24.22h-.18a.41.41,0,0,1-.29-.13V45.77c0-1,0-1.5,0-1.65a.33.33,0,0,1,.1-.26,1.87,1.87,0,0,1,.36,0,.75.75,0,0,1,.34,0,.93.93,0,0,1,.12.31A5.31,5.31,0,0,0,31,45.71a2.43,2.43,0,0,0,2.13,1.12c1.43,0,2.14-.57,2.14-1.72a1.37,1.37,0,0,0-.4-1,1.82,1.82,0,0,0-.92-.59l-1.06-.25a7.28,7.28,0,0,1-1.67-.46,2.72,2.72,0,0,1-1.69-2,1.21,1.21,0,0,1,0-.33c0-1.69,1-2.64,3.11-2.84a1.34,1.34,0,0,1,.52,0,3.39,3.39,0,0,1,1.54.33l.33.17.2-.15a3.69,3.69,0,0,1,.49-.37h.17a.41.41,0,0,1,.29.13v2.9l-.13.13h-.62a.35.35,0,0,1-.13-.26,2.06,2.06,0,0,0-.62-1.58A2.39,2.39,0,0,0,33,38.29Z"/><path class="aec8cc31-db26-4c09-b755-17c89d4b81b7" d="M44.76,52.7c0,.14-.13.2-.39.2h-.29l-.62-.53q-4-3.6-4-10.47a17.89,17.89,0,0,1,.64-4.9,11.89,11.89,0,0,1,3.32-5.57l.36-.3a2.59,2.59,0,0,0,.26-.23h.29a.5.5,0,0,1,.33.07.19.19,0,0,1,.06.13q0,.09-.24.33Q41.11,35,41.11,41.9t3.41,10.47Q44.76,52.63,44.76,52.7Z"/><path class="aec8cc31-db26-4c09-b755-17c89d4b81b7" d="M53,31.91h.44A2.41,2.41,0,0,1,55.3,33a6.39,6.39,0,0,1,.86,3.54,7.75,7.75,0,0,1,0,1,16.11,16.11,0,0,1-1.51,5.48,12.46,12.46,0,0,1-1.75,2.72,6.61,6.61,0,0,1-2,1.65,2.92,2.92,0,0,1-1.19.31h-.15a2.13,2.13,0,0,1-1.61-.68A5.57,5.57,0,0,1,46.76,43,12.63,12.63,0,0,1,47,40.78a14.43,14.43,0,0,1,3.33-7.19A4.7,4.7,0,0,1,53,31.91Zm.35,8.74.11-.38H49.18l0,.16a18.86,18.86,0,0,0-.68,4.07A3.1,3.1,0,0,0,49,46.57a.84.84,0,0,0,.64.26c.58,0,1.2-.48,1.84-1.43A15.61,15.61,0,0,0,53.36,40.65ZM54.42,35c0-1.5-.39-2.24-1.17-2.24a2.06,2.06,0,0,0-1.49.94,11.79,11.79,0,0,0-1.87,4,9.28,9.28,0,0,0-.44,1.63l2.13,0,2.14,0a8.18,8.18,0,0,0,.39-1.72A13.92,13.92,0,0,0,54.42,35Z"/><path class="aec8cc31-db26-4c09-b755-17c89d4b81b7" d="M57.63,30.92l.09,0h.48l.62.53q4,3.62,4,10.47a17.24,17.24,0,0,1-.64,4.89,11.8,11.8,0,0,1-3.32,5.58l-.35.3-.27.23h-.26a.81.81,0,0,1-.34,0c-.05,0-.08-.1-.08-.22s.1-.11.24-.29q3.42-3.54,3.41-10.45T57.76,31.45a2.91,2.91,0,0,0-.24-.28A.28.28,0,0,1,57.63,30.92Z"/><path class="aec8cc31-db26-4c09-b755-17c89d4b81b7" d="M71.6,39.77a.47.47,0,0,1,.31-.44h14a.48.48,0,0,1,.33.44.51.51,0,0,1-.3.42l-7,0H72A.44.44,0,0,1,71.6,39.77Zm0,4.27A.44.44,0,0,1,72,43.6H86l.09.07.12.09a.36.36,0,0,1,.06.11.47.47,0,0,1,0,.17.49.49,0,0,1-.33.44h-14A.48.48,0,0,1,71.6,44Z"/></svg>`);
}
function sineSVG() {
    return SVG.parseSVG(`<svg id="b68a17ee-95ac-41af-be89-033de7e03ed8" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" width="150.68" height="73.98" viewBox="0 0 150.68 73.98"><defs><style>.acff0dd8-5260-42f1-a102-d2610ecc3e18{fill:#333;}.a6ac49f0-2712-46fe-b226-b9dd3ef5cec9{fill:none;stroke:#333;stroke-linecap:round;stroke-miterlimit:10;}</style></defs><title>sine</title><path class="acff0dd8-5260-42f1-a102-d2610ecc3e18" d="M103.26,25.8a5,5,0,0,1,1.28-3.44,4.74,4.74,0,0,1,3.06-1.66,4.61,4.61,0,0,1,.55-.05,4.55,4.55,0,0,1,3.32,1.41A5.11,5.11,0,0,1,113,25.78a6,6,0,0,1-.11,1,4.64,4.64,0,0,1-1.25,2.41,4.72,4.72,0,0,1-3.5,1.51A5,5,0,0,1,107,30.6a4.8,4.8,0,0,1-2.68-1.75A4.85,4.85,0,0,1,103.26,25.8Zm5.28-4.31a1.58,1.58,0,0,0-.35,0,3,3,0,0,0-1.25.26,2.87,2.87,0,0,0-1.48,2.4c0,.26,0,.73,0,1.41a7.51,7.51,0,0,0,.42,3,2.4,2.4,0,0,0,2.31,1.34c1.78,0,2.68-1.2,2.68-3.59v-.7a11.33,11.33,0,0,0-.11-1.94A2.61,2.61,0,0,0,108.54,21.49Z"/><path class="acff0dd8-5260-42f1-a102-d2610ecc3e18" d="M114.44,33.76h.3c.58,0,.92-.1,1-.3v-.61c0-.18,0-.4,0-.65s0-.53,0-.86V25.16c0-.42,0-.82,0-1.18s0-.64,0-.85v-.34a.74.74,0,0,0-.32-.57,2.71,2.71,0,0,0-1-.18h-.39v-.51c0-.34,0-.5,0-.5l.22,0,.64,0,.81,0,.82-.06.66-.05.24,0h.06v.58l0,.57.17-.16a5.11,5.11,0,0,1,3-1,4,4,0,0,1,.7,0,4.28,4.28,0,0,1,2.58,1.65,5.22,5.22,0,0,1,1,3.26c0,.27,0,.53,0,.77A5.09,5.09,0,0,1,124,29a5.17,5.17,0,0,1-2.19,1.54,4.21,4.21,0,0,1-1.36.22,4,4,0,0,1-2.65-1l-.17-.15V31.5c0,1.27,0,1.93,0,2a.53.53,0,0,0,.27.24,8.27,8.27,0,0,0,1.07.06h.36v1h-.18a20.09,20.09,0,0,0-2.46-.07,20.19,20.19,0,0,0-2.47.07h-.17v-1Zm8.53-8A5.25,5.25,0,0,0,122.3,23a2.42,2.42,0,0,0-1.64-1.34h-.14l-.16,0a3.39,3.39,0,0,0-2.71,1.43v5.26a2.74,2.74,0,0,0,2.46,1.59,2.19,2.19,0,0,0,1.67-.82A4.68,4.68,0,0,0,123,25.71Z"/><path class="acff0dd8-5260-42f1-a102-d2610ecc3e18" d="M126.67,33.76H127c.57,0,.91-.1,1-.3v-.61c0-.18,0-.4,0-.65s0-.53,0-.86V25.16c0-.42,0-.82,0-1.18s0-.64,0-.85v-.34a.74.74,0,0,0-.32-.57,2.71,2.71,0,0,0-1-.18h-.39v-.51c0-.34,0-.5,0-.5l.22,0,.64,0,.81,0,.82-.06.66-.05.24,0h.07v.58l0,.57.17-.16a5.11,5.11,0,0,1,3-1,3.93,3.93,0,0,1,.7,0,4.28,4.28,0,0,1,2.58,1.65,5.16,5.16,0,0,1,1,3.26,6.29,6.29,0,0,1,0,.77,5,5,0,0,1-3.26,4,4.17,4.17,0,0,1-1.36.22,3.94,3.94,0,0,1-2.64-1l-.18-.15V31.5c0,1.27,0,1.93,0,2a.53.53,0,0,0,.27.24,8.43,8.43,0,0,0,1.08.06h.35v1h-.18a20.09,20.09,0,0,0-2.46-.07,20.31,20.31,0,0,0-2.47.07h-.17v-1Zm8.54-8a5.26,5.26,0,0,0-.68-2.68,2.4,2.4,0,0,0-1.63-1.34h-.15l-.16,0a3.4,3.4,0,0,0-2.71,1.43v5.26a2.74,2.74,0,0,0,2.47,1.59,2.22,2.22,0,0,0,1.67-.82A4.72,4.72,0,0,0,135.21,25.71Z"/><path class="acff0dd8-5260-42f1-a102-d2610ecc3e18" d="M106.47,61c.12.2.46.3,1,.3h.66v1H108a20.09,20.09,0,0,0-2.46-.07,20.19,20.19,0,0,0-2.47.07h-.17v-1h.66c.57,0,.91-.1,1-.3V59.57c0-.28,0-.6,0-1s0-.72,0-1.1V53.33c0-.61,0-1.15,0-1.64s0-.93,0-1.33V49a.7.7,0,0,0-.32-.56,2.46,2.46,0,0,0-1-.19h-.39v-.5c0-.34,0-.51,0-.51l.22,0,.64,0,.81,0,.82-.06.66-.05.24,0h.06v7.19a4,4,0,0,1,3.17-1.65q2.72,0,3,2.49c0,.1,0,1.12,0,3.06s0,2.83,0,2.86a.47.47,0,0,0,.26.24,8.54,8.54,0,0,0,1.08.06h.35v1h-.18a20.09,20.09,0,0,0-2.46-.07,20.09,20.09,0,0,0-2.46.07H109v-1h.53c.78,0,1.16-.11,1.16-.35t0-3c0-2,0-3,0-3.15a2,2,0,0,0-.49-1,1.47,1.47,0,0,0-1-.32,2.39,2.39,0,0,0-1.74.75,3.15,3.15,0,0,0-.9,1.93v.41c0,.26,0,.58,0,1s0,.77,0,1.12v.69c0,.25,0,.46,0,.65s0,.36,0,.52V61Z"/><path class="acff0dd8-5260-42f1-a102-d2610ecc3e18" d="M115.31,64.05a1.09,1.09,0,0,1,.78-.3,1,1,0,0,1,.77.32,1.14,1.14,0,0,1,.13,1.37.89.89,0,0,1-.42.38c-.06,0-.06.05,0,.08A.88.88,0,0,0,117,66a1.59,1.59,0,0,0,.64-.13,2.2,2.2,0,0,0,1-.88,9,9,0,0,0,.82-1.74l.37-.94-1.58-4-1.65-4.11q-.15-.33-1.14-.33H115v-1h.15a14.8,14.8,0,0,0,2.11.07,21.46,21.46,0,0,0,2.45-.07h.17v1h-.2c-.69,0-1,.12-1,.37l2.22,5.63,1-2.53,1-2.51V54.6a.68.68,0,0,0-.26-.56,1,1,0,0,0-.66-.21h-.07v-1H122a17.73,17.73,0,0,0,1.87,0c.81,0,1.4,0,1.79,0h.1v1h-.24a1.89,1.89,0,0,0-1.65.88s-.35.84-1,2.43-1.27,3.25-2,5a23.82,23.82,0,0,1-1.37,3.07,3.3,3.3,0,0,1-2,1.58,2.52,2.52,0,0,1-.46,0,2.14,2.14,0,0,1-1.49-.53,1.82,1.82,0,0,1-.58-1.4A1,1,0,0,1,115.31,64.05Z"/><path class="acff0dd8-5260-42f1-a102-d2610ecc3e18" d="M127,65.55h.3c.58,0,.92-.1,1-.31v-.6c0-.18,0-.4,0-.65s0-.54,0-.86V57c0-.43,0-.82,0-1.18s0-.64,0-.85v-.35A.76.76,0,0,0,128,54a2.76,2.76,0,0,0-1-.18h-.4v-.51c0-.34,0-.51,0-.51l.22,0,.64,0,.81,0,.81-.05.66-.06.25,0h.06v.57l0,.58.18-.16a5.1,5.1,0,0,1,3-1,3.79,3.79,0,0,1,.7,0,4.14,4.14,0,0,1,2.57,1.65,5.16,5.16,0,0,1,1,3.25,6,6,0,0,1,0,.77,5,5,0,0,1-1.06,2.47,5.17,5.17,0,0,1-2.19,1.54,4.52,4.52,0,0,1-1.37.22,4,4,0,0,1-2.64-1l-.17-.15v1.87c0,1.27,0,1.92,0,1.95a.53.53,0,0,0,.26.25,8.54,8.54,0,0,0,1.08.06h.35v1h-.17a50.67,50.67,0,0,0-4.93,0h-.18v-1Zm8.53-8a5.23,5.23,0,0,0-.67-2.68,2.46,2.46,0,0,0-1.64-1.35h-.31a3.38,3.38,0,0,0-2.7,1.43v5.26a2.73,2.73,0,0,0,2.46,1.58,2.21,2.21,0,0,0,1.67-.81A4.68,4.68,0,0,0,135.51,57.5Z"/><line class="a6ac49f0-2712-46fe-b226-b9dd3ef5cec9" x1="95.32" y1="41.37" x2="142.68" y2="41.37"/><path class="acff0dd8-5260-42f1-a102-d2610ecc3e18" d="M12.18,38.29c-1.35,0-2,.48-2,1.43a1.06,1.06,0,0,0,0,.38,1.34,1.34,0,0,0,.68.76,7.28,7.28,0,0,0,1.5.43,5.57,5.57,0,0,1,1.71.48A3.21,3.21,0,0,1,15.88,44a5.23,5.23,0,0,1,0,.53A3.45,3.45,0,0,1,15.59,46a3.3,3.3,0,0,1-3.23,1.63,3.48,3.48,0,0,1-2.29-.79L9.89,47l-.2.2a2,2,0,0,1-.26.24l-.24.22H9a.37.37,0,0,1-.28-.13V45.77c0-1,0-1.5,0-1.65s0-.23.1-.26a1.73,1.73,0,0,1,.35,0,.75.75,0,0,1,.34,0,.62.62,0,0,1,.12.31,5.31,5.31,0,0,0,.57,1.52,2.46,2.46,0,0,0,2.14,1.12c1.42,0,2.13-.57,2.13-1.72a1.37,1.37,0,0,0-.4-1,1.82,1.82,0,0,0-.92-.59l-1.06-.25a7.44,7.44,0,0,1-1.67-.46,2.72,2.72,0,0,1-1.69-2,1.34,1.34,0,0,1,0-.33c0-1.69,1-2.64,3.1-2.84a1.39,1.39,0,0,1,.53,0,3.42,3.42,0,0,1,1.54.33l.33.17.19-.15a5.71,5.71,0,0,1,.49-.37h.17a.39.39,0,0,1,.29.13v2.9l-.13.13h-.62a.35.35,0,0,1-.13-.26,2.06,2.06,0,0,0-.62-1.58A2.39,2.39,0,0,0,12.18,38.29Z"/><path class="acff0dd8-5260-42f1-a102-d2610ecc3e18" d="M22.1,47.4a20.6,20.6,0,0,0-2.29-.06c-1.33,0-2.13,0-2.39.06h-.18v-1h.35a6.91,6.91,0,0,0,1.08-.07.41.41,0,0,0,.26-.24s0-1.09,0-3.19a29.81,29.81,0,0,0-.09-3.52c-.12-.29-.55-.44-1.3-.44h-.24v-.5c0-.34,0-.51,0-.51l.22,0,.62,0,.79,0,.79-.05.64-.06.24,0h.07V46a.49.49,0,0,0,.26.27,3,3,0,0,0,.77.08h.51v1ZM19.55,32.68a1.38,1.38,0,0,1,.9.39,1.22,1.22,0,0,1,.35.93,1.18,1.18,0,0,1-.59,1.13,1.22,1.22,0,0,1-.7.19,1.26,1.26,0,0,1-.73-.19A1.18,1.18,0,0,1,18.19,34a1.21,1.21,0,0,1,.38-1A1.38,1.38,0,0,1,19.55,32.68Z"/><path class="acff0dd8-5260-42f1-a102-d2610ecc3e18" d="M26.92,46.08c.12.21.46.31,1,.31h.67v1h-.18A24.49,24.49,0,0,0,26,47.34a24.36,24.36,0,0,0-2.46.06h-.18v-1H24c.58,0,.92-.1,1-.31V45.4c0-.2,0-.44,0-.69s0-.55,0-.86v-.91c0-.46,0-.95,0-1.47s0-.95,0-1.28v-.51a.7.7,0,0,0-.32-.56,2.5,2.5,0,0,0-1-.19h-.4v-.5c0-.34,0-.51.05-.51l.22,0,.63,0,.8,0,.79-.05.64-.06.24,0h.07v.88a5.12,5.12,0,0,0,0,.83l0,0a3.86,3.86,0,0,1,3.37-1.69A2.57,2.57,0,0,1,33,40.16c0,.11,0,1.13,0,3.06s0,2.83,0,2.86a.46.46,0,0,0,.27.24,6.91,6.91,0,0,0,1.08.07h.35v1h-.18a24.36,24.36,0,0,0-2.46-.06,24.64,24.64,0,0,0-2.47.06h-.17v-1H30c.77,0,1.16-.12,1.16-.35,0,0,0-1,0-3s0-3,0-3.14a2,2,0,0,0-.49-1,1.52,1.52,0,0,0-1.05-.32,2.39,2.39,0,0,0-1.74.75,3.2,3.2,0,0,0-.9,1.94v.41c0,.25,0,.58,0,1s0,.77,0,1.13v.69c0,.24,0,.46,0,.65s0,.36,0,.52v.51Z"/><path class="acff0dd8-5260-42f1-a102-d2610ecc3e18" d="M42.34,52.7c0,.14-.13.2-.39.2h-.29L41,52.37c-2.63-2.4-4-5.89-4-10.47a17.89,17.89,0,0,1,.64-4.9A11.89,11.89,0,0,1,41,31.43l.36-.3a2.59,2.59,0,0,0,.26-.23H42a.5.5,0,0,1,.33.07.19.19,0,0,1,.06.13q0,.09-.24.33Q38.69,35,38.69,41.9T42.1,52.37Q42.34,52.63,42.34,52.7Z"/><path class="acff0dd8-5260-42f1-a102-d2610ecc3e18" d="M50.59,31.91H51A2.41,2.41,0,0,1,52.88,33a6.39,6.39,0,0,1,.86,3.54,7.75,7.75,0,0,1-.05,1,16.11,16.11,0,0,1-1.51,5.48,12.46,12.46,0,0,1-1.75,2.72,6.61,6.61,0,0,1-2,1.65,2.92,2.92,0,0,1-1.19.31h-.15a2.13,2.13,0,0,1-1.61-.68A5.57,5.57,0,0,1,44.34,43a12.63,12.63,0,0,1,.22-2.22,14.43,14.43,0,0,1,3.33-7.19A4.7,4.7,0,0,1,50.59,31.91Zm.35,8.74.11-.38H46.76l0,.16a18.86,18.86,0,0,0-.68,4.07,3.1,3.1,0,0,0,.53,2.07.84.84,0,0,0,.64.26c.58,0,1.2-.48,1.84-1.43A15.61,15.61,0,0,0,50.94,40.65ZM52,35c0-1.5-.39-2.24-1.17-2.24a2.06,2.06,0,0,0-1.49.94,11.79,11.79,0,0,0-1.87,4A9.28,9.28,0,0,0,47,39.24l2.13,0,2.14,0a8.18,8.18,0,0,0,.39-1.72A13.92,13.92,0,0,0,52,35Z"/><path class="acff0dd8-5260-42f1-a102-d2610ecc3e18" d="M55.21,30.92l.09,0h.48l.62.53q4,3.62,4,10.47a17.24,17.24,0,0,1-.64,4.89,11.8,11.8,0,0,1-3.32,5.58l-.35.3-.27.23h-.26a.81.81,0,0,1-.34,0s-.08-.1-.08-.22.1-.11.24-.29q3.42-3.54,3.41-10.45T55.34,31.45a2.91,2.91,0,0,0-.24-.28A.28.28,0,0,1,55.21,30.92Z"/><path class="acff0dd8-5260-42f1-a102-d2610ecc3e18" d="M69.18,39.77a.47.47,0,0,1,.31-.44h14a.48.48,0,0,1,.33.44.51.51,0,0,1-.3.42l-7,0h-7A.44.44,0,0,1,69.18,39.77Zm0,4.27a.44.44,0,0,1,.35-.44h14l.09.07.12.09a.36.36,0,0,1,.06.11.47.47,0,0,1,0,.17.49.49,0,0,1-.33.44h-14A.48.48,0,0,1,69.18,44Z"/></svg>`);
}
//# sourceMappingURL=unit-circle-html.js.map