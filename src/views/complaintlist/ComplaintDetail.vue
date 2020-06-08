<!--
 * @des:投诉详情
 * @date: 2020-03-03 15:11
 * @version:1.0
 *
 * Date                   Author               Description
 * ------------------------------------------------------
 * 2020-03-03            wangdm                  创建
 -->
<template>
    <a-modal
        title="投诉详情"
        style="top: 20%;"
        :width="800"
        :visible="visible"
        @cancel="handleCancel"
        footer=""
        cancelText="返回"
    >
        <a-spin :spinning="confirmLoading">
            <div>
                <div class="divTitle">投诉类别：</div>
                <div class="divInfo">{{ complaintType | complaintFilter }}</div>
            </div>
            <div style="margin-top: 10px;">
                <div class="divTitle">投诉原因：</div>
                <div class="divInfo">{{ complaintReason }}</div>
            </div>
            <div style="margin-top: 10px;">
                <div class="divTitle">文章详情：</div>
                <div class="divContent">
                    <div
                        class="content_box"
                        :style="{backgroundColor: details.textbgcolor, color: details.articlefontcolor}"
                    >
                        <div class="artice_detail">
                            <div class="container" :style="{fontFamily:textFont}">
                                <div
                                    class="player"
                                    @click="backmusic(1)"
                                    v-if="actionname === 1"
                                ><img
                                    class="active"
                                    src="../../assets/musicplay.svg"
                                    alt=""
                                /></div>
                                <div
                                    class="player"
                                    @click="backmusic(2)"
                                    v-if="actionname === 2"
                                ><img
                                    src="../../assets/musicstop.svg"
                                    alt=""
                                /></div>
                                <audio :src="musicfiles" controls="controls" id="audio" @ended="audioEnd()" style='display: none;'></audio>
                                <div class="defaulttitle" v-if="details.type == 1">
                                    <div class="title">{{ title }}</div>
                                    <div class="author_line clearfix">
                                        <div class="avatar_box fl">
                                            <a-avatar class="avatar" size="small" :src="avatarUrl" />
                                        </div>
                                        <div class="author_detail fl">
                                            <div class="author_name">{{ authorName }}</div>
                                            <div class="author_time">{{ currentdate }}</div>
                                        </div>
                                    </div>
                                </div>
                                <div class="templatetitle" v-if="details.type == 2">
                                    <div class="bgimg">
                                        <img :src="bgimg" alt="" />
                                    </div>
                                    <div
                                        class="author_line clearfix text-center"
                                        :style="'color:' + details.articlefontcolor"
                                    >
                                        <div class="avatar_box">
                                            <a-avatar class="avatar" size="small" :src="avatarUrl" />
                                        </div>
                                        <div class="author_name">{{ authorName }}</div>
                                        <div class="title">{{ title }}</div>
                                        <div class="author_time">{{ currentdate }}</div>
                                    </div>
                                </div>
                                <!-- 文章详情页 段落类型 1 文本，2 图片，3 音频，4 视频 :style="{height: height}"
                            compositionType:1 //字上图下 2字下图上 -->
                                <div class="artice_main" v-for="(item, index) in parts" :key="index">
                                    <div v-if="item.sectionType == 1 || item.sectionType == 2">
                                        <div
                                            v-if="compositionType == 1"
                                            class="word"
                                            :style="'color:' + details.articlefontcolor"
                                        >
                                            {{ item.text }}
                                        </div>
                                        <div class="media img" v-if="item.resourceUrl != null">
                                            <img :src="item.resourceUrl" alt="" />
                                        </div>
                                        <div
                                            v-if="compositionType == 2"
                                            class="word"
                                            :style="'color:' + details.articlefontcolor"
                                        >
                                            {{ item.text }}
                                        </div>
                                    </div>
                                    <div v-if="item.sectionType == 4">
                                        <div
                                            v-if="compositionType == 1"
                                            class="word"
                                            :style="'color:' + details.articlefontcolor"
                                        >
                                            {{ item.text }}
                                        </div>
                                        <div class="media video">
                                            <video
                                                id="myVideo"
                                                :controls="videoSetting.controls"
                                                :show-fullscreen-btn="videoSetting.showFullscreenBtn"
                                                :show-center-play-btn="videoSetting.showCenterPlayBtn"
                                                :show-progress="videoSetting.showProgress"
                                                :src="item.resourceUrl"
                                                style="object-fit:cover"
                                            ></video>
                                        </div>

                                        <div
                                            v-if="compositionType == 2"
                                            class="word"
                                            :style="'color:' + details.articlefontcolor"
                                        >
                                            {{ item.text }}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </a-spin>
        <div style="text-align: right;border-top: 1px solid #e8e8e8;margin: 0 -24px;">
            <button @click="handleCancel" style="margin: 15px 30px -20px 0" type="button" class="ant-btn"><span>返 回</span></button>
        </div>
    </a-modal>
</template>

<script>
    import { getComplaintDetail } from '@/api/complaint'
    import { getArticlesDetail, templateDetails, musicDetails, fontDetails } from '@/api/article'
    // 用于投诉类别过滤器
    const complaintStatusMap = {
        1: {
            text: '违法违规'
        },
        2: {
            text: '政治有害'
        },
        3: {
            text: '诈骗敲诈'
        },
        4: {
            text: '侵权威胁'
        },
        5: {
            text: '淫秽色情'
        },
        6: {
            text: '事实争议'
        },
        7: {
            text: '其他'
        }
    }
    export default {
        name: 'UserAdd',
        props: {
            visible: {
                default: false
            },
            complaintId: {
                default: null,
                type: Number
            },
            articleId: {
                default: null,
                type: Number
            }
        },
        data() {
            return {
                confirmLoading: false,
                complaintType: 1,
                complaintReason: '',
                details: {},
                parts: [], // 段落列表
                authorName: '', // 作者名称
                avatarUrl: '', // 作者头像url
                currentdate: '', // 时间
                compositionType: '', // 图文样式:1 字上图下,2 字下图上
                templateId: '', // 模板id
                musicfiles: '',
                musicId: null,
                contentFontId: null,
                actionname: 1,
                isPlaying: false,
                textFont: '',
                videoSetting: {
                    controls: true,
                    showFullscreenBtn: false,
                    showCenterPlayBtn: false,
                    showProgress: true
                }
            }
        },
        methods: {
            // 点击取消按钮
            handleCancel() {
                this.stop()
                this.$emit('update:visible', false)
            },
            // 获取模板详情
            gettemplateDetails(id) {
                templateDetails(id).then((res) => {
                    if (res.status === 200) {
                        this.details = res.data.jsonProperties
                        this.bgimg = res.data.bgimg
                    } else {
                        this.$message.info(res.message)
                    }
                })
            },
            _getmusicDetails(id) {
                // 音乐详情
                const that = this
                var audio = document.querySelector('#audio')
                audio.currentTime = 0
                musicDetails(id).then((res) => {
                    if (res.status === 200) {
                        this.musicfiles = res.data.fileUrl // 音乐文件
                        setTimeout(function() {
                            that.play()
                        }, 200)
                    }
                })
            },
            backmusic(name) {
                if (this.actionname === 1) {
                    this.actionname = 2
                    this.stop()
                } else {
                    this.actionname = 1
                    this.play()
                }
            },
            play() {
                var audio = document.querySelector('#audio')
                if (!this.isPlaying) {
                    audio.play()
                    this.isPlaying = true
                }
            },
            stop() {
                var audio = document.querySelector('#audio')
                if (this.isPlaying) {
                    audio.pause()
                    this.isPlaying = false
                }
            },
            audioEnd() {
                var audio = document.querySelector('#audio')
                audio.currentTime = 0
                audio.play()
                this.isPlaying = true
            },
            _getfontsDetails(id) {
                // 字体详情
                fontDetails(id).then((res) => {
                    if (res.status === 200) {
                        this.Fontfile = res.data.fileUrl // 字体文件
                        if (this.Fontfile === 'https://cdn.ibdsr.cn/fonts/kaiti.ttf') {
                            this.textFont = 'kaiti'
                        } else if (this.Fontfile === 'https://cdn.ibdsr.cn/fonts/katong.ttf') {
                            this.textFont = 'katong'
                        } else if (this.Fontfile === 'https://cdn.ibdsr.cn/fonts/lishu.ttf') {
                            this.textFont = 'lishu'
                        } else if (this.Fontfile === 'https://cdn.ibdsr.cn/fonts/tiaotiao.ttf') {
                            this.textFont = 'tiaotiao'
                        } else {
                            this.textFont = ''
                        }
                    }
                })
            }
        },
        filters: {
            // 投诉类别过滤值
            complaintFilter(type) {
                return complaintStatusMap[type].text
            }
        },
        watch: {
            // 查看文章详情接口
            visible(val, oldVal) {
                if (val === true) {
                    getArticlesDetail(this.articleId).then((res) => {
                        if (res.status === 200) {
                            this.title = res.data.title // 标题
                            this.parts = res.data.sectionList // 段落列表
                            this.authorName = res.data.authorName // 作者名称
                            this.avatarUrl = res.data.avatarUrl // 作者头像url
                            this.compositionType = res.data.compositionType // 图文样式:1 字上图下,2 字下图上
                            this.templateId = res.data.templateId // 模板id
                            this.currentdate = res.data.createTime.substr(0, 10)
                            this.templateId = res.data.templateId
                            if (this.templateId) {
                                this.gettemplateDetails(this.templateId) // 模板详情
                            }
                            this.musicId = res.data.musicId // 音乐id
                            if (this.musicId) {
                                this._getmusicDetails(res.data.musicId) // 音乐详情
                                this.actionname = 1
                            } else {
                                this.actionname = -1
                            }
                            this.contentFontId = res.data.contentFontId // 字体id
                            if (this.contentFontId) {
                                this._getfontsDetails(res.data.contentFontId) // 字体详情
                            }
                        } else {
                            this.$message.info(res.message)
                        }
                    })
                }
            },
            // 查看投诉详情接口
            complaintId(val, oldVal) {
                getComplaintDetail(val).then(res => {
                    if (res.status === 200) {
                        this.complaintType = res.data.complaintType
                        this.complaintReason = res.data.description
                    } else {
                        this.$message.info(res.message)
                    }
                })
            }
        }
    }
</script>

<style lang="less" scoped>
    @import "../../../public/font.css";
    .divTitle {
        float: left;
        width: 15%;
        line-height: 30px;
        text-align: right;
        font-weight: bold;
        margin-right: 10px;
    }
    .divInfo {
        display: inline-block;
        width: 80%;
        line-height: 30px;
    }
    .divContent {
        display: inline-block;
        width: 60%;
        height: 300px;
        overflow-y: scroll;
        border: 1px solid #ccc;
        padding: 10px;
    }
    .fl {
        float: left;
    }
    .fr {
        float: right;
    }
    .clearfix {
        zoom: 1;
    }
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: '';
    }
    .clearfix:after {
        clear: both;
    }
    .text-center {
        text-align: center;
    }
    .content_box {
        padding-bottom: 50px;
        .artice_detail {
            .container {
                position: relative;
                padding: 0;
                .player {
                    position: absolute;
                    right: 15px;
                    z-index: 100;
                    top: 10px;
                    img {
                        width: 35px;
                        height: 35px;
                    }
                    @-webkit-keyframes rotation {
                        from {
                            -webkit-transform: rotate(0deg);
                        }

                        to {
                            -webkit-transform: rotate(360deg);
                        }
                    }
                    .active {
                        -webkit-transform: rotate(360deg);
                        animation: rotation 5s linear infinite;
                        -moz-animation: rotation 5s linear infinite;
                        -webkit-animation: rotation 5s linear infinite;
                        -o-animation: rotation 5s linear infinite;
                    }
                }
                .defaulttitle {
                    padding: 15px 0 15px 15px;
                    .title {
                        font-size: 18px;
                        color: #333333;
                        letter-spacing: 0.69px;
                        line-height: 25px;
                        font-weight: bold;
                    }
                    .author_line {
                        margin-top: 15px;
                        .avatar_box {
                            margin-right: 10px;
                        }
                        .author_detail {
                            height: 40px;
                            .author_name {
                                font-size: 16px;
                                color: #333333;
                                letter-spacing: 0.62px;
                                line-height: 24px;
                            }
                            .author_time {
                                font-size: 14px;
                                color: #999999;
                                letter-spacing: 0.54px;
                                line-height: 16px;
                            }
                        }
                    }
                }
                .templatetitle {
                    .bgimg {
                        height: 210px;

                        img {
                            width: 100%;
                            height: 210px;
                        }
                    }
                    .author_line {
                        .avatar_box {
                            margin-top: -59px;
                        }
                        .author_name {
                            font-size: 16px;
                            letter-spacing: 0.62px;
                            line-height: 24px;
                            margin: 5px 0;
                        }
                        .title {
                            font-size: 18px;
                            letter-spacing: 0.69px;
                            line-height: 25px;
                            font-weight: bold;
                            padding: 0 15px;
                        }
                        .author_time {
                            margin-top: 6px;
                            font-size: 14px;
                            letter-spacing: 0.54px;
                            line-height: 16px;
                        }
                    }
                }
                .artice_main {
                    transition: all 0.3s linear;
                    position: relative;
                    padding: 0 15px;
                    .media {
                        width: 100%;
                        border-radius: 10px;
                        margin-top: 15px;
                        img {
                            width: 100%;
                            height: 200px;
                        }
                    }
                    .media.video {
                        width: 100%;
                        height: 200px;
                        position: relative;
                        video {
                            width: 100%;
                            height: 200px;
                        }
                        .mask {
                            width: 100%;
                            height: 100%;
                            position: absolute;
                            top: 0;
                            left: 0;
                            background: #000;
                            opacity: 0.1;
                            z-index: 1;
                        }
                        .playBtn {
                            width: 60px;
                            height: 60px;
                            background: url('../../assets/tuwen_list_play.svg') no-repeat center;
                            background-size: 100%;
                            position: absolute;
                            top: 70px;
                            left: 50%;
                            margin-left: -30px;
                            z-index: 2;
                        }
                    }
                    .word {
                        margin-top: 15px;
                        font-size: 16px;
                        letter-spacing: 0.69px;
                    }
                }
            }
        }
    }
</style>
