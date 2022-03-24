import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import { Timeline } from "antd"
import { BaseDrawer } from "@/app/components/base/baseDrawer"
import { DateTitleView } from "@/app/components/normal/Title"
import "./index.scss"
import styled from "styled-components"

const LineBox = styled.div`
  div {
    height: 30px;
    line-height: 30px;
  }
  div:first-child {
    color: #59b4f4;
  }
  div:nth-child(3) {
    background: #e8e8e8;
    span {
      margin: 10px;
    }
    span:first-child {
      margin-left: 0;
      margin-right: 10px;
    }
  }
`

export default
@inject("frozenRenewal")
@observer
class Resume extends Component {
  close = () => {
    const { setResume } = this.props.frozenRenewal
    setResume()
  }
  render() {
    const { showResume, resumeList } = this.props.frozenRenewal
    return (
      <BaseDrawer
        visible={showResume}
        onclose={() => this.close()}
        width={280}
        bodyStyle={{ padding: "10px 8px 0 0" }}
        closable={false}
        placement="right"
      >
        <DateTitleView title={`续费履历（共${resumeList.length}条）`}>
          <Timeline>
            {resumeList.map((item, index) => {
              return (
                <Timeline.Item key={index}>
                  <LineBox>
                    <div>登记日期：{item.registrationDate}</div>
                    <div>登记：{item.registrant}</div>
                    <div>
                      <span>{item.renewalItem}</span>|
                      <span>{item.renewalMoney}元</span>|
                      <span>
                        {item.renewalDuration}
                        {item.renewalUnit}
                      </span>
                    </div>
                    <div>续前日期：{item.beforeRenewalExpiryDate}</div>
                    <div>续后日期：{item.afterRenewalExpiryDate}</div>
                    <span>说明：{item.renewalNote}</span>
                  </LineBox>
                </Timeline.Item>
              )
            })}
          </Timeline>
        </DateTitleView>
      </BaseDrawer>
    )
  }
}
