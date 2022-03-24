import React, { Component } from "react"
import BigMedical from "@/app/components/normal/BigRecord"
import { ContentRadius } from "@/app/components/base/baseDiv"
import styled from "styled-components"

const DivStyle = styled.div`
  float: right;
  cursor: pointer;
  margin: 0px 20px;
`
export default class index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  changeurl = () => {
    this.props.history.push("/public/bigMedical")
  }
  // 当父组件中的数组更改时，重新调用接口初始化
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.currentKey !== this.props.currentKey ||
      nextProps.patientId !== this.props.patientId
    ) {
      this.BigMedical.init()
    }
  }
  render() {
    return (
      <ContentRadius className="bigMedicalDiv">
        <DivStyle onClick={this.changeurl}>
          <svg className="icon_m">
            <use xlinkHref="#iconedit-fill"></use>
          </svg>
        </DivStyle>
        <div
          style={{
            // height: "450px",
            margin: "0 10px 10px 60px",
          }}
        >
          <BigMedical onRef={(ref) => (this.BigMedical = ref)} name="see" />
        </div>
      </ContentRadius>
    )
  }
}
