"use strict";
import Vue from 'vue'
import 'ant-design-vue/dist/antd.less';
import {
    Button, Layout, Row, Col, Menu, Icon, Tabs, Input, Select, Dropdown, List, Avatar,
    Form, Divider, BackTop, Modal, Upload, message, notification, Spin, Badge, LocaleProvider,
    Comment, Affix, Table, Breadcrumb, Tag, Pagination, Card, Popconfirm, DatePicker, ConfigProvider, Tree
} from 'ant-design-vue';
//按需加载 减少资源使用量
Vue.use(Button);
Vue.use(Layout);
Vue.use(Row);
Vue.use(Col);
Vue.use(Menu);
Vue.use(Icon);
Vue.use(Tabs);
Vue.use(Input);
Vue.use(Select);
Vue.use(Dropdown);
Vue.use(List);
Vue.use(Avatar);
Vue.use(Form);
Vue.use(Divider);
Vue.use(BackTop);
Vue.use(Modal);
Vue.use(Upload);
Vue.use(Spin);
Vue.use(Badge);
Vue.use(LocaleProvider);
Vue.use(ConfigProvider)
Vue.use(Comment);
Vue.use(Affix);
Vue.use(Table);
Vue.use(Breadcrumb);
Vue.use(Tag);
Vue.use(Pagination);
Vue.use(Card)
Vue.use(Popconfirm);
Vue.use(DatePicker);
Vue.use(Tree)
Vue.prototype.$message = message;
Vue.prototype.$notification = notification;
