<script setup>

import { ref, onMounted } from 'vue';
import { inject } from 'vue'

const emitter = inject('emitter');
const canvas = ref(null);
const ctx = ref(null);
const coordinates = ref([]);
const robot = ref([]);
const showRobot = ref(false);
const showCleanedArea = ref(false);

emitter.on('pathParsed', (value) => {
    coordinates.value = [];
    Array.prototype.push.apply(coordinates.value, value);
    
    prepareCanvasForDrawing();

    var factor = calculateFactor();
    drawRobotPath(factor);
});

emitter.on('robotParsed', (value) => {
    robot.value = [];
    Array.prototype.push.apply(robot.value, value);
});


onMounted(() => {
    ctx.value = canvas.value.getContext('2d');
})

function prepareCanvasForDrawing()
{
    ctx.value.save();
    ctx.value.translate(100, 50);
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
    ctx.value.lineWidth = 0.66 * factor; // static number for width of cleaned path, should be dynamic
    ctx.value.strokeStyle = 'rgba(255,255,255,0.6)';
    ctx.value.beginPath();

    coordinates.value.forEach(coordinate => {
        var x = (coordinate[0]) * factor;
        var y = (coordinate[1]) * factor;
        ctx.value.lineTo(x, y);
    });

    ctx.value.stroke();
}

function drawRobotPolygon(baseLink, factor) {
    ctx.value.lineWidth = 1.5;
    ctx.value.strokeStyle = 'black';

    var x1 = baseLink[0] + robot.value[0][0] * factor;
    var x2 = baseLink[0] + robot.value[1][0] * factor;
    var x3 = baseLink[0] + robot.value[2][0] * factor;
    var x4 = baseLink[0] + robot.value[3][0] * factor;
    var y1 = baseLink[1] + robot.value[0][1] * factor;
    var y2 = baseLink[1] + robot.value[1][1] * factor;
    var y3 = baseLink[1] + robot.value[2][1] * factor;
    var y4 = baseLink[1] + robot.value[3][1] * factor;

    ctx.value.beginPath();
    ctx.value.lineTo(x1, y1);
    ctx.value.lineTo(x2, y2);
    ctx.value.lineTo(x3, y3);
    ctx.value.lineTo(x4, y4);
    ctx.value.lineTo(x1, y1);
    ctx.value.stroke();
}

function drawRobotPath(factor) {
    ctx.value.lineWidth = 1.5;
    ctx.value.strokeStyle = 'red';

    ctx.value.beginPath();

    coordinates.value.forEach(coordinate => {
        var x = (coordinate[0]) * factor;
        var y = (coordinate[1]) * factor;
        ctx.value.lineTo(x, y);
    });

    ctx.value.stroke();
}

function redrawCanvas() {
    var factor = calculateFactor();

    // clear the canvas for redrawing
    ctx.value.restore();
    ctx.value.clearRect(0, 0, canvas.value.width, canvas.value.height);
    prepareCanvasForDrawing();

    // Handle the logic based on switch state 
    if(showCleanedArea.value)
    {
        visualizeCleanedPath(factor);
    }

    if(showRobot.value)
    {
        var baseLink = [coordinates.value[0][0] * factor, coordinates.value[0][1] * factor];
        drawRobotPolygon(baseLink, factor);
    }

    // Always draw the robot path again
    drawRobotPath(factor);
}
</script> 
<template>
    <div class="container">
        <div class="canvas-container">
            <!-- Canvas element and placeholder div-->
            <canvas :style="[coordinates.length > 0 ? { 'display': 'block' } : { 'display': 'none' }]" ref="canvas"
                width="400" height="400"></canvas>
            <div :style="[coordinates.length > 0 ? { 'display': 'none' } : { 'display': 'block' }]" class="no-data">
                <span>No data provided. Please upload a json file.</span>
            </div>
        </div>
        <!-- Switch elements -->
        <div class="switch-container" :style="[coordinates.length > 0 ? { 'display': 'block' } : { 'display': 'none' }]">
            <div>
                <label class="switch">
                    <input type="checkbox" v-model="showRobot" @change="redrawCanvas" />
                    <span class="slider round"></span>
                </label>
                <span class="switch-desc">Display robot (BETA)</span>
            </div>
            <div>
                <label class="switch">
                    <input type="checkbox" v-model="showCleanedArea" @change="redrawCanvas" />
                    <span class="slider round"></span>
                </label>
                <span class="switch-desc">Display cleaned area (BETA)</span>
            </div>
        </div>
    </div>
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
    margin: 0 20px 20px 0;
}

.container {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
}

.canvas-container {
    flex: 1;
    max-width: 420px;
    min-width: 420px;
    margin-right: 10px;
}

.switch-container {
    flex: 1;
    min-width: 50%;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
    margin-bottom: 10px;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 34px;
}

.slider:before {
    position: absolute;
    content: '';
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
    border-radius: 50%;
}

input:checked+.slider {
    background-color: #2196F3;
}

input:focus+.slider {
    box-shadow: 0 0 1px #2196F3;
}

input:checked+.slider:before {
    transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}

.switch-desc{
    margin-left: 10px;
}
</style>