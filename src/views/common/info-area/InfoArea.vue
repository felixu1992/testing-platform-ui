<template>
  <div class="info-area">
    <div class="logged-in-user-info" v-if="loggedIn">
      当前用户：{{loggedInUserInfo.username.length > 10 ? loggedInUserInfo.username.substr(0,10) + '...' : loggedInUserInfo.username}}
    </div>
    <div class="two-btns" v-else>
      <a-button @click="()=>this.routeTo('/login')">登陆</a-button>
      <a-button @click="()=>this.routeTo('/register')">注册</a-button>
    </div>

  </div>
</template>
<script>
  let tempUserInfoForTest = {
    username:'ChasonLuis'
  }
  export default{
    name:'InfoArea',
    data:function(){
      return {
        loggedInUserInfo : tempUserInfoForTest
      }
    },
    computed:{
      loggedIn: function () {
        // return this.$store.getters.loggedIn
        return tempUserInfoForTest
      }
    },
    methods: {
    }
  }
</script>
<style scoped>
  @import "./info-area.css";
</style>