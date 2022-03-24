import request from 'superagent'
import config from '@/app/config'
import { getToken } from "./localTools"
import { safeParse } from './commonUtils'

request.Request.prototype.checkToken = function () {
    const token = getToken()
    if (token) {
        this.set("Authorization", token)
    } else {
        window.location.href = `${config.urlPrefix}/login`
    }
    return this
}

request.Request.prototype.promiseify = function () {
    const self = this

    return new Promise((resolve, reject) => {
        self.end((err, res) => {
            if (err) {
                if (err.status === 401) {
                    window.location.href = `${config.urlPrefix}/login`
                }
                return reject(res)
            }
            resolve(res)
        })
    })
}

request.Request.prototype.commonDispose = function () {
    return this.promiseify()
        .then(
            result => safeParse(result.text),
            error => Promise.reject(safeParse(error.text))
        )
}

request.Request.prototype.dataListDispose = function () {
    return this.promiseify()
        .then(
            result => {
                const resData = {
                    dataList: safeParse(result.text),
                    totalCount: result.header["x-total-count"] * 1,
                }
                return resData
            }, error => Promise.reject(safeParse(error.text))
        )
}

export default request
