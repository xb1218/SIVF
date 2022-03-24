import React from "react"
import ReactDOM from "react-dom"
import Store from "@/app/stores"
import Auth from "@/app/stores/auth"
import Moredetail from "@/app/stores/patients/moredetail"
import Inspection from "@/app/stores/patients/inspection"
import "dfinfo-common-components/lib/dfinfo-common-components.css"
import { Provider } from "mobx-react"
import { BrowserRouter } from "react-router-dom"
import { ConfigProvider } from "antd"
// import "react-app-polyfill/ie11"
// import "react-app-polyfill/stable"
import zhCN from "antd/es/locale/zh_CN" // 引入中文包

const store = new Store()
const moredetail = new Moredetail()
const inspection = new Inspection()
const auth = Auth.getInstance()

function init() {
  let App = require("@/app").default
  ReactDOM.render(
    <ConfigProvider locale={zhCN}>
      <Provider
        store={store}
        auth={auth}
        moredetail={moredetail}
        inspection={inspection}
      >
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    </ConfigProvider>,
    document.getElementById("root")
  )
}

if (module.hot) {
  module.hot.accept("@/app", () => requestAnimationFrame(init))
}

init()
