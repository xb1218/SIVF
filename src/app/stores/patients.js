import { action, observable } from "mobx"
import request from "@/app/utils/request"
import config from "@/app/config"
import { setTokenBundle } from "@/app/utils/localTools"

let authInstance

export default class Auth {
  @observable userInfo = {}

  @action login = (data) => {
    request
      .post(`${config.backend}/auth`)
      .send(data)
      .type("application/json")
      .commonDispose()
      .then((res) => {
        //此处处理成功回调
        if (res.token) {
          setTokenBundle(JSON.stringify(res))
        }
      })
  }

  static getInstance = () => {
    if (!authInstance) {
      authInstance = new Auth()
    }
    return authInstance
  }
}
