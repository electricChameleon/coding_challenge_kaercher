<script setup>
import { ref } from 'vue'

const count = ref(0)

function submitFile() {
    console.log("submit this!");
}
</script>

<template>
    <input type="file">
    <button @click="submitFile">Submit</button>
</template>