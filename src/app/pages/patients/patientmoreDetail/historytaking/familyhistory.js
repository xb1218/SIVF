import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { Select, Input, Switch, AutoComplete } from "antd"
import { FlexItem, FourItem } from "@/app/components/base/baseForms.js"
import { deepClone } from "@/app/utils/tool.js"
import apis from "@/app/utils/apis.js"

const { TextArea } = Input

export default
@inject("moredetail", "store")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      optionsData: props.optionsData,
      dataList: props.data,
      defaultObj: {
        name: "",
        type: "",
        multiple: "无",
        medicalHistoryType: null,
      },
      buliangList: props.data.adverseReproductiveOutcomeList, //不良生殖结局
      buyunList: props.data.infertilityOutcomeList, //不孕不育病史结局
      yichuanList: props.data.geneticOutcomeList, //遗传病史结局
      zhongliuList: props.data.tumorOutcomeList, //肿瘤结局
      shengzhiList: props.data.reproductiveOutcomeList, //生殖系统结局
      options: [], //家族史下拉框
    }
  }
  componentDidMount() {
    let { optionsData } = this.props
    this.setState({
      optionsData: optionsData,
    })
    this.getFamilyOption()
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.data !== this.props.data) {
      this.setState({
        dataList: nextProps.data,
        buliangList: nextProps.data.adverseReproductiveOutcomeList, //不良生殖结局
        buyunList: nextProps.data.infertilityOutcomeList, //不孕不育病史结局
        yichuanList: nextProps.data.geneticOutcomeList, //遗传病史结局
        zhongliuList: nextProps.data.tumorOutcomeList, //肿瘤结局
        shengzhiList: nextProps.data.reproductiveOutcomeList, //生殖系统结局
      })
    }
  }
  // 家族史下拉框的获取
  getFamilyOption = () => {
    let { select_one } = this.props.store
    apis.Patients_dishistory.getFamilyHistoryOptions(select_one).then((res) => {
      this.setState({
        options: res.data,
      })
    })
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
  //更新state数据
  setObjVal = (val, obj, param) => {
    let data = obj
    data[param] = val
    this.setState({
      obj: data,
    })
    this.upData()
  }
  // 表格数据更新
  setData = (val, data, parm, index) => {
    data[index][parm] = val
    this.upData()
  }
  // 更新 数据
  upData = () => {
    let {
      dataList,
      buliangList,
      buyunList,
      yichuanList,
      zhongliuList,
      shengzhiList,
    } = this.state
    dataList.adverseReproductiveOutcomeList = buliangList
    dataList.infertilityOutcomeList = buyunList
    dataList.geneticOutcomeList = yichuanList
    dataList.tumorOutcomeList = zhongliuList
    dataList.reproductiveOutcomeList = shengzhiList
    this.setState({ dataList })
    this.props.changeData(dataList, "familyHistoryV0")
  }
  //添加行
  setList = (list, param, index) => {
    const { defaultObj } = this.state
    let data = []
    this.judgeType(param)
    let newObj = deepClone(defaultObj)
    for (let m = 0; m < index; m++) {
      data.push({ ...newObj })
    }
    this.setState({
      [param]: [...data],
    })
  }
  // 判断添加的是哪一种类型的结局
  judgeType = (param) => {
    const { defaultObj } = this.state
    switch (param) {
      case "buliangList":
        defaultObj.medicalHistoryType = 0
        break
      case "buyunList":
        defaultObj.medicalHistoryType = 1
        break
      case "yichuanList":
        defaultObj.medicalHistoryType = 2
        break
      case "zhongliuList":
        defaultObj.medicalHistoryType = 3
        break
      case "shengzhiList":
        defaultObj.medicalHistoryType = 4
        break
      default:
        break
    }
  }
  //名称类型数量
  renderList = (data, itemcod) => {
    // 病史类型（0=不良生殖结局&1=不孕不育结局&2=遗传病史结局&3=肿瘤病史结局&4=生殖系统结局的结局
    return (
      data &&
      data.map((item, index) => {
        return (
          <div key={item + index}>
            <FourItem>
              <div>
                <span>类型</span>
                <AutoComplete
                  style={{ width: "180px" }}
                  dropdownMatchSelectWidth={180}
                  options={this.getSelectOption(itemcod)}
                  value={item.type}
                  onChange={(val) => this.setData(val, data, "type", index)}
                />
              </div>
              <div>
                <span>名称</span>
                <AutoComplete
                  style={{ width: "180px" }}
                  dropdownMatchSelectWidth={180}
                  options={this.corresOptions(data[index].type, itemcod)}
                  value={item.name}
                  onChange={(val) => this.setData(val, data, "name", index)}
                />
              </div>
              <div>
                <Select
                  style={{ width: 90 }}
                  value={item.multiple}
                  onChange={(val) => this.setData(val, data, "multiple", index)}
                >
                  {this.props.moredetail.renderOptions(
                    this.props.optionsData,
                    "224"
                  )}
                </Select>
                <span>发生</span>
              </div>
            </FourItem>
          </div>
        )
      })
    )
  }
  render() {
    let { renderOptions } = this.props.moredetail
    const {
      buliangList,
      buyunList,
      yichuanList,
      zhongliuList,
      shengzhiList,
      dataList,
    } = this.state
    const { optionsData } = this.props
    return (
      <div>
        <FlexItem>
          <div>
            <span>
              <span style={{ fontWeight: "bold" }}>父母</span> 近亲结婚
            </span>
            <Switch
              checked={dataList.parentalBloodline}
              onChange={(val) => {
                this.setObjVal(val ? 1 : 0, dataList, "parentalBloodline")
              }}
            />
          </div>
        </FlexItem>
        <FlexItem>
          <div>
            <span className="suffer">高血压</span>
            <span>关系</span>
            <Select
              mode="tags"
              style={{ minWidth: "65px" }}
              value={
                dataList.hypertensionKinship ? dataList.hypertensionKinship : []
              }
              onChange={(val) => {
                this.setObjVal(val.length + "人", dataList, "hypertension")
                this.setObjVal(val, dataList, "hypertensionKinship")
              }}
            >
              {renderOptions(optionsData, "30")}
            </Select>
          </div>
          {dataList.hypertensionKinship?.length ? (
            <>
              <div style={{ marginLeft: "3px" }}>
                <Select
                  value={dataList.hypertension || "无"}
                  style={{ width: 90 }}
                  showArrow={false}
                  onChange={(val) =>
                    this.setObjVal(val, dataList, "hypertension")
                  }
                >
                  {renderOptions(optionsData, "224")}
                </Select>
              </div>
              <div
                style={{ width: "100%", height: "0px", marginBottom: "10px" }}
              ></div>
            </>
          ) : null}

          <div>
            <span className="suffer">糖尿病</span>
            <span>关系</span>
            <Select
              mode="tags"
              style={{ minWidth: "65px" }}
              value={dataList.diabetesKinship || []}
              onChange={(val) => {
                this.setObjVal(val.length + "人", dataList, "diabetes")
                this.setObjVal(val, dataList, "diabetesKinship")
              }}
            >
              {renderOptions(optionsData, "30")}
            </Select>
          </div>
          {dataList.diabetesKinship?.length ? (
            <>
              <div style={{ marginLeft: "3px" }}>
                <Select
                  value={dataList.diabetes || "无"}
                  style={{ width: 90 }}
                  showArrow={false}
                  onChange={(val) => this.setObjVal(val, dataList, "diabetes")}
                >
                  {renderOptions(optionsData, "224")}
                </Select>
              </div>
              <div
                style={{ width: "100%", height: "0px", marginBottom: "10px" }}
              ></div>
            </>
          ) : null}

          <div>
            <span className="suffer">心脏病</span>
            <span>关系</span>
            <Select
              mode="tags"
              style={{ minWidth: "65px" }}
              value={dataList.cardiologyKinship || []}
              onChange={(val) => {
                this.setObjVal(val.length + "人", dataList, "cardiology")
                this.setObjVal(val, dataList, "cardiologyKinship")
              }}
            >
              {renderOptions(optionsData, "30")}
            </Select>
          </div>
          {dataList.cardiologyKinship?.length ? (
            <>
              <div style={{ marginLeft: "3px" }}>
                <Select
                  value={dataList.cardiology || "无"}
                  style={{ width: 90 }}
                  showArrow={false}
                  onChange={(val) =>
                    this.setObjVal(val, dataList, "cardiology")
                  }
                >
                  {renderOptions(optionsData, "224")}
                </Select>
              </div>
            </>
          ) : null}
        </FlexItem>

        <FourItem>
          <div>
            <span className="font_size_bold">不良生殖结局</span>
            <Select
              value={dataList.undesirableProcreationConclusion || "无"}
              style={{ width: 60 }}
              showArrow={false}
              onChange={(val) => {
                this.setObjVal(
                  val,
                  dataList,
                  "undesirableProcreationConclusion"
                )
                this.setList(buliangList, "buliangList", parseInt(val))
              }}
            >
              {renderOptions(optionsData, "225")}
            </Select>
          </div>
        </FourItem>
        {dataList.undesirableProcreationConclusion !== "无" &&
        dataList.undesirableProcreationConclusion !== null
          ? this.renderList(buliangList, "305")
          : null}
        <FourItem>
          <div>
            <span className="font_size_bold">不孕不育病史</span>
            <Select
              value={dataList.infertilityConclusion || "无"}
              style={{ width: 60 }}
              showArrow={false}
              onChange={(val) => {
                this.setObjVal(val, dataList, "infertilityConclusion")
                this.setList(buyunList, "buyunList", parseInt(val))
              }}
            >
              {renderOptions(optionsData, "225")}
            </Select>
          </div>
        </FourItem>
        {dataList.infertilityConclusion !== "无" &&
        dataList.infertilityConclusion !== null
          ? this.renderList(buyunList, "308")
          : null}
        <FourItem>
          <div>
            <span className="font_size_bold">遗传病史</span>
            <Select
              value={dataList.geneticHistoryConclusion || "无"}
              style={{ width: 60 }}
              showArrow={false}
              onChange={(val) => {
                this.setObjVal(val, dataList, "geneticHistoryConclusion")
                this.setList(yichuanList, "yichuanList", parseInt(val))
              }}
            >
              {renderOptions(optionsData, "225")}
            </Select>
          </div>
        </FourItem>
        {dataList.geneticHistoryConclusion !== "无" &&
        dataList.geneticHistoryConclusion !== null
          ? this.renderList(yichuanList, "311")
          : null}
        <FourItem>
          <div>
            <span className="font_size_bold">肿瘤病史</span>
            <Select
              value={dataList.tumorHistoryConclusion || "无"}
              style={{ width: 60 }}
              showArrow={false}
              onChange={(val) => {
                this.setObjVal(val, dataList, "tumorHistoryConclusion")
                this.setList(zhongliuList, "zhongliuList", parseInt(val))
              }}
            >
              {renderOptions(optionsData, "225")}
            </Select>
          </div>
        </FourItem>
        {dataList.tumorHistoryConclusion !== "无" &&
        dataList.tumorHistoryConclusion !== null
          ? this.renderList(zhongliuList, "313")
          : null}
        <FourItem>
          <div>
            <span className="font_size_bold">生殖系统结局</span>
            <Select
              value={dataList.reproductiveSystemConclusion || "无"}
              style={{ width: 60 }}
              showArrow={false}
              onChange={(val) => {
                this.setObjVal(val, dataList, "reproductiveSystemConclusion")
                this.setList(shengzhiList, "shengzhiList", parseInt(val))
              }}
            >
              {renderOptions(optionsData, "225")}
            </Select>
          </div>
        </FourItem>
        {dataList.reproductiveSystemConclusion !== "无" &&
        dataList.reproductiveSystemConclusion !== null
          ? this.renderList(shengzhiList, "315")
          : null}
        <FourItem>
          <div style={{ width: "100%" }}>
            <span style={{ fontWeight: "bold" }}>备注</span>
            <TextArea
              style={{ width: "100%", height: "30px" }}
              value={dataList.others}
              onChange={(e) => {
                this.setObjVal(e.target.value, dataList, "others")
              }}
              rows={2}
            />
          </div>
        </FourItem>
      </div>
    )
  }
}
