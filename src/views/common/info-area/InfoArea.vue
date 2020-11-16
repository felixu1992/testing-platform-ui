<template>
  <div class="info-area">
    <a-button @click="routeTo('/')">home</a-button>
    <a-button @click="routeTo('/login')">login</a-button>
    <a-button @click="routeTo('/register')">register</a-button>
  </div>
</template>
<script>
  export default{
    name:'InfoArea',
    methods: {
      routeTo: function(path){
        this.$router.push(path)
      }
    }
  }
</script>