<template>
  <div class="info-area">
    <div class="logged-in-user-info" v-if="loggedIn">
      <a-avatar class="avatar" v-if="user.avatar" :src="user.avatar" />
      <a-avatar class="avatar" v-else icon="user" />
       {{ infoText }}
      <span class="logoff"><a @click="logoff()">注销</a></span>
    </div>
    <div class="two-btns" v-else>
      <a-button @click="()=>this.routeTo('/login')">登陆</a-button>
      <a-button @click="()=>this.routeTo('/register')">注册</a-button>
    </div>

  </div>
</template>
<script>
export default {
  name: 'InfoArea',
  data: function () {
    return {
      user: {}
    }
  },
  computed: {
    loggedIn: function () {
      return this.$store.getters.loggedIn
    },
    infoText: function () {
      let userInfo = this.$store.state.loggedInUserInfo;
      this.user = userInfo
      return userInfo.username.length > 10 ? userInfo.username.substr(0, 10) + '...' : userInfo.username;
    }
  },
  methods: {
    logoff: function () {
      this.$store.commit("doLogoff");
      this.routeTo("/login");
    }
  }
}
</script>
<style scoped>
@import "./info-area.css";
</style>
