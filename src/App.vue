<template>
  <a-locale-provider :locale="locale">
  <div id="app">
    <div id="test-platform-nav">
      <div id="test-platform-nav-logo" class="float-to-left" @click="()=>this.routeTo('/')">
        <h1 class="test-platform-nav-title">logo</h1>
      </div>
      <div id="test-platform-nav-content" class="float-to-left">
        <top-nav/>
      </div>
      <div id="test-platform-info-area">
        <info-area/>
      </div>
    </div>
    <br/>
    <div>
      <common-breadcrumb/>
    </div>
    <router-view/>
  </div>
  </a-locale-provider>
</template>
<script>
  import TopNav from './views/common/top-nav/TopNav'
  import InfoArea from './views/common/info-area/InfoArea'
  import CommonBreadcrumb from './views/common/common-breadcrumb/CommonBreadcrumb'
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
  export default {
    components:{TopNav,InfoArea,CommonBreadcrumb},
    data(){
      return {
        locale: zhCN
      }
    },
    computed:{}
  }
</script>
<style scoped>
 @import "assets/css/app.css";
</style>
