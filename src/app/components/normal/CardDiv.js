import React from "react"
import { inject, observer } from "mobx-react"
import { Row, Progress } from "antd"
import { BaseDiv } from "../base/baseDiv"
import styled from "styled-components"
import LeftIcon from "@/app/styles/image/left-icon.svg"
import RightIcon from "@/app/styles/image/right-icon.svg"

const Content = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  padding: 0 30px;
  overflow: hidden;
`

const CardWarp = styled(BaseDiv)`
  background-color: #f0f2f5;
  padding: 0;
`

const ImgIcon = styled.img`
  padding: 56px 0 0;
`

const Cards = styled.ul`
  height: 146px;
  list-style: none;
  margin: 0;
  padding: 0;
  position: relative;
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
`

const CardItem = styled.li`
  border-radius: 2px;
  font-size: 1.5em;
  display: flex;
  flex-direction: column;
  width: 247px;
  height: 128px;
  position: relative;
  margin-right: 12px;
  background-color: white;
  padding: 16px;
  .total {
    position: absolute;
    right: 18px;
    bottom: 46px;
    color: #333333;
    font-size: 12px;
    font-weight: 400;
  }
`

const Arrow = styled.div`
  position: absolute;
  z-index: 1;
  top: 64px;
  transform: translateY(-50%);
  background: #fff;
  width: 18px;
  height: 128px;
  cursor: pointer;
`

const LeftArrow = styled(Arrow)`
  left: 0px;
`

const RightArrow = styled(Arrow)`
  right: 0px;
  z-index: ${(props) => (props.showSideNav ? "1" : "999")};
`

const colors = new Map([
  [0, "#37B7C3"],
  [1, "#FFBE46"],
  [2, "#958CFF"],
  [3, "#FF8282"],
  [5, "#37B7C3"],
  [6, "#FFBE46"],
  [7, "#958CFF"],
  [8, "#FF8282"],
])

export default
@inject("store")
@observer
class Breadtitle extends React.Component {
  scroll = (type) => {
    const element = document.getElementById("steps")
    if (type === "left") {
      let scrollInterval = setInterval(() => {
        element.scrollLeft -= 12
      }, 10)

      setTimeout(() => {
        clearInterval(scrollInterval)
      }, 200)
    } else {
      let scrollInterval = setInterval(() => {
        element.scrollLeft += 12
      }, 10)

      setTimeout(() => {
        clearInterval(scrollInterval)
      }, 200)
    }
  }

  render() {
    const { reservationCount } = this.props

    return (
      <CardWarp height="100%" width="100%">
        <Content>
          <LeftArrow onClick={() => this.scroll("left")}>
            <ImgIcon src={LeftIcon} alt="" />
          </LeftArrow>
          <RightArrow onClick={() => this.scroll("right")}>
            <ImgIcon src={RightIcon} alt="" />
          </RightArrow>

          <Cards id="steps">
            {reservationCount.map((card, index) => (
              <CardItem key={index} color="#D8F6F9">
                <Row type="flex" style={{ width: 247 }}>
                  {card.cardName}
                </Row>
                <Row
                  type="flex"
                  justify="center"
                  style={{
                    color: colors.get(index),
                  }}
                >
                  {card.completed}
                </Row>
                <Row type="flex">
                  <Progress
                    percent={(card.completed / card.count) * 100}
                    showInfo={false}
                    strokeColor={colors.get(index)}
                    strokeLinecap="square"
                  />
                </Row>
                <div className="total">共{card.count}例</div>
              </CardItem>
            ))}
          </Cards>
        </Content>
      </CardWarp>
    )
  }
}
