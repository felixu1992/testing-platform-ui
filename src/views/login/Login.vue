<template>
  <div class="login">
    login page<br>

    username: <input v-model="username"/>
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
      username:'',
      password:''
    }
  },
  methods:{
    doLogin: async function () {
      let username = this.username
      let pswd = this.password
      let response = await this.request.post('/foo', {
        username: username,
        password: pswd
      })
      console.log("======")
      console.log(response)
    }
    // toRegPage: function () {
    //   this.$router.push('/register')
    // }
  }
}
</script>
<style scoped>

</style>
