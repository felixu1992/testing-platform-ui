<template>
  <div class="files">
    <h1>files page</h1>
    <a-button @click="toFoo">to foo</a-button>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'Files',
  components: {
    
  },
  methods:{
    toFoo(){
      this.$router.push('/files/foo');
    }
  }
}
</script>
<style scoped>

</style>
