import { getlocalQuery } from "@/app/utils/tool.js"
import moment from "moment"

export const dateFormat = "hh:mm:ss" //时分秒格式
export const dateFormatDate = "YYYY-MM-DD" //日期格式
export const todayString = moment(new Date()).format("YYYY-MM-DD") //当天日期
export const todayTime = moment(new Date()).format("HH:mm:ss") //当天时间,时分秒
export const monitor_curDate = getlocalQuery("monitor_curDate") || todayString //卵泡监测开立日

// 更多患者，二级菜单选择
export const CONST_ZERO = 0
export const CONST_ONE = 1
export const CONST_TWO = 2
export const CONST_THREE = 3
export const CONST_FOUR = 4
export const CONST_FIVE = 5
export const CONST_SIX = 6
export const CONST_SEVEN = 7
export const CONST_EIGHT = 8

export const twentyFemaleParam = {
  menstruation: "月经规律",
  menstrualVolume: "正常",
  vulvalDevelopment: 1,
  pubicHairDistribution: 1,
  pubicHairPattern: "未婚式",
  vaginalDischarge: "正常",
  cervix: "光滑",
  scent: "无",
  vaginal: 1,
  mucosa: 1,
  palaceBodySize: 1,
  palaceBodyTexture: "软",
  palaceBodyMobility: "活动",
  leftAttachment: 1,
  rightAttachment: 1,
  developmentStatus: 1,
}

export const defaultPhysicalData = {
  seminalEmission: "是",
  armpitHair: "是",
  pubicHairDistribution: 1,
  textureElasticity: 1,
  vasDeferens: 1,
  nodules: 1,
  foreskin: "正常",
}
export const defaultMalePhysicalData = {
  pubicHair: 1,
  textureElasticity: 1,
  vasDeferens: 1,
  nodules: 1,
  foreskin: "正常",
}
export const defaultSecondarySex = {
  breastsDevelopSituation: "是",
  armpitHairDevelopSituation: "是",
  pubicHairDevelopSituation: "是",
}
