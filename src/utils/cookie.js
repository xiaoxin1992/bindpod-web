import VueCookie from "vue-cookie"


const Cookie = {
    set(key, value, json, expire) {
        expire = expire || {expires: 'Session'}
        json = json || false
        if (json) {
            VueCookie.set(key, JSON.stringify(value), expire)
        } else {
            VueCookie.set(key, value, expire)
        }
        return this
    },
    get(key, json) {
        json = json || false
        let value = VueCookie.get(key)
        if (json) {
            return JSON.parse(value)
        }
        return value
    },
    del(key) {
        VueCookie.delete(key)
        return this
    }
}
export default Cookie
