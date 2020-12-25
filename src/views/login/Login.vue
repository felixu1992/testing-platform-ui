<template>
  <div class="login test-platform-common-background">
    <div class="login-tile">
      <span>
        <h1>登陆</h1>
      </span>
    </div>
    <br>

    <div class="login-form-item">
      <div class="login-form-item-lable">
        <span>email: </span>
      </div>
      <div>
        <input v-model="email"/>
      </div>
    </div>
    <div class="login-form-item">
      <div class="login-form-item-lable">
        <span>password:</span>
      </div>
      <div>
        <input type="password" v-model="password"/>
      </div>
    </div>
    <br/>
    <a-button @click="doLogin">登陆</a-button>
    <span>《--》</span>
    <a-button @click="()=>{this.routeTo('/register')}">注册</a-button>
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
    doLogin: function () {
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
  @import "../../assets/css/common.css";
  @import "./login.css";
</style>
