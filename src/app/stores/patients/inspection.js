import List from "@/app/stores/list"
import { action, observable } from "mobx"
import apis from "@/app/utils/apis"

export default class Store {
  @observable currentNum = 1 //当前的第几个
  @observable abnormalProject = [] //体格检查异常项目
  @observable femalecheckOption = [] //妇科检查下拉框
  @observable malecheckOption = [] //男科检查下拉框
  @observable selectInspectionType = [] //验下拉框数据
  @observable selectCheckType = [] //查下拉框数据
  @observable physicalFemaleExaminationUid = null //女体格检查uid
  @observable physicalMaleExaminationUid = null //男体格检查uid
  @observable gynecologicalExaminationUid = null //妇科检查
  @observable maleExaminationUid = null //男科检查
  @observable inspectionProjectUids = [] //检查检验
  @observable hysterosalpingogramUid = null //子宫输卵管造影uid
  @observable gynecologicalUltrasoundUid = null //阴道B超
  @observable otherVideoProjectUids = []
  //判断当前所取性别,
  @action judgeSex = (sex, patientSex) => {
    let flagSex = sex === null ? patientSex : sex
    return flagSex
  }
  //左侧列表显示
  @action handleList = (param1, param2, sex, patientSex) => {
    let data =
      sex === null ? (patientSex ? param1 : param2) : sex ? param1 : param2
    return data
  }
  //患者参数
  @action selectPatient = (select_one, sex) => {
    if (sex === null) {
      //患者详情
      return select_one
    } else {
      //大病历
      let femalePatient = JSON.parse(localStorage.getItem("femalePatient"))
      let malePatient = JSON.parse(localStorage.getItem("malePatient"))
      if (sex) {
        return femalePatient
      } else {
        return malePatient
      }
    }
  }
  //查,验的下拉框数据处理
  @action handleInspectionType = (data, type) => {
    let selectObj = [{ itemCod: "1", ontopts: [] }]
    data &&
      data.forEach((item) => {
        item.inspectionConfigDTOS.forEach((citem) => {
          selectObj[0].ontopts.push({
            inspectionId: citem.id,
            itemCod: "1",
            optVal: citem.inspectionName,
          })
        })
      })
    if (type === "test") {
      this.selectInspectionType = selectObj
    } else {
      this.selectCheckType = selectObj
    }
  }
  //妇科下拉框
  @action getFemaleCheckOption = () => {
    apis.ManCheck.getcheckfemaleoption().then((res) => {
      this.femalecheckOption = res.data
    })
  }
  //男科下拉框
  @action getMaleCheckOption = () => {
    apis.ManCheck.getcheckmaleoption().then((res) => {
      this.malecheckOption = res.data
    })
  }
  //异常项目查询
  @action getAbnormalProject = (value) => {
    apis.ManCheck.getexceptioncheck({
      sex: value ? 1 : 0,
    }).then((res) => {
      let abnormal = this.changname(res.data[0].ontopts)
      this.abnormalProject = abnormal
    })
  }
  //处理异常项目
  @action changname = (value) => {
    return value.map((item, index) => {
      return {
        label: item.optVal,
        value: item.optVal,
      }
    })
  }

  //初始化当前次数
  @action initNum = () => {
    this.currentNum = 1
  }
  //病人详情改变当前次数
  @action changeNum = (index) => {
    this.currentNum = index + 1
  }

  @action judgeNum = (sex, index, citem, itemTitle) => {
    if (sex === null) {
      this.changeNum(index)
    } else {
      this.selectExamination(index, citem, itemTitle)
    }
  }
  //大病历中默认activationTag项
  @action judgeActivationTag = (sex, data) => {
    let numIndex = data.findIndex((item) => item.activationTag === 1)
    if (sex !== null) {
      if (numIndex === -1) {
        this.initNum()
      } else {
        this.changeNum(numIndex)
      }
    } else {
      this.initNum()
    }
  }

  //大病历，指定该周期病例里的检查日期
  @action selectExamination = (index, citem, itemTitle) => {
    switch (itemTitle) {
      case "女方体检":
        this.physicalFemaleExaminationUid = citem.uid
        break
      case "男方体检":
        this.physicalMaleExaminationUid = citem.uid
        break
      case "妇科检查":
        this.gynecologicalExaminationUid = citem.uid
        break
      case "男科检查":
        this.maleExaminationUid = citem.uid
        break
      case "化验单":
        if (this.judgeProjectUids(citem) !== -1) {
          this.inspectionProjectUids.splice(this.judgeProjectUids(citem), 1)
          this.addProjectUids("化验单", citem)
        } else {
          this.addProjectUids("化验单", citem)
        }
        break
      case "影像":
        if (this.judgeProjectUids(citem) !== -1) {
          this.otherVideoProjectUids.splice(this.judgeProjectUids(citem), 1)
          this.addProjectUids("影像", citem)
        } else {
          this.addProjectUids("影像", citem)
        }
        break
      case "阴道B超":
        this.gynecologicalUltrasoundUid = citem.uid
        break
      case "输卵管造影":
        this.hysterosalpingogramUid = citem.uid
        break
      default:
        break
    }
    this.currentNum = index + 1
  }
  //判断选中的化验单和影像
  @action judgeProjectUids = (citem) => {
    let judgeFlag = this.inspectionProjectUids.findIndex(
      (item) => item.projectName === citem.inspectionName
    )
    return judgeFlag
  }
  //添加选中的化验单和影像
  @action addProjectUids = (type, citem) => {
    if (type === "化验单") {
      this.inspectionProjectUids.push({
        projectName: citem.inspectionName,
        selectedExaminationUid: citem.uid,
      })
    } else {
      this.otherVideoProjectUids.push({
        projectName: citem.videoType,
        selectedExaminationUid: citem.uid,
      })
    }
  }

  static fromJS() {
    const store = new Store()
    store.list = new List(store, "aaa/bbb/ccc") //使用list说明 aaa/bbb/ccc为请求列表接口
    return store
  }
}
