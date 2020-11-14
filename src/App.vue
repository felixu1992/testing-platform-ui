<template>
  <div id="app">
    <div id="test-platform-nav">
      <div id="test-platform-logo" class="float-to-left">this is the Logo</div>
<!--      <router-link to="/">Home</router-link> |-->
<!--      <router-link to="/about">About</router-link>-->
      <div id="test-platform-nav-content" class="float-to-left">
        <top-nav/>
      </div>
    </div>
    <br/>
    <div id="test-platform-side-opts" class="float-to-left">
      <div class="test-platform-side-opts-item">
        menu1
      </div>
      <div class="side-opts-item">
        menu2{
      </div>
      <div class="side-opts-item">
        menu3
      </div>
      <div class="side-opts-item">
        menu4
      </div>
    </div>
    <div id="" class="float-to-left">
      Working Area
      <router-view/>
    </div>
  </div>
</template>
<script>
  import TopNav from '@/views/common/top-nav/TopNav'
  export default {
    components:[TopNav]
  }

</script>
<style scoped>
  #test-platform-nav{
    min-height: 40px;
  }
  .float-to-left{
    float: left;
  }
  .side-opts-item{
    align-content: center;
  }
</style>
