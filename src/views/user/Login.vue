<!--
 * @des:登录
 * @date: 2020-03-03 15:17
 * @version:1.0
 *
 * Date                   Author               Description
 * ------------------------------------------------------
 * 2020-03-03            wangdm                  创建
 -->
<template>
    <div class="main">
        <a-form
            :form="form"
            class="user-layout-login"
            @submit="handleSubmit"
        >
            <a-alert v-if="isLoginError" type="error" showIcon style="margin-bottom: 24px;" :message="message" />
            <a-form-item>
                <a-input
                    size="large"
                    type="text"
                    placeholder="请输入账号"
                    v-decorator="[
                        'userName',
                        {rules: [{ required: true, message: '账号不能为空' }], validateTrigger: 'blur'}
                    ]"
                >
                    <a-icon slot="prefix" type="user" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                </a-input>
            </a-form-item>

            <a-form-item>
                <a-input
                    size="large"
                    type="password"
                    autocomplete="false"
                    placeholder="请输入密码"
                    v-decorator="[
                        'password',
                        {rules: [{ required: true, message: '密码不能为空' }], validateTrigger: 'blur'}
                    ]"
                >
                    <a-icon slot="prefix" type="lock" :style="{ color: 'rgba(0,0,0,.25)' }"/>
                </a-input>
            </a-form-item>

            <a-form-item style="margin-top:24px">
                <a-button
                    size="large"
                    type="primary"
                    htmlType="submit"
                    class="login-button"
                    :loading="buttonStatus"
                    :disabled="buttonStatus"
                >确定</a-button>
            </a-form-item>
        </a-form>
    </div>
</template>

<script>
    import { login, authentication } from '@/api/auth'
    import md5 from 'js-md5'
    export default {
        components: {
        },
        data() {
            return {
                form: this.$form.createForm(this),
                buttonStatus: false,
                isLoginError: false,
                message: ''
            }
        },
        created() {
        },
        methods: {
            // 登录按钮点击
            handleSubmit(e) {
                e.preventDefault()
                this.buttonStatus = true
                this.form.validateFields((err, values) => {
                    if (!err) {
                        var parameter = values
                        parameter.authMethod = 1
                        // 认证中心账号密码登录认证
                        login(parameter).then(response => {
                            if (response.status === 200) {
                                var casToken = response.data.casToken
                                // 独家记忆项目认证
                                authentication({ casToken: casToken }).then(res => {
                                    if (res.status === 200) {
                                        sessionStorage.setItem('SET_CASTOKEN', casToken)
                                        sessionStorage.setItem('SET_PASSWORD', md5(values.password))
                                        setTimeout(() => {
                                            this.$message.info(`${values.userName}，欢迎回来`)
                                        }, 100)
                                        this.$router.push({ name: 'statistics' })
                                        this.isLoginError = false
                                    }
                                })
                            }
                        }).catch(err => {
                            const errStr = err.toString()
                            if (errStr.indexOf('400')) {
                                this.message = '账号或密码错误，请确认账号密码正确'
                            } else if (errStr.indexOf('500')) {
                                this.message = '服务器异常，请联系后台人员'
                            } else {
                                this.message = errStr
                            }
                            this.isLoginError = true
                        }).finally(() => {
                            this.buttonStatus = false
                        })
                    } else {
                        setTimeout(() => {
                            // this.isLoginError = true
                            this.buttonStatus = false
                        }, 600)
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    .user-layout-login {
        label {
            font-size: 14px;
        }
        button.login-button {
            padding: 0 15px;
            font-size: 16px;
            height: 40px;
            width: 100%;
        }
    }
</style>
