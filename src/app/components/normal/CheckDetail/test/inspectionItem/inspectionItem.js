import React, { Component } from "react"
import { inject, observer } from "mobx-react"
import { DateTitleView } from "@/app/components/normal/Title"
import { Divider } from "antd"
import { PlusOutlined, CloseOutlined, EditFilled } from "@ant-design/icons"
import { DashBtn } from "@/app/components/base/baseBtn.js"
import { Content } from "./baseItem"
import SetType from "./setType"

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
      itemTitle,
      count,
      inspectionItems,
      timeLine,
      date,
      projectItem,
      addCheckSource,
      sex,
      typeAndNameList,
      changeTab,
    } = this.props
    let { currentNum } = this.props.inspection
    return (
      <DateTitleView
        title={itemTitle}
        selectOption={
          <div className="selectOptions">
            {timeLine ? (
              <span style={{ marginLeft: 20 }}>{date}</span>
            ) : (
              inspectionItems.map((citem, index) => {
                return (
                  <>
                    <span key={index}>
                      {currentNum - 1 === index ? (
                        <span className="timeColor">{citem.date}</span>
                      ) : (
                        <span
                          onClick={(e) => {
                            e.preventDefault()
                            this.changeNum(index, citem, "化验单")
                          }}
                        >
                          {citem.date ? citem.date.substring(5, 10) : null}
                        </span>
                      )}
                      {index !== count - 1 ? (
                        <span className="verticalLine">|</span>
                      ) : null}
                    </span>
                  </>
                )
              })
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
              {addCheckSource === 0 ? (
                <SetType
                  sex={sex}
                  typeAndNameList={typeAndNameList}
                  title={itemTitle}
                  changeTab={changeTab}
                />
              ) : null}
              {inspectionItems.map((citem, cindex) => {
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
            addCheckSource={this.props.addCheckSource}
          />
        ) : (
          <>
            {inspectionItems.map((item, index) => {
              if (index === currentNum - 1) {
                return (
                  <div key={index}>
                    <div className="content">
                      <div className="topContent">
                        <Content
                          item={item}
                          checkType={itemTitle}
                          addCheckSource={this.props.addCheckSource}
                        />
                      </div>
                      <div className="bottom">
                        <div className="bottomTag">
                          <span className="icon_title">LIS</span>
                          {addCheckSource === 0 ? null : (
                            <>
                              <span className="icon_title">/</span>
                              <span>
                                {/* 编辑 */}
                                <EditFilled
                                  className="icon_record"
                                  onClick={() =>
                                    this.changeVisible({
                                      uid: item.uid,
                                      date: item.date,
                                      inspectionName: item.inspectionName,
                                      version: item.version,
                                      place: item.place,
                                      inspectionListParams:
                                        item.inspectionListParams,
                                      otherInspectionProjectDTO:
                                        item.otherInspectionProjectDTO,
                                      edit: true,
                                    })
                                  }
                                />
                              </span>
                            </>
                          )}
                        </div>
                        <div className="divider">
                          <Divider />
                        </div>
                        <div className="divider">
                          <Divider />
                        </div>
                        <div className="bottomBtn">
                          {/* 添加 */}
                          {addCheckSource === 0 ? null : (
                            <DashBtn
                              onClick={() =>
                                this.changeVisible({ edit: false })
                              }
                            >
                              <PlusOutlined />
                            </DashBtn>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              } else {
                return null
              }
            })}
            {inspectionItems.length === 0 ? (
              <div className="bottomBtn">
                {/* 添加 */}
                {addCheckSource === 0 ? null : (
                  <DashBtn onClick={() => this.changeVisible({ edit: false })}>
                    <PlusOutlined />
                  </DashBtn>
                )}
              </div>
            ) : null}
          </>
        )}
      </DateTitleView>
    )
  }
}
