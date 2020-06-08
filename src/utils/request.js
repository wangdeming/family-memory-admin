import axios from 'axios'
import notification from 'ant-design-vue/es/notification'
import Cookies from 'js-cookie'

// create an axios instance
const service = axios.create({
    baseURL: process.env.VUE_APP_DEV_URL, // url = base url + request url
    withCredentials: true, // send cookies when cross-domain requests
    timeout: 6000 // request timeout
})
function refreshToken() {
    Cookies.set('cas_sid', sessionStorage.getItem('SET_CASTOKEN'))
    return service.get(process.env.VUE_APP_AUTH_URL + '/auth/login').then(res => res.data)
}

function authentication(params) {
    return service.get('/authentication', { params }).then(res => res.data)
}

// 是否正在刷新的标记
let isRefreshing = false
const handleError = (error) => {
    if (error.response) {
        const data = error.response.data
        if (error.response.status === 403) {
            notification.error({
                message: 'Forbidden',
                description: data.message
            })
        }
        if (error.response.status === 401) {
            if (!isRefreshing) {
                isRefreshing = true
                return refreshToken().then(res => {
                    const casToken = res.casToken
                    authentication({ casToken: casToken }).then(res => {
                        sessionStorage.setItem('SET_CASTOKEN', casToken)
                        window.location.reload()
                    }).catch(res => {
                        notification.error({
                            message: 'Unauthorized',
                            description: '请重新登录'
                        })
                        sessionStorage.removeItem('SET_CASTOKEN')
                        window.location.href = '#/user/login'
                    })
                }).catch(res => {
                    notification.error({
                        message: 'Unauthorized',
                        description: '请重新登录'
                    })
                    sessionStorage.removeItem('SET_CASTOKEN')
                    window.location.href = '#/user/login'
                }).finally(() => {
                    isRefreshing = false
                })
            }
        }
    }
    return Promise.reject(error)
}

// request interceptor
service.interceptors.request.use(
    config => {
        return config
    },
    handleError
)

// response interceptor
service.interceptors.response.use(
    response => {
        return response
    },
    handleError
)

const VueAxios = {
    vm: {},
    // eslint-disable-next-line no-unused-vars
    install(Vue) {
        if (this.installed) {
            return
        }
        this.installed = true

        Vue.axios = service
        Object.defineProperties(Vue.prototype, {
            axios: {
                get: function get() {
                    return service
                }
            },
            $http: {
                get: function get() {
                    return service
                }
            }
        })
    }
}

export {
    VueAxios,
    service as default
}
