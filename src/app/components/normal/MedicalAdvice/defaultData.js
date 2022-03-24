import React from "react"

export const optionSelect = [
  { value: "日期", label: "日期" },
  { value: "月经后第三天", label: "月经后第三天" },
  { value: "一个月后", label: "一个月后" },
  { value: "三个月后", label: "三个月后" },
]
export const matterOptions = [
  { label: "妇科", value: "妇科" },
  { label: "男科", value: "男科" },
  { label: "B超", value: "B超" },
  { label: "B超+血检", value: "B超+血检" },
  { label: "取卵", value: "取卵" },
  { label: "移植", value: "移植" },
  { label: "验孕", value: "验孕" },
]
export const treeData = [
  {
    label: "自然周期",
    value: "自然周期",
  },
  {
    label: "刺激周期",
    value: "刺激周期",
    children: [
      {
        label: "长方案",
        value: "长方案",
      },
      {
        label: "短方案",
        value: "短方案",
      },
      {
        label: "拮抗方案",
        value: "拮抗方案",
      },
    ],
  },
  {
    label: "微刺激周期",
    value: "微刺激周期",
    children: [
      {
        label: "IUI方案",
        value: "IUI方案",
      },
    ],
  },
]
export const medicalColums = [
  {
    title: "序号",
    dataIndex: "key",
    key: "key",
    width: 50,
    render: (text, record, index) => {
      return <span>{index + 1}</span>
    },
  },
  {
    title: "药名",
    dataIndex: "drugName",
    key: "drugName",
    width: 100,
  },
  {
    title: "用量",
    dataIndex: "dose",
    key: "dose",
    width: 100,
  },
  {
    title: "频次",
    dataIndex: "frequency",
    key: "frequency",
    width: 50,
  },
  {
    title: "天数",
    dataIndex: "days",
    key: "days",
    width: 50,
  },
  {
    title: "用法",
    dataIndex: "usage",
    key: "usage",
    width: 100,
  },
] //用药表头
export const checkColums = [
  {
    title: "序号",
    dataIndex: "key",
    key: "key",
    width: 100,
    render: (text, record, index) => {
      return <span>{index + 1}</span>
    },
  },
  {
    title: "检查项目",
    dataIndex: "inspectionItem",
    key: "inspectionItem",
    width: 100,
  },
  {
    title: "嘱托",
    dataIndex: "entrustment",
    key: "entrustment",
    width: 100,
  },
  {
    title: "有效期",
    dataIndex: "inspectionExpireTip",
    key: "inspectionExpireTip",
    width: 100,
    render: (text, record) => {
      return <span style={{color: text === "未查" && "red"}}>{text}</span>
    },
  },
] //检查表头
