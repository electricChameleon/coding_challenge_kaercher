<script setup>
import { ref } from 'vue'
const pathArray = ref([]);

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const jsonData = JSON.parse(e.target.result);

            if (jsonData.path && Array.isArray(jsonData.path)) {
                pathArray.value = [];
                Array.prototype.push.apply(pathArray.value, jsonData.path);
            } else {
                alert('Invalid JSON format: "path" property is missing or not an array.');
            }
        } catch (error) {
            alert('Error parsing JSON file: ' + error.message);
        }
    };

    reader.readAsText(file);
}
</script>

<template>
    <div>
        <input type="file" @change="handleFileUpload" accept=".json" />
        <div v-if="pathArray.length > 0">
            <h2>Path Array:</h2>
            <ul>
                <li v-for="(point, index) in pathArray" :key="index">
                    {{ point }}
                </li>
            </ul>
        </div>
    </div>
</template>
  
  