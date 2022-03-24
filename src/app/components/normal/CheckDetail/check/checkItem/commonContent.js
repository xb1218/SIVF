import React from "react"
import { Select, Input, Radio, DatePicker, AutoComplete } from "antd"
import { FlexItem } from "@/app/components/base/baseForms.js"
import { renderOptions } from "@/app/utils/tool.js" //引入不同的下拉框
import { dateFormatDate } from "@/app/utils/const.js"
import moment from "moment"

//共同的结果，详述
export const CommonContent = (props) => {
  const setInheritVal = (val, param) => {
    props.setInheritVal(val, param)
  }
  let { item, checkType, options } = props
  item.result = item.result ? item.result : 0
  return (
    <FlexItem>
      <div>
        <span>
          结果:
          <Radio.Group
            value={item.result}
            onChange={(e) => {
              setInheritVal(e.target.value, "result")
            }}
          >
            <Radio value={0}>正常</Radio>
            <Radio value={1}>异常</Radio>
          </Radio.Group>
        </span>
      </div>
      <div className="flexgrow">
        <span>详述:</span>
        <>
          {checkType === "输卵管通液" ? (
            <Select
              value={item.detail}
              style={{ flexGrow: 1, textAlign: "left" }}
              onChange={(value) => {
                setInheritVal(value, "detail")
              }}
            >
              {renderOptions(options, "281")}
            </Select>
          ) : (
            <AutoComplete
              value={item.detail}
              style={{ flexGrow: 1 }}
              onChange={(value) => {
                setInheritVal(value, "detail")
              }}
            />
          )}
        </>
      </div>
    </FlexItem>
  )
}
//共同的诊断
export const CommonDiagnosis = (props) => {
  const setInheritVal = (val, param) => {
    props.setInheritVal(val, param)
  }
  let { item, type } = props
  return (
    <FlexItem>
      <div>
        <span>{type}:</span>
        <span>
          <DatePicker
            style={{ width: 120 }}
            value={item.date ? moment(item.date, dateFormatDate) : null}
            onChange={(date, datestring) => {
              setInheritVal(datestring, "date")
            }}
          />
        </span>
      </div>
      <div className="flexgrow">
        <span>诊断:</span>
        <Input
          value={item.diagnosis}
          style={{ flexGrow: 1 }}
          onChange={(e) => {
            setInheritVal(e.target.value, "diagnosis")
          }}
        />
      </div>
    </FlexItem>
  )
}
//内容的展示
export const CommonExhibition = (props) => {
  let { item } = props
  item.result = item.result ? item.result : 0
  return (
    <FlexItem>
      <div>
        <span>结果：</span>
        <span className="span_underline">{item.result ? "异常" : "正常"}</span>
      </div>
      <div className="flexgrow">
        <span>详述：</span>
        <span className="span_underline">{item.detail}</span>
      </div>
    </FlexItem>
  )
}
