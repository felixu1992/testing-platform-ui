<template>

  <div class="info-area">
    <div class="logged-in-user-info" v-if="loggedIn">
      你好：{{loggedInUserInfo.username}}
    </div>
    <div class="two-btns" v-else>
      <a-button @click="()=>this.routeTo('/login')">login</a-button>
      <a-button @click="()=>this.routeTo('/register')">register</a-button>
    </div>

  </div>
</template>
<script>
  export default{
    name:'InfoArea',
    data:{
      loggedInUserInfo : function () {
        return this.$store.state.loggedInUserInfo;
      }
    },
    computed:{
      loggedIn: function () {
        return this.$store.getters.loggedIn
      }
    },
    methods: {
    }
  }
</script>