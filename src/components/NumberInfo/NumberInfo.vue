<template>
    <div :class="[prefixCls]">
        <slot name="subtitle">
            <div :class="[`${prefixCls}-subtitle`]">{{ typeof subTitle === 'string' ? subTitle : subTitle() }}</div>
        </slot>
        <div class="number-info-value">
            <span>{{ total }}</span>
            <span class="sub-total">
                {{ desc }}
                <icon :type="`caret-${status}`" :style="{color: status==='up' ? 'green' : 'red'}" style="font-size: 16px;" />
                {{ subTotal }}
            </span>
        </div>
    </div>
</template>

<script>
    import Icon from 'ant-design-vue/es/icon'

    export default {
        name: 'NumberInfo',
        props: {
            prefixCls: {
                type: String,
                default: 'ant-pro-number-info'
            },
            total: {
                type: Number,
                required: true
            },
            subTotal: {
                type: String,
                default: ''
            },
            subTitle: {
                type: [String, Function],
                default: ''
            },
            status: {
                type: String,
                default: ''
            },
            desc: {
                type: String,
                default: ''
            }
        },
        components: {
            Icon
        },
        data() {
            return {}
        }
    }
</script>

<style lang="less" scoped>
  @import "index";
</style>
