import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { Button, DatePicker, Select, Input } from "antd"
import { MinusOutlined } from "@ant-design/icons"
import { DashBtn } from "@/app/components/base/baseBtn"
import { BaseTable } from "@/app/components/base/baseTable.js"
import { deepClone } from "@/app/utils/tool.js"
import styled from "styled-components"
import moment from "moment"
import apis from "@/app/utils/apis.js"

const dateFormat = "YYYY-MM-DD"

const PastContent = styled.div`
  background: #fff;
  display: flex;
  > div {
    width: 15%;
    justify-content: center;
    display: flex;
    align-items: center;
    height: 30px;
    .ant-picker,
    .ant-input-group-wrapper {
      width: 140px;
    }
    .ant-select,
    .ant-input,
    .ant-input-group {
      width: 120px;
    }
  }
`
const DetailContent = styled.div`
  display: "flex";
  justify-content: "center";
  flex-wrap: "wrap";
  > span {
    padding-left: 10px;
  }
`
const todayString = moment(new Date()).format("YYYY-MM-DD")

const pastDefault = {
  date: todayString,
  diseaseName: null,
  treatmentMethod: null,
  type: null,
  explain: null,
}
const surDefault = {
  date: todayString,
  surgicalName: null,
  type: null,
  explain: null,
}
const artDefault = {
  date: todayString,
  place: null,
  treatmentMethod: null,
  treatmentNumber: null,
  conclusion: null,
  explain: null,
}

export default
@inject("moredetail", "store")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSourceArt: props.data.artTreatmentHistoryVO,
      dataSourcePas: props.data.pastHistoryVO,
      dataSourceSur: props.data.surgicalHistoryVO,
      artobj: deepClone(artDefault),
      pastobj: deepClone(pastDefault),
      surobj: deepClone(surDefault),
      options: [], //既往病史下拉框分男女
    }
  }
  componentDidMount() {
    this.getOPtions()
  }
  //输入框取值
  setObjVal = async (obj, param, val) => {
    obj[param] = val
    await this.setState({
      obj,
    })
  }
  // 获取下拉框
  getOPtions = () => {
    let { select_one } = this.props.store
    apis.Patients_dishistory.getPreviousHistoryOptions(select_one).then(
      (res) => {
        this.setState({
          options: res.data,
        })
      }
    )
  }
  // 下拉框数据处理
  getSelectOption = (itemcode) => {
    let { options } = this.state
    let data = []
    options &&
      options.forEach((item, index) => {
        if (itemcode === item.itemCod) {
          data.push({
            value: item.optVal,
            lable: item.optVal,
          })
        }
      })
    return data
  }
  // 对应类型
  corresOptions = (val, itemcode) => {
    let { options } = this.state
    let data = []
    options &&
      options.forEach((item, index) => {
        if (itemcode === item.itemCod && val === item.optVal) {
          item.children.forEach((itemc, indexc) => {
            data.push({
              value: itemc.optVal,
              lable: itemc.optVal,
            })
          })
        }
      })
    return data
  }
  //删除表中行数据
  deleteRow = (datasource, param, index) => {
    let { dataSourcePas, dataSourceArt, dataSourceSur } = this.state
    let data = datasource
    data.splice(index, 1)
    this.setState({
      [param]: data,
    })
    this.setState({
      dataSourcePas: [...dataSourcePas],
      dataSourceArt: [...dataSourceArt],
      dataSourceSur: [...dataSourceSur],
    })
  }
  // 判断表格中的indexKey是否有值，如果有，则为修改，没有则是新增
  isHaveValue = (data) => {
    let defaults = false
    if (data.indexKey || data.indexKey === 0) {
      defaults = true
    } else {
      defaults = false
    }
    return defaults
  }
  modifyData = (data, upData) => {
    let obj = deepClone(data)
    upData.splice(data.indexKey, 1)
    upData.splice(data.indexKey, 0, { ...obj })
  }
  //提交至表格
  submit = (type) => {
    let {
      dataSourcePas,
      dataSourceArt,
      dataSourceSur,
      pastobj,
      surobj,
      artobj,
    } = this.state
    switch (type) {
      case "pastobj":
        if (!this.isHaveValue(pastobj)) {
          dataSourcePas.push(pastobj)
        } else {
          this.modifyData(pastobj, dataSourcePas)
        }
        pastobj = deepClone(pastDefault)
        this.setState({
          pastobj,
          dataSourcePas: [...dataSourcePas],
        })
        break
      case "surobj":
        if (!this.isHaveValue(surobj)) {
          dataSourceSur.push(surobj)
        } else {
          this.modifyData(surobj, dataSourceSur)
        }
        surobj = deepClone(surDefault)
        this.setState({
          surobj,
          dataSourceSur: [...dataSourceSur],
        })
        break
      case "artobj":
        if (!this.isHaveValue(artobj)) {
          dataSourceArt.push(artobj)
        } else {
          this.modifyData(artobj, dataSourceArt)
        }
        artobj = deepClone(artDefault)
        this.setState({
          artobj,
          dataSourceArt: [...dataSourceArt],
        })
        break
      default:
        break
    }
    let obj = {
      artTreatmentHistoryVO: dataSourceArt,
      pastHistoryVO: dataSourcePas,
      surgicalHistoryVO: dataSourceSur,
    }
    this.props.changeData(obj, "previousHistoryVO")
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({
        dataSourceArt: nextProps.data.artTreatmentHistoryVO,
        dataSourcePas: nextProps.data.pastHistoryVO,
        dataSourceSur: nextProps.data.surgicalHistoryVO,
      })
    }
  }
  // 修改固定的病史
  modifyHistory = (type, index, record) => {
    if (type === "past") {
      this.setState({
        pastobj: { ...record, indexKey: index },
      })
    }
    if (type === "sur") {
      this.setState({
        surobj: { ...record, indexKey: index },
      })
    }
    if (type === "art") {
      this.setState({
        artobj: { ...record, indexKey: index },
      })
    }
  }
  render() {
    let { renderOptions, todayString } = this.props.moredetail
    const { optionsData } = this.props
    const {
      artobj,
      pastobj,
      surobj,
      dataSourceArt,
      dataSourcePas,
      dataSourceSur,
    } = this.state
    const pastColumns = [
      {
        title: "类型",
        dataIndex: "type",
        width: 200,
        render: (text, record, index) => {
          const obj = {
            children: "既往病史",
            props: {},
          }
          obj.props.rowSpan = index === 0 ? dataSourcePas.length : 0
          return obj
        },
      },
      {
        title: "详情",
        render: (text, record, index) => {
          return (
            <DetailContent>
              <span> {record.date}</span>
              <span> {record.diseaseName}</span>
              <span> {record.type}</span>
              <span> {record.treatmentMethod}</span>
              <span> {record.explain}</span>
            </DetailContent>
          )
        },
      },
      {
        title: "操作",
        width: 100,
        render: (text, record, index) => {
          return (
            <DashBtn>
              <MinusOutlined
                onClick={() =>
                  this.deleteRow(dataSourcePas, "dataSourcePas", index)
                }
              />
            </DashBtn>
          )
        },
      },
    ] //既往病史
    const surColumns = [
      {
        title: "类型",
        dataIndex: "type",
        width: 200,
        render: (text, record, index) => {
          const obj = {
            children: "外伤手术史",
            props: {},
          }

          obj.props.rowSpan = index === 0 ? dataSourceSur.length : 0
          return obj
        },
      },
      {
        title: "详情",
        render: (text, record, index) => {
          return (
            <DetailContent>
              <span> {record.date}</span>
              <span> {record.surgicalName}</span>
              <span> {record.type}</span>
              <span> {record.explain}</span>
            </DetailContent>
          )
        },
      },
      {
        title: "操作",
        width: 100,
        render: (text, record, index) => {
          return (
            <DashBtn>
              <MinusOutlined
                onClick={() =>
                  this.deleteRow(dataSourceSur, "dataSourceSur", index)
                }
              />
            </DashBtn>
          )
        },
      },
    ] //外伤手术史
    const artColumns = [
      {
        title: "类型",
        dataIndex: "type",
        width: 200,
        render: (text, record, index) => {
          const obj = {
            children: "ART治疗史",
            props: {},
          }

          obj.props.rowSpan = index === 0 ? dataSourceArt.length : 0
          return obj
        },
      },
      {
        title: "详情",
        render: (text, record, index) => {
          return (
            <DetailContent>
              <span> {record.date}</span>
              <span> {record.place}</span>
              <span> {record.treatmentMethod}</span>
              <span> {record.treatmentNumber}</span>
              <span> {record.conclusion}</span>
              <span> {record.explain}</span>
            </DetailContent>
          )
        },
      },
      {
        title: "操作",
        width: 100,
        render: (text, record, index) => {
          return (
            <DashBtn>
              <MinusOutlined
                onClick={() =>
                  this.deleteRow(dataSourceArt, "dataSourceArt", index)
                }
              />
            </DashBtn>
          )
        },
      },
    ]
    let { sex } = this.props
    return (
      <div>
        {dataSourcePas.length > 0 ? (
          // 既往病史
          <BaseTable
            bordered
            columns={pastColumns}
            dataSource={[...dataSourcePas]}
            pagination={false}
            rowKey="uid"
            onRow={(record, index) => {
              return {
                onClick: () => this.modifyHistory("past", index, record),
              }
            }}
          />
        ) : null}
        {/* 外伤手术史 */}
        {dataSourceSur.length > 0 ? (
          <BaseTable
            bordered
            columns={surColumns}
            dataSource={[...dataSourceSur]}
            pagination={false}
            rowKey="uid"
            onRow={(record, index) => {
              return {
                onClick: () => this.modifyHistory("sur", index, record),
              }
            }}
          />
        ) : null}
        {/* art */}
        {dataSourceArt.length > 0 ? (
          <BaseTable
            bordered
            columns={artColumns}
            dataSource={[...dataSourceArt]}
            pagination={false}
            rowKey="uid"
            onRow={(record, index) => {
              return {
                onClick: () => this.modifyHistory("art", index, record),
              }
            }}
          />
        ) : null}
        <PastContent style={{ marginTop: "2em" }}>
          <div>既往病史</div>
          <div>类型</div>
          <div>疾病名称</div>
          <div>治疗方式</div>
          <div style={{ width: "30%" }}>说明</div>
        </PastContent>
        <PastContent>
          <div>
            <DatePicker
              allowClear={false}
              defaultValue={moment(todayString, dateFormat)}
              value={moment(pastobj.date)}
              onChange={(date, dateString) =>
                this.setObjVal(pastobj, "date", dateString)
              }
            />
          </div>
          <div>
            <Select
              showArrow={false}
              options={this.getSelectOption(sex ? "24" : "25")}
              value={pastobj.type || null}
              onChange={(val) => this.setObjVal(pastobj, "type", val)}
            />
          </div>
          <div>
            <Select
              value={pastobj.diseaseName || null}
              options={this.corresOptions(pastobj.type, sex ? "24" : "25")}
              showArrow={false}
              onChange={(val) => this.setObjVal(pastobj, "diseaseName", val)}
            />
          </div>
          <div>
            <Select
              showArrow={false}
              value={pastobj.treatmentMethod || null}
              onChange={(val) =>
                this.setObjVal(pastobj, "treatmentMethod", val)
              }
            >
              {renderOptions(optionsData, "26")}
            </Select>
          </div>
          <div style={{ width: "30%" }}>
            <Input
              value={pastobj.explain || null}
              style={{ width: "100%" }}
              onChange={(e) =>
                this.setObjVal(pastobj, "explain", e.target.value)
              }
            />
          </div>
          <div style={{ width: "10%" }}>
            <Button
              onClick={() => this.submit("pastobj")}
              type="primary"
              size="small"
            >
              提交
            </Button>
          </div>
        </PastContent>
        <PastContent>
          <div>外伤手术史</div>
          <div>类型</div>
          <div>手术名称</div>
          <div style={{ width: "45%" }}>说明</div>
        </PastContent>
        <PastContent>
          <div>
            <DatePicker
              allowClear={false}
              defaultValue={moment(todayString, dateFormat)}
              value={moment(surobj.date)}
              onChange={(date, dateString) =>
                this.setObjVal(surobj, "date", dateString)
              }
            />
          </div>
          <div>
            <Select
              value={surobj.type || null}
              options={this.getSelectOption(sex ? "28" : "300")}
              showArrow={false}
              onChange={(val) => this.setObjVal(surobj, "type", val)}
            />
          </div>
          <div>
            <Select
              value={surobj.surgicalName || null}
              options={this.corresOptions(surobj.type, sex ? "28" : "300")}
              showArrow={false}
              onChange={(val) => this.setObjVal(surobj, "surgicalName", val)}
            />
          </div>
          <div style={{ width: "45%" }}>
            <Input
              value={surobj.explain || null}
              style={{ width: "90%" }}
              onChange={(e) =>
                this.setObjVal(surobj, "explain", e.target.value)
              }
            />
          </div>
          <div style={{ width: "10%" }}>
            <Button
              onClick={() => this.submit("surobj")}
              type="primary"
              size="small"
            >
              提交
            </Button>
          </div>
        </PastContent>
        <PastContent>
          <div>ART治疗史</div>
          <div>地点</div>
          <div>治疗方式</div>
          <div>治疗次数</div>
          <div>结局</div>
          <div>说明</div>
        </PastContent>
        <PastContent>
          <div>
            <DatePicker
              allowClear={false}
              defaultValue={moment(todayString, dateFormat)}
              value={moment(artobj.date)}
              onChange={(date, dateString) =>
                this.setObjVal(artobj, "date", dateString)
              }
            />
          </div>
          <div>
            <Select
              value={artobj.place || null}
              showArrow={false}
              onChange={(val) => this.setObjVal(artobj, "place", val)}
            >
              {renderOptions(optionsData, "229")}
              <option></option>
            </Select>
          </div>
          <div>
            <Select
              value={artobj.treatmentMethod || null}
              showArrow={false}
              onChange={(val) => this.setObjVal(artobj, "treatmentMethod", val)}
            >
              {renderOptions(optionsData, "285")}
            </Select>
          </div>
          <div>
            <Input
              value={artobj.treatmentNumber || null}
              addonAfter="次"
              onChange={(e) =>
                this.setObjVal(
                  artobj,
                  "treatmentNumber",
                  parseInt(e.target.value)
                )
              }
            />
          </div>
          <div>
            <Select
              value={artobj.conclusion || null}
              showArrow={false}
              onChange={(val) => this.setObjVal(artobj, "conclusion", val)}
            >
              {renderOptions(optionsData, "29")}
            </Select>
          </div>
          <div>
            <Input
              value={artobj.explain || null}
              style={{ width: "100%" }}
              onChange={(e) =>
                this.setObjVal(artobj, "explain", e.target.value)
              }
            />
          </div>
          <div style={{ width: "10%" }}>
            <Button
              onClick={() => this.submit("artobj")}
              type="primary"
              size="small"
            >
              提交
            </Button>
          </div>
        </PastContent>
      </div>
    )
  }
}
