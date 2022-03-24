import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { Input } from "antd"
import { BaseTable } from "@/app/components/base/baseTable"
import apis from "@/app/utils/apis"
import "./index.scss"

export default
@inject("moredetail", "store")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      medicalId: null, //查询药品的id
      spellCounts: [], //拼针统计
      spellNeedleDTOS: [], //拼针列表数据
    }
  }
  // 初始化
  componentDidMount() {
    let { id } = this.props
    let { medicalId } = this.state
    let queryid = id ? id : medicalId
    this.querySpells(queryid)
  }
  // 查询拼针列表
  querySpells = (id) => {
    let { putKeys } = this.props.moredetail
    apis.MedicalAdvice.searchSpell(id).then((res) => {
      putKeys(res.data.spellNeedleDTOS)
      putKeys(res.data.spellCounts)
      this.inputSpellerName(res.data.spellNeedleDTOS)
      this.setState({
        spellCounts: res.data.spellCounts,
        spellNeedleDTOS: res.data.spellNeedleDTOS,
      })
    })
  }
  // 将当前的患者填到相应的数据框里
  inputSpellerName = (data) => {
    let indexdefault = data.findIndex((item) => item.spellerName === null)
    data.forEach((item, index) => {
      if (index === indexdefault) {
        localStorage.setItem("spellListUid", item.uid)
      }
    })
  }
  // 改变当前的拼针人
  changeSpellerName = () => {}
  render() {
    let { getlocalQuery } = this.props.store
    let name = getlocalQuery("patientCard").femalePatientName
    let { spellCounts, spellNeedleDTOS } = this.state
    let columns = [
      {
        title: "日期",
        dataIndex: "spellDate",
        key: "spellDate",
      },
      {
        title: "开立人",
        dataIndex: "openerName",
        key: "openerName",
        render: (text, record) => {
          return (
            <>
              <div>{record.openerName}</div>
              <div>{record.openerPhone}</div>
            </>
          )
        },
      },
      {
        title: "拼针人",
        dataIndex: "spellerName",
        key: "spellerName",
        render: (text, record, index) => {
          return (
            <>
              {!record.spellerName ? (
                <Input value={name} />
              ) : (
                <span>{record.spellerName}</span>
              )}
            </>
          )
        },
      },
    ] //列表头部
    return (
      <div id="SpellCountDiv">
        <div className="spellTopDiv">
          {spellCounts.map((item, index) => {
            return (
              <div
                className={
                  index === 0 ? "topItemSpell borderItem" : "topItemSpell"
                }
                key={index}
              >
                <span className="itemSpell icon_male">{item.spellDate}</span>
                <span className="itemSpell">
                  已拼{item.spellCount}/{item.totalCount}人
                </span>
              </div>
            )
          })}
        </div>
        <div className="tableSpell">
          <BaseTable
            columns={columns}
            dataSource={spellNeedleDTOS}
            pagination={false}
          />
        </div>
      </div>
    )
  }
}
