<template>
  <div class="home">
    <div id="test-platform-side-opts" class="float-to-left">
      <div class="side-opts-item" @click="toMenu1">
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
    <div class="float-to-left">
      <router-view/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import TopNav from '../common/top-nav/TopNav'

export default {
  name: 'Home',
  components: {TopNav},
  methods:{
    toMenu1: function(){
      this.$router.push('/menu1')
    }
  }
}
</script>
<style scoped>
  .float-to-left{
    float: left;
  }
</style>
