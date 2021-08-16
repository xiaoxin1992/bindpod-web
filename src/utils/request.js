import axios from "axios"
import config from "../../config"
import cookie from './cookie'
import ElementUI from "element-ui"

const REQUEST_INVALID = "服务不可用,请联系管理员"
const NETWORK_ERROR = "网络异常请稍后重试"
const PERMISSION_INVALID = "没有权限"

let url = config.api.trim()
axios.defaults.baseURL = url.endsWith("/") ? url : `${url}/`
axios.defaults.timeout = config.timeout


axios.interceptors.response.use(response => {
    if (response.status === 401) {
        window.location.href = "/#/login"
    }
    return response.data

}, error => {
    let res = error.response
    let path = location.hash
    if (res === undefined) {
        ElementUI.Message.error(NETWORK_ERROR)
        return
    }
    if ((res.status === 401 || parseInt(res.data.msg.code) === 401) && path !== "#/login") {
        window.location.href = "/#/login"
    } else if (res.status === 403) {
        ElementUI.Message.error(PERMISSION_INVALID)
    } else if (res.status === 401 || res.status === 200) {
        ElementUI.Message.error(res.data.msg.detail || res.data.msg)
    } else {
        if (res.data !== undefined && res.data.msg.msg !== undefined) {
            const {msg} = res.data
            ElementUI.Message.error(msg.msg)
        } else {
            ElementUI.Message.error(REQUEST_INVALID)
        }
    }
    return Promise.reject(res)
})

axios.interceptors.request.use(req => {
    const headers = req.headers
    headers.Authorization = "Token " + cookie.get("token") || ""
    return req
})

function request(options) {
    options.method = options.method || "get"
    if (options.method.toLowerCase() === 'get') {
        options.params = options.data
    }
    return axios(options)
}


export default request
