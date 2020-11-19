<template>
  <div class="info-area">
    <a-button @click="()=>this.routeTo('/login')">login</a-button>
    <a-button @click="()=>this.routeTo('/register')">register</a-button>
  </div>
</template>
<script>
  export default{
    name:'InfoArea',
    methods: {
    }
  }
</script>