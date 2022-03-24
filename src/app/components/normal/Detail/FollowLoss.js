import React from "react"
import styled from "styled-components"
import { Select, DatePicker, Form, Input, Button, Radio, message } from "antd"
import moment from "moment"
import apis from "@/app/utils/apis"
const { Option } = Select
const { TextArea } = Input
const formdate = "YYYY-MM-DD"
const SpanNumber = styled.span`
  position: absolute;
  bottom: 20px;
  right: 10px;
`
export default class FollowForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cycleNumber: JSON.parse(localStorage.getItem("followrecord")).cycleNumber, //周期号
      note: "", //备注
      overReseason: "未妊娠", //结束原因
      followFlag: 0, //随访状态    选择是否已经结束随访0是未结束，1结束
      followDate: moment(new Date()).format(formdate), //计划随访时间
      followStage: "", //随访阶段
    }
  }

  /**
   * @func 调用改变状态的接口
   * @param
   */
  onFinish = (val) => {
    let { followDate, cycleNumber } = this.state
    for (let i in val) {
      if (i === "followDate") val.followDate = followDate
    }
    let body = Object.assign(val, { cycleNumber: cycleNumber })
    this.setState({ followDate }, () => {
      apis.follow.reviseloststatus(body).then((res) => {
        if (res.code !== 200) {
          message.error("进入下一阶段失败")
        } else {
          message.success("保存下一阶段成功")
          this.props.setVisible()
        }
      })
    })
  }
  render() {
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    }
    const tailLayout = {
      wrapperCol: { offset: 8, span: 12 },
    }
    let { overReseason, followFlag, note, followDate } = this.state
    return (
      <Form
        {...layout}
        onFinish={this.onFinish}
        initialValues={{ lostVisit: 0 }}
      >
        <Form.Item name="lostVisit" label="随访已结束">
          <Radio.Group
            onChange={(e) =>
              this.setState({
                followFlag: e.target.value,
              })
            }
            value={followFlag}
          >
            <Radio value={1}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        </Form.Item>

        {followFlag ? (
          <>
            <Form.Item name="reason" label="结束原因" initialValue="未妊娠">
              <Select
                allowClear
                placeholder="请选择"
                value={overReseason}
                onChange={(val) =>
                  this.setState({
                    overReseason: val,
                  })
                }
              >
                <Option value="未妊娠">未妊娠</Option>
                <Option value="流产">流产</Option>
                <Option value="胚停">胚停</Option>
                <Option value="异位妊娠">异位妊娠</Option>
                <Option value="中期引产">中期引产</Option>
              </Select>
            </Form.Item>
            <Form.Item label="备注">
              <Form.Item name="note" initialValue="">
                <TextArea
                  placeholder="请输入"
                  autoSize={{ minRows: 3, maxRows: 5 }}
                  maxLength="30"
                  onChange={(e) => {
                    this.setState({ note: e.target.value })
                  }}
                />
              </Form.Item>
              <SpanNumber>{note.length}/30</SpanNumber>
            </Form.Item>
          </>
        ) : (
          <>
            <Form.Item
              name="followDate"
              label="随访时间"
              initialValue={moment(followDate)}
            >
              <DatePicker
                onChange={(e, val) => {
                  this.setState({ followDate: val })
                }}
              />
            </Form.Item>
            <Form.Item
              name="followStatus"
              label="随访阶段"
              initialValue="生化期"
            >
              <Select
                allowClear
                placeholder="请选择"
                value={overReseason}
                onChange={(value) => {
                  this.setState({
                    overReseason: value,
                  })
                }}
              >
                <Option value="生化期">生化期</Option>
                <Option value="临床期">临床期</Option>
                <Option value="孕早期">孕早期</Option>
                <Option value="孕中期">孕中期</Option>
                <Option value="产前筛查">产前筛查</Option>
                <Option value="孕晚期">孕晚期</Option>
                <Option value="分娩">分娩</Option>
                <Option value="出生后">出生后</Option>
              </Select>
            </Form.Item>
          </>
        )}

        <Form.Item {...tailLayout}>
          <Button
            style={{ marginRight: "30px" }}
            onClick={this.props.setVisible}
          >
            取消
          </Button>
          <Button type="primary" htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>
    )
  }
}
