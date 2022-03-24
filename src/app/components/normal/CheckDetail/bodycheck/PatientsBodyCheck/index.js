import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import { Spin } from "antd"
import { LoadingDiv } from "@/app/components/base/baseDiv"
import FemaleBodyOperate from "./femalebodyOperate"
import MaleBodyOperate from "./malebodyOperate"
import FemaleOperate from "./femaleOperate"
import MaleOperate from "./maleOperate"
import BodyCheck from "./bodyCheck"
import apis from "@/app/utils/apis"

export default
@inject("store", "inspection")
@observer
class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: true, //添加修改？显示
      initFlag: false, //数据是否请求成功
      checkdata: [], //体格检查数据
      operateData: [], //添加修改要操作的数据
      count: 0, //类型总数
      handleTag: true,
    }
  }

  componentDidMount() {
    this.props.onRef(this)
    this.getBodyCheck()
  }
  //体格检查初始化
  getBodyCheck = () => {
    let { select_one, patientSex } = this.props.store
    if (this.props.sex === null) {
      //患者详情
      patientSex
        ? this.getFemaleBodyCheck(select_one)
        : this.getMaleBodyCheck(select_one)
    } else {
      //大病历
      let femalePatient = JSON.parse(localStorage.getItem("femalePatient"))
      let malePatient = JSON.parse(localStorage.getItem("malePatient"))
      this.props.sex
        ? this.getFemaleBodyCheck(femalePatient)
        : this.getMaleBodyCheck(malePatient)
    }
  }
  //女方体格检查
  getFemaleBodyCheck = (data) => {
    let { getAbnormalProject } = this.props.inspection
    apis.ManCheck.getwomanhysicalcheck(data).then((res) => {
      this.judgeActivationTag(res.data)
      this.setState({
        count: res.data.length,
        checkdata: res.data,
        initFlag: true,
      })
    })
    getAbnormalProject(1)
  }
  //男体格检查
  getMaleBodyCheck = (data) => {
    let { getAbnormalProject } = this.props.inspection
    apis.ManCheck.getmanphysicalcheck(data).then((res) => {
      this.judgeActivationTag(res.data)
      this.setState({
        count: res.data.length,
        checkdata: res.data,
        initFlag: true,
      })
    })
    getAbnormalProject(0)
  }
  //检查初始化
  getCheck = () => {
    let { typeTitle } = this.props
    let { select_one } = this.props.store
    if (this.props.sex === null) {
      //详情
      typeTitle === "妇科检查"
        ? this.initFemaleCheck(select_one)
        : this.initMaleCheck(select_one)
    } else {
      //大病历
      let femalePatient = JSON.parse(localStorage.getItem("femalePatient"))
      let malePatient = JSON.parse(localStorage.getItem("malePatient"))
      typeTitle === "妇科检查"
        ? this.initFemaleCheck(femalePatient)
        : this.initMaleCheck(malePatient)
    }
  }
  //妇科检查
  initFemaleCheck = (data) => {
    let { getFemaleCheckOption } = this.props.inspection
    apis.ManCheck.getcheckfemale(data).then((res) => {
      this.judgeActivationTag(res.data)
      this.setState({
        count: res.data.length,
        checkdata: res.data,
        initFlag: true,
      })
    })
    getFemaleCheckOption()
  }
  //男科检查
  initMaleCheck = (data) => {
    let { getMaleCheckOption } = this.props.inspection
    apis.ManCheck.getmancheck(data).then((res) => {
      this.judgeActivationTag(res.data ? res.data : [])
      this.setState({
        count: res.data ? res.data.length : 0,
        checkdata: res.data ? res.data : [],
        initFlag: true,
      })
    })
    getMaleCheckOption()
  }

  //判断是否活动
  judgeActivationTag = (data) => {
    let { judgeActivationTag } = this.props.inspection
    let { sex } = this.props
    judgeActivationTag(sex, data)
  }

  //切换到添加和修改页面
  changeVisible = (item) => {
    let { visible } = this.state
    this.setState({
      operateData: item,
      visible: !visible,
    })
  }
  //关闭添加和修改
  close = () => {
    let { visible } = this.state
    this.setState({
      visible: !visible,
    })
  }

  render() {
    let { sex, typeTitle } = this.props
    let {
      visible,
      initFlag,
      count,
      checkdata,
      operateData,
      handleTag,
    } = this.state
    return (
      <div>
        {visible ? (
          initFlag ? (
            <BodyCheck
              typeTitle={typeTitle}
              checkData={checkdata}
              count={count}
              sex={sex}
              changeVisible={this.changeVisible}
            />
          ) : (
            <LoadingDiv>
              <Spin />
            </LoadingDiv>
          )
        ) : initFlag ? (
          typeTitle === "女方体检" ? (
            <FemaleBodyOperate
              typeTitle={typeTitle}
              operateData={operateData}
              handleTag={handleTag}
              sex={sex}
              getData={this.getBodyCheck}
              close={this.close}
            />
          ) : typeTitle === "男方体检" ? (
            <MaleBodyOperate
              typeTitle={typeTitle}
              operateData={operateData}
              handleTag={handleTag}
              sex={sex}
              close={this.close}
              getData={this.getBodyCheck}
            />
          ) : typeTitle === "妇科检查" ? (
            <FemaleOperate
              typeTitle={typeTitle}
              operateData={operateData}
              handleTag={handleTag}
              sex={sex}
              getData={this.getCheck}
              close={this.close}
            />
          ) : (
            <MaleOperate
              typeTitle={typeTitle}
              operateData={operateData}
              handleTag={handleTag}
              sex={sex}
              close={this.close}
              getData={this.getCheck}
            />
          )
        ) : (
          <LoadingDiv>
            <Spin />
          </LoadingDiv>
        )}
      </div>
    )
  }
}
