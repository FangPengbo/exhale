<template>
  <div id="app" class="background">
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'exhale'
  }
</script>

<style>
  /* CSS */
  html, body {
    font-family: 微软雅黑;
    -webkit-app-region: drag;
    width: 100%;
    height: 100%;
  }
  button, input{
    -webkit-app-region: no-drag;
  }
  * {
    margin: 0;
    padding: 0;
  }
  .background {
    background-color: #eaebf0;
    height: 100%;
    width: 100%;
  }
</style>
