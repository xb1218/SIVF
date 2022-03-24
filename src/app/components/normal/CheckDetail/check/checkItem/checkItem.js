import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import { DateTitleView } from "@/app/components/normal/Title"
import { Divider } from "antd"
import { PlusOutlined, CloseOutlined, EditFilled } from "@ant-design/icons"
import { DashBtn } from "@/app/components/base/baseBtn.js"
import Content from "./contentItem"
import { Fragment } from "react"

export default
@inject("store", "inspection")
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
      itemTitle,
      count,
      checkItems,
      timeLine,
      date,
      projectItem,
      sex,
    } = this.props
    let { currentNum } = this.props.inspection
    let { patientSex } = this.props.store
    let flag =
      sex === null
        ? itemTitle === "B超检查" && patientSex
        : itemTitle === "B超检查" && sex
    return (
      <DateTitleView
        title={itemTitle}
        selectOption={
          flag ? null : (
            <div className="selectOptions">
              {timeLine ? (
                <span style={{ marginLeft: 20 }}>{date}</span>
              ) : (
                <>
                  {checkItems.map((citem, index) => {
                    return (
                      <Fragment key={index}>
                        <span>
                          {currentNum - 1 === index ? (
                            <span className="timeColor">{citem.date}</span>
                          ) : (
                            <span
                              onClick={(e) => {
                                e.preventDefault()
                                this.changeNum(
                                  index,
                                  citem,
                                  itemTitle === "阴道B超" ||
                                    itemTitle === "输卵管造影"
                                    ? itemTitle
                                    : "影像"
                                )
                              }}
                            >
                              {citem.date ? citem.date.substring(5, 10) : null}
                            </span>
                          )}
                          {index !== count - 1 ? (
                            <span className="verticalLine">|</span>
                          ) : null}
                        </span>
                      </Fragment>
                    )
                  })}
                </>
              )}
            </div>
          )
        }
        subtitle={
          timeLine ? (
            <CloseOutlined
              style={{ color: "red" }}
              onClick={this.closeProjectItem}
            />
          ) : flag ? null : (
            <>
              {checkItems.map((citem, cindex) => {
                if (cindex === currentNum - 1) {
                  return (
                    <span
                      style={{ marginRight: 20, color: "#59b4f4" }}
                      key={cindex}
                    >
                      {citem.place === 0
                        ? "本院"
                        : citem.place === 1
                        ? "外院"
                        : "第三方检验"}
                    </span>
                  )
                } else {
                  return null
                }
              })}
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
          <Content
            item={projectItem}
            checkType={itemTitle}
            timeLine={timeLine}
            sex={sex}
          />
        ) : (
          <>
            {checkItems.map((item, index) => {
              if (index === currentNum - 1) {
                return (
                  <div key={index}>
                    <div className="content">
                      <div className="topContent">
                        {flag ? (
                          <Content
                            item={checkItems}
                            checkType={itemTitle}
                            sex={sex}
                          />
                        ) : (
                          <Content
                            item={item}
                            checkType={itemTitle}
                            sex={sex}
                          />
                        )}
                      </div>
                      <div className="bottom">
                        <div className="bottomTag">
                          <span className="icon_title">LIS</span>
                          <span className="icon_title">/</span>
                          <span>
                            {/* 编辑 */}
                            <EditFilled
                              className="icon_record"
                              onClick={() => {
                                this.changeVisible({
                                  ...item,
                                  ultrasounds: checkItems,
                                  edit: true,
                                })
                              }}
                            />
                          </span>
                        </div>
                        <div className="divider">
                          <Divider />
                        </div>
                        <div className="divider">
                          <Divider />
                        </div>
                        <div className="bottomBtn">
                          {/* 添加 */}
                          <DashBtn
                            onClick={() => this.changeVisible({ edit: false })}
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
            {checkItems.length === 0 ? (
              <div className="bottomBtn">
                {/* 添加 */}
                <DashBtn onClick={() => this.changeVisible({ edit: false })}>
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
