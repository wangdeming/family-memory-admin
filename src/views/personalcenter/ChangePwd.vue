<!--
 * @des:修改密码
 * @date: 2020-03-03 15:16
 * @version:1.0
 *
 * Date                   Author               Description
 * ------------------------------------------------------
 * 2020-03-03            wangdm                  创建
 -->
<template>
    <a-modal
        title="修改密码"
        style="top: 20%;"
        :width="600"
        :visible="visible"
        @cancel="handleCancel"
        @ok="handleOk"
    >
        <a-spin :spinning="confirmLoading">
            <a-form
                autocomplete="off"
                :form="form"
                v-bind="formLayout"
            >
                <a-form-item
                    label="原密码"
                    :labelCol="{lg: {span: 5}, sm: {span: 5}}"
                    :wrapperCol="{lg: {span: 16}, sm: {span: 16} }">
                    <a-input
                        v-decorator="[
                            'oldPwd',
                            {rules: [{ required: true, message: '请输入旧密码' },{validator: handleOldPass}]}
                        ]"
                        name="oldPwd"
                        type="password"
                        placeholder="请输入旧密码" />
                </a-form-item>
                <a-form-item
                    label="新密码"
                    :labelCol="{lg: {span: 5}, sm: {span: 5}}"
                    :wrapperCol="{lg: {span: 16}, sm: {span: 16} }"
                    hasFeedback>
                    <a-input
                        v-decorator="[
                            'newPwd',
                            {rules: [{ required: true, message: '请输入新密码' },{validator: handlePass}]}
                        ]"
                        name="newPwd"
                        type="password"
                        placeholder="请输入新密码" />
                </a-form-item>
                <a-form-item
                    label="确认密码"
                    :labelCol="{lg: {span: 5}, sm: {span: 5}}"
                    :wrapperCol="{lg: {span: 16}, sm: {span: 16} }"
                    hasFeedback>
                    <a-input
                        v-decorator="[
                            'confirmedPwd',
                            {rules: [{ required: true, message: '请再次输入密码' },{validator: handleConfirmPass}]}
                        ]"
                        name="confirmPwd"
                        type="password"
                        placeholder="请再次输入密码" />
                </a-form-item>
            </a-form>
        </a-spin>
    </a-modal>
</template>

<script>
    import md5 from 'js-md5'
    export default {
        name: 'ChangePwd',
        props: {
            visible: {
                default: false
            }
        },
        data() {
            return {
                form: this.$form.createForm(this),
                formLayout: {
                    labelCol: {
                        xs: { span: 24 },
                        sm: { span: 5 }
                    },
                    wrapperCol: {
                        xs: { span: 24 },
                        sm: { span: 16 }
                    }
                },
                confirmLoading: false,
                oldPassword: '',
                password: '',
                confirmPassword: '',
                onlyOnec: true
            }
        },
        created() {
            if (!sessionStorage.getItem('SET_CASTOKEN')) {
                this.$router.push({ name: 'index' })
            }
        },
        methods: {
            // 点击取消按钮
            handleCancel() {
                this.$emit('update:visible', false)
                this.form.resetFields()
            },
            // 点击确认按钮
            handleOk() {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        const data = JSON.stringify(values)
                        // 通过方法传值给父组件
                        this.$emit('success', data)
                    }
                })
            },
            handleOldPass(rule, value, callback) {
                this.oldPassword = value
                if (sessionStorage.getItem('SET_PASSWORD') !== md5(value)) {
                    callback(new Error('请输入正确的旧密码'))
                    return false
                }
                callback()
            },
            // 输入新密码验证
            handlePass(rule, value, callback) {
                const rgxRule = /^(?![\d]+$)(?![a-zA-Z]+$)(?![!#$%^&*]+$)[\da-zA-Z!#$%^&*]{6,30}$/
                this.password = value
                if (!rgxRule.test(value)) {
                    callback(new Error('大小写字母、阿拉伯数字、符号的组合，6~30个字符'))
                    return false
                }
                if (sessionStorage.getItem('SET_PASSWORD') === md5(value)) {
                    callback(new Error('新密码不能与旧密码一致'))
                    return false
                }
                if (this.confirmPassword !== value) {
                    this.onlyOnec = true
                    callback(new Error('新密码与确认密码必须一致'))
                    return false
                } else {
                    if (this.onlyOnec) {
                        this.onlyOnec = false
                        this.form.validateFields(['confirmedPwd'], (errors, values) => {
                        })
                    }
                }
                callback()
            },
            // 再次输入新密码验证
            handleConfirmPass(rule, value, callback) {
                this.confirmPassword = value
                const rgxRule = /^(?![\d]+$)(?![a-zA-Z]+$)(?![!#$%^&*]+$)[\da-zA-Z!#$%^&*]{6,30}$/
                if (!rgxRule.test(value)) {
                    callback(new Error('大小写字母、阿拉伯数字、符号的组合，6~30个字符'))
                    return false
                }
                if (this.password !== value) {
                    this.onlyOnec = true
                    callback(new Error('新密码与确认密码必须一致'))
                    return false
                } else {
                    if (this.onlyOnec) {
                        this.onlyOnec = false
                        this.form.validateFields(['newPwd'], (errors, values) => {
                        })
                    }
                }
                callback()
            }
        }
    }
</script>

<style></style>
