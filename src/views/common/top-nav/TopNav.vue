<template>
  <div id="top-nav">
    <a-menu class="menu" v-model="current" mode="horizontal">
      <a-menu-item @click="()=>this.routeTo('/')">
        <a-icon type="home"/>
        首页
      </a-menu-item>
      <a-sub-menu v-if="roleAdmin">
        <span slot="title" class="submenu-title-wrapper">
          <a-icon type="contacts"/>联系人管理
        </span>
        <a-menu-item-group>
          <a-menu-item key="contact-grp" @click="()=>this.routeTo('/contact-group')">
            联系人分组
          </a-menu-item>
          <a-menu-item key="contact-itm" @click="()=>this.routeTo('/contact')">
            联系人
          </a-menu-item>
        </a-menu-item-group>
      </a-sub-menu>
      <a-sub-menu>
        <span slot="title" class="submenu-title-wrapper">
          <a-icon type="file"/>文件管理
        </span>
        <a-menu-item-group>
          <a-menu-item key="file-grp" @click="()=>$router.push('/file-group')">
            文件分组
          </a-menu-item>
          <a-menu-item key="file-itm" @click="()=>$router.push('/file')">
            文件
          </a-menu-item>
        </a-menu-item-group>
      </a-sub-menu>
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
      <a-sub-menu>
        <span slot="title" class="submenu-title-wrapper">
          <a-icon type="dashboard"/>测试记录
        </span>
        <a-menu-item-group>
          <a-menu-item key="test-recs" @click="()=> $router.push('/record')">
            测试记录
          </a-menu-item>
        </a-menu-item-group>
      </a-sub-menu>
    </a-menu>
  </div>
</template>
<script>
import ASubMenu from "ant-design-vue/es/menu/SubMenu";

export default {
  name: 'TopNav',
  components: {ASubMenu},
  data() {
    return {
      current: ['mail'],
    };
  },
  methods: {},
  computed: {
    roleAdmin: function () {
      let userinfo = this.$store.state.loggedInUserInfo;
      return this.$store.getters.loggedIn && userinfo.role === "ROLE_ADMIN";
    }
  }
}
</script>

<style scoped>
@import "top-nav.css";
</style>
