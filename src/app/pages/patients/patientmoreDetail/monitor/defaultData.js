import { monitor_curDate, todayString } from "@/app/utils/const.js"
//页面默认数据 -start-

export const bloodAdd = {
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
  operation: true, //false为减，true为加
}
//临床
export const clinicalDefault = {
  artMethod: "体外授精",
  cycleType: null,
  treatmentMethod: null,
  treatmentPlan: null,
  medicationPlan: null,
  preCycleMedication: "妈富隆,二甲双胍,抗生素",
  surgeryDate1: null,
  cue1: null,
  surgeryDate2: null,
  cue2: null,
  cyclePlan: null,
  transplantDate: null,
  set: null,
  transferredEmbryos: null,
  cesareanSectionHistory: null,
  scarredUterus: null,
  small: null,
  nonTransplantationReason: null,
  clinicalDate: "2020-11-18",
}
//b超 记录信息
export const follicleMonitoringDTODefault = {
  afterMenstruation: null,
  handle: null,
  innerMembrane: null,
  leftFollicles: [],
  leftFolliclesTotal: null,
  leftOvaryHeight: null,
  leftOvaryLength: null,
  leftOvaryVolume: null,
  leftOvaryWidth: null,
  monitorDate: monitor_curDate,
  result: null,
  rightFollicles: [],
  rightFolliclesTotal: null,
  rightOvaryHeight: null,
  rightOvaryLength: null,
  rightOvaryVolume: null,
  rightOvaryWidth: null,
  typing: null,
  ultrasoundCue: null,
}
//b超 左右卵泡详细
export const ovaDTODefault = {
  leftOvarianFollicleDTOList: [
    { diameterMin: 0, diameterMax: 0, count: 0, delflag: 0, key: 0 },
  ],
  rightOvarianFollicleDTOList: [
    { diameterMin: 0, diameterMax: 0, count: 0, delflag: 0, key: 0 },
  ],
}
//b超 总数统计
export const countListDefault = [
  { follicleDetail: [], location: 0, total: 1 },
  { follicleDetail: [], location: 1, total: 22 },
]

export const activationDfault = {
  deregulation: {
    date: null,
    medicine: [],
    bloodHormone: [],
  },
  gn: { date: null, medicine: [] },
  antagonistic: { date: null, medicine: [] },
}

//页面默认数据 -end-

// 卵泡监测数据下拉框
export const eggData = [
  { label: "取卵", value: "取卵" },
  { label: "自卵解冻", value: "自卵解冻" },
  { label: "受新鲜卵", value: "受新鲜卵" },
  { label: "受卵解冻", value: "受卵解冻" },
]
export const spermData = [
  { label: "鲜夫精", value: "鲜夫精" },
  { label: "冻夫精", value: "冻夫精" },
  { label: "鲜手术精", value: "鲜手术精" },
  { label: "冻手术精", value: "冻手术精" },
  { label: "供精", value: "供精" },
]

export const inseData = [
  { label: "IVF", value: "IVF" },
  { label: "IVF备RICSI", value: "IVF备RICSI" },
  { label: "ICSI", value: "ICSI" },
  { label: "IVF+ICSI", value: "IVF+ICSI" },
]
