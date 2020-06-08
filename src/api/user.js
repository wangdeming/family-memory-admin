import api from '@/api'

export const path = {
    getUsers: '/users'
}

export function getUsers(params) {
    return api.get(path.getUsers, { params })
}

export function freezeUser(displayId, data) {
    return api.put(`/users/${displayId}`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function unfreezeUser(displayId, data) {
    return api.put(`/users/${displayId}`, data, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function getUserDetail(displayId) {
    return api.get(`/users/${displayId}`)
}
