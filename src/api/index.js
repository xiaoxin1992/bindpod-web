import request from '@/utils/request'

const urls = {
    login: {url: "/login/", method: "post"},
    createDomain: {url: "/agent/domain/create/", method: "post"},
    deleteDomain: {url: "/agent/domain/delete/", method: "post"},
    listDomain: {url: "/agent/domain/", method: "get"},
    isActive: {url: "/agent/resolve/stop/", method: "post"},
    resolveList: {
        url: "/agent/resolve/list",
        method: "get",
        handle: function (value) {
            let {domain, ...data} = value
            return {cUrl: `${this.url}/${domain}/`, cData: data}
        }
    },
    createResolve: {url: "/agent/resolve/create/", method: "post"},
    editResolve: {url: "/agent/resolve/modify/", method: "post"},
    deleteResolve: {url: "/agent/resolve/delete/", method: "post"},

    // 用户url
    userList: {url: "/agent/user/", method: "get"},
    changePassword: {url: "/agent/user/change/passwd/", method: "post"},
    createUser: {url: "/agent/user/create/", method: "post"},
    editUser: {url: "/agent/user/change/", method: "post"},
    deleteUser: {url: "/agent/user/delete/", method: "post"},
    domainAuthorize: {url: "/agent/user/domain/authorize/", method: "post"},
    userInfo: {url: "/agent/user/info", method: "get"},
    userDomain: {url: "/agent/user/domain/", method: "get"},

    // 日志
    getLogs: {url: "/agent/log/", method: "get"},


}

const api = {
    ...urls,
    req(params, data) {
        let {url} = params
        if (params["handle"] !== undefined) {
            let {cUrl, cData} = params["handle"](data)
            url = cUrl
            data = cData
        }
        return request({
            method: params.method,
            url: url,
            data: data
        })
    },
}

export default api

