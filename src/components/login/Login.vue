<template>
  <div>
    <div class="login-container">
      <div class="login-form">
        <Form ref="formInline" :model="formInline" :rules="ruleInline">
          <div class="login-info">
            <FormItem prop="title">
              <lable><h3>欢迎使用沙雕测试系统</h3></lable>
            </FormItem>
            <FormItem prop="email">
              <Input type="text" v-model="formInline.email" placeholder="请输入您的邮箱帐号" @input="validation('formInline')">
                <Icon type="ios-mail-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input type="password" v-model="formInline.password" placeholder="请输入您的密码" @input="validation('formInline')">
                <Icon type="ios-lock-outline" slot="prepend"></Icon>
              </Input>
            </FormItem>
            <FormItem>
              <Button id="login-button" disabled type="primary" @click="handleSubmit('formInline', formInline)">登 录</Button>
            </FormItem>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script>
import md5 from 'js-md5'
export default {
  name: 'Login',
  data () {
    return {
      formInline: {
        email: '',
        password: ''
      },
      ruleInline: {
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { type: 'string', min: 6, message: '密码不少于 6 位', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    encodePwd: function (password) {
      let pwd = md5(password)
      console.log(pwd)
      return password
    },
    validation: function (form) {
      let validate = false
      this.$refs[form].validate(valid => {
        document.getElementById('login-button').disabled = !valid
        validate = valid
      })
      return validate
    },
    handleSubmit (form, formInline) {
      let valid = this.validation(form)
      if (valid) {
        let pwd = this.encodePwd(formInline.password)
        this.axios.post('/platform/login', {
          email: formInline.email,
          password: pwd
        }).then(response => {
          if (response.code === 0) {
            localStorage.setItem('testing-platform-token', response.data.token)
            this.$Message.success('登录成功！')
            this.$router.push('/platform/home')
          } else {
            this.$Message.error(response.message)
          }
        }, err => {
          console.log(err)
        })
      } else {
        this.$Message.error('登录信息缺失！')
      }
    }
  }
}
</script>

<style scoped>
.login-container {
  width:100%;
  height:100%;
  position:absolute;
  background: url("../../assets/logo.png");
  background-size: 100% 100%;
}
.login-form {
  width: 25%;
  height: 30%;
  right: 15%;
  top: 30%;
  position: absolute;
  z-index: 999;
  background-color: aqua;
  border-radius:15px;
}
.login-info {
  position: absolute;
  width: 40%;
  top: 20%;
  left: 32%;
}
</style>
