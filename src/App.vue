<template>

  <div id="app">
    <router-view/>
  </div>
<!--  <Layout v-else-if="!(path === '/')">-->
<!--  </Layout>-->
</template>

<script>
import Layout from "./layout/Layout";

export default {
  components: {
    Layout
  },
  name: 'App',
  data(){
    return{
      path:''
    }
  },
  mounted() {
    this.path = this.$route.path;
  },
  watch:{
    $route(to,from){
      this.path = to.path
    }
  }

}

</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
