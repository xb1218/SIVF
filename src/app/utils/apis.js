import _superagent from "superagent"
import superagentPromise from "superagent-promise"
import config from "@/app/config"
import { getToken } from "./localTools"
import { message } from "antd"
import qs from "qs"

export const superagent = superagentPromise(_superagent, Promise)
const responseBody = (res) => res.body
const responseDispose = (res) => ({
  dataList: res.body,
  totalCount: res.header["x-total-count"] * 1,
})
const handleError = (err) => {
  // time out
  if (err.errno === "ETIME") {
    message.error("响应超时")
    return Promise.reject({ resolved: true })
  }

  // 本系统的逻辑受 server 端影响，reject 也设置为返回 res 以供前端逻辑处理
  if (err.status === 401) {
    // message.error("登录超时")
    window.location.href = "/public/login"
  }

  if (err.status === 503) {
    message.error("服务不可用")
    return Promise.reject({ resolved: true })
  }

  if (err.status === 500) {
    message.error("服务器异常")
    return Promise.reject({ resolved: true })
  }

  if (err.status === 404) {
    message.error("请求地址错误")
    return Promise.reject({ resolved: true })
  }

  //  network unavailable
  if (!err.status) {
    message.error("网络异常")
    return Promise.reject({ resolved: true })
  }
  return Promise.reject(err.response.body)
}

const tokenPlugin = (req) => {
  const token = getToken()
  if (token) {
    req.set("Authorization", token)
  }
}
// 信息化采集头
const cdnPlugin = (req) => {
  req.set("Secret", "C6DA9FC38E622E27AC76EB5E0AD00868")
}
export const catchError = (err) => {
  if (!err.resolved) message.error(err.message)
}
const request = {
  getMessage: (url, queryMap = {}) =>
    superagent
      .get(`${config.messageBackend}${url}`)
      .use(cdnPlugin)
      .query(queryMap)
      .then(responseBody, handleError),
  get: (url, queryMap = {}) =>
    superagent
      .get(`${config.backend}${url}`)
      .use(tokenPlugin)
      .query(queryMap)
      .then(responseBody, handleError),
  post: (url, body) =>
    superagent
      .post(`${config.backend}${url}`)
      .send(body)
      .use(tokenPlugin)
      .then(responseBody, handleError),
  posts: (url, body) =>
    superagent
      .post(`${config.backend}${url}`)
      .send(qs.stringify(body))
      .use(tokenPlugin)
      .then(responseBody, handleError),
  postToken: (url, body) =>
    superagent
      .post(`${config.backend}${url}`)
      .type("application/json")
      .send(body)
      .use(tokenPlugin)
      .then(responseBody, handleError),
  put: (url, body) =>
    superagent
      .put(`${config.backend}${url}`)
      .send(body)
      .use(tokenPlugin)
      .then(responseBody, handleError),
  putIM: (url, queryMap) =>
    superagent
      .put(`${config.backend}${url}`)
      .query(queryMap)
      .use(tokenPlugin)
      .then(responseBody, handleError),
  delete: (url, queryMap) =>
    superagent
      .del(`${config.backend}${url}`)
      .use(tokenPlugin)
      .query(queryMap)
      .then(responseBody, handleError),
  getListDispose: (url, queryMap = {}) =>
    superagent
      .get(`${config.backend}${url}`)
      .use(tokenPlugin)
      .query(queryMap)
      .then(responseDispose, handleError),
}
// LIS相关接口
const getList = {
  // 获取当天该人的所有的血激素(卵泡监测,随访)
  getAllBloodList: (pid, body) =>
    request.get(`/inspection/bloodHormones/${pid}`, body),
  // 批量获取一群人的血激素（卵泡监测）
  getPeopleBloodList: (body) => request.post("/inspection/bloodHormones", body),
  // 批量获取一群人的血激素(随访)
  getFollowBloodList: (body) =>
    request.post("/inspection/bloodHormones/followUp", body),
}
// 信息化采集接口调用
const collection = {
  getAgreenData: (body) => request.getMessage("/home/models", body),
}
// 用户操作
const Auth = {
  loginout: (name) => request.post("/logout?userName=" + name),
  // refresh: (path, body) =>
  //   request.postToken(`/${path}`, body),
}
//查询所有下拉框的接口
const selectdata = {
  getselect: (body) => request.get("/allOntops"),
}
// 设置系统时间
const Time = {
  // 设置时间
  setTime: (body) => request.get("/time/set", body),
  // 恢复现在的时间
  resertTime: () => request.get("/time/reset"),
}
const Mensturation = {
  // 获取月经史
  getHistory: (body) => request.get("/diseaseHistory/menstrualHistory", body),
  // 保存月经史
  saveHistory: (body) => request.post("/diseaseHistory/menstrualHistory", body),
}
// 模板
const Template = {
  // 查询模板（0是IUI手术模板，1是现病史模板）
  getTempalte: (type) => request.get(`/templates/${type}`),
  // 新增模板
  addTempalte: (body) => request.post("/template", body),
  // 修改模板
  modifyTempalte: (body) => request.put("/template", body),
  // 删除模板
  delTempalte: (uid) => request.delete(`/template/${uid}`),
}
// 留言功能
const Message = {
  // 查询自己发的留言
  postMessage: () => request.get("/message/send"),
  // 发送留言
  addMessage: (body) => request.put("/message", body),
  // 查询自己收到的留言
  getMessage: () => request.get("/message/receive"),
  // 获取要发送的用户下拉框
  userMessage: () => request.get("/message/users"),
}
//男女基本信息
const Patients_info = {
  //基本信息
  getInfo: (body) => request.get("/baseInfo", body),
  //搜索配偶
  searchSpouse: (body) => request.get("/baseInfo/spouses", body),
  //新增配偶
  addSpouse: (body) => request.post("/baseInfo/spouse", body),
  //绑定夫妻关系
  batchSpouse: (body) => request.put("/baseInfo/spouse/batch", body),
  // 入组保存
  patientGroup: (body) => request.put("/patientList/group", body),
  //保存特殊标记
  saveMarkData: (body) => request.post("/baseInfo/tips", body),
}
//患者搜索
const Patients_search = {
  getPatients: (body) => request.get("/reservation/patient", body),
  addPatients: (body) => request.post("/reservation/patient", body),
}
//患者列表
const Patients_list = {
  // 获取详情中的患者列表
  getPatientList: (body) => request.get("/patientList/couple", body),
  addPatients: (body) => request.post("/patientList/patient", body),
  //修改初复诊标记
  modifyTag: (body) =>
    request.put(`/patientList/outTag?reservationUid=${body}`),
}
// pending列表
const PatientList_pending = {
  // 查询pengding列表
  getPendingList: (body) => request.get("/reservation/pending", body),
  // 保存pengding列表
  modifyPendingList: (body) => request.put("/reservation/pending", body),
  // 获取所有的组别
  getAllGroups: (body) => request.get("/reservation/groups", body),
  // 删除penging预约
  deletePending: (uid) => request.delete(`/reservation/pending/${uid}`),
}
//更多患者
const Patients_more = {
  // 超期未返诊
  getOverduelist: (body) => request.post("/morePatient/overdueReturn", body),
  getMorePatiens: (body) => request.post("/morePatient", body),
  addPatien2ts: (body) => request.post("/reservation/patient", body),
}
//就诊履历
const Patients_history = {
  //查询就诊履历
  getMedicalHistory: (body) => request.get("/medicalHistory", body),
  //查看初诊病历
  getMedicalFirst: (body) => request.get("/medicalHistory/initial", body),
  //查看复诊病历
  getMedicalSecond: (body) => request.get("/medicalHistory/further", body),
  // 查看大病历
  getBigHistory: (body) => request.get("/html/cycle", body),
}
//初诊病历
const Patients_firstList = {
  //查看初诊病例
  getfirstList: (body) => request.get("/outpatient/initial", body),
  //查看初始化主诉
  getfirstComplainant: (body) => request.get("/outpatient/complainant", body),
  //保存主诉
  saveComplainant: (body) => request.post("/outpatient/complainant", body),
}
//复诊病历
const Patients_secondList = {
  //初始化-获取周期信息
  getsecondList: (body) => request.get("/outpatient/further", body),
}
//病人详情--检查检验
const Patients_checkout = {
  //指定lis化验单的分类和化验单名
  categoryname: (body) => request.post("/inspection/category_name", body),
  //查询遗传学检查
  inspectionget: (body) =>
    request.get("/inspection/geneticExamination/search", body),
  //保存遗传学检查
  inspectionsave: (queryMap) =>
    request.post("/inspection/geneticExamination", queryMap),
  //查询检查检验类型
  gettypes: (body) => request.get("/inspection/type", body),
  //查询新增某一类型下的项目
  getAddtypes: (body) => request.get("/inspection/add/init", body),
  //查询某一类型下的项目
  getprojects: (body) => request.get("/inspection/project/search", body),
  //保存当前项目
  projectsave: (body) => request.post("/inspection/project", body),
}
//病人详情--卵泡监测
const Patients_monitor = {
  //初始化-用药视图
  getMedInit: (body) => request.get("/follicleMonitoring/medicineView", body),
  //初始化-就诊视图
  getVisInit: (body) => request.get("/follicleMonitoring/visitView", body),
  //初始化-启动情况
  getActInit: (body) => request.get("/follicleMonitoring/activation", body),
  //初始化-b超
  getOvumInit: (body) => request.get("/follicleMonitoring/ultrasound", body),
  //初始化-下拉框
  getOptionInit: (body) => request.get("/follicleMonitoring/ontopt", body),
  //初始化-血激素
  getbloodInit: (body) => request.get("/follicleMonitoring/bloodHormone", body),
  //初始化-方案
  getPlanInit: (body) => request.get("/follicleMonitoring/cyclePlan", body),
  //初始化-获取周期信息
  getCycle: (body) => request.get("/follicleMonitoring/cycleInfo", body),
  /////////////////////////////////-------⬆️
  //修改保存方案
  savePlane: (body) => request.put("/follicleMonitoring/cyclePlan", body),
  //初始化
  initMonitor: (body) => request.get("/follicleMonitoring", body),
  //根据日期单独查询卵泡监测
  getOvum: (body) => request.get("/follicleMonitoring/follicle", body),
  //卵泡监测情况-医嘱
  getAdvice: (body) => request.get("/follicleMonitoring/follicle/advice", body),
  //卵泡监测情况-用药
  getMedication: (body) =>
    request.get("/follicleMonitoring/follicle/medication", body),
  //保存b超
  saveBchao: (body) => request.post("/follicleMonitoring/ultrasound", body),
  //保存血激素
  saveBlood: (body) => request.post("/follicleMonitoring/bloodHormone", body),
  // 卵泡监测修订记录
  revisionRecord: (body) => request.get("/follicleMonitoring/logs", body),
  // 获取修订记录中对应模块的数据
  getRevisionData: (body) =>
    request.get("/follicleMonitoring/logModuleData", body),
}
const NaturalMonitor = {
  // 初始化卵泡监测记录
  getNatureCycle: (body) => request.get("/natureCycle", body),
  // 初始化就诊视图
  getNatureCycleView: (body) => request.get("/natureCycle/view", body),
  // 修改末次月经
  putLmp: (body) => request.put("/natureCycle/lmp", body),
  // 结束该周期
  EndNatureCycle: (body) => request.put("/natureCycle", body),
}
//手术记录
const Patients_surgery = {
  //查询取卵手术
  initSurgeryovum: (body) => request.get("/operation/eggretrieval", body),
  //新增修改取卵手术
  addSurgeryovum: (body) => request.post("/operation/eggretrieval", body),
  //删除取卵手术
  delSurgeryovum: (uid) => request.delete(`/operation/eggretrieval/${uid}`),
  //获取取卵手术下拉框
  initSelectovum: () => request.get("/operation/options/egg"),

  //查询移植手术
  initSurgerytransplant: (body) => request.get("/operation/transplants", body),
  //新增修改移植手术
  addSurgerytransplant: (body) => request.post("/operation/transplant", body),
  //删除移植手术
  deltransplant: (uid) => request.delete(`/operation/transplant/${uid}`),
  //获取移植手术下拉框
  initSelecttran: () => request.get("/operation/options/transplant"),

  //查询取卵术后
  initSurgeryafter: (body) => request.get("/operation/eggafterretrieval", body),
  //新增,修改取卵术后
  addSurgeryafter: (body) => request.post("/operation/eggafterretrieval", body),
  //删除取卵术后
  delSurgeryafter: (uid) =>
    request.delete(`/operation/eggafterretrieval/${uid}`),
  //获取取卵术后下拉框
  initSelectafter: () => request.get("/operation/options/eggafter"),

  //查询IUI手术
  initSurgeryiui: (body) => request.get("/operation/iuis", body),
  //新增,修改IUI手术,
  addSurgeryiui: (body) => request.post("/operation/iui", body),
  //删除IUI手术
  delSurgeryiui: (uid) => request.delete(`/operation/iui/${uid}`),
  //获取IUI下拉框
  initSelectiui: () => request.get("/operation/options/iui"),

  //查询睾丸手术
  initSurgerygao: (body) => request.get("/operation/testicularpuncture", body),
  //新增，修改睾丸手术
  addSurgerygao: (body) => request.post("/operation/testicularpuncture", body),
  //删除睾丸手术
  delSurgerygao: (uid) =>
    request.delete(`/operation/testicularpuncture/${uid}`),
  //获取IUI下拉框
  initSelectgao: () => request.get("/operation/options/testicularpuncture"),
}
// 诊断
const Diagnosis_order = {
  //初始化诊断
  getdiagnoseAll: (body) => request.get("/diagnose", body),
  // 添加一条诊断记录
  postDiagnose: (body) => request.post("/diagnose", body),
  // 修改疑似状态
  modifySuspected: (body) => request.put("/diagnose/doubt", body),
  // 修改有效状态
  modifyEffective: (body) => request.put("/diagnose/effective", body),
  // 删除诊断
  deleteDiagnosis: (uid) => request.delete(`/diagnose/${uid}`),
  // 医嘱的初始化
  getOrder: (body) => request.get("/medicalAdvice", body),
  // 添加处方
  saveOrder: (body) => request.post("/prescription", body),
  // 周期诊断保存
  saveDiagnosis: (body) => request.post("/cycleDiagnose", body),
}
// 医嘱
const MedicalAdvice = {
  // 模糊查询药名
  selectdrug: () => request.get("/medicalAdvice/medicines"),
  // 获取医嘱的配置
  configMedical: (body) => request.get("/medicalAdvice/config", body),
  // 医嘱部分查询
  getMedicalAdvice: (body) => request.get("/medicalAdvice", body),
  // 删除用药数据
  deleteMedical: (type, uid) =>
    request.delete(`/operation/eggretrieval/${type}/${uid}`),
  // 获取黄体用药
  getLutealMedical: (body) => request.get("/medicalAdvice/luteal", body),
  // 添加医嘱(保存)
  saveMedicalAdvice: (body) => request.post("/medicalAdvice", body),
  // 返诊预约
  returnReservation: (body) => request.post("/medicalAdvice/reservation", body),
  // 查询药品是发送拼针还是接受拼针，0发送，1接受
  medicalIsSpell: (id) => request.get(`/medicalAdvice/isSpell/${id}`),
  // 查询拼针列表
  searchSpell: (id) => request.get(`/medicalAdvice/spells/${id}`),
  // 发起拼针
  postSpell: (body) => request.post("/medicalAdvice/spell", body),
  // 接受拼针
  putSpell: (body) => request.put("/medicalAdvice/spell", body),
  // 查询该药是否有余量
  medicalRemain: (body) => request.post("/medicalAdvice/remain", body),
  // 快速导入医嘱
  quickAdvice: (body) => request.get("/medicalAdvice/quick", body),
  // 初始化用药&检查下拉框
  medicalAdviceOptions: () => request.get("/package/options"),
  // 获取周期信息
  getCycleMessage: (body) => request.get("/medicalAdvice/cycleDate", body),
}
//实验室
const Patients_lab = {
  //查询实验室
  initLabInfo: (body) => request.get("/lab/init", body),
  //刷新实验室
  refreshLabInfo: (body) => request.get("/lab/refresh", body),
}
//病史
const Patients_dishistory = {
  //查询实验室
  initdisHistory: (body) => request.get("/diseaseHistory", body),
  //刷新实验室
  savedisHistory: (body) => request.post("/diseaseHistory", body),
  //下拉框初始化
  initOptions: (body) => request.get("/diseaseHistory/options", body),
  // 获取既往病史的下拉框
  getPreviousHistoryOptions: (body) =>
    request.get("/diseaseHistory/previousHistoryOptions", body),
  // 获取家族史的下拉框
  getFamilyHistoryOptions: (body) =>
    request.get("/diseaseHistory/familyHistoryOptions", body),
  // 查询流行病学史
  getEpidemic: (body) => request.get("/diseaseHistory/epidemiologics", body),
  // 新增流行病学史
  saveEpidemic: (body) => request.post("/diseaseHistory/epidemiologics", body),
  // 获取流行病学史下拉框
  getDecOption: (body) =>
    request.get("/diseaseHistory/epidemiologicsOptions", body),
}
// 日程表
const Schedule = {
  //查询取卵日程表
  getOpuArry: (body) => request.get("/schedule/hcg", body),
  // 查询移植日程表
  getEtArry: (body) => request.get("/schedule/et", body),
  //查询iui日程表
  getIuiArry: (body) => request.get("/schedule/iui", body),
  // 查询IUI扳机日程表
  getIUItrigger: (body) => request.get("/schedule/iuiTrigger", body),
  // 修改日程表
  saveHcg: (body) => request.put("/schedule", body),
  // 日程表下拉框
  optionsSelect: () => request.get("/schedule/ontopt"),
  // 日程表的保存
  saveSchedule: (body) => request.put("/schedule", body),
}
// 基线调查
const Survey = {
  // poic查询
  getPoiData: (body) => request.get("/poi", body),
  // poi的保存
  saveData: (body) => request.post("/poi", body),
  // pcos查询
  getPcosData: (body) => request.get("/pcos", body),
  // /pcos的保存
  savePcosData: (body) => request.post("/pcos", body),
  // survey查询
  getSurveyData: (body) => request.get("/perimenopause", body),
  // survey的保存
  saveSurveyData: (body) => request.post("/perimenopause", body),
}
// 随访
const follow = {
  // getFollowDetail: (body) => request.get("/followUp/info", body),
  // 随访详情保存
  saveFollowDetail: (body) => request.post("/followUp/info", body),
  // 随访刷选条件
  screeningCondition: (body) => request.get("/followUp/search", body),
  //修改随访状态
  revisefollowStatus: (body) => request.put("/followUp/lost", body),
  //查询随访履历
  queryhistory: (body) => request.get("/followUp/history", body),
  //失访接口
  alterloststatus: (body) => request.put(`/followUp/lost/${body}`, body),
  //进入下一周期 和修改失访状态
  reviseloststatus: (body) => request.post("/followUp/next", body),
  //初始化随访记录
  initializefollowinfo: (body) => request.get("/followUp/pregnancy", body),
  //保存生化期的数据
  saveBiochemical: (body) => request.post("/followUp/biochemical", body),
  //保存临床期数据
  saveselectclinicalstage: (body) => request.post("/followUp/clinical", body),
  //保存孕早期详情数据
  saveearlypregnancy: (body) => request.post("/followUp/earlypregnancy", body),
  //保存孕中期详情数据
  savepregnantmetaphase: (body) => request.post("/followUp/midpregnancy", body),
  //保存产前筛查
  saveprenatalscreening: (body) =>
    request.post("/followUp/antenatalscreening", body),
  //保存孕晚期
  saveLatepregnancy: (body) => request.post("/follo/wUp/latepregnancy", body),
  //保存分娩
  savedelivery: (body) => request.post("/followUp/parturition", body),
  //保存出生后一周岁
  savebirth: (body) => request.post("/followUp/afterbirthone", body),
  //保存出生后5周岁
  savebirthfive: (body) => request.post("/followUp/afterbirthfive", body),
  //保存出生后10周岁
  savebirthten: (body) => request.post("/followUp/afterbirthten", body),
  //保存出生后15女周岁
  savebirthfifgirl: (body) => request.post("/followUp/fifteenfemale", body),
  //保存出生后15男周岁
  savebirthfifboy: (body) => request.post("/followUp/fifteenmale", body),
  //保存出生后20男周岁
  savebirthtwoman: (body) => request.post("/followUp/twentymale", body),
  //保存出生后20女周岁
  savebirth20girl: (body) => request.post("/followUp/twentyfemale", body),
}
// 工作台
const WorkBench = {
  // 工作台初始化
  initWorkStaion: (body) => request.get("/workStation", body),
  // 获取工作台患者列表
  getworkbenchbasedata: (body) => request.get("/workStation/patients", body),
  // 获取工作台统计
  getworkbenchcount: (body) => request.get("/workStation/count", body),
  // 获取患者基本信息card
  getPatiensInfo: (body) => request.get("/baseInfo/workstation", body),
  // 初始化设置诊室
  getVisitRoom: (body) => request.get("/workStation/visitRooms", body),
  // 初始化今日诊室
  getTodayVisitRoom: (body) =>
    request.get("/workStation/todayVisitRooms", body),
  // 初始化诊室列表
  getVisitRoomList: (body) => request.get("/workStation/visitRoom", body),
  // 初始化工作角色
  getProjectGroup: (body) => request.get("/workStation/projectGroup", body),
  // 设置诊室提交
  postVisitRoom: (body) => request.post("/workStation/visitRooms", body),
  // 修改工作角色提交
  postProjectGroup: (body) => request.post("/workStation/projectGroup", body),
  // 修改诊室列表提交
  postVisitRoomList: (body) => request.post("/workStation/visitRoom", body),
  // 修改今日诊室
  postTodayVisitRoom: (body) =>
    request.post("/workStation/todayVisitRooms", body),
  // 设置诊室工作角色对照表
  roleComparison: () => request.get("/workStation/projectGroupMatch"),
  // 初始化周期岗位的人数
  initPeopele: () => request.get("/workStation/cycle/counts"),
  // 获取周期岗位患者列表
  getPeopleList: (body) => request.get("/workStation/cycle/patients", body),
  // 获取所有地点集合
  getPlaces: () => request.get("/workStation/places"),
  //获取全部的特殊标记
  getMarkData: () => request.get("/baseInfo/tipOntopts"),
}
//检查,影像,体格检查
const ManCheck = {
  //获取手动新增化验单的信息
  getAddCheckData: (body) => request.get(`/inspection/projectConfig/${body}`),
  //新增化验单
  addCheckData: (body) => request.post("/inspection/create", body),
  //初始化男女体格检查异常项目
  getexceptioncheck: (body) =>
    request.get("/physicalExamination/exception", body),
  //查询女方体格检查
  getwomanhysicalcheck: (body) =>
    request.get("/physicalExamination/female", body),
  //保存女方体格检查
  savewomanphysicalcheck: (body) =>
    request.post("/physicalExamination/female", body),
  //修改女方体格检查
  updatewomanphysicalcheck: (body) =>
    request.put("/physicalExamination/female", body),
  //获取女方最新检查
  getlastwomanphysicalcheck: (body) =>
    request.get("/physicalExamination/female/last", body),
  //查询男方体格检查
  getmanphysicalcheck: (body) => request.get("/physicalExamination/male", body),
  //保存男方体格检查
  savemanphysicalcheck: (body) =>
    request.post("/physicalExamination/male", body),
  //修改男方体格检查
  updatemanphysicalcheck: (body) =>
    request.put("/physicalExamination/male", body),
  //获取男方最新检查
  getlastmanphysicalcheck: (body) =>
    request.get("/physicalExamination/male/last", body),
  //妇科检查查询
  getcheckfemale: (body) => request.get("/gynecologicalExamination", body),
  //妇科检查保存
  savecheckfemale: (body) => request.post("/gynecologicalExamination", body),
  //妇科检查更新
  updatecheckfemale: (body) => request.put("/gynecologicalExamination", body),
  //获取妇科检查最新
  getlastcheckfemale: (body) =>
    request.get("/gynecologicalExamination/last", body),
  //妇科检查下拉框
  getcheckfemaleoption: (body) =>
    request.get("/gynecologicalExamination/ontopt", body),
  //查询男科检查
  getmancheck: (body) => request.get("/maleExamination", body),
  //保存男方检查
  savemancheck: (body) => request.post("/maleExamination", body),
  //男科检查更新
  updatecheckmale: (body) => request.put("/maleExamination", body),
  //获取男科检查最新
  getlastcheckmale: (body) => request.get("/maleExamination/last", body),
  //男科检查下拉框
  getcheckmaleoption: (body) => request.get("/maleExamination/ontopt", body),
  //获取验列表
  getinspectiontype: (body) => request.get("/inspection/type", body),
  //获取化验单项目详情
  getinspectiontdetail: (body) => request.get("/inspection", body),
  //修改化验单项目
  updateinspectiontdetail: (body) => request.put("/inspection", body),
  //添加化验单项目
  saveinspectiontdetail: (body) => request.post("/inspection", body),
  //初始化验的下拉框
  getInsepectionOption: (body) => request.get("/inspection/ontopts", body),
  //添加影像
  saveimagedata: (body) => request.post("/video", body),
  //修改影像
  updateimagedata: (body) => request.put("/video", body),
  //查询影像
  getimagedata: (body) => request.get("/video", body),
  //影像下拉框
  getImageOption: (body) => request.get("/video/ontopt", body),

  //查询异常
  getException: (body) => request.get("/check/exception", body),
  //查询时间轴
  getTimeLine: (body) => request.get("/check/timeline", body),

  //指定该周期病例里的检查日期
  setSelectExamination: (body) => request.put("/html/selectExamination", body),
}

//冷冻续费
const Frozen = {
  // 查询冷冻信息
  getFronzenInfo: (body) => request.get("/frozen/info", body),
  //根据身份证查询冷冻履历
  getFronzenResume: (body) => request.get("/frozen/history", body),
  // 冷冻续费
  renewal: (body) => request.post("/frozen/renewal", body),
}

//数据视图
const Dashboard = {
  //总览
  getDataView: (body) => request.get("/dataView/all", body),
  // 获取新鲜复苏周期
  getFresh: (body) => request.get("/dataView/fresh", body),
  // 获取周期总数
  getCycle: (body) => request.get("/dataView/cycle", body),
  // 获取不育例数
  getSterile: (body) => request.get("/dataView/sterile", body),
}

//预约管理
const Reservation = {
  //模糊查询患者
  getSearch: (body) => request.get("/reservation/patient", body),
  //下拉框取值
  getOptions: (body) => request.get("/reservation", body),
  //新增预约
  addReservation: (body) => request.post("/reservation", body),
  //修改预约
  editReservation: (body) => request.put("/reservation", body),
  //已预约项目查询
  hasReservation: (id) => request.get(`/reservation/${id}`),
  //删除已预约项目
  delReservation: (id) => request.delete(`/reservation/${id}`),
  //筛选查看列表
  getLookList: (body) => request.get("/patientList/couple", body),
  //设置成查看
  setLook: (id) => request.put(`/patientList/joinReport/?reservationUid=${id}`),
  //取消查看设置
  cancelLook: (id) =>
    request.put(`/patientList/exitReport/?reservationUid=${id}`),
}

const Admin = {
  getUserListByEndtime: (endMonthtype) =>
    request.get(
      `/admin/user/getuserbyendtime?systemName=SIVF&endMonth=${endMonthtype}`
    ),
  //获取统计的人数
  getUserStatics: () =>
    request.get(`/admin/user/staticUserCountInfo?systemName=SIVF`),
  // 获取业务数据 addOption
  getBizItems: () =>
    request.get(`/admin/bizdata/items?systemName=SIVF&moduleName`),
  getBizItemByName: (itemName) =>
    request.get(
      `/admin/bizdata/item?systemName=SIVF&moduleName=系统&itemName=${itemName}`
    ),
  getBizItemOptions: (code) =>
    request.get(`/admin/bizdata/options?itemCode=${code}`),
  updateOption: (body) => request.post("/admin/bizdata/updateOption", body),
  addOption: (body) => request.post("/admin/bizdata/addOption", body),
  getUserListByRole: (role) =>
    request.get(`/admin/user/getuserbyrole?systemName=SIVF&role=${role}`),
  getUserListByStatus: (status) =>
    request.get(`/admin/user/getuserbystatus?systemName=SIVF&status=${status}`),
  changestatus: (body) => request.post("/admin/user/changestatus", body),
  updateItem: (body) => request.post("/admin/bizdata/updateItem", body),
  updateUser: (body) => request.post("/admin/user/updateUser", body),
  getSystemLog: (body) => request.post("/systemlog/select", body),
  resetpwd: (body) => request.post("/admin/user/resetpwd", body),
  changeUsersEndUseTime: (body) =>
    request.post("/admin/user/changeUsersEndUseTime", body),
  batchApplyuser: (body) => request.post("/admin/user/batchApplyUser", body),
}
const AdminSet = {
  // 组套列表初始化
  getSetList: (type) => request.get(`/package/packages?typeTag=${type}`),
  // 检查套餐详情
  inspectDetails: (uid) => request.get(`/package/checkPackage?uid=${uid}`),
  // 用药套餐详情
  adviceDetails: (uid) => request.get(`/package/medicationPackage?uid=${uid}`),
  // 根据uid删除套餐
  deleteSet: (uid) => request.delete(`/package?uid=${uid}`),
  // 修改检查套餐
  modifyInspect: (body) => request.post("/package/checkPackage", body),
  // 修改用药套餐
  modifyAdvice: (body) => request.post("/package/medicationPackage", body),
  // 新建检查套餐
  addInspect: (body) => request.post("/package/newCheckPackage", body),
  // 新建用药套餐
  addAdvice: (body) => request.post("/package/newMedicationPackage", body),
  // 套餐的筛选
  searchMeal: (body) => request.get("/package/packages/name", body),
}
// 数据视图
const DataView = {
  // 获取工作量统计
  workLoad: (body) => request.get("/dataView/workload", body),
  // 获取返诊视图
  returnClinicData: (body) => request.get("/dataView/returnClinicData", body),
  // 获取平均获卵数
  averageEgg: (body) => request.get("/dataView/averageEgg", body),
  // 生化妊娠率
  biochemicalPregnancyRate: (body) =>
    request.get("/dataView/biochemicalPregnancyRate", body),
  // 临床妊娠率
  clinicalPregnancyRate: (body) =>
    request.get("/dataView/clinicalPregnancyRate", body),
  // 获取不孕因素
  infertilityFactor: (body) => request.get("/dataView/infertilityFactor", body),
  // 获取新鲜复苏周期数
  fresh: (body) => request.get("/dataView/fresh", body),
  // 获取周期总数
  cycleView: (body) => request.get("/dataView/cycle", body),
  // 获取新增不育例数
  sterileView: (body) => request.get("/dataView/sterile", body),
  // 获取去年同月治疗量数据
  astSame: (body) => request.get("/dataView/lastSame", body),
  // 获取本年度各季度数据对比
  getYearQuarterData: (body) =>
    request.get("/dataView/getYearQuarterData", body),
  // 获取各年度各月数据对比
  yearMonth: (body) => request.get("/dataView/yearMonth", body),
  // 获取三年内同季度周期数对比
  threeYear: (body) => request.get("/dataView/threeYear", body),
}
//病程记录
const IllnessRecord = {
  //通过患者编号查询病程记录信息
  searchData: (body) => request.get("/diseaseHistory/historys", body),
  //修改患者病程信息
  update: (body) => request.put("/diseaseHistory/history", body),
  //新增患者病程记录
  addRecord: (body) => request.post("/diseaseHistory/history", body),
  //获取医生列表
  getDoctorList: (body) => request.post("/diseaseHistory/ontopt", body),
}

export default {
  Auth,
  selectdata,
  Patients_info, //基本信息
  WorkBench, //工作台
  ManCheck, //检查
  Patients_list, //更多患者列表
  Patients_checkout, //病人详情--检查检验
  Patients_monitor, //病人详情--卵泡监测
  NaturalMonitor, //自然周期卵泡监测
  Patients_search, //患者搜索
  Patients_more, //更多患者
  Patients_history, //就诊履历
  Patients_surgery, //手术记录
  Patients_lab, //实验室
  Patients_dishistory, //病史
  Patients_firstList, //初诊病历
  Patients_secondList, //复诊病历
  Schedule, //日程表
  Survey, //基线调查
  Frozen, //冷冻续费
  follow, //随访
  Diagnosis_order, //诊断
  Dashboard, //数据视图
  MedicalAdvice, //医嘱
  Reservation, //预约
  PatientList_pending, //pending列表
  Time, //设置系统时间
  Template, //设置系统中的模板
  Message, //医生留言功能
  Admin, //管理员
  AdminSet,
  DataView, //数据视图
  Mensturation,
  collection,
  getList, //lis相关
  IllnessRecord, //病程记录
}
