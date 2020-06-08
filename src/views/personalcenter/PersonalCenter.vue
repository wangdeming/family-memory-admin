<!--
 * @des:个人中心
 * @date: 2020-03-03 15:16
 * @version:1.0
 *
 * Date                   Author               Description
 * ------------------------------------------------------
 * 2020-03-03            wangdm                  创建
 -->
<template>
    <page-view>
        <a-card style="min-height: 500px;">
            <div style="margin: 30px 50px;width: 120px;text-align: center;">
                <a-avatar src="/avatar2.jpg" class="avatar"/>
                <h2 style="margin-top: 20px;">{{admin}}</h2>
                <a @click="changePwd()" style="margin-top: 20px;color: #1878FE;">修改密码</a>
            </div>
        </a-card>
        <change-pwd :visible.sync="modalShow" @success="changePwdSuccess"></change-pwd>
    </page-view>
</template>

<script>
    import PageView from '../../layouts/PageView'
    import ChangePwd from './ChangePwd'
    import { changePassword } from '@/api/auth'
    import Cookies from 'js-cookie'
    export default {
        name: 'Personalcenter',
        components: {
            PageView,
            ChangePwd
        },
        data() {
            return {
                admin: sessionStorage.getItem('admin'),
                modalShow: false, // 是否显示修改密码modal
                casToken: sessionStorage.getItem('casToken') // 登录时保存的casToken，修改密码时需上传的cas_sid
            }
        },
        created() {
            if (!sessionStorage.getItem('SET_CASTOKEN')) {
                this.$router.push({ name: 'index' })
            }
        },
        methods: {
            // 点击修改密码按钮，显示修改密码modal
            changePwd() {
                this.modalShow = true
            },
            // 监听修改密码modal确认修改密码事件
            changePwdSuccess(val) {
                const values = JSON.parse(val)
                Cookies.set('cas_sid', sessionStorage.getItem('casToken'))
                changePassword(values).then(response => {
                    if (response.status === 200) {
                        this.modalShow = false
                        setTimeout(() => {
                            this.$message.info('修改密码成功,请重新登录!')
                        }, 100)
                        this.$router.push({ name: 'index' })
                    } else {
                        this.$message.info(response.message)
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .avatar {
        width: 100px;
        height: 100px;
    }
</style>
