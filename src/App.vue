<script setup>
import FileUpload from './components/FileUpload.vue'
import RobotPathPlot from './components/RobotPathPlot.vue';
</script>

<template>
  <div class="header">
    <h1>Kärcher Coding Challenge</h1>
  </div>

  <div class="content">
    <RobotPathPlot />
    <FileUpload/>
  </div>
</template>

<style scoped>
.header {
  line-height: 1.5;
  background-color: white;
  box-shadow: 0 8px 12px 0 rgba(0, 0, 0, 0.3);
  position:fixed;
  left:0;
  top:0;
  width:100vw;
  z-index:200;
  height:100px;
  padding: 25px 40px;
}

.header h1 {
  text-decoration: underline;
  text-decoration-color: #ffed00;
  text-transform: uppercase;
  font-weight: 900;
  font-style: normal;
  color: #2b2b2b;
  white-space: nowrap;
}

.content{
  padding-top: 150px;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

</style>
