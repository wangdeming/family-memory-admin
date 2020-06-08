<!--
 * @des:文章列表
 * @date: 2020-03-03 15:02
 * @version:1.0
 *
 * Date                   Author               Description
 * ------------------------------------------------------
 * 2020-03-03            wangdm                  创建
 -->
<template>
    <page-view>
        <a-card :bordered="false" title="文章列表" :style="{ height: '100%' }">
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
                                placeholder="输入标题、作者ID和昵称的关键词" />
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
                                <a-select-option value="0">不限</a-select-option>
                                <a-select-option value="2">已发布</a-select-option>
                                <a-select-option value="1">未发布</a-select-option>
                                <a-select-option value="3">下架</a-select-option>
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
                    :pagination="pagination"
                    change="change"
                >
                    <span slot="artilceTitle" slot-scope="text">
                        <ellipsis :length="10" tooltip>{{ text }}</ellipsis>
                    </span>
                    <span slot="status" slot-scope="text">
                        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
                    </span>
                    <span slot="action" slot-scope="text, record">
                        <a @click="openDetail(record.id)" style="margin-right: 10px;">详情</a>
                        <a @click="rmuser(record.id)" v-if="record.status!==3">强制下架</a>
                    </span>
                </s-table>
            </a-col>
        </a-card>
        <article-detail :visible.sync="detailVisiable" :articleId="articleId"></article-detail>
    </page-view>
</template>

<script>
    import { PageView } from '@/layouts'
    import ACol from 'ant-design-vue/es/grid/Col'
    import { STable, Ellipsis } from '@/components'
    import ArticleDetail from './ArticleDetail'
    import { getArticles, unPublishArticle } from '@/api/article'

    // 用于文章状态过滤器
    const statusMap = {
        1: {
            status: 'default',
            text: '未发布'
        },
        2: {
            status: 'processing',
            text: '已发布'
        },
        3: {
            status: 'error',
            text: '下架'
        }
    }
    var pageSize = 5
    var modal
    export default {
        name: 'Managearticle',
        components: {
            ACol,
            PageView,
            STable,
            Ellipsis,
            ArticleDetail
        },
        data() {
            return {
                detailVisiable: false, // 是否显示文字详情modal
                articleId: null, // 文章ID
                pagination: {
                    pageSizeOptions: ['5', '10', '15', '20'], // pageSize选择
                    showSizeChanger: true,
                    showQuickJumper: true, // 显示跳到某一页
                    showTotal: (total, range) => `共 ${total} 条记录 第${Math.ceil(range[0] / pageSize)} / ${Math.ceil(total / pageSize)} 页`
                },
                columns: [
                    {
                        title: '序号',
                        dataIndex: 'num'
                    },
                    {
                        title: '标题',
                        dataIndex: 'title',
                        scopedSlots: { customRender: 'artilceTitle' }
                    },
                    {
                        title: '作者ID',
                        dataIndex: 'authorDisplayId'
                    },
                    {
                        title: '昵称',
                        dataIndex: 'authorName'
                    },
                    {
                        title: '创建时间',
                        dataIndex: 'createTime',
                        sorter: true
                    },
                    {
                        title: '评论数',
                        dataIndex: 'commentCount',
                        sorter: true
                    },
                    {
                        title: '点赞数',
                        dataIndex: 'likeCount',
                        sorter: true
                    },
                    {
                        title: '收藏数',
                        dataIndex: 'favoriteCount',
                        sorter: true
                    },
                    {
                        title: '阅读数',
                        dataIndex: 'readCount',
                        sorter: true
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
                textAreaValue: '',
                // 查询条件参数
                queryParam: { status: '0' },
                // 加载数据方法 必须为 Promise 对象
                loadData: parameter => {
                    return getArticles(Object.assign(parameter, this.queryParam)).then((res) => {
                        var result = res.data
                        pageSize = result.pageSize
                        for (let i = 0; i < result.data.length; i++) {
                            const no = (result.pageNo - 1) * result.pageSize + i + 1
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
            // 显示用户详情modal
            openDetail(id) {
                this.detailVisiable = true
                this.articleId = id
            },
            // 点击强制下架按钮
            rmuser(id) {
                modal = this.$confirm({
                    title: '强制下架',
                    content: (
                        <div>
                            <p style='color: rgb(235,58,53);'>强制下架后，所有用户将无法查看这篇文章，此操作不可逆，请谨慎操作。</p>
                            <div>
                                <label style='float: left;'>备注：</label>
                                <textArea id='remark' placeholder='必填，最多30个字' style='border: 1px solid #ccc;border-radius: 4px;outline: none;resize: none;height: 100px;width: 250px;'></textArea>
                            </div>
                            <div id='errorMsg' style='color:red;margin-left:40px;display:none;'><a-icon type='close-circle'style='margin-right:5px;' />请输入下架原因,且长度不能超过30</div>
                        </div>
                    ),
                    okText: '确定',
                    okType: 'primary',
                    cancelText: '取消',
                    icon: 'close-circle',
                    onOk: (resolve) => {
                        if (document.getElementById('remark').value.replace(/[ ]/g, '').replace(/[\n]/g, '').length === 0 || document.getElementById('remark').value.length > 30) {
                            document.getElementById('errorMsg').style.display = 'block'
                        } else {
                            document.getElementById('errorMsg').style.display = 'none'
                            unPublishArticle(id, document.getElementById('remark').value).then((res) => {
                                if (res.status === 200) {
                                    this.$message.success('文章下架成功')
                                    modal.destroy()
                                    this.$refs.table.refresh()
                                } else {
                                    this.$message.info(res.message)
                                    modal.destroy()
                                }
                            })
                        }
                    },
                    onCancel: () => {
                    }
                })
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
