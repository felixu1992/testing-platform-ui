<template>
  <div class="home" style="background: #ECECEC; padding: 30px; height: 100%">
<!--    <iframe src="https://blogs.felixu.top/testing-platform/" width="100%" height="100%"></iframe>-->
    <a-collapse default-active-key="3" :bordered="false">
      <a-collapse-panel key="1" header="数据统计">
        <a-row :gutter="16">
          <a-card>
            <a-col :span="8">
              <a-statistic title="项目数" :value="17" style="margin-right: 50px" />
            </a-col>
            <a-col :span="8">
              <a-statistic title="接口数" :value="18243" class="demo-class" />
            </a-col>
            <a-col :span="8">
              <a-statistic title="记录数" :value="31" class="demo-class" />
            </a-col>
          </a-card>
        </a-row>
        <a-row :gutter="16">
          <a-card>
            <a-form class="abc" :form="form">
              <a-col :span="12">
                <a-form-item :label="`选择项目: `">
                  <a-select style="width: 20%" @change="value => value"
                            v-decorator="[
                    'group_id',
                    { rules: [{
                        required: true, message: '文件分组不可为空！' }
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
              </a-col>
            </a-form>
            <a-col :span="16" style="height: 400px">
              <div id="echarts1" style="width: 100%; height: 100%"></div>
            </a-col>
            <a-col :span="8" style="height: 400px">
              <div id="echarts2" style="width: 100%; height: 100%"></div>
            </a-col>
          </a-card>
        </a-row>
        <a-row :gutter="16">
          <a-card>
            <a-form class="abc" :form="form">
              <a-col :span="12">
                <a-form-item :label="`排序方式: `">
                  <a-select style="width: 20%" @change="value => value"
                            v-decorator="[
                      'group_id',
                      { rules: [{
                          required: true, message: '文件分组不可为空！' }
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
              </a-col>
              <a-col :span="12">
                <a-form-item :label="`时间范围: `">
                  <a-range-picker>
                    <template slot="dateRender" slot-scope="current">
                      <div class="ant-calendar-date" :style="getCurrentStyle(current)">
                        {{ current.date() }}
                      </div>
                    </template>
                  </a-range-picker>
                </a-form-item>
              </a-col>
            </a-form>
            <a-col :span="24">
              <a-table :columns="columns" :data-source="data" :pagination="false" />
            </a-col>
          </a-card>
        </a-row>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="使用指南" :disabled="false">
        <a-row :gutter="16">
          <mavon-editor class="md" :value="used"
                        :subfield = "prop.subfield"
                        :defaultOpen = "prop.defaultOpen"
                        :toolbarsFlag = "prop.toolbarsFlag"
                        :editable="prop.editable"
                        :scrollStyle="prop.scrollStyle"
          />
        </a-row>
      </a-collapse-panel>
      <a-collapse-panel key="3" header="项目说明">
        <a-row :gutter="16">
          <mavon-editor class="md" :value="desc"
                        :subfield = "prop.subfield"
                        :defaultOpen = "prop.defaultOpen"
                        :toolbarsFlag = "prop.toolbarsFlag"
                        :editable="prop.editable"
                        :scrollStyle="prop.scrollStyle"
          />
        </a-row>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
// @ is an alias to /src
import TopNav from '../common/top-nav/TopNav'

const columns = [
  {
    title: '排名',
    dataIndex: 'name',
    key: 'name',
    align: 'center'
  },
  {
    title: '项目名',
    dataIndex: 'name',
    key: 'name',
    align: 'center'
  },
  {
    title: '用例数量',
    dataIndex: 'name',
    key: 'name',
    align: 'center'
  },
  {
    title: '成功数',
    dataIndex: 'name',
    key: 'name',
    align: 'center'
  },
  {
    title: '失败数',
    dataIndex: 'name',
    key: 'name',
    align: 'center'
  },
  {
    title: '忽略数',
    dataIndex: 'name',
    key: 'name',
    align: 'center'
  },
  {
    title: '成功率',
    dataIndex: 'name',
    key: 'name',
    align: 'center'
  },
  {
    title: '覆盖率',
    dataIndex: 'name',
    key: 'name',
    align: 'center'
  },
];

export default {
  name: 'Home',
  components: {TopNav},
  beforeCreate() {
    this.form = this.$form.createForm(this, {name: 'form'});
  },
  data() {
    return {
      columns,
      used: '# 菜单说明\n' +
          '\n' +
          '- 联系人：联系人主要用于后续在执行接口用例之后，通过联系人的相关联系方式完成通知操作\n' +
          '- 文件：对于接口中需要使用到的文件，需要提前上传，在使用时选择\n' +
          '- 项目：用于管理项目，以及项目下对应的接口用例\n' +
          '- 测试记录：项目执行接口用例后，会产生接口用例记录，点击详情可以查看具体的执行情况\n' +
          '\n' +
          '# 使用方法\n' +
          '\n' +
          '- step1：新建接口开发者作为联系人(如果需要使用通知的话)\n' +
          '- step2：新建并上传文件(如果接口有需要上传文件的话)\n' +
          '- step3：创建项目，可以选择设置项目的请求地址和请求头，如果用例没有设置请求地址则使用项目设置的，否则使用用例自身的，用例实际请求头为项目加上用例自身设置的，打开通知，在完成用例测试时，如果存在失败的，将会通知对应的开发者\n' +
          '- step4：创建用例，这里重点介绍参数注入、预期结果、结果示例、延迟时长、运行\n' +
          '  - 参数注入：为执行参数中注入一个`key`和`value`，`key`是注入到参数中的步骤，`value`为注入的值，它一定来源于某个接口的返回值，如：`key`为`key1 > key2`，`value`为`data > id`意为在执行用例时，将该条所依赖的用例的放回结果`data`下的`id`字段注入到请求参数的`key1`下`key2`的属性中\n' +
          '  - 预期结果：预期字段为用例返回后需要校验的字段名，预期值可以选择固定值或者某个接口的返回值，当请求完成后，会去找到返回结果中指定的预期字段的值，与所填的固定值或者依赖接口该值做对比，用例校验该用例是否符合预期\n' +
          '  - 结果示例：`JSON`类型，为该接口的返回示例，如果有其他接口需要依赖该接口，则必须填充此字段，否则无法被选到\n' +
          '  - 延迟时长：执行该接口前延迟的时长，默认为`0`即不延迟\n' +
          '  - 运行：在执行项目用例时，可能部分用例不需要执行，则可以通过关闭运行来完成，默认开启\n' +
          '- step5：查看用例记录，用例记录只有在执行项目时，才会产生，会记录当前项目执行的概况，详情会展示每条用例执行的具体情况和执行接口以提供参考',
      desc: '# 项目说明\n' +
          '\n' +
          '- 适用对象：开发者、测试工程师\n' +
          '- 用途：用于完成对项目中的接口进行组合，完成对接口的验证\n' +
          '- 背景：为了解决原来开发的`Python + Excel`的接口自动化测试工具存在的部分痛点\n' +
          '\n' +
          '# 技术栈\n' +
          '\n' +
          '- Django\n' +
          '- Mysql\n' +
          '- Redis\n' +
          '- Vue\n' +
          '\n' +
          '后端采用`Python`的`Django`框架进行实现，前端采用`Vue`实现\n' +
          '\n' +
          '# 更新日志\n' +
          '\n' +
          '## 1.0.0\n' +
          '\n' +
          '第一个版本，主要完成对原接口自动化工具的最小改造，可以通过页面管理用例，执行用例，管理结果\n' +
          '\n' +
          '- **feature**\n' +
          '  1. 完成联系人管理\n' +
          '  2. 完成文件管理\n' +
          '  3. 完成项目管理和用例管理\n' +
          '  4. 完成测试记录管理\n' +
          '\n' +
          '# TODO\n' +
          '\n' +
          '- [ ] 完成首页数据统计功能\n' +
          '- [ ] 支持用例的导出与导入\n' +
          '- [ ] 支持执行结果的导出\n' +
          '- [ ] 支持`swagger`导入接口\n' +
          '- [ ] 支持接口覆盖率统计\n' +
          '- [ ] 增加后台管理，管理用户，即类似租户\n' +
          '- [ ] 待续。。。'
    };
  },
  methods:{
    getCurrentStyle(current, today) {
      const style = {};
      if (current.date() === 1) {
        style.border = '1px solid #1890ff';
        style.borderRadius = '50%';
      }
      return style;
    },
    drawLine1() {
      // 基于准备好的dom，初始化echarts实例
      let myChart = window.echarts.init(document.getElementById('echarts1'))
      // 绘制图表
      myChart.setOption({
        title: {
          text: '用例数量走势'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['执行成功', '执行失败', '忽略执行', '接口总数']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {
              show: false
            }
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '忽略执行',
            type: 'line',
            smooth: true,
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '执行失败',
            type: 'line',
            stack: '总量',
            smooth: true,
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '执行成功',
            type: 'line',
            stack: '总量',
            smooth: true,
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: '接口总数',
            type: 'line',
            stack: '总量',
            smooth: true,
            data: [320, 332, 301, 334, 390, 330, 320]
          }
        ]
      });
    },
    drawLine2() {
      // 基于准备好的dom，初始化echarts实例
      let myChart2 = window.echarts.init(document.getElementById('echarts2'))
      // 绘制图表
      myChart2.setOption({
        title: {
          text: '用例执行结果占比',
          left: 'center'
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['执行成功', '执行失败', '忽略执行']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              {value: 335, name: '执行成功'},
              {value: 310, name: '执行失败'},
              {value: 234, name: '忽略执行'}
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      });
    }
  },
  mounted() {
    this.drawLine1();
    this.drawLine2();
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
@import 'home.css';
</style>
