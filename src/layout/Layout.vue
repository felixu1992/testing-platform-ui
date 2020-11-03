<style scoped>
.layout{
  border: 1px solid #d7dde4;
  background: #f5f7f9;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
}
.layout-logo{
  width: 100px;
  height: 30px;
  background: #5b6270;
  border-radius: 3px;
  float: left;
  position: relative;
  top: 15px;
  left: 12px;
}
.layout-nav{
  width: 420px;
  /*position: absolute;*/
  /*top: 10px;*/
  /*right: 1px;*/
  margin: 0 auto;
  margin-right: 20px;
}
</style>
<template>
  <div class="layout">
    <Layout>
      <Header>
        <Menu mode="horizontal" theme="dark" active-name="1">
          <div class="layout-logo"></div>
          <div class="layout-nav">
            <menu-item name="user-info">
              <Icon type="ios-analytics"></Icon>
              个人信息
            </menu-item>
          </div>
        </Menu>
      </Header>
      <Layout>
        <Sider hide-trigger :style="{background: '#fff'}">
          <Menu active-name="home" theme="light" width="auto">
            <div >
              <menu-item name="home">
                <router-link to="/home"> <Icon type="ios-navigate"></Icon>首页</router-link>
              </menu-item>
            </div>
            <submenu name="1">
              <template slot="title">
                <Icon type="ios-navigate"></Icon>
                Item 1
              </template>
              <menu-item name="1-1">Option 1</menu-item>
              <menu-item name="1-2">Option 2</menu-item>
              <menu-item name="1-3">Option 3</menu-item>
            </submenu>
            <submenu name="2">
              <template slot="title">
                <Icon type="ios-keypad"></Icon>
                Item 2
              </template>
              <menu-item name="2-1">Option 1</menu-item>
              <menu-item name="2-2">Option 2</menu-item>
            </submenu>
            <submenu name="3">
              <template slot="title">
                <Icon type="ios-analytics"></Icon>
                Item 3
              </template>
              <menu-item name="3-1">Option 1</menu-item>
              <menu-item name="3-2">Option 2</menu-item>
            </submenu>
          </Menu>
        </Sider>
        <Layout :style="{padding: '0 24px 24px'}">
<!--          <Breadcrumb :style="{margin: '24px 0'}">-->
<!--            <BreadcrumbItem>Home</BreadcrumbItem>-->
<!--            <BreadcrumbItem>Components</BreadcrumbItem>-->
<!--            <BreadcrumbItem>Layout</BreadcrumbItem>-->
<!--          </Breadcrumb>-->
          <Tabs type="card" closable @on-tab-remove="handleTabRemove">
            <TabPane label="标签一" v-if="tab0">
              <router-view/>
            </TabPane>
<!--            <TabPane label="标签二" v-if="tab1">标签二的内容</TabPane>-->
<!--            <TabPane label="标签三" v-if="tab2">标签三的内容</TabPane>-->
          </Tabs>
<!--          <Content :style="{padding: '24px', minHeight: '280px', background: '#fff'}">-->
<!--            <router-view/>-->
<!--          </Content>-->
        </Layout>
      </Layout>
    </Layout>
  </div>
</template>
<script>
export default {
  data () {
    return {
      tab0: true,
      tab1: true,
      tab2: true
    }
  },
  methods: {
    handleTabRemove (name) {
      this['tab' + name] = false
    }
  }
}
</script>
