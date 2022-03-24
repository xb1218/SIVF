import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import { DateTitleView } from "@/app/components/normal/Title"
import { Divider } from "antd"
import { PlusOutlined, CloseOutlined } from "@ant-design/icons"
import { DashBtn } from "@/app/components/base/baseBtn.js"
import { Content } from "./baseItem.js"

export default
@inject("inspection")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  changeNum = (index, citem, itemTitle) => {
    let { sex } = this.props
    this.props.inspection.judgeNum(sex, index, citem, itemTitle)
  }
  changeVisible = (item) => {
    this.props.changeVisible(item)
  }
  closeProjectItem = () => {
    this.props.closeProjectItem()
  }
  render() {
    let {
      typeTitle,
      checkData,
      count,
      timeLine,
      date,
      projectItem,
    } = this.props
    let { currentNum } = this.props.inspection
    return (
      <DateTitleView
        title={typeTitle}
        selectOption={
          <div className="selectOptions">
            {timeLine ? (
              <span style={{ marginLeft: 20 }}>{date}</span>
            ) : (
              <>
                {checkData.map((citem, index) => {
                  return (
                    <span key={citem.uid}>
                      {currentNum - 1 === index ? (
                        <span className="timeColor">{citem.saveDate}</span>
                      ) : (
                        <span
                          onClick={(e) => {
                            e.preventDefault()
                            this.changeNum(index, citem, typeTitle)
                          }}
                        >
                          {citem.saveDate
                            ? citem.saveDate.substring(5, 10)
                            : null}
                        </span>
                      )}
                      {index !== count - 1 ? (
                        <span className="verticalLine">|</span>
                      ) : null}
                    </span>
                  )
                })}
              </>
            )}
          </div>
        }
        subtitle={
          timeLine ? (
            <CloseOutlined
              style={{ color: "red" }}
              onClick={this.closeProjectItem}
            />
          ) : (
            <>
              <span style={{ color: "#59b4f4" }}>
                {count === 0 ? 0 : currentNum}
              </span>
              /{count}
            </>
          )
        }
        style={{ marginRight: 0 }}
      >
        {timeLine ? (
          <Content item={projectItem} typeTitle={typeTitle} />
        ) : (
          <>
            <div className="divider">
              <Divider />
            </div>
            {checkData.map((item, index) => {
              if (index === currentNum - 1) {
                return (
                  <div key={item.uid}>
                    <div className="content">
                      <div className="topContent">
                        <Content item={item} typeTitle={typeTitle} />
                      </div>
                      <div className="bottom">
                        <div className="bottomTag">
                          <svg
                            className="icon_record"
                            aria-hidden="true"
                            onClick={() => this.changeVisible(item)}
                          >
                            <use xlinkHref="#iconedit-fill" />
                          </svg>
                        </div>
                        <div className="divider">
                          <Divider />
                        </div>
                        <div className="divider">
                          <Divider />
                        </div>
                        <div className="bottomBtn">
                          <DashBtn
                            onClick={() =>
                              this.changeVisible({
                                special: [],
                                exceptionalProjectDTOList: [],
                                uterusNeckSituation: [],
                                leftSituation: [],
                                rightSituation: [],
                                sexualCharacteristics: [],
                                sexualException: [],
                              })
                            }
                          >
                            <PlusOutlined />
                          </DashBtn>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              } else {
                return null
              }
            })}
            {checkData.length === 0 ? (
              <div className="bottomBtn">
                <DashBtn
                  onClick={() =>
                    this.changeVisible({
                      special: [],
                      exceptionalProjectDTOList: [],
                      uterusNeckSituation: [],
                      leftSituation: [],
                      rightSituation: [],
                      sexualCharacteristics: [],
                      sexualException: [],
                    })
                  }
                >
                  <PlusOutlined />
                </DashBtn>
              </div>
            ) : null}
          </>
        )}
      </DateTitleView>
    )
  }
}
