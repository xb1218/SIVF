import React, { Component } from "react"
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons"
import { observer, inject } from "mobx-react"
import { Spin, Collapse, Button, message } from "antd"
import { BaseCollapse } from "@/app/components/base/baseCollapse"
import { LoadingDiv } from "@/app/components/base/baseDiv"
import PanelTag from "@/app/components/normal/PanelTag"
import PastHistory from "./pasthistory"
import Menstrualhistory from "./menstrualhistory"
import Familyhistory from "./familyhistory"
import Marryhistory from "./marryhistory"
import Personally from "./personally"
import IrriHistory from "./irritability"
import EpidemicHistory from "./epidemicHistory"
import apis from "@/app/utils/apis.js"
import { handleDefault } from "@/app/utils/tool.js"
import {
  personData,
  irriData,
  menData,
  maleMarryData,
  femaleMarryData,
  familyData,
} from "./defaultData"
const { Panel } = Collapse

export default
@inject("moredetail", "store")
@observer
class index extends Component {
  constructor() {
    super()
    this.state = {
      defaultKey: [
        "menstr",
        "marry",
        "past",
        "family",
        "irri",
        "personaly",
        "epidemic",
      ], //默认选中的状态
      selectArr: [
        "menstr",
        "marry",
        "past",
        "family",
        "irri",
        "personaly",
        "epidemic",
      ],
      initFlag: false,
      familyHistoryV0: null,
      menstrualHistoryVO: null,
      allergicHistoryVO: null,
      personalHistoryVO: null,
      previousHistoryVO: null,
      optionArry: [], //下拉框值
    }
  }
  componentDidMount() {
    this.props.onRef && this.props.onRef(this)
    this.refresh()
    this.initOption()
  }
  // 刷新接口
  refresh = () => {
    let { name, sex } = this.props
    if (name && name === "bigRecordHistory") {
      let male = JSON.parse(localStorage.getItem("malePatient"))
      let female = JSON.parse(localStorage.getItem("femalePatient"))
      if (sex) {
        this.initPage(female)
      } else {
        this.initPage(male)
      }
    } else {
      this.initPage()
    }
  }
  // 当父组件中的数组更改时，重新调用接口初始化
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.currentKey !== this.props.currentKey ||
      nextProps.patientId !== this.props.patientId
    ) {
      setTimeout(() => {
        this.initPage()
      }, 1)
    }
  }
  initPage = (data) => {
    let { select_one } = this.props.store
    apis.Patients_dishistory.initdisHistory(data ? data : select_one).then(
      (res) => {
        this.setState({
          initFlag: true,
          familyHistoryV0: handleDefault(res.data.familyHistoryVO, familyData),
          menstrualHistoryVO: handleDefault(
            res.data.menstrualHistoryVO,
            menData
          ),
          allergicHistoryVO: handleDefault(
            res.data.allergicHistoryVO,
            irriData
          ),
          personalHistoryVO: handleDefault(
            res.data.personalHistoryVO,
            personData
          ),
          previousHistoryVO: res.data.previousHistoryVO,
          femaleMaritalHistoryVO: handleDefault(
            res.data.femaleMaritalHistoryVO,
            femaleMarryData
          ),
          maleMaritalHistoryVO: handleDefault(
            res.data.maleMaritalHistoryVO,
            maleMarryData
          ),
        })
      }
    )
    this.Epidemic && this.Epidemic.getOption()
  }
  // 病史下拉框
  initOption = () => {
    //（病史下拉框）
    apis.Patients_dishistory.initOptions().then((res) => {
      this.setState({
        optionArry: res.data,
      })
    })
  }
  // 子组件修改父组件值的方法
  changeData = (data, paramObj) => {
    this.setState({
      [paramObj]: data,
    })
  }
  //判断当前患者为谁
  judgePatient = (obj) => {
    let { name, sex } = this.props
    if (name && name === "bigRecordHistory") {
      if (sex) {
        obj.patientParam = JSON.parse(localStorage.getItem("femalePatient"))
      } else {
        obj.patientParam = JSON.parse(localStorage.getItem("malePatient"))
      }
    } else {
      obj.patientParam = this.props.store.select_one
    }
  }
  //保存方法
  saveAll = (tag) => {
    let {
      familyHistoryV0,
      menstrualHistoryVO,
      personalHistoryVO,
      allergicHistoryVO,
      previousHistoryVO,
      femaleMaritalHistoryVO,
      maleMaritalHistoryVO,
    } = this.state
    let obj = {
      menstrualHistoryVO: menstrualHistoryVO,
      femaleMaritalHistoryVO: femaleMaritalHistoryVO,
      maleMaritalHistoryVO: maleMaritalHistoryVO,
      familyHistoryVO: familyHistoryV0,
      previousHistoryVO: previousHistoryVO,
      personalHistoryVO: personalHistoryVO,
      allergicHistoryVO: allergicHistoryVO,
    }
    this.judgePatient(obj)
    apis.Patients_dishistory.savedisHistory(obj).then((res) => {
      if (res.code === 200) {
        this.props.store.initCard("patient")
        this.refresh()
        if (!tag) {
          message.success(res.data)
        }
      }
    })
  }
  saveData = (tag) => {
    this.Epidemic && this.Epidemic.saveList()
  }
  // 判断当前应该按照哪个患者的性别
  judgeSex = () => {
    let { patientSex } = this.props.store
    let { sex, name } = this.props
    if (name && name === "bigRecordHistory") {
      return sex
    } else {
      return patientSex
    }
  }
  render() {
    let {
      initFlag,
      familyHistoryV0,
      menstrualHistoryVO,
      personalHistoryVO,
      allergicHistoryVO,
      previousHistoryVO,
      femaleMaritalHistoryVO,
      maleMaritalHistoryVO,
      optionArry,
      defaultKey,
      selectArr,
    } = this.state
    let sex = this.judgeSex()
    return (
      <div>
        {initFlag ? (
          <BaseCollapse
            ghost
            defaultActiveKey={defaultKey}
            destroyInactivePanel={true}
            expandIcon={({ isActive }) =>
              isActive ? <CaretUpOutlined /> : <CaretDownOutlined />
            }
            className="monitor-collapse"
            onChange={(val) => {
              this.setState({
                selectArr: val,
              })
              this.saveAll(1)
            }}
          >
            {sex === 1 ? (
              <Panel header={<PanelTag title="月经史" />} key="menstr">
                {(sex === 0 && defaultKey === "menstr") ||
                (sex === 1 && selectArr.indexOf("menstr") !== -1) ? (
                  <Menstrualhistory
                    optionsData={optionArry}
                    data={menstrualHistoryVO}
                    changeData={(data, parm) => this.changeData(data, parm)}
                  />
                ) : null}
              </Panel>
            ) : null}

            <Panel header={<PanelTag title="婚育史" />} key="marry">
              {defaultKey === "marry" || selectArr.indexOf("marry") !== -1 ? (
                <Marryhistory
                  optionsData={optionArry}
                  data={femaleMaritalHistoryVO} //女方婚育史
                  dataMale={maleMaritalHistoryVO} //男方婚育史
                  changeData={(data, parm) => this.changeData(data, parm)}
                  sex={sex}
                />
              ) : null}
            </Panel>
            <Panel header={<PanelTag title="既往史" />} key="past">
              {selectArr.indexOf("past") !== -1 ? (
                <PastHistory
                  optionsData={optionArry}
                  data={previousHistoryVO}
                  changeData={(data, parm) => this.changeData(data, parm)}
                  sex={sex}
                />
              ) : null}
            </Panel>
            <Panel header={<PanelTag title="家族史" />} key="family">
              {selectArr.indexOf("family") !== -1 ? (
                <Familyhistory
                  optionsData={optionArry}
                  data={familyHistoryV0}
                  changeData={(data, parm) => this.changeData(data, parm)}
                />
              ) : null}
            </Panel>
            <Panel header={<PanelTag title="过敏史" />} key="irri">
              {selectArr.indexOf("irri") !== -1 ? (
                <IrriHistory
                  data={allergicHistoryVO}
                  changeData={(data, parm) => this.changeData(data, parm)}
                />
              ) : null}
            </Panel>
            <Panel header={<PanelTag title="个人史" />} key="personaly">
              {selectArr.indexOf("personaly") !== -1 ? (
                <Personally
                  optionsData={optionArry}
                  data={personalHistoryVO}
                  changeData={(data, parm) => this.changeData(data, parm)}
                />
              ) : null}
            </Panel>
            <Panel header={<PanelTag title="流行病学史" />} key="epidemic">
              {selectArr.indexOf("epidemic") !== -1 ? (
                <EpidemicHistory
                  optionsData={optionArry}
                  onRef={(ref) => (this.Epidemic = ref)}
                />
              ) : null}
            </Panel>
            <div
              className="linetop"
              style={{ textAlign: "center", margin: "1.5em 0" }}
            >
              <Button
                type="primary"
                onClick={() => {
                  this.saveAll()
                  this.saveData()
                }}
              >
                保存
              </Button>
            </div>
          </BaseCollapse>
        ) : (
          <LoadingDiv>
            <Spin />
          </LoadingDiv>
        )}
      </div>
    )
  }
}
