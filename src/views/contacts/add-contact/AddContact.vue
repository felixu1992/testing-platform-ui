<template>
  <div class="add-contact" style="padding:30px">
    <a-card title="新增联系人">
      <a-form
          id="add-contact-form"
          :form="form"
          class="contact-form"
          @submit="handleSubmit"
      >
        <a-form-item>
          名  称：
          <a-input class="contact-name" style="width: 10%"
                   v-decorator="[
          'name',
          { rules: [{ required: true, message: '联系人名称不可为空！' }] },
        ]"
                   placeholder="请输入联系人名称"
          >
          </a-input>
        </a-form-item>
        <a-form-item>
          邮  箱：
          <a-input class="contact-email" style="width: 10%"
                   v-decorator="[
          'email',
          { rules: [{ required: true, message: '联系人邮箱不可为空！' }] },
        ]"
                   placeholder="请输入联系人邮箱"
          >
          </a-input>
        </a-form-item>
        <a-form-item>
          手  机：
          <a-input class="contact-phone" style="width: 10%"
                   v-decorator="[
          'phone',
          { rules: [{ required: true, message: '联系人手机不可为空！' }] },
        ]"
                   placeholder="请输入联系人手机"
          >
          </a-input>
        </a-form-item>
        <a-form-item>
          分  组：
          <a-select style="width: 120px" @change="value => value"
                    v-decorator="[
                      'group_id',
                      { rules: [{
                          required: true, message: '联系人分组不可为空！' }
                        ],
                      initialValue: '--请选择--'
                      }
                    ]"
          >
            <a-select-option v-for="group in groups" :value="group.id">
              {{ group.name }}
            </a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" class="contact-form-button">
            确 定
          </a-button>
          <a-divider type="vertical"/>
          <a-button class="contact-form-cancel-button" @click="$router.push('/contact')">
            取消
          </a-button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>
export default {
  name: "AddContact",
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'add-contact'});
  },
  beforeMount() {
    this.getGroups()
  },
  data() {
    return {
      name: '',
      email: '',
      phone: '',
      groupId: '',
      groups: [],
    }
  },
  methods: {
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          this.createContactor(values)
        }
      });
    },
    getGroups: function () {
      this.request.get('/contactor/group/', {
        page: 1,
        page_size: 999
      }, (data => {
        this.groups = data.records;
      }));
    },
    createContactor: function (params) {
      this.request.post('/contactor/', params, (data => {
        this.$router.push('/contact');
      }))
    },
  }
}
</script>

<style scoped>
@import "add-contact.css";
</style>
