// import Qs from 'qs'
import axios from '@/utils/request'

const api = {
    axios,
    get(url, config) {
        return axios.get(url, config)
    },
    post(url, data, config) {
        return axios.post(url, data, config)
    },
    put(url, data, config) {
        return axios.put(url, data, config)
    },
    delete(url, config) {
        return axios.delete(url, config)
    },
    patch(url, data, config) {
        return axios.patch(url, data, config)
    }
}

export default api
