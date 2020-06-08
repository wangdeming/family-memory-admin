<template>
    <div class="user-wrapper">
        <div class="content-box">
            <a-dropdown>
                <span class="action ant-dropdown-link user-dropdown-menu">
                    <a-avatar class="avatar" size="small" src="/avatar2.jpg"/>
                    <span>{{admin}}</span>
                </span>
                <a-menu slot="overlay" class="user-dropdown-menu-wrapper">
                    <a-menu-item key="0">
                        <router-link :to="{ name: 'personalcenter' }">
                            <a-icon type="user"/>
                            <span>个人中心</span>
                        </router-link>
                    </a-menu-item>
                    <a-menu-divider/>
                    <a-menu-item key="3">
                        <a href="javascript:;" @click="handleLogout">
                            <a-icon type="logout"/>
                            <span>退出登录</span>
                        </a>
                    </a-menu-item>
                </a-menu>
            </a-dropdown>
        </div>
    </div>
</template>

<script>
    import NoticeIcon from '@/components/NoticeIcon'
    import { logout } from '@/api/auth'

    export default {
        name: 'UserMenu',
        data() {
            return {
                admin: sessionStorage.getItem('admin')
            }
        },
        components: {
            NoticeIcon
        },
        methods: {
            handleLogout() {
                this.$confirm({
                    title: '提示',
                    content: '真的要注销登录吗 ?',
                    onOk: () => {
                        logout().then(response => {
                            if (response.status === 200) {
                                // 延迟 1 秒显示欢迎信息
                                setTimeout(() => {
                                    this.$message.info('注销成功,请重新登录!')
                                }, 100)
                                sessionStorage.removeItem('SET_CASTOKEN')
                                this.$router.push({ name: 'index' })
                            } else {
                                this.$message.info('注销失败')
                            }
                        })
                    },
                    onCancel() {
                    }
                })
            }
        }
    }
</script>
