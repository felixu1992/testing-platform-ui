<template>
  <div id="app">
    <div id="test-platform-nav">
      <div id="test-platform-logo" class="float-to-left">
        <h1>A Beautiful Logo</h1>
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
  #test-platform-nav{
    min-height: 40px;
  }
  .float-to-left{
    float: left;
  }
</style>
