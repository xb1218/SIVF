import { action, observable } from "mobx"
import request from "@/app/utils/request"
import config from "@/app/config"
import { setTokenBundle } from "@/app/utils/localTools"

let authInstance

export default class Auth {
  @observable userInfo = {}

  @action login = (userName, password) =>
    request
      .post(`${config.backend}/login`)
      .send({ userName, password })
      .type("application/json")
      .commonDispose()
      .then(
        (res) => {
          if (res.data.token) {
            setTokenBundle(JSON.stringify(res.data))
            localStorage.setItem("username", res.data.username)
            localStorage.setItem("isAdmin", res.data.isAdmin)
          }
        },
        (err) => Promise.reject(err)
      )

  static getInstance = () => {
    if (!authInstance) {
      authInstance = new Auth()
    }
    return authInstance
  }
}
