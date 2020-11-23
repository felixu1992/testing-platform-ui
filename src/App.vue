<template>
  <div id="app">
    <div id="test-platform-nav">
      <div id="test-platform-nav-logo" class="float-to-left" @click="()=>this.routeTo('/')">
        <h1 class="test-platform-nav-title">许大仙的测试平台</h1>
      </div>
      <div id="test-platform-nav-content" class="float-to-left">
        <top-nav/>
      </div>
      <div id="test-platform-info-area">
        <info-area/>
      </div>
    </div>
    <br/>
    <router-view/>
  </div>
</template>
<script>
  import TopNav from './views/common/top-nav/TopNav'
  import InfoArea from './views/common/info-area/InfoArea'
  export default {
    components:{TopNav,InfoArea}
  }
</script>
<style scoped>
 @import "assets/css/app.css";
</style>
