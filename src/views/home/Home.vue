<template>
  <div class="home" style="background: #ECECEC; padding: 30px; height: 100%">
<!--    <iframe src="https://blogs.felixu.top/testing-platform/" width="100%" height="100%"></iframe>-->
    <a-collapse default-active-key="1" :bordered="false">
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
          <mavon-editor class="md" :value="content"
                        :subfield = "prop.subfield"
                        :defaultOpen = "prop.defaultOpen"
                        :toolbarsFlag = "prop.toolbarsFlag"
                        :editable="prop.editable"
                        :scrollStyle="prop.scrollStyle"
          />
        </a-row>
      </a-collapse-panel>
      <a-collapse-panel key="3" header="支持一下">
        <a-row :gutter="16">
          <mavon-editor class="md" :value="content"
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
      content: '- 这是1      \n' +
          '- 这是2       ' +
          '- 这是3       ' +
          '- 这是4'
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
