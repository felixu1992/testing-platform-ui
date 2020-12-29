<template>
  <div class="files">
    <a-table :columns="columns" :data-source="data">
  </a-table>
    <router-view/>
  </div>
</template>

<script>
const columns = [
  {
    title:'id',
    dataIndex: 'id',
  },
  {
    title: '文件路径',
    dataIndex: 'path'
  },
  {
    title: '文件描述',
    dataIndex: 'remark'
  },
  {
    title: '分组id',
    dataIndex: 'group_id'
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
    title: '操作'
  }
];
const data = [];
export default {
  name: 'Files',
  components: {
  },
  data() {
    return {
      data,
      columns,
    };
  },
  methods:{
    listFilePage(current,pageSize){
      this.request.get('/file/',{current:current,pageSize:pageSize}, data => {
        // console.log(data);
        let records = data.records;
        for(let i = 0; i < records.length; i++){
          this.data.push(records[i])
        }
      });
    }
  },
  beforeMount(current,pageSize){
    this.listFilePage(1,10);
  }
  
}
</script>
<style scoped>

</style>
