<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <div id="test-platform-nav">
        <div id="test-platform-nav-logo" class="float-to-left"v-if="loggedIn">
          <img class="logo" src="https://oss-blog.felixu.top/shutup" alt="logo" style="width: 36px;height: 36px; margin-left: 8px; margin-top: 8px">
        </div>
        <div id="test-platform-nav-content" class="float-to-left"  v-if="loggedIn">
          <top-nav/>
        </div>
        <div id="test-platform-info-area">
          <info-area/>
        </div>
      </div>
      <div class="test-platform-breadcrumb" v-if="loggedIn">
        <common-breadcrumb/>
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
  export default {
    components:{TopNav,InfoArea,CommonBreadcrumb},
    data(){
      return {
        locale: zhCN
      }
    },
    computed:{
      loggedIn: function () {
        return this.$store.getters.loggedIn
      }
    }
  }
</script>
<style scoped>
 @import "assets/css/app.css";
</style>
