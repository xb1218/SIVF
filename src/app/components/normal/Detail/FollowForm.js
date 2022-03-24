import React from "react"
import styled from "styled-components"
import { Select, DatePicker, Form, Input, Button, Radio } from "antd"

const { Option } = Select
const { TextArea } = Input

const SpanNumber = styled.span`
  position: absolute;
  bottom: 5px;
  right: 10px;
`
export default class FollowForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      note: "", //备注
      overReseason: "", //结束原因
      followFlag: 2, //选择是否已经结束随访0是未结束，1结束
      followDate: "", //计划随访时间
      followStage: "", //随访阶段
    }
  }

  /**
   * @func 多文本输入 onchange获取值
   * @param
   */
  onchangtext = (e) => {
    this.setState({ note: e.target.value })
  }
  //结束原因
  onchangselectvalue = (value) => {
    this.setState({
      overReseason: value,
    })
  }

  /**
   * @func 是否随访结束
   * @param
   */
  changeRadio = async (e) => {
    await this.setState({
      followFlag: e.target.value,
    })
  }
  /**
   * @func 调用改变状态的接口
   * @param
   */
  onFinish = (val) => {
    this.props.onFinish(this.state)
  }
  render() {
    const layout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 14 },
    }
    const tailLayout = {
      wrapperCol: { offset: 8, span: 12 },
    }
    const usrinfo = this.props.lostInfo
    let { overReseason, followFlag, note } = this.state

    return (
      <Form
        {...layout}
        onFinish={this.onFinish}
        initialValues={{ lostVisit: 2 }}
      >
        <Form.Item label="男方">
          <span>
            {usrinfo.maleName}&nbsp;&nbsp;{usrinfo.malePhone}
          </span>
        </Form.Item>
        <Form.Item label="女方">
          <span>
            {usrinfo.femaleName}&nbsp;&nbsp;{usrinfo.femalePhone}
          </span>
        </Form.Item>
        <Form.Item name="lostVisit" label="随访已结束">
          <Radio.Group onChange={this.changeRadio} value={followFlag}>
            <Radio value={2}>是</Radio>
            <Radio value={0}>否</Radio>
          </Radio.Group>
        </Form.Item>

        {followFlag ? (
          <>
            <Form.Item name="reason" label="结束原因">
              <Select
                allowClear
                placeholder="请选择"
                value={overReseason}
                onChange={(value) => {
                  this.onchangselectvalue(value)
                }}
              >
                <Option value="未妊娠">未妊娠</Option>
                <Option value="流产">流产</Option>
                <Option value="胚停">胚停</Option>
                <Option value="异位妊娠">异位妊娠</Option>
                <Option value="中期引产">中期引产</Option>
              </Select>
            </Form.Item>
            <Form.Item label="备注">
              <TextArea
                placeholder="请输入"
                autoSize={{ minRows: 3, maxRows: 5 }}
                maxLength="30"
                onChange={this.onchangtext}
              />
              <SpanNumber>{note.length}/30</SpanNumber>
            </Form.Item>
          </>
        ) : (
          <>
            <Form.Item name="nextFollowDate" label="随访时间">
              <DatePicker />
            </Form.Item>
            <Form.Item name="followStatus" label="随访阶段">
              <Select
                allowClear
                placeholder="请选择"
                value={overReseason}
                onChange={(value) => {
                  this.onchangselectvalue(value)
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
