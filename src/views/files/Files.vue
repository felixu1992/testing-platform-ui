<template>
  <div class="files" v-if="isRouteOfFile">
    <div>
      <a-form class="ant-advanced-search-form" :form="form" @submit="handleSearch">
      <a-row :gutter="24">
        <a-col :span=6>
          <a-form-item :label="`文件路径: `">
            <a-input
              v-decorator="[
                `filePath`,
                {
                  rules: [
                    {
                      required: false
                    },
                  ],
                },
              ]"
              placeholder="filePath"
            />
          </a-form-item>
        </a-col>
        <a-col :span=6>
          <a-form-item :label="`分组: `">
            <a-input
              v-decorator="[
                `fileGroup`,
                {
                  rules: [
                    {
                      required: false
                    },
                  ],
                },
              ]"
              placeholder="fileGroupId"
            />
          </a-form-item>
        </a-col>
        <a-col :span=12>
          <a-form-item :label="`创建时间: `">
            <a-range-picker
              v-decorator="['create-time-picker']"
              show-time
              format="YYYY-MM-DD HH:mm:ss"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="24">
        
        <a-col :span=10>
          <a-form-item :label="`更新时间: `">
            <a-range-picker
              v-decorator="['update-time-picker']"
              show-time
              format="YYYY-MM-DD HH:mm:ss"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12" :style="{ textAlign: 'right' }">
          <a-button type="primary" html-type="submit">
            搜索
          </a-button>
          <a-button :style="{ marginLeft: '8px' }" @click="handleReset">
            重置
          </a-button>
        </a-col>
      </a-row>
    </a-form>
    </div>
    
    <a-table :columns="columns" :data-source="data" :pagination='false'>
      <span slot="action" slot-scope="text, record">
        <a-button size='small' type="link" @click="()=>routeTo('/files/update-file')">
          更新
        </a-button>
        <a-popconfirm title="确认删除?"
          ok-text="是"
          cancel-text="否"
          @confirm="deleteFile(record.id)"
          @cancel="cancelDeleteFile"
        >
          <a-button size='small' type="link" @click="showConfirmDelete(record)">
            删除
          </a-button> 
        </a-popconfirm>
      </span>
    </a-table>
    <div>
      <div class="add-file-btn">
        <a-button size='small' type='primary' @click="()=>routeTo('/files/add-file')">添加文件</a-button>
      </div>
      <div class="pagination-bar">
        <a-pagination size="small" :total="50" :show-total="total => `Total ${total} items`" show-size-changer show-quick-jumper />
      </div>
    </div>
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
    showConfirmDelete(rowRecord){

    },
    deleteFile(fileId){
      //todo
      this.request.get('/file/',{}, data=>{
        this.$notification.info({
          message: '操作提示',
          description:'删除成功',
          duration:2
        });
      });
    },
    cancelDeleteFile(){
      this.$notification.open({
        message: '操作提示',
        description:'已取消操作',
        duration:2
      });
    },

    //form test
    handleSearch(e) {
      e.preventDefault();
      this.form.validateFields((error, values) => {
        console.log('error', error);
        console.log('Received values of form: ', values);
      });
    },

    handleReset() {
      this.form.resetFields();
    },

    toggle() {
      this.expand = !this.expand;
    }
  },
  computed:{
    isRouteOfFile(){
      return this.$store.state.currentRoute == '/files'
    },

    // form test
    count() {
      return this.expand ? 11 : 7;
    },
  },
  data() {
    const data = [];
    const columns = [
      {
        title:'id',
        dataIndex: 'id',
        key: 'id'
      },
      {
        title: '文件路径',
        dataIndex: 'path',
        key:'path',
        customRender: (text, row, index) => {
          let len = text.length;
          // return len > 25 ? '...' + text.substr(len - 25, len) : text ;
          return len > 25 ? text.substr(0, 10) + '...' + text.substr(len - 14, len) : text ;
        }
      },
      {
        title: '文件描述',
        dataIndex: 'remark',
        key:'remark',
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
        dataIndex: 'created_at',
        key:'created_at'
      },
      {
        title: '更新时间',
        dataIndex: 'updated_at',
        key:'update_at'
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
      expand: false,
      form: this.$form.createForm(this, { name: 'advanced_search' }),
    };
  },
  
  beforeMount(current,pageSize){
    this.listFilePage(1,10);
  }
  
}
</script>
<style scoped>
.ant-advanced-search-form {
  padding: 18px;
  background: #fbfbfb;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
}

.ant-advanced-search-form .ant-form-item {
  display: flex;
}

.ant-advanced-search-form .ant-form-item-control-wrapper {
  flex: 1;
}
.pagination-bar{
  float: right;
}
.add-file-btn{
  float: left;
}

</style>
