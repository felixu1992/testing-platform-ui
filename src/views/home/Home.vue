<template>
  <div class="home">
    <iframe src="https://blogs.felixu.top/testing-platform/" width="100%" height="100%"></iframe>
  </div>
</template>

<script>
// @ is an alias to /src
import TopNav from '../common/top-nav/TopNav'

export default {
  name: 'Home',
  components: {TopNav},
  methods:{
    req: function () {
      this.request.get('/contactor/group/page',(data)=>{
        console.log(data)
      });

    }

  }

}
</script>
<style scoped>
 .home{
   height: 100vh;
 }
</style>
