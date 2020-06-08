<!--
 * @des:用户列表
 * @date: 2020-03-03 14:43
 * @version:1.0
 *
 * Date                   Author               Description
 * ------------------------------------------------------
 * 2020-03-03            wangdm                  创建
 -->
<template>
    <page-view>
        <a-card :bordered="false" title="用户列表" :style="{ height: '100%' }">
            <a-col :lg="24" :sm="24">
                <a-form>
                    <a-col :lg="24" :sm="24" style="position: relative;">
                        <a-form-item
                            label="关键词"
                            :labelCol="{lg: {span: 2}, sm: {span: 4}}"
                            :wrapperCol="{lg: {span: 6}, sm: {span: 12} }">
                            <a-input
                                v-model="queryParam.keyword"
                                name="name"
                                autocomplete="off"
                                placeholder="输入ID、昵称或手机号码的关键词" />
                            <a-button @click="handleSearch()" type="primary" style="position: absolute;top: -7px;right: -100px;">查询</a-button>
                        </a-form-item>
                    </a-col>
                    <a-col :lg="24" :sm="24">
                        <a-form-item
                            label="状态"
                            :labelCol="{lg: {span: 2}, sm: {span: 4}}"
                            :wrapperCol="{lg: {span: 6}, sm: {span: 12} }"
                        >
                            <a-select
                                v-model="queryParam.status"
                                @change="handleSearch()">
                                <a-select-option value="0">全部</a-select-option>
                                <a-select-option value="1">正常</a-select-option>
                                <a-select-option value="2">已冻结</a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-form>
            </a-col>
            <a-col :lg="24" :sm="24">
                <s-table
                    ref="table"
                    size="default"
                    :columns="columns"
                    :data="loadData"
                    showPagination="auto"
                    :pagination="pagination">
                    <span slot="description" slot-scope="text">
                        <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
                    </span>
                    <span slot="status" slot-scope="text">
                        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
                    </span>
                    <span slot="action" slot-scope="text, record">
                        <a @click="goToUserDetail(record.displayId)" style="margin-right: 10px;">
                            详情
                        </a>
                        <a @click="freeze(record.displayId)" v-if="record.status===1">冻结</a>
                        <a @click="unfreeze(record.displayId)" v-else>解冻</a>
                    </span>
                </s-table>
            </a-col>
            <router-view></router-view>
        </a-card>
    </page-view>
</template>

<script>
    import { PageView } from '@/layouts'
    import ACol from 'ant-design-vue/es/grid/Col'
    import { STable, Ellipsis } from '@/components'
    import { getUsers, freezeUser, unfreezeUser } from '@/api/user'

    // 状态对象，用在过滤器中
    const statusMap = {
        1: {
            status: 'success',
            text: '正常'
        },
        2: {
            status: 'error',
            text: '已冻结'
        }
    }
    var pageSize = 5
    export default {
        name: 'Manageuser',
        components: {
            ACol,
            PageView,
            STable,
            Ellipsis
        },
        data() {
            return {
                casToken: sessionStorage.getItem('casToken'), // 登录时保存的casToken，修改密码时需上传的cas_sid
                pagination: {
                    pageSizeOptions: ['5', '10', '15', '20'], // pageSize选择
                    showSizeChanger: true,
                    showQuickJumper: true, // 显示跳到某一页
                    showTotal: (total, range) => `共 ${total} 条记录 第${Math.ceil(range[0] / pageSize)} / ${Math.ceil(total / pageSize)} 页`
                },
                columns: [
                    {
                        title: '序号',
                        dataIndex: 'no'
                    },
                    {
                        title: 'ID',
                        dataIndex: 'displayId'
                    },
                    {
                        title: '头像',
                        dataIndex: 'avatarUrl',
                        customRender: (text, row, index) => {
                            return text ? <a-avatar src={text} /> : null
                        }
                    },
                    {
                        title: '昵称',
                        dataIndex: 'name'
                    },
                    {
                        title: '个性签名',
                        dataIndex: 'signature',
                        scopedSlots: { customRender: 'signature' }
                    },
                    {
                        title: '手机号码',
                        dataIndex: 'phoneNumber'
                    },
                    {
                        title: '状态',
                        dataIndex: 'status',
                        scopedSlots: { customRender: 'status' }
                    },
                    {
                        title: '操作',
                        width: '150px',
                        dataIndex: 'action',
                        scopedSlots: { customRender: 'action' }
                    }
                ],
                // 查询条件参数
                queryParam: { status: '0' },
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    return getUsers(Object.assign(parameter, this.queryParam)).then((res) => {
                        var result = res.data
                        pageSize = result.pageSize
                        for (let i = 0; i < result.data.length; i++) {
                            const no = (result.pageNo - 1) * result.pageSize + i + 1
                            result.data[i].no = no
                            result.data[i].key = no
                        }
                        return result
                    })
                }
            }
        },
        filters: {
            // 过滤出状态值
            statusFilter(type) {
                return statusMap[type].text
            },
            // 过滤出状态type
            statusTypeFilter(type) {
                return statusMap[type].status
            }
        },
        created() {
            if (!sessionStorage.getItem('SET_CASTOKEN')) {
                this.$router.push({ name: 'index' })
            }
        },
        methods: {
            // 冻结用户操作
            freeze(id) {
                const freezeData = { status: 2 }
                this.$confirm({
                    title: '冻结用户',
                    content: (
                        <div>
                        <p style='color: rgb(235,58,53);'>用户被冻结后将无法正常使用本应用，</p>
                        <p style='color: rgb(135,135,135);'>你还要继续吗？</p>
                        </div>
                    ),
                    okText: '继续',
                    okType: 'primary',
                    cancelText: '取消',
                    icon: 'exclamation-circle',
                    onOk: () => {
                        freezeUser(id, freezeData).then((res) => {
                            if (res.status === 200) {
                                this.$message.success('冻结用户成功')
                                this.$refs.table.refresh()
                            } else {
                                this.$message.info(res.message)
                            }
                        })
                    },
                    onCancel: () => {
                    }
                })
            },
            // 解冻用户操作
            unfreeze(id) {
                const unFreezeData = { status: 1 }
                this.$confirm({
                    title: '解冻用户',
                    content: (
                        <div>
                        <p style='color: rgb(235,58,53);'>用户被解冻后可恢复使用本应用，</p>
                        <p style='color: rgb(135,135,135);'>你还要继续吗？</p>
                        </div>
                    ),
                    okText: '继续',
                    okType: 'primary',
                    cancelText: '取消',
                    icon: 'exclamation-circle',
                    onOk: () => {
                        unfreezeUser(id, unFreezeData).then((res) => {
                            if (res.status === 200) {
                                this.$message.success('解冻用户成功')
                                this.$refs.table.refresh()
                            } else {
                                this.$message.info(res.message)
                            }
                        })
                    },
                    onCancel: () => {
                    }
                })
            },
            // 跳转到用户详情页面，并保存用户相关信息
            goToUserDetail(displayId) {
                sessionStorage.setItem('displayId', displayId)
                this.$router.push({ name: 'userdetail' })
            },
            // 查询并刷新列表
            handleSearch() {
                this.$refs.table.refresh()
            }
        }
    }
</script>

<style>
    .ant-table-pagination.ant-pagination {
        width: 100% !important;
        text-align: right !important;
    }
    .ant-pagination-total-text {
        float: left !important;
    }
</style>
