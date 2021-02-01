<template>
  <div class="top-bar">
    <img class="top-logo" src="https://oss-blog.felixu.top/shutup" alt="logo"
         style="width: 36px;height: 36px; margin-left: 8px; margin-top: 8px">
    <div class="top-menu">
      <a-menu class="menu" mode="horizontal">
        <a-menu-item @click="() => $router.push('/')">
          <a-icon type="home"/>
          首页
        </a-menu-item>
        <a-menu-item @click="() => $router.push('/contact')">
          <a-icon type="contacts"/>
          联系人管理
        </a-menu-item>
        <a-menu-item @click="() => $router.push('/file')">
          <a-icon type="file"/>
          文件管理
        </a-menu-item>
        <a-sub-menu>
        <span slot="title" class="submenu-title-wrapper">
          <a-icon type="project"/>项目管理
        </span>
          <a-menu-item-group>
            <a-menu-item key="project-grp" @click="() => this.$router.push('/project-group')">
              项目分组
            </a-menu-item>
            <a-menu-item key="project-itm" @click="() => this.routeTo('/project')">
              项目
            </a-menu-item>
          </a-menu-item-group>
        </a-sub-menu>
        <a-menu-item @click="() => $router.push('/record')">
          <a-icon type="dashboard"/>
          测试记录
        </a-menu-item>
      </a-menu>
    </div>
    <div class="top-info">
      <div class="logged-in-user-info" v-if="loggedIn">
        <a-avatar class="avatar" v-if="user.avatar" :src="user.avatar"/>
        <a-avatar class="avatar" v-else icon="user"/>
        {{ infoText }}
        <span class="logoff"><a @click="logoff()">注销</a></span>
      </div>
      <div class="two-btns" v-else>
        <a-button @click="() => $router.push('/login')">登陆</a-button>
        <a-button @click="() => $router.push('/register')">注册</a-button>
      </div>

    </div>
  </div>

</template>

<script>
// import ASubMenu from "ant-design-vue/es/menu/SubMenu";

export default {
  name: "TopBar",
  // components: { ASubMenu },
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
      this.$router.push("/login");
    }
  }
}
</script>

<style scoped>
@media screen and (min-width: 860px) {
  .top-bar {
    /*border: 1px solid black;*/
    height: 48px;
    /*padding: 20px;*/
  }

  .top-logo {
    float: left;
  }

  .top-menu {
    float: left;
  }

  .top-menu .menu {
    height: 48px;
  }

  .top-info {
    float: right;
    padding-top: 8px;
    padding-right: 10px;
    height: 48px;
  }

  /*.avatar {*/
  /*  width: 32px;*/
  /*  height: 32px;*/
  /*}*/
}

</style>
