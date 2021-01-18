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
          <a-form class="abc" :form="editForm">
              <a-col :span="12">
                <a-form-item :label="`名 称: `">
                  <a-input
                      placeholder="项目名称"
                      style="width: 20%"
                      v-decorator="[
                        `newName`,
                        {
                          rules: [
                            {
                              required: true, message: '分组名称不能为空'
                            },
                          ],
                        },
                      ]"
                  />
                </a-form-item>
              </a-col>
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
            </a-form>
            <a-table :columns="columns" :data-source="data" :pagination="false">
            </a-table>
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
          data: ['邮件营销', '联盟广告', '视频广告', '直接访问', '搜索引擎']
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
            name: '邮件营销',
            type: 'line',
            smooth: true,
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210]
          },
          {
            name: '联盟广告',
            type: 'line',
            stack: '总量',
            smooth: true,
            data: [220, 182, 191, 234, 290, 330, 310]
          },
          {
            name: '视频广告',
            type: 'line',
            stack: '总量',
            smooth: true,
            data: [150, 232, 201, 154, 190, 330, 410]
          },
          {
            name: '直接访问',
            type: 'line',
            stack: '总量',
            smooth: true,
            data: [320, 332, 301, 334, 390, 330, 320]
          },
          {
            name: '搜索引擎',
            type: 'line',
            stack: '总量',
            smooth: true,
            data: [820, 932, 901, 934, 1290, 1330, 1320]
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
          data: ['直接访问', '邮件营销', '联盟广告', '视频广告', '搜索引擎']
        },
        series: [
          {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: [
              {value: 335, name: '直接访问'},
              {value: 310, name: '邮件营销'},
              {value: 234, name: '联盟广告'},
              {value: 135, name: '视频广告'},
              {value: 1548, name: '搜索引擎'}
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
