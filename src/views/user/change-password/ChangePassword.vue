<template>
  <div class="change-password" style="padding:30px">
    <a-form id="add-user-form" :form="form" class="user-form" @submit="handleSubmit">
      <a-form-item :label="`旧密码: `">
        <a-input class="original-password" style="width: 10%"
                 v-decorator="[
          'originalPassword',
          { rules: [{ required: true, message: '旧密码不可为空！' }] },
        ]"
                 placeholder="请输入旧密码"
        >
        </a-input>
      </a-form-item >
      <a-form-item :label="`新密码: `">
        <a-input class="new-password" style="width: 10%"
                 v-decorator="[
          'newPassword',
          { rules: [{ required: true, message: '新密码不可为空！' }, {validator: handlePassword}] },
        ]"
                 placeholder="请输入新密码"
        >
        </a-input>
      </a-form-item>
      <a-form-item :label="`确认密码: `">
        <a-input class="confirm-password" style="width: 10%"
                 v-decorator="[
          'confirmPassword',
          { rules: [{ required: true, message: '确认密码不可为空！' }, {validator: checkPassword}] },
        ]"
                 placeholder="请确认密码"
        >
        </a-input>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" html-type="submit" class="user-form-button">
          确 定
        </a-button>
        <a-divider type="vertical"/>
        <a-button class="user-form-cancel-button" @click="$router.push('/')">
          取消
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import api from "@/plugins/api";
export default {
  name: "ChangePassword",
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'change-password'});
  },
  data() {
    return {
      newPassword: '',
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          let user = this.$store.state.loggedInUserInfo;
          api.changePassword(user.id, values, data => this.$router.push('/login'))
        }
      });
    },
    handlePassword: function (rule, value, callback) {
      this.newPassword = value;
      callback();
    },
    checkPassword: function (rule, value, callback) {
      if (this.newPassword &&this.newPassword !== value) {
        callback('两次输入的密码不一致！');
      }
      callback();
    }
  }
}
</script>

<style scoped>

</style>
