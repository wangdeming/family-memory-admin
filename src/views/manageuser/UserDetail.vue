<!--
 * @des:用户详情
 * @date: 2020-03-03 14:45
 * @version:1.0
 *
 * Date                   Author               Description
 * ------------------------------------------------------
 * 2020-03-03            wangdm                  创建
 -->
<template>
    <page-view>
        <detail-list slot="headerContent" size="large" :col="3" class="detail-layout">
            <detail-list-item term="昵称">{{ record.name }}</detail-list-item>
            <detail-list-item term="ID">{{ record.displayId }}</detail-list-item>
            <detail-list-item term="头像"><a-avatar :src="record.avatarUrl" /></detail-list-item>
            <detail-list-item term="状态">{{ record.status===1?'正常':'冻结' }}</detail-list-item>
            <detail-list-item term="手机号码">{{ record.phoneNumber }}</detail-list-item>
            <detail-list-item term="注册时间">{{ record.createTime }}</detail-list-item>
        </detail-list>
        <detail-list slot="headerContent" size="large" :col="1">
            <detail-list-item term="个性签名">{{record.signature}}</detail-list-item>
        </detail-list>
        <a-col :sm="24" :lg="24">
            <a-col :sm="12" :lg="8">
                <div class="num_card_item">
                    <a-avatar src="/headIcon.png" class="item_avatar"/>
                    <div class="item_div">
                        <span class="item_div_title">关注</span>
                        <span class="item_div_info">{{ record.followCount | numFormat }}</span>
                    </div>
                </div>
            </a-col>
            <a-col :sm="12" :lg="8">
                <div class="num_card_item">
                    <a-avatar src="/headIcon.png" class="item_avatar"/>
                    <div class="item_div">
                        <span class="item_div_title">粉丝</span>
                        <span class="item_div_info">{{ record.fanCount | numFormat }}</span>
                    </div>
                </div>
            </a-col>
            <a-col :sm="12" :lg="8">
                <div class="num_card_item">
                    <a-avatar src="/headIcon.png" class="item_avatar"/>
                    <div class="item_div">
                        <span class="item_div_title">家庭</span>
                        <span class="item_div_info">{{ record.familyCount | numFormat }}</span>
                    </div>
                </div>
            </a-col>
        </a-col>
        <a-col  :sm="24" :lg="24">
            <a-col :sm="12" :lg="8">
                <div class="num_card_item" style="margin-top: 30px;">
                    <a-avatar src="/headIcon.png" class="item_avatar"/>
                    <div class="item_div">
                        <span class="item_div_title">文章</span>
                        <span class="item_div_info">{{ record.articleCount | numFormat }}</span>
                    </div>
                </div>
            </a-col>
            <a-col :sm="12" :lg="8">
                <div class="num_card_item" style="margin-top: 30px;">
                    <a-avatar src="/headIcon.png" class="item_avatar"/>
                    <div class="item_div">
                        <span class="item_div_title">收藏</span>
                        <span class="item_div_info">{{ record.favoriteCount | numFormat }}</span>
                    </div>
                </div>
            </a-col>
        </a-col>
    </page-view>
</template>

<script>
    import { PageView } from '@/layouts'
    import DetailList from '@/components/tools/DetailList'
    import ACol from 'ant-design-vue/es/grid/Col'
    import { getUserDetail } from '@/api/user'
    const DetailListItem = DetailList.Item
    export default {
        name: 'UserDetail',
        components: {
            ACol,
            PageView,
            DetailList,
            DetailListItem
        },
        // 在vue对象存活的情况下，进入当前存在activated()函数的页面时，一进入页面就触发；可用于初始化页面数据等
        activated() {
            this.displayId = sessionStorage.getItem('displayId')
            getUserDetail(this.displayId).then(res => {
                if (res.status === 200) {
                    this.record = res.data
                } else {
                    this.$message.info(res.message)
                }
            })
        },
        data() {
            return {
                displayId: sessionStorage.getItem('displayId'), // 获取用户详情信息
                record: {},
                casToken: sessionStorage.getItem('casToken') // 登录时保存的casToken，修改密码时需上传的cas_sid
            }
        },
        created() {
            if (!sessionStorage.getItem('SET_CASTOKEN')) {
                this.$router.push({ name: 'index' })
            }
        },
        // 数值逢3一断过滤器
        filters: {
            numFormat(value) {
                if (!value) {
                    return '0'
                }
                var intPart = Number(value).toFixed(0) // 获取整数部分
                var intPartFormat = intPart.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') // 将整数部分逢三一断
                return intPartFormat
            }
        }
    }
</script>

<style lang="less" scoped>
    .num_card_item {
        width: 300px;
        height: 100px;
        float: left;
        border: 1px solid #ccc;
        background: white;
        margin-right: 80px;
        position: relative;
        .item_avatar {
            width: 60px;
            height: 60px;
            position: absolute;
            top: 20px;
            left: 20px;
        }
        .item_div {
            position: absolute;
            top: 20px;
            left: 100px;
            width: 100px;
            height: 60px;
            .item_div_title {
                display: inline-block;
                width: 100%;
                height: 20px;
                line-height: 20px;
                color: rgb(151,151,151);
                font-size: 16px;
            }
            .item_div_info {
                display: inline-block;
                width: 100%;
                height: 40px;
                line-height: 40px;
                color: #000;
                font-size: 32px;
            }
        }
    }
</style>
