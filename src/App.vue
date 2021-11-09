<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <div>
        <top-bar/>
      </div>
      <div id="test-platform-area">
        <router-view/>
      </div>
    </div>
  </a-config-provider>
</template>
<script>
import TopNav from './views/common/top-nav/TopNav'
import InfoArea from './views/common/info-area/InfoArea'
import CommonBreadcrumb from './views/common/common-breadcrumb/CommonBreadcrumb'
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import TopBar from "@/views/common/top-bar/TopBar";

export default {
  components: {TopBar, TopNav, InfoArea, CommonBreadcrumb},
  data() {
    return {
      locale: zhCN
    }
  },
  computed: {
    loggedIn: function () {
      return this.$store.getters.loggedIn
    }
  }
}
</script>
<style scoped>
@import "assets/css/app.css";
</style>
