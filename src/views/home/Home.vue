<template>
  <div class="home" style="background: #ECECEC; padding: 30px; height: 100%">
<!--    <iframe src="https://blogs.felixu.top/testing-platform/" width="100%" height="100%"></iframe>-->
    <a-collapse default-active-key="1" :bordered="false">
      <a-collapse-panel key="1" header="项目统计">
        <a-row :gutter="16">
          <a-col :span="12">
            <a-card>
              <a-statistic
                  title="Feedback"
                  :value="11.28"
                  :precision="2"
                  suffix="%"
                  :value-style="{ color: '#3f8600' }"
                  style="margin-right: 50px"
              >
                <template #prefix>
                  <a-icon type="arrow-up" />
                </template>
              </a-statistic>
            </a-card>
          </a-col>
          <a-col :span="12">
            <a-card>
              <a-statistic
                  title="Idle"
                  :value="9.3"
                  :precision="2"
                  suffix="%"
                  class="demo-class"
                  :value-style="{ color: '#cf1322' }"
              >
                <template #prefix>
                  <a-icon type="arrow-down" />
                </template>
              </a-statistic>
            </a-card>
          </a-col>
        </a-row>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="使用指南" :disabled="false">
        <mavon-editor class="md" :value="content"
                      :subfield = "prop.subfield"
                      :defaultOpen = "prop.defaultOpen"
                      :toolbarsFlag = "prop.toolbarsFlag"
                      :editable="prop.editable"
                      :scrollStyle="prop.scrollStyle"
        />
      </a-collapse-panel>
      <a-collapse-panel key="3" header="支持一下">
        <p>{{ text }}</p>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
// @ is an alias to /src
import TopNav from '../common/top-nav/TopNav'

export default {
  name: 'Home',
  components: {TopNav},
  data() {
    return {
      text: `A dog is a type of domesticated animal. Known for its loyalty and faithfulness, it can be found as a welcome guest in many households across the world.`,
      content: '- 这是1      \n' +
          '- 这是2       ' +
          '- 这是3       ' +
          '- 这是4'
    };
  },
  methods:{
    req: function () {
      this.request.get('/contactor/group/page',(data)=>{
        console.log(data)
      });

    }
  },
  computed: {
    prop () {
      return {
        subfield: false,
        defaultOpen: 'preview',
        editable: false,
        toolbarsFlag: false,
        scrollStyle: true
      }
    }
  }
}
</script>
<style scoped>
 .home{
   /*height: 100vh;*/
 }
</style>
