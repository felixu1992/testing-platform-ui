<template>
  <div class="home">
    <h1>Welcome to testting platform</h1>
    <h1>A beautiful Picture</h1>
    <h1>This is a very beautiful Home page</h1>
    <a-button @click="req">ohihi</a-button>
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

 }
</style>
