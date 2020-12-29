<template>
  <div class="contacts">
    <a-table :columns="columns" :data-source="data" :pagination="pagination">
    <a slot="name" slot-scope="text">{{ text }}</a>
    <span slot="customTitle"><a-icon type="smile-o" /> 名称</span>
    <span slot="tags" slot-scope="tags">
      <a-tag
        v-for="tag in tags"
        :key="tag"
        :color="tag === 'loser' ? 'volcano' : tag.length > 5 ? 'geekblue' : 'green'"
      >
        {{ tag.toUpperCase() }}
      </a-tag>
    </span>
    <span slot="action" slot-scope="text, record">
      <a>Invite 一 {{ record.name }}</a>
      <a-divider type="vertical" />
      <a>Delete</a>
      <a-divider type="vertical" />
      <a class="ant-dropdown-link"> More actions <a-icon type="down" /> </a>
    </span>
   </a-table>
  <a-pagination
      show-size-changer
      :default-current="3"
      :total="500"
      @showSizeChange="onShowSizeChange"
  />
  </div>

</template>

<script>

const columns = [
  {
    dataIndex: 'name',
    key: 'name',
    slots: { title: 'customTitle' },
    scopedSlots: { customRender: 'name' },
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: '手机号',
    dataIndex: 'phone',
    key: 'phone',
  },
  {
    title: '所属分组',
    key: 'group_name',
    dataIndex: 'group_name'
  },
  {
    title: '创建时间',
    key: 'created_at'
  },
  {
    title: '更新时间',
    key: 'updated_at'
  },
  {
    title: '操作',
    key: 'action',
    scopedSlots: { customRender: 'action' },
  }
];

const data = [];

export default {
  name: 'Contacts',
  components: {},
  beforeMount(){

    this.getPage();
  },
  data() {
    // let page;
    let pageSize;
    return {
      data,
      columns,
      // page,
      pageSize,
      pagination:{
        defaultPageSize: 10,
        showTotal: total => `共 ${total} 条数据`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '30', '40', '50'],
        onShowSizeChange: (current, pageSize) => this.pageSize = pageSize
      }

    };
  },
  computed:{
    computedData(){
      return this.data;
    }
  },
  watch: {
    pageSize(val) {
      console.log('pageSize', val);
    },
    current(val) {
      console.log('current', val);
    },
  },
  methods:{
    getPage: function () {
      // let page = 1;
      // let pswd = this.password;
      this.request.get('/contactor/', {
        page: 1,
        page_size: 10
      },(data =>{
        this.data = data.records
      }));
    }
  }
}
</script>
<style scoped>

</style>
