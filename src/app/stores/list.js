import { observable, action, computed } from "mobx"
import request from "@/app/utils/request"
import config from "@/app/config"

export default class Filter {
  store
  url
  @observable tableData = []
  @observable totalCount = 0
  @observable tableData = []
  @observable currentPageIndex = 1
  @observable queryMap = {
    offset: 0,
    limit: 10,
    keywords: null,
    start: null,
    end: null,
  }

  constructor(store, url) {
    this.store = store
    this.url = url
  }

  @computed get queryString() {
    let queryCount = 0
    let queryString = ""
    for (let key in this.queryMap) {
      if (queryCount === 0 && queryString[key] !== undefined) {
        queryString = `${key}=${this.queryMap[key]}`
      } else {
        if (this.queryMap[key] !== null) {
          queryString += `&${key}=${this.queryMap[key]}`
        } else {
          queryString += ""
        }
      }
    }
    return queryString
  }

  @action getTableData = () => {
    return request.get(`${config.backend}/${this.url}?${this.queryString}`)
      .checkToken()
      .dataListDispose()
  }

  @action filterData = (newQueryMap) => {
    this.updateQueryMap(newQueryMap)
    this.clearTableData()
    this.initOffset()
    this.getTableData()
      .then(
        res => {
          this.updateTableData(res)
          this.initPageIndex()
        }
      )
  }

  @action changePagin = (selectedPageNumber) => {
    this.updatePageIndex(selectedPageNumber)
    this.updateQueryMap({ offset: (selectedPageNumber - 1) * this.queryMap.limit })
    this.getTableData()
      .then(
        res => {
          this.updateTableData(res)
        }
      )
  }

  @action clearTableData = () => {
    this.tableData = []
  }

  @action updateTableData = (data) => {
    this.totalCount = data.totalCount
    this.tableData = data.dataList
  }

  @action initOffset = () => {
    this.queryMap.offset = 0
  }

  @action updateQueryMap = (data) => {
    this.queryMap = { ...this.queryMap, ...data }
  }

  @action initPageIndex = () => {
    this.currentPageIndex = 1
  }
}