<script setup>

import { ref, onMounted } from 'vue';
import { inject } from 'vue'

const emitter = inject('emitter');
const canvas = ref(null);
const coordinates = ref([]);

emitter.on('pathParsed', (value) => {   // listen for event
    coordinates.value = [];
    Array.prototype.push.apply(coordinates.value, value);
    plotRobotPath();
});

function plotRobotPath() {
    var factor = calculateFactor();
    var baseLine = [coordinates.value[0][0] * factor, coordinates.value[0][1] * factor];
    
    plotPath(factor);
    // visualizeCleanedPath(factor);
    // plotRobotPolygon(baseLine, factor);
}

function calculateFactor() {
    var maxX = 0;
    var maxY = 0;
    var minX = 0;
    var minY = 0;
    coordinates.value.forEach(coordinate => {
        if (coordinate[0] > maxX) {
            maxX = coordinate[0]
        }
        if (coordinate[1] > maxY) {
            maxY = coordinate[1]
        }
        if (coordinate[0] < minX) {
            minX = coordinate[0]
        }
        if (coordinate[1] < minY) {
            minY = coordinate[1]
        }
    });
    var lengthX = maxX - minX;
    var lengthY = maxY - minY;

    // calculate the factor based on the canvas size with 100px buffer
    var factorX = (canvas.value.width - 100) / lengthX;
    var factorY = (canvas.value.height - 100) / lengthY;

    var factor = Math.min(factorX, factorY);
    return factor;
}

function visualizeCleanedPath(factor) {
    var cleanedPath = canvas.value.getContext('2d');
    cleanedPath.lineWidth = 0.66 * factor;
    cleanedPath.strokeStyle = 'rgba(255,255,255,0.6)';
    cleanedPath.beginPath();

    //var previousCoordinate = [0,0];
    coordinates.value.forEach(coordinate => {
        //ASSUMPTION: coordinates.value are world coordinates.value
        var x = (coordinate[0]) * factor;
        var y = (coordinate[1]) * factor;
        // console.log(x +","+ y);
        cleanedPath.lineTo(x, y);
    });

    cleanedPath.stroke();
}

function plotRobotPolygon(baseLine, factor) {
    var robot = canvas.value.getContext('2d');

    robot.fillRect(baseLine[0], baseLine[1], 1, 1);
    robot.lineWidth = 1.5;
    robot.strokeStyle = 'black';

    robot.beginPath();

    var x1R = baseLine[0] - 0.4 * factor;
    var x2R = baseLine[0] - 0.4 * factor;
    var x3R = baseLine[0] + 0.7 * factor;
    var x4R = baseLine[0] + 0.7 * factor;
    var y1R = baseLine[1] - 0.37 * factor;
    var y2R = baseLine[1] + 0.37 * factor;
    var y3R = baseLine[1] + 0.37 * factor;
    var y4R = baseLine[1] - 0.37 * factor;
    console.log("x0R, y0R:" + x1R, y1R)
    console.log("x1R, y1R:" + x2R, y2R)
    console.log("x2R, y2R:" + x3R, y3R)
    console.log("x3R, y3R:" + x4R, y4R)

    robot.beginPath();
    robot.lineTo(x1R, y1R);
    robot.lineTo(x2R, y2R);
    robot.lineTo(x3R, y3R);
    robot.lineTo(x4R, y4R);
    robot.lineTo(x1R, y1R);
    robot.stroke();
}

function plotPath(factor) {
    var ctx = canvas.value.getContext('2d');
    ctx.translate(100, 50);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'red';

    ctx.beginPath();

    coordinates.value.forEach(coordinate => {
        var x = (coordinate[0]) * factor;
        var y = (coordinate[1]) * factor;
        ctx.lineTo(x, y);
    });

    ctx.stroke();
}
</script> 
<template>
    <canvas :style="[coordinates.length > 0 ? {'display': 'block'} : {'display': 'none'}]" ref="canvas" width="400" height="400"></canvas>
    <div :style="[coordinates.length > 0 ? {'display': 'none'} : {'display': 'block'}]" class="no-data">
    <span>No data provided. Please upload a json file.</span></div>
</template>

<style>
canvas {
    background-color: #cde;
    margin: 0 20px 20px 0;
}

.no-data {
    width: 400px; 
    height: 400px; 
    border: 1px solid grey;
    padding: 10px;
}
</style>