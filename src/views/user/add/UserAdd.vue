<template>
  <div class="add-contact" style="padding:30px">
    <a-card title="新增用户">
      <a-form id="add-user-form" :form="form" class="user-form" @submit="handleSubmit">
        <a-form-item>
          名  称：
          <a-input class="user-name" style="width: 10%"
                   v-decorator="[
          'username',
          { rules: [{ required: true, message: '用户名不可为空！' }] },
        ]"
                   placeholder="请输入用户名"
          >
          </a-input>
        </a-form-item>
        <a-form-item>
          邮  箱：
          <a-input class="user-email" style="width: 10%"
                   v-decorator="[
          'email',
          { rules: [{ required: true, message: '用户邮箱不可为空！' }] },
        ]"
                   placeholder="请输入用户邮箱"
          >
          </a-input>
        </a-form-item>
        <a-form-item>
          手  机：
          <a-input class="user-phone" style="width: 10%"
                   v-decorator="[
          'phone',
          { rules: [{ required: true, message: '用户手机不可为空！' }] },
        ]"
                   placeholder="请输入用户手机"
          >
          </a-input>
        </a-form-item>
        <a-form-item v-if="admin">
          授权项目:
          <a-tree-select
              v-decorator="['projectIds']"
              style="width: 10%"
              :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
              :tree-data="projectTreeData"
              placeholder="选择授权的项目"
              allowClear
              multiple
              tree-default-expand-all
          >
          </a-tree-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" class="user-form-button">
            确 定
          </a-button>
          <a-divider type="vertical"/>
          <a-button class="user-form-cancel-button" @click="$router.push('/user')">
            取消
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>
import api from "@/plugins/api";
export default {
  name: "UserAdd",
  components: {
    VNodes: {
      functional: true,
      render: (h, ctx) => ctx.props.vnodes,
    },
  },
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'add-user'});
  },
  beforeMount() {
    this.getProjectTree();
  },
  data() {
    return {
      projectTreeData: []
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.createUser(values);
        }
      });
    },
    getProjectTree: function () {
      if (this.admin) {
        api.treeProject({}, data => this.projectTreeData = data);
      }
    },
    createUser: function (params) {
      api.createUser(params, data => {
        this.$router.push('/user');
      });
    },
  },
  computed: {
    admin: function () {
      let userInfo = this.$store.state.loggedInUserInfo;
      return userInfo.role === "ADMIN";
    }
  }
}
</script>

<style scoped>
@import "add-user.css";
</style>
