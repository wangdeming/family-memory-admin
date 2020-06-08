import api from '@/api'

export const path = {
    getStatisticsUsersToday: '/statistics/users/today', // 查询当日用户数据统计结果
    getStatisticsArticlesToday: '/statistics/articles/today', // 查询当日文章数据统计结果
    getStatisticsUsers: '/statistics/users', // 查询指定日期范围的新增用户数列表
    getStatisticsArticles: '/statistics/articles' // 查询指定日期范围的新增文章数列表
}

export function getStatisticsUsersToday() {
    return api.get(path.getStatisticsUsersToday)
}

export function getStatisticsArticlesToday() {
    return api.get(path.getStatisticsArticlesToday)
}

export function getStatisticsUsers(params) {
    return api.get(path.getStatisticsUsers, { params })
}

export function getStatisticsArticles(params) {
    return api.get(path.getStatisticsArticles, { params })
}
