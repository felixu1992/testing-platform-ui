<template>
  <div class="files" v-if="isRouteOfFile">
    <div>
      <a-button size='small' type='primary'>添加文件</a-button>
    </div>
    <a-table :columns="columns" :data-source="data">
      <span slot="action" slot-scope="text, record">
        <a-button size='small' type="link" @click="updateFile(record.id)">
          更新
        </a-button>
        <a-button size='small' type="link" @click="deleteFile(record.id)">
          删除
        </a-button> 
      </span>
    </a-table>
    <router-view/>
  </div>
  <div v-else>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'Files',
  components: {
  },
  methods:{
    listFilePage(current,pageSize){
      this.request.get('/file/',{current:current,pageSize:pageSize}, data => {
        let records = data.records;
        for(let i = 0; i < records.length; i++){
          this.data = records;
        }
      });
    },
    updateFile(fileId){
      
    },
    deleteFile(fileId){
      
    }
  },
  computed:{
    isRouteOfFile(){
      return this.$store.state.currentRoute == '/files'
    }
  },
  data() {
    const data = [];
    const columns = [
      {
        title:'id',
        dataIndex: 'id',
      },
      {
        title: '文件路径',
        dataIndex: 'path',
        customRender: (text, row, index) => {
          let len = text.length;
          // return len > 25 ? '...' + text.substr(len - 25, len) : text ;
          return len > 25 ? text.substr(0, 10) + '...' + text.substr(len - 14, len) : text ;
        }
      },
      {
        title: '文件描述',
        dataIndex: 'remark',
        customRender: (text, row, index) => {
          if(text){
            return text;
          }else {
            return '-';
          }
        }
      },
      {
        title: '分组',
        dataIndex: 'group_name',
        key: 'group_id'
      },
      {
        title: '创建时间',
        dataIndex: 'created_at'
      },
      {
        title: '更新时间',
        dataIndex: 'updated_at'
      },
      {
        title: '操作',
        key: 'action',
        scopedSlots: { customRender: 'action' },
      }
    ];
    return {
      data,
      columns,
    };
  },
  
  beforeMount(current,pageSize){
    this.listFilePage(1,10);
  }
  
}
</script>
<style scoped>

</style>
