<template xmlns="http://www.w3.org/1999/html">
  <!--  <div class="login test-platform-common-background">-->
  <!--    <div class="login-tile">-->
  <!--      <span>-->
  <!--        <h1>登陆</h1>-->
  <!--      </span>-->
  <!--    </div>-->
  <!--    <br>-->

  <!--    <div class="login-form-item">-->
  <!--      <div class="login-form-item-lable">-->
  <!--        <span>email: </span>-->
  <!--      </div>-->
  <!--      <div>-->
  <!--        <input v-model="email"/>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <div class="login-form-item">-->
  <!--      <div class="login-form-item-lable">-->
  <!--        <span>password:</span>-->
  <!--      </div>-->
  <!--      <div>-->
  <!--        <input type="password" v-model="password"/>-->
  <!--      </div>-->
  <!--    </div>-->
  <!--    <br/>-->
  <!--    <a-button @click="doLogin">登陆</a-button>-->
  <!--    <span>《&#45;&#45;》</span>-->
  <!--    <a-button @click="()=>{this.routeTo('/register')}">注册</a-button>-->
  <!--  </div>-->
  <div class="login test-platform-common-background">
    <a-card class="login-card" title="登 录">
      <a-form
          id="login-card-form"
          :form="form"
          class="login-form"
          @submit="handleSubmit"
      >
        <a-form-item>
          <a-input class="login-email"
                   v-decorator="[
          'email',
          { rules: [{ required: true, message: '邮箱不可以为空！' }] },
        ]"
                   placeholder="请输入邮箱"
          >
            <a-icon slot="prefix" type="mail" style="color: rgba(0,0,0,.25)"/>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-input class="login-password"
                   v-decorator="[
          'password',
          { rules: [{ required: true, message: '密码不可以为空！' }] },
        ]"
                   type="password"
                   placeholder="请输入密码"
          >
            <a-icon slot="prefix" type="lock" style="color: rgba(0,0,0,.25)"/>
          </a-input>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" class="login-form-button">
            登录
          </a-button>
          <br/>
          没有账号吗？
          <a @click="()=>{this.routeTo('/register')}"> 注册 </a>
          一个吧
        </a-form-item>
      </a-form>
    </a-card>
  </div>

</template>

<script>
// @ is an alias to /src
import api from '../../plugins/api';

export default {
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'normal_login'});
  },
  name: 'Login',
  components: {},
  data: function () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.doLogin(values)
        }
      });
    },
    doLogin: function (params) {
      api.signin(params, (data => {
        this.$message.info("登陆成功");
        this.$store.commit('doLogin', data);
        this.routeTo('/');
      }));
    }
  }
}
</script>
<style scoped>
@import "../../assets/css/common.css";
@import "./login.css";

#login-card-form .login-form {
  max-width: 300px;
}

#login-card-form .login-form-forgot {
  float: right;
}

#login-card-form .login-form-button {
  width: 20%;
}

.login-card {
  width: 30%;
  float: right;
  margin-right: 10%;
  margin-top: 5%;
  border-radius: 3%;
}

.login-email {
  width: 50%;
}

.login-password {
  width: 50%;
}
</style>
