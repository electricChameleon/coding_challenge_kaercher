<script setup>
import { ref } from 'vue'
import { inject } from 'vue'

const pathArray = ref([]);
const emitter = inject('emitter');

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
        const jsonData = JSON.parse(e.target.result);

        if (jsonData.path && Array.isArray(jsonData.path)) {
            pathArray.value = [];
            Array.prototype.push.apply(pathArray.value, jsonData.path);
            emitter.emit("pathParsed", pathArray.value);
        } else {
            alert('Invalid JSON format: "path" property is missing or not an array.');
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
  
  