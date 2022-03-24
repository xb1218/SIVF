import React, { Component } from "react"
import moment from "moment"
import { observer, inject } from "mobx-react"
import { Button, InputNumber, message } from "antd"
import { BaseTable } from "@/app/components/base/baseTable"
import { checkArrisEmpty } from "@/app/utils/tool.js"
import { todayString } from "@/app/utils/const.js"
import { bloodAdd } from "./defaultData"
import apis from "@/app/utils/apis"
import "./index.scss"

export default
@inject("moredetail", "store")
@observer
class index extends Component {
  constructor(props) {
    super()
    this.state = {
      dataList: [],
      bloFlag: false,
    }
  }
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
    let { select_one } = this.props.store
    let select = JSON.parse(localStorage.getItem("patient"))
    this.getblood(this.props.store.resumePeople ? select : select_one)
  }
  //获取血激素信息
  getblood = (data) => {
    let { select_one } = this.props.store
    apis.Patients_monitor.getbloodInit(data ? data : select_one).then((res) => {
      if (res.code === 200) {
        this.reviseData(res.data)
      }
    })
  }
  // 获取血激素数据
  reviseData = (data) => {
    if (!checkArrisEmpty(data)) {
      data.forEach((item, index) => {
        if (index === 0) {
          item.operation = true
        } else if (!item.edited) {
          item.operation = null
        } else {
          item.operation = false
        }
        item.key = item.uid
      })
    }
    this.setState({
      dataList: !checkArrisEmpty(data) ? [...data] : [{ ...bloodAdd }],
      bloFlag: true,
    })
  }
  //输入框取值
  setObjVal = (obj, param, val) => {
    let { dataList } = this.state
    let { editTag, name } = this.props
    if (editTag || (name && name === "natural")) {
      obj[param] = val ? val : ""
      this.setState({
        dataList: [...dataList],
      })
    }
  }
  //保存方法
  saveFuc = () => {
    let { dataList } = this.state
    let { select_one } = this.props.store
    let select = JSON.parse(localStorage.getItem("patient"))
    let obj = {
      patientParam: this.props.store.resumePeople ? select : select_one,
      bloodHormoneDTOS: dataList,
    }
    if (dataList[0].visitDate === todayString) {
      apis.Patients_monitor.saveBlood(obj).then((res) => {
        if (res.code === 200) {
          this.props.initPage()
        } else {
          message.error(res.message)
        }
      })
    }
  }
  //保存当前模块
  componentWillUnmount() {
    let { editTag, editModalName } = this.props
    if (editTag === 0 && editModalName === "血激素水平") {
      message.error("该数据从修订记录获取，不可保存")
    } else {
      this.saveFuc()
    }
  }
  //lis获取数据
  getLis = () => {
    const { select_one } = this.props.store
    let pid = select_one.patientPid
    let obj = {
      date: moment(new Date()).format("YYYY-MM-DD"),
    }
    apis.getList.getAllBloodList(pid, obj).then((res) => {
      if (res.code === 200) {
        if (res.data !== null) {
          message.success("获取血激素成功！")
          let data = res.data
          this.reviseData(data)
        } else {
          message.warning("当天没有血激素数据！")
        }
      } else {
        message.error(res.message)
      }
    })
  }
  // 点击加号新建一行
  addItemLine = () => {
    const { dataList } = this.state
    dataList.push({
      key: Date.now(),
      amh: null,
      doctor: null,
      e2: null,
      edited: 1,
      fsh: null,
      hcg: null,
      lh: null,
      note: null,
      p: null,
      prl: null,
      t: null,
      visitDate: todayString,
      patientParam: null,
      operation: false, //false为减，true为加
    })
    this.setState({
      dataList: [...dataList],
    })
  }
  // 删除一行
  deleteItemLine = (index) => {
    const { dataList } = this.state
    dataList.splice(index, 1)
    this.addKey(dataList)
    this.setState({
      dataList: [...dataList],
    })
  }
  // 给数据加key
  addKey = (data) => {
    let arr = []
    arr = data.map((item, index) => {
      item.key = index
      return item
    })
    return arr
  }
  render() {
    const { bloFlag, dataList } = this.state
    let colums = [
      {
        title: "E2(pmol/L)",
        dataIndex: "e2",
        key: "e2",
        render: (text, record) => {
          return record.edited && record.visitDate === todayString ? (
            <InputNumber
              min={0}
              defaultValue={text}
              onChange={(val) => this.setObjVal(record, "e2", val)}
            />
          ) : (
            text
          )
        },
      },
      {
        title: "LH(IU/l)",
        dataIndex: "lh",
        key: "lh",
        render: (text, record) => {
          return record.edited && record.visitDate === todayString ? (
            <InputNumber
              min={0}
              defaultValue={text}
              onChange={(val) => this.setObjVal(record, "lh", val)}
            />
          ) : (
            text
          )
        },
      },
      {
        title: "FSH(IU/l)",
        dataIndex: "fsh",
        key: "fsh",
        render: (text, record) => {
          return record.edited && record.visitDate === todayString ? (
            <InputNumber
              min={0}
              defaultValue={text}
              onChange={(val) => this.setObjVal(record, "fsh", val)}
            />
          ) : (
            text
          )
        },
      },
      {
        title: "P(ng/ml)",
        dataIndex: "p",
        key: "p",
        render: (text, record) => {
          return record.edited && record.visitDate === todayString ? (
            <InputNumber
              min={0}
              defaultValue={text}
              onChange={(val) => this.setObjVal(record, "p", val)}
            />
          ) : (
            text
          )
        },
      },
      {
        title: "PRL(ng/ml)",
        dataIndex: "prl",
        key: "prl",
        render: (text, record) => {
          return record.edited && record.visitDate === todayString ? (
            <InputNumber
              min={0}
              defaultValue={text}
              onChange={(val) => this.setObjVal(record, "prl", val)}
            />
          ) : (
            text
          )
        },
      },
      {
        title: "AMH(ng/ml)",
        dataIndex: "amh",
        key: "amh",
        render: (text, record) => {
          return record.edited && record.visitDate === todayString ? (
            <InputNumber
              min={0}
              defaultValue={text}
              onChange={(val) => this.setObjVal(record, "amh", val)}
            />
          ) : (
            text
          )
        },
      },
      {
        title: "T(nmol/L)",
        dataIndex: "t",
        key: "t",
        render: (text, record) => {
          return record.edited && record.visitDate === todayString ? (
            <InputNumber
              min={0}
              defaultValue={text}
              onChange={(val) => this.setObjVal(record, "t", val)}
            />
          ) : (
            text
          )
        },
      },
      {
        title: "HCG(IU/L)",
        dataIndex: "hcg",
        key: "hcg",
        render: (text, record) => {
          return record.edited && record.visitDate === todayString ? (
            <InputNumber
              min={0}
              defaultValue={text}
              onChange={(val) => this.setObjVal(record, "hcg", val)}
            />
          ) : (
            text
          )
        },
      },
      {
        title: "操作",
        dataIndex: "operation",
        key: "operation",
        render: (text, record, index) => {
          return (
            <Button
              style={{
                border: "1px dashed #59b4f4",
                background: "#def0fd",
                borderRadius: "2px",
                padding: "2px 4px",
              }}
            >
              {record.operation === true ? (
                <svg
                  className="icon_svg"
                  aria-hidden="true"
                  onClick={this.addItemLine}
                >
                  <use xlinkHref="#iconjiahao1"></use>
                </svg>
              ) : record.operation === false ? (
                <svg
                  className="icon_svg"
                  aria-hidden="true"
                  onClick={() => this.deleteItemLine(index)}
                >
                  <use xlinkHref="#iconjianhao"></use>
                </svg>
              ) : null}
            </Button>
          )
        },
      },
    ]
    return (
      <>
        {bloFlag ? (
          <>
            <div
              style={{
                width: "10%",
                marginTop: "5px",
                display: "inline-block",
                verticalAlign: "top",
              }}
            >
              <Button type="primary" size="small" onClick={() => this.getLis()}>
                LIS 获取
              </Button>
            </div>
            <div style={{ width: "90%", display: "inline-block" }}>
              <BaseTable
                columns={colums}
                dataSource={dataList}
                pagination={false}
              />
            </div>
          </>
        ) : null}
      </>
    )
  }
}
