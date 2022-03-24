import React, { Component } from "react"
import { observer, inject } from "mobx-react"

import { Input, Select } from "antd"
import BaseSelect from "@/app/components/base/baseSelect"
import "./index.css"
import { BaseTable } from "@/app/components/base/baseTable"
import { DatePicker } from 'antd'
import { CheckOutlined, CloseOutlined } from "@ant-design/icons"
import apis from "../../../utils/apis"

const { Option } = Select

export default
@inject("store", "inspection")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [
        {
          inspectionProjectName: "",
          resultTable: "阴性",
          unitRes: "",
          section1: "",
          section2: "",
          markIndex: 0
        }
      ], //化验单数据
      sex: ["全部", "男", "女"],
      sexIndex: 0,
      time: ["一年", "半年", "终身"],
      timeIndex: 0,
      result: ["阴性", "阳性", "input"],
      resultIndex: 0,
      belongList: ["本院", "外院", "第三方"],
      belong: "",
      typeList: [], //化验单类型列表
      date: "", //报告日期
      inspectionName: "", //化验单名称
      room: "", //送检科室
      version: "", //版本
      place: 0, //地点
      sexRes: 0, //性别
      inspectionType: "", //化验单类型
      effectiveType: "", //有效类型
      nomalMark: 0, //提示标记
    }
  }
  componentDidMount = () => {
    let { belongList } = this.state
    let { inspectionType } = this.props
    this.getTypeList(inspectionType)
    this.setState({
      belong: belongList[0]
    })
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if(nextProps.inspectionType !== this.props.inspectionType){
      this.getTypeList(nextProps.inspectionType)
    }
  }
  //获取所有化验单类型
  getTypeList = (data) => {
    let tempData = []
    data.forEach(element => {
      if(element.inspectionType !== "lis"){
        tempData.push(element.inspectionType)
      }
    })
    this.setState({
      typeList: [...tempData]
    })
    if(data.length > 0){
      this.setState({
        inspectionType: tempData[0]
      })
    }
  }
  changeSexIndex = () => {
    let { sexIndex } = this.state
    if(sexIndex === 2){
      this.setState({
        sexIndex: 0
      })
    }else{
      this.setState({
        sexIndex: sexIndex + 1
      })
    }
  }
  changeTimeIndex =() => {
    let { timeIndex } = this.state
    if(timeIndex === 2){
      this.setState({
        timeIndex: 0
      })
    }else{
      this.setState({
        timeIndex: timeIndex + 1
      })
    }
  }
  changeInput = (val, mark, index) => {
    let { dataSource } = this.state
    let tempData = dataSource
    tempData[index][mark] = val
    this.setState({
      dataSource: [...tempData]
    })
  }
  changeResultIndex = (record, index) => {
    let { dataSource } = this.state
    let tempData = dataSource
    if(record.markIndex === 0){
      tempData[index].resultTable = "阳性"
      tempData[index].markIndex = 1
      tempData[index].section1 = ""
      tempData[index].section2 = ""
    }else if(record.markIndex === 1){
      tempData[index].resultTable = ""
      tempData[index].markIndex = 2
    }else {
      tempData[index].resultTable = "阴性"
      tempData[index].markIndex = 0
      tempData[index].section1 = ""
      tempData[index].section2 = ""
    }
    this.setState({
      dataSource: [...tempData]
    })
  }
  deleteElement = (index) => {
    let { dataSource } = this.state
    let tempData = dataSource
    tempData.splice(index, 1)
    this.setState({
      dataSource: [...tempData]
    })
  }
  addElement = () => {
    let { dataSource } = this.state
    let tempData = dataSource
    let obj = {
      inspectionProjectName: "",
      resultTable: dataSource[dataSource.length -1].markIndex === 0 ?  "阴性"
      : dataSource[dataSource.length -1].markIndex === 1 ? "阳性" : "",
      unitRes: "",
      section1: "",
      section2: "",
      markIndex: dataSource[dataSource.length -1].markIndex
    }
    tempData.push(obj)
    this.setState({
      dataSource: [...tempData]
    })
  }
  setBelong = (e) => {
    this.setState({
      belong: e
    })
  }
  request = () => {
    let { 
      dataSource,
      inspectionName,
      date,
      belong,
      sexIndex,
      inspectionType,
      timeIndex,
    } = this.state
    let { closeModal, sex, getData } = this.props
    let { select_one } = this.props.store
    let { selectPatient } = this.props.inspection
    let tempArr = []
    dataSource.forEach((item, index) => {
      if(item.resultTable === "阴性" || item.resultTable === "阳性"){
        let tempObj1 = {
          inspectionProjectName: item.inspectionProjectName,
          resultOptionType: 0,
          inspectionProjectValue: item.resultTable,
          projectIndex: index,
          projectException: item.resultTable === "阳性" ? 1 : 0
        }
        tempArr.push(tempObj1)
      }else{
        let tempObj2 = {
          inspectionProjectName: item.inspectionProjectName,
          resultOptionType: 1,
          inspectionProjectValue: item.resultTable,
          unit: item.unitRes,
          range: item.section1 + "-" + item.section2,
          projectIndex: index,
          tips: (item.section1 !== "" && item.resultTable !== "" && item.resultTable !== null && parseFloat(item.resultTable) < parseFloat(item.section1)) ? -1 
          : (item.section2 !== "" && item.resultTable !== "" && parseFloat(item.resultTable) > parseFloat(item.section2)) ? 1 : 
          null,
          projectException: (item.section1 !== "" && item.resultTable !== "" && item.resultTable !== null && parseFloat(item.resultTable) < parseFloat(item.section1))
          || (item.section2 !== "" && item.resultTable !== "" && parseFloat(item.resultTable) > parseFloat(item.section2)) || item.resultTable === "阳性" ? 1 : 0
        }
        tempArr.push(tempObj2)
      }
    })
    let param = {
      patientParam:selectPatient(select_one, sex),
      inspectionName: inspectionName,
      date: date,
      place: belong === "本院" ? 0 : belong === "外院" ? 1 : 2,
      sex: sexIndex === 0 ? 2 : sexIndex === 1 ? 0 : 1,
      inspectionType: inspectionType,
      effectiveType: timeIndex === 0 ? 2 : timeIndex === 1 ? 1 : 0,
      createInspectionListDTOList: tempArr
    }
    apis.ManCheck.addCheckData(param).then(res => {
      getData("test")
    })
    let obj = {
      inspectionProjectName: "",
      resultTable: "阴性",
      unitRes: "",
      section1: "",
      section2: "",
      markIndex: 0
    }
    this.setState({
      dataSource: [obj]
    })
    closeModal()
  }
  changeDate = (date, dateString) => {
    this.setState({
      date: dateString
    })
  }
  changeType = (e) => {
    this.setState({
      inspectionType: e
    })
  }
  changeName = (e) => {
    this.setState({
      inspectionName: e.target.value
    })
  }
  render() {
    let { 
      dataSource, 
      sex, 
      sexIndex, 
      time, 
      timeIndex, 
      belong, 
      belongList,
      typeList,
      inspectionType,
      inspectionName,
    } = this.state
    let columns = [
      {
        title: "项目",
        dataIndex: "inspectionProjectName",
        key: "inspectionProjectName",
        width: 80,
        render: (text, record, index) => {
          return (
            <Input
              style={{ width: "98%" }}
              value={record.inspectionProjectName}
              onChange={(e) => {
                this.changeInput(e.target.value, "inspectionProjectName", index)
              }}
            />
          )
        },
      },
      {
        title: "结果",
        dataIndex: "resultTable",
        key: "resultTable",
        width: 70,
        render: (text, record, index) => {
          let { result} = this.state
          return (
            <Input
              style={{ width: "98%" }}
              value={record.resultTable}
              disabled={result[record.markIndex] === "input" ? false : true}
              onChange={(e) => {
                this.changeInput(e.target.value, "resultTable", index)
              }}
            />
          )
        },
      },
      {
        title: "",
        dataIndex: "change",
        key: "change",
        width: 1,
        render: (text, record, index) => {
          return (
            <svg 
              className="icon_girl" 
              aria-hidden="true"
              onClick={()=>{
                this.changeResultIndex(record, index)
              }}
            >
              <use xlinkHref="#iconqiehuan"></use>
            </svg>
          )
        },
      },
      {
        title: "单位",
        dataIndex: "unitRes",
        key: "unitRes",
        width: 70,
        render: (text, record, index) => {
          return (
            record.markIndex === 2 ?
            <Input
              style={{ width: "98%" }}
              value={record.unitRes}
              onChange={(e) => {
                this.changeInput(e.target.value, "unitRes", index)
              }}
            /> : "/"
          )
        },
      },
      {
        title: "参考区间",
        dataIndex: "section",
        key: "section",
        width:80,
        render: (text, record, index) => {
          return (
            record.markIndex === 2 ?
            <>
            <Input
              style={{ width: "40%" }}
              value={record.section1}
              onChange={(e) => {
                this.changeInput(e.target.value, "section1", index)
              }}
            />
            ~
            <Input
              style={{ width: "40%" }}
              value={record.section2}
              onChange={(e) => {
                this.changeInput(e.target.value, "section2", index)
              }}
            />
            </> : "/"
          )
        },
      },
      {
        title: "提示",
        dataIndex: "tishi",
        key: "tishi",
        width: 80,
        render: (text, record, index) => {
          return (
          <div>
            {record.resultTable !== "阴性" &&
            record.resultTable !== "阳性" &&
            record.resultTable !== "" &&
            record.section1 !== "" &&
            record.section2 !== "" ? (
              parseFloat(record.resultTable) > parseFloat(record.section2) ? (
                <svg className="icon_record" aria-hidden="true">
                  <use xlinkHref="#iconarrowup" />
                </svg>
              ) : (
                parseFloat(record.resultTable) < parseFloat(record.section1) ? (
                  <svg className="icon_record" aria-hidden="true">
                    <use xlinkHref="#icondownarrow" />
                  </svg>
                ) : (null)
              )
            ) : null}
          </div>
          )
        },
      },
      {
        title: 
        <span 
          style={{color:"blue"}}
          onClick={()=>{
            this.addElement()
          }}
        >+添加</span>,
        dataIndex: "tianjia",
        key: "tianjia",
        width:50,
        render: (text, record, index) => {
          return (
            <>
              {
                index === 0 ? null : 
                  <svg 
                    className="icon_girl" 
                    aria-hidden="true"
                    onClick={()=>this.deleteElement(index)}
                  >
                    <use xlinkHref="#iconjianhao"></use>
                  </svg>
              }
            </>
          )
        },
      }
    ]
    return (
      <>
      {
        this.props.showMark ? 
        <div className="content">
          <div className="top"></div>
          <Input 
            style={{marginRight:"20px", marginLeft:"0px"}}
            onChange={this.changeName}
            className="inputStyle"
            placeholder="化验单名"
            value={inspectionName}
          />
          <BaseSelect
            width={120}
            height={30}
            value={inspectionType}
            onChange={(e) =>
              this.changeType(e)
            }
          >
            {typeList.map((item, index) => (
              <Option key={index} value={item}>
                {item}
              </Option>
            ))}
          </BaseSelect> 
          <div className="margin"></div>
          <BaseSelect
            width={120}
            height={30}
            value={belong}
            onChange={(e) =>
              this.setBelong(e)
            }
          >
            {belongList.map((item, index) => (
              <Option key={index} value={item}>
                {item}
              </Option>
            ))}
          </BaseSelect> 
          <Input
            className="inputStyle"
            disabled={true}
            value={sex[sexIndex]}
          />
          <svg 
            className="icon_girl" 
            aria-hidden="true"
            onClick={() =>
              this.changeSexIndex()
            }
          >
            <use xlinkHref="#iconqiehuan"></use>
          </svg>
          <Input 
            className="inputStyle"
            disabled={true}
            value={time[timeIndex]}
          />
          <svg 
            className="icon_girl" 
            aria-hidden="true"
            onClick={() =>
              this.changeTimeIndex()
            }
          >
            <use xlinkHref="#iconqiehuan"></use>
          </svg>
          
          <CheckOutlined
            style={{ color: "#59B4F4", marginRight: 20, float:"right", marginTop:"8px" }}
            onClick={()=>{
              this.request()
            }}
          />
          <CloseOutlined 
            style={{ color: "red", float:"right", marginRight: 20, marginTop:"8px" }} 
            onClick={()=>{
              this.props.closeModal()
            }} 
          />
          <DatePicker 
            onChange={this.changeDate} 
            style={{float:"right", marginRight: 20}}
          />
          <div className="middle"></div>
          <BaseTable
            columns={columns}
            dataSource={dataSource}
            pagination={false}
          />
          <div className="bottom"></div>
        </div> : null
      }
      </>
    )
  }
}
