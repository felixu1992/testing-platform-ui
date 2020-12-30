<template>
  <div class="add-contacts" style="padding:30px">
    <a-card title="新增联系人" style="width: 100%">
      名  称：
      <a-input placeholder="请输入联系人名称" v-model="name" style="width: 10%"/>
      <br/>
      邮  箱：
      <a-input placeholder="请输入联系人邮箱" v-model="email" style="width: 10%"/>
      <br/>
      手  机：
      <a-input placeholder="请输入联系人手机" v-model="phone" style="width: 10%"/>
      <br/>
      分  组：
      <a-select default-value="--请选择--" style="width: 120px" @change="value => chooseGroup(value)">
        <a-select-option v-for="group in groups" :value="group.id">
          {{ group.name }}
        </a-select-option>
      </a-select>
      <br/>
      <a-button type="primary" @click="createContactor">
        确定
      </a-button>
    </a-card>
  </div>
</template>

<script>
export default {
  name: "AddContacts",
  beforeMount() {
    this.getGroups()
  },
  data() {
    return {
      name: '',
      email: '',
      phone: '',
      groupId: '',
      groups: []
    }
  },
  methods: {
    getGroups: function () {
      this.request.get('/contactor/group/', {
        page: 1,
        page_size: 999
      }, (data => {
        this.groups = data.records;
      }));
    },
    chooseGroup: function (groupId) {
      this.groupId = groupId
    },
    createContactor: function () {
      this.request.post('/contactor/', {
        name: this.name,
        email: this.email,
        phone: this.phone,
        group_id: this.groupId
      }, (data => {
        this.routeTo('/contacts')
      }))
    }
  }
}
</script>

<style scoped>

</style>
