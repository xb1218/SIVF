import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { renderOptions } from "@/app/utils/tool.js"
import moment from "moment"
import { DatePicker, TimePicker, Select, Input, Button, message } from "antd"
import styled from "styled-components"
import apis from "@/app/utils/apis"
import "./index.scss"

const { TextArea } = Input
const format = 'HH:mm'
const dateFormat = 'YYYY-MM-DD'
const PatientContent = styled.div`
  background: #fff;
  border-radius: 2px;
  border-bottom: 10px;
  min-height: 500px;
`
const IllnessItem = styled.div`
  margin: 0px 20px 0px 20px;
`
const CirleDiv = styled.div`
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  border:2px solid #59B4F4;
`
const DealDiv = styled.div`
  background: #fff;
  border-radius: 2px;
  border-bottom: 10px;
  min-height: 500px;
  margin-left: 10px;
`
const ContentDiv = styled.div`
  margin: 20px;
`
const IntervalSpan = styled.span`
  display: inline-block;
  width: 10px;
`
const BaseTitle = styled.div`
  height: 40px;
  line-height: 40px;
  font-weight: 500;
  display: inline-block;

  .leftborder {
    vertical-align: middle;
    display: inline-block;
    margin: 0 10px;
    width: 2px;
    height: 14px;
    background-color: #59b4f4;
  }
`
export default
@inject("moredetail", "store")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      doctorList: [],
      pId: this.props.store.select_one.patientPid, //当前患者编号
      recordList: [], //当前患者病程记录集合
      requestObj: {}, //编辑数据
      selectUid: "", //选中的UID
    }
  }
  componentDidMount() {
    this.getDoctorListApi()
    this.searchData()
  }
  // 当父组件中的数组更改时，重新调用接口初始化
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.currentKey !== this.props.currentKey) {
      this.getDoctorListApi()
      this.searchData()
    }
  }
  //获取医生列表
  getDoctorListApi = () => {
    apis.IllnessRecord.getDoctorList().then(res => {
      if(res.code === 200){
        this.setState({
          doctorList: res.data
        })
      }
    })
  }
  //通过患者编号查询病程记录信息
  searchData = () => {
    let param = this.props.store.select_one 
    apis.IllnessRecord.searchData(param).then(res => {
      if(res.code === 200){
        this.setState({
          recordList: res.data ? [...res.data] : []
        },()=>{
          if(res.data?.length > 0){
            this.getCurrentRecord(res.data[0])
          }else{
            this.addRecord()
          }
        })
      }
    })
  }
  //更新状态数据
  setStateData = (param, val) => {
    let { requestObj } = this.state
    let tempData = requestObj
    tempData[param] = val
    this.setState({
      requestObj: tempData
    })
  }
  //点击新增，添加病程记录
  addRecord = () => {
    let tempData = {
      recordDate: moment().format("YYYY-MM-DD"),
      recordTime: moment().format("hh:mm"),
      recordContent: "",
      doctorName: "",
    }
    this.getCurrentRecord(tempData, true)
  }
  //获取当前病程
  getCurrentRecord = (data, nullMark) => {
    let obj = Object.assign({}, data)
    this.setState({
      selectUid: nullMark ? "" : data?.uid,
      requestObj: obj
    })
  }
  //校验所填信息是否完整
  checkData = () => {
    let { requestObj } = this.state
    if("uid" in requestObj){
      return "update"
    }else{
      return requestObj.recordContent !== "" && requestObj.doctorName !== "" ? "add" : "false"
    }
  }
  //save按钮保存
  save = () => {
    let resultMark = this.checkData()
    //可以进行病程更新
    if(resultMark === "update"){
      this.updateRecordApi()
    //可以进行病程新增
    }else if(resultMark === "add"){
      this.addRecordApi()
    //不可以进行病程新增
    }else{
      message.warning("请填写完整")
    }
  }
  //新增病程记录
  addRecordApi = () => {
    let { requestObj } = this.state
    let param = {
      recordDate: requestObj.recordDate,
      recordTime: requestObj.recordTime,
      recordContent: requestObj.recordContent,
      doctorName: requestObj.doctorName,
      patientParam: this.props.store.select_one
    }
    apis.IllnessRecord.addRecord(param).then(res => {
      if(res.code === 200){
        message.success(res.data)
        this.searchData()
      }
    })
  }
  //修改病程记录
  updateRecordApi = () => {
    let { requestObj } = this.state
    let param = {
      recordDate: requestObj.recordDate,
      recordTime: requestObj.recordTime,
      recordContent: requestObj.recordContent,
      doctorName: requestObj.doctorName,
      uid: requestObj.uid,
      patientParam: this.props.store.select_one
    }
    apis.IllnessRecord.update(param).then(res => {
      if(res.code === 200){
        message.success(res.data)
        this.searchData()
      }
    })
  }
  render() {
    let { doctorList, recordList, selectUid, requestObj } = this.state
    return (
      <div className="clinicRecord">
        <PatientContent>
          <BaseTitle>
            <div className="leftborder" />
            <span className="rightmargin">病程记录</span>
          </BaseTitle>
          <div 
            className="addStyle"
            onClick={this.addRecord}
          >
            +
          </div>
          {
            recordList.map((item, index) => {
              return(
                <>
                <IllnessItem key={index}>
                  <CirleDiv/>
                  <span className="leftTime">{item.recordDate} {item.recordTime}</span>
                  <div className="doctorpositon">
                    <svg
                      className="outDoctor"
                      aria-hidden="true"
                    >
                      <use xlinkHref="#icondoctor"></use>
                    </svg>
                  </div>
                  <span className="leftDoctor">{item.doctorName}</span>
                </IllnessItem>
                <div className={index + 1 === recordList.length ? "borderDivNull" : "borderDiv"} key={-1-index}>
                  <div 
                    className={item.uid === selectUid ? "leftInputOnf" : "leftInput"}
                    onClick={()=>{
                      this.getCurrentRecord(item)
                    }}
                  >
                    {
                      item.recordContent.split("\n").map(citem => {
                        return(
                          <><span className="spanText" key={citem}>{citem}</span><br/></>
                        )
                      })
                    }
                  </div>
                </div>
                </>
              )
            })
          }
        </PatientContent>
        <DealDiv>
          <ContentDiv>
            <DatePicker 
              value={moment(requestObj?.recordDate, dateFormat)} 
              onChange={(date, dateString) => {
                this.setStateData("recordDate", dateString)
              }} 
              format={dateFormat}
              allowClear={false}
            />
            <IntervalSpan/>
            <TimePicker 
              value={moment(requestObj?.recordTime, format)} 
              onChange={(val, str)=> {
                this.setStateData("recordTime", str)
              }} 
              format={format} 
              allowClear={false}
            />
            <div
              className="selectStyle">
              医生：
              <Select 
                value={requestObj?.doctorName}
                style={{width: "120px"}}
                onChange={(val)=>this.setStateData("doctorName", val)}
              >
                {renderOptions(doctorList, "278")}
              </Select>
            </div>
            <TextArea 
              value={requestObj?.recordContent}
              rows={8} 
              className="textInput"
              onChange={(val)=>this.setStateData("recordContent", val.target.value)}
            />
            <Button 
              type="primary" 
              className="saveBut"
              onClick={this.save}
            >保存</Button>
          </ContentDiv>
        </DealDiv>
      </div>
    )
  }
}
