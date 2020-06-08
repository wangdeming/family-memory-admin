import api from '@/api'

export const path = {
    authentication: '/authentication',
    login: process.env.VUE_APP_AUTH_URL + '/auth/login',
    changePwd: process.env.VUE_APP_AUTH_URL + '/user/pwd/change'
}

export function authentication(params) {
    return api.get(path.authentication, { params })
}

export function login(data) {
    return api.post(path.login, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function logout() {
    return api.delete(path.authentication, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function changePassword(data) {
    return api.put(path.changePwd, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
