import moment from "moment"

export const substract = (date) => {
  return moment(date).subtract(1, "days")
}
export const add = (date) => {
  return moment(date).add(1, "days")
}
