<script setup>
import { ref } from 'vue'
import { inject } from 'vue'

const emitter = inject('emitter');

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
        const jsonData = JSON.parse(e.target.result);

        if (jsonData.path && Array.isArray(jsonData.path)) {
            emitter.emit("pathParsed", jsonData.path);
        } else {
            alert('Invalid JSON format: "path" property is missing or not an array.');
        }

        if (jsonData.path && Array.isArray(jsonData.robot)) {
            emitter.emit("robotParsed", jsonData.robot);
        } else {
            alert('Invalid JSON format: "robot" property is missing or not an array.');
        }
    };

    reader.readAsText(file);
}
</script>

<template>
    <div>
        <input type="file" @change="handleFileUpload" accept=".json" />
    </div>
</template>
  
  