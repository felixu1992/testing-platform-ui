<template>
  <div class="login">
    login page<br>

    email: <input v-model="email"/>
    <br>
    password: <input type="password" v-model="password"/>
    <br>
    <a-button @click="doLogin">login</a-button>
    <a-button @click="()=>{this.$router.push('/register')}">register</a-button>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: 'Login',
  components: {},
  data: function () {
    return {
      email:'',
      password:''
    }
  },
  methods:{
    doLogin: async function () {
      let email = this.email;
      let pswd = this.password;
      this.request.post('/user/signin', {
        email: email,
        password: pswd
      },(data =>{
        this.$message.info("登陆成功");
        this.$store.commit('doLogin',data);
        this.routeTo('/');
      }));
    }
  }
}
</script>
<style scoped>

</style>
