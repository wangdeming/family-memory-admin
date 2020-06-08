import api from '@/api'

export const path = {
    getComplaints: '/articles/complaints'
}

export function getComplaints(params) {
    return api.get(path.getComplaints, { params })
}

export function getComplaintDetail(id) {
    return api.get(`/articles/complaints/${id}`)
}
