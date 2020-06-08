<!--
 * @des:数据统计
 * @date: 2020-03-03 14:32
 * @version:1.0
 *
 * Date                   Author               Description
 * ------------------------------------------------------
 * 2020-03-03            wangdm                  创建
 -->
<template>
    <page-view>
        <a-card :bordered="false" title="用户分析" :style="{ height: '100%' }">
            <a-col :sm="12" :md="8" :xl="4">
                <number-info :total="userAmount" style="margin-bottom: 40px;">
                    <span slot="subtitle">
                        <span>累计用户数量</span>
                    </span>
                </number-info>
                <number-info :total="userAddNum" :sub-total="userGrade" :status="userStatus" desc="较昨日">
                    <span slot="subtitle">
                        <span>今日新增用户数</span>
                    </span>
                </number-info>
            </a-col>
            <a-col :sm="24" :md="24" :xl="20">
                <div style="height: 32px;">
                    <h4 class="extra-title">用户增长趋势图</h4>
                    <div class="extra-wrapper">
                        <a @click="chartWeekBtnClick()" :class="chartWeekBtnActive ? 'active' : ''">近7天</a>
                        <a @click="chartMonthBtnClick()" :class="chartMonthBtnActive ? 'active' : ''">近30天</a>
                        <a-range-picker
                            :disabledDate="disabledDate"
                            :defaultValue="[moment().startOf('day').subtract(6,'days'), moment().endOf('day')]"
                            :value="dateValue===undefined ? null : dateValue"
                            @change="onChange"
                            :style="{width: '256px'}" />
                    </div>
                </div>
                <!-- 创建图表容器 -->
                <div id="container"></div>
            </a-col>
        </a-card>
        <a-card :bordered="false" title="文章分析" :style="{ height: '100%' }">
            <a-col :sm="12" :md="8" :xl="4">
                <number-info :total="articleAmount" style="margin-bottom: 40px;">
                    <span slot="subtitle">
                        <span>累计文章数量</span>
                    </span>
                </number-info>
                <number-info :total="articleAddNum" :sub-total="articleGrade" :status="articleStatus" desc="较昨日">
                    <span slot="subtitle">
                        <span>今日新增文章数</span>
                    </span>
                </number-info>
            </a-col>
            <a-col :sm="24" :md="24" :xl="20">
                <div style="height: 32px;">
                    <h4 class="extra-title">文章发布趋势图</h4>
                    <div class="extra-wrapper">
                        <a @click="chart1WeekBtnClick()" :class="chart1WeekBtnActive ? 'active' : ''">近7天</a>
                        <a @click="chart1MonthBtnClick()" :class="chart1MonthBtnActive ? 'active' : ''">近30天</a>
                        <a-range-picker
                            :disabledDate="disabledDate"
                            :defaultValue="[moment().startOf('day').subtract(6,'days'), moment().endOf('day')]"
                            :value="dateValue1===undefined ? null : dateValue1"
                            @change="onChange1"
                            :style="{width: '256px'}" />
                    </div>
                </div>
                <!-- 创建图表容器 -->
                <div id="container1" style="width: 100%;"></div>
            </a-col>
        </a-card>
    </page-view>
</template>

<script>
    import { PageView } from '@/layouts'
    import { NumberInfo } from '@/components'
    import ACol from 'ant-design-vue/es/grid/Col'
    import G2 from '@antv/g2'
    import moment from 'moment'
    import { getStatisticsUsersToday, getStatisticsArticlesToday, getStatisticsUsers, getStatisticsArticles } from '@/api/statistics'

    var userChart
    var articleChart
    export default {
        name: 'Statistics',
        components: {
            ACol,
            PageView,
            NumberInfo
        },
        data() {
            return {
                casToken: sessionStorage.getItem('casToken'), // 登录时保存的casToken，修改密码时需上传的cas_sid
                userAmount: 0, // 累计用户量
                userAddNum: 0, // 今日新增用户数
                userGrade: '-', // 较昨日新增比例
                userStatus: '', // 用户新增比例为正或为负，为正-up,为负-down
                articleAmount: 0, // 累计文章数
                articleAddNum: 0, // 今日新增文章数
                articleGrade: '-', // 较昨日新增比例
                articleStatus: '', // 用户新增比例为正或为负，为正-up,为负-down
                chartWeekBtnActive: true, // 用户近七天按钮是否点击状态
                chartMonthBtnActive: false, // 用户近30天按钮是否点击状态
                chart1WeekBtnActive: true, // 文章近七天按钮是否点击状态
                chart1MonthBtnActive: false, // 文章近30天按钮是否点击状态
                dateFormat: 'YYYY/MM/DD', // 日期格式
                dateValue: [moment().startOf('day').subtract(6, 'days'), moment().endOf('day')], // 用户选择日期
                dateValue1: [moment().startOf('day').subtract(6, 'days'), moment().endOf('day')], // 文章选择日期
                chartData: [], // 用户数据
                chartData1: [] // 文章数据
            }
        },
        created() {
            if (!sessionStorage.getItem('SET_CASTOKEN')) {
                this.$router.push({ name: 'index' })
            } else {
                this.getUsersToday()
                this.getArticlesToday()
                this.getUsers()
                this.getArticles()
            }
        },
        methods: {
            moment,
            // 获取用户今日数据
            getUsersToday() {
                getStatisticsUsersToday().then(res => {
                    if (res.status === 200) {
                        this.userAmount = res.data.totalQuantity
                        this.userAddNum = res.data.newQuantity
                        if (typeof (res.data.riseRate) === 'undefined' || res.data.riseRate === 0) {
                            this.userGrade = '-'
                            this.userStatus = ''
                        } else {
                            this.userGrade = Math.abs(res.data.riseRate * 100).toFixed(2) + '%'
                            if (res.data.riseRate < 0) {
                                this.userStatus = 'down'
                            } else {
                                this.userStatus = 'up'
                            }
                        }
                    } else {
                        this.$message.info(res.message)
                    }
                })
            },
            // 获取文章今日数据
            getArticlesToday() {
                getStatisticsArticlesToday().then(res => {
                    if (res.status === 200) {
                        this.articleAmount = res.data.totalQuantity
                        this.articleAddNum = res.data.newQuantity
                        if (typeof (res.data.riseRate) === 'undefined' || res.data.riseRate === 0) {
                            this.userGrade = '-'
                            this.userStatus = ''
                        } else {
                            this.articleGrade = Math.abs(res.data.riseRate * 100).toFixed(2) + '%'
                            if (res.data.riseRate < 0) {
                                this.articleStatus = 'down'
                            } else {
                                this.articleStatus = 'up'
                            }
                        }
                    } else {
                        this.$message.info(res.message)
                    }
                })
            },
            // 获取用户选择日期内数据
            getUsers() {
                getStatisticsUsers({ startDate: this.dateValue[0].format('YYYY-MM-DD'), endDate: this.dateValue[1].format('YYYY-MM-DD') }).then(res => {
                    if (res.status === 200) {
                        this.chartData = res.data
                        userChart.changeData(this.chartData)
                    } else {
                        this.$message.info(res.message)
                    }
                })
            },
            // 获取文章选择日期内数据
            getArticles() {
                getStatisticsArticles({ startDate: this.dateValue1[0].format('YYYY-MM-DD'), endDate: this.dateValue1[1].format('YYYY-MM-DD') }).then(res => {
                    if (res.status === 200) {
                        this.chartData1 = res.data
                        articleChart.changeData(this.chartData1)
                    } else {
                        this.$message.info(res.message)
                    }
                })
            },
            // 不可选日期
            disabledDate(current) {
                // 不能选中今天之后的日期
                return current > moment().endOf('day')
            },
            // 用户日期选择事件
            onChange(date, dateString) {
                // 监听range-picker选择日期事件
                this.dateValue = date
                this.getUsers()
                this.chartWeekBtnActive = false
                this.chartMonthBtnActive = false
            },
            // 文章选择日期事件
            onChange1(date, dateString) {
                // 监听range-picker选择日期事件
                this.dateValue1 = date
                this.getArticles()
                this.chart1WeekBtnActive = false
                this.chart1MonthBtnActive = false
            },
            // 用户近7日按钮点击事件
            chartWeekBtnClick() {
                // 用户模块近7天按钮点击事件
                if (!this.chartWeekBtnActive) {
                    this.chartWeekBtnActive = true
                    this.chartMonthBtnActive = false
                    this.dateValue = [moment().startOf('day').subtract(6, 'days'), moment().endOf('day')]
                    this.getUsers()
                }
            },
            // 用户近30日按钮点击事件
            chartMonthBtnClick() {
                // 用户模块近30天按钮点击事件
                if (!this.chartMonthBtnActive) {
                    this.chartMonthBtnActive = true
                    this.chartWeekBtnActive = false
                    this.dateValue = [moment().startOf('day').subtract(30, 'days'), moment().endOf('day')]
                    this.getUsers()
                }
            },
            // 文章近7日按钮点击事件
            chart1WeekBtnClick() {
                // 文章模块近7天按钮点击事件
                if (!this.chart1WeekBtnActive) {
                    this.chart1WeekBtnActive = true
                    this.chart1MonthBtnActive = false
                    this.dateValue1 = [moment().startOf('day').subtract(6, 'days'), moment().endOf('day')]
                    this.getArticles()
                }
            },
            // 文章近30日按钮点击事件
            chart1MonthBtnClick() {
                // 文章模块近30天按钮点击事件
                if (!this.chart1MonthBtnActive) {
                    this.chart1MonthBtnActive = true
                    this.chart1WeekBtnActive = false
                    this.dateValue1 = [moment().startOf('day').subtract(30, 'days'), moment().endOf('day')]
                    this.getArticles()
                }
            },
            // 创建用户G2表格
            initChartUser(data) {
                // 创建G2表格
                userChart = new G2.Chart({
                    container: 'container',
                    forceFit: true, // 自适应宽度
                    height: 300
                })
                userChart.changeData(data) // 数据来源
                userChart.scale('date', {
                    range: [0, 1],
                    tickCount: 10,
                    type: 'timeCat',
                    mask: 'MM-DD'
                })
                userChart.scale('newCount', {
                    alias: '新增用户数'
                })
                userChart.tooltip({
                    crosshairs: {
                        type: 'line'
                    }
                })
                userChart.area().position('date*newCount').color('#2F85FF').style({
                    fillOpacity: 0.2
                }).shape('smooth')
                userChart.line().position('date*newCount').color('#2F85FF').size(2).shape('smooth')
                userChart.render()
            },
            // 创建文章G2表格
            initChartArticle(data) {
                // 创建G2表格
                articleChart = new G2.Chart({
                    container: 'container1',
                    forceFit: true, // 自适应宽度
                    height: 300
                })
                articleChart.changeData(data) // 数据来源
                articleChart.scale('date', {
                    range: [0, 1],
                    tickCount: 10,
                    type: 'timeCat',
                    mask: 'MM-DD'
                })
                articleChart.scale('newCount', {
                    alias: '新增文章数'
                })
                articleChart.tooltip({
                    crosshairs: {
                        type: 'line'
                    }
                })
                articleChart.area().position('date*newCount').color('#2F85FF').style({
                    fillOpacity: 0.2
                }).shape('smooth')
                articleChart.line().position('date*newCount').color('#2F85FF').size(2).shape('smooth')
                articleChart.render()
            }
        },
        mounted() {
            this.initChartUser(this.chartData)
            this.initChartArticle(this.chartData1)
            // 解决canvas 溢出问题
            const e = document.createEvent('Event')
            e.initEvent('resize', true, true)
            window.dispatchEvent(e)
        }
    }
</script>

<style lang="less" scoped>
    .extra-title {
        float: left;
        line-height: 32px;
    }
    .extra-wrapper {
        float: right;
        line-height: 32px;
        a {
            margin-left: 24px;
            color: #000;
            padding: 5px 10px;
            cursor: pointer;
            &:nth-child(2) {
                margin-right: 24px;
            }
        }
        .active {
            color: white !important;
            background-color: rgb(24,120,254) !important;
            border-radius: 4px;
        }
    }
</style>
