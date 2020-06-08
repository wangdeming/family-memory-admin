import api from '@/api'

export const path = {
    getArticles: '/articles'
}

export function getArticles(params) {
    return api.get(path.getArticles, { params })
}

export function unPublishArticle(articleId, params) {
    return api.patch(`/articles/${articleId}`, params, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function getArticlesDetail(articleId) {
    return api.get(`/articles/${articleId}`)
}

export function templateDetails(templateId) {
    return api.get(`/articles/templates/${templateId}`)
}

export function musicDetails(musicId) {
    return api.get(`/articles/musics/${musicId}`)
}

export function fontDetails(fontId) {
    return api.get(`/articles/fonts/${fontId}`)
}
