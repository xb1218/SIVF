import List from "@/app/stores/list"
import { observable, action } from "mobx"

export default class Store {
  @observable showResume = false //是否显示履历
  @observable resumeList = [] //履历数组
  @observable selectPerson = {}
  @observable type = "冻胚" //筛选冻胚卵类型
  // 分页传参
  @observable queryMaps = {
    pageNum: 1,
    pageSize: 10,
  }
  // 分页方法
  @action updateQueryMap = (data) => {
    for (const key in data) {
      this.queryMaps[key] = data[key]
    }
  }

  // 是否显示履历
  @action setResume = () => {
    this.showResume = !this.showResume
  }
  // 履历列表
  @action setResumeList = (data) => {
    this.resumeList = data
  }
  //设置选中的人
  @action setSelectedPerson = (data) => {
    this.selectPerson = data
  }
  //设置选中的type
  @action setSelectedType = (data) => {
    this.type = data
  }

  static fromJS() {
    const store = new Store()
    store.list = new List(store, "/frozen/info") //使用list说明 aaa/bbb/ccc为请求列表接口
    return store
  }
}
