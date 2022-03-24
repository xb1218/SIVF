import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import { BaseModal } from "@/app/components/base/baseModal"
import { Button, Divider, Input, message } from "antd"
import { FormOutlined, CheckCircleOutlined } from "@ant-design/icons"
import PanelTag from "@/app/components/normal/PanelTag"
import apis from "@/app/utils/apis"

const { TextArea } = Input
export default
@inject("moredetail", "store")
@observer
class index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      deleteVisible: false, //显示新增或修改的弹框
      getedTempalte: [], //查询到的模板数据
      recordData: {}, //选中的哪行数据以及新增的一行数据
      title: null,
    }
  }
  componentDidMount() {
    this.getData()
  }
  // 查询
  getData = () => {
    let { type } = this.props
    apis.Template.getTempalte(type).then((res) => {
      if (res.code === 200) {
        this.setState({
          getedTempalte: res.data,
        })
      }
    })
  }
  // 新增后台接口
  addTem = (data) => {
    apis.Template.addTempalte(data).then((res) => {
      if (res.code === 200) {
        this.setState({
          deleteVisible: false,
        })
        message.success("模板新增成功！")
        this.getData()
      }
    })
  }
  // 修改后台接口
  modifyTem = (data) => {
    apis.Template.modifyTempalte(data).then((res) => {
      if (res.code === 200) {
        this.setState({
          deleteVisible: false,
        })
        message.success("模板修改成功！")
        this.getData()
      }
    })
  }
  // 删除模板后台接口
  deleteItem = (uid) => {
    apis.Template.delTempalte(uid).then((res) => {
      if (res.code === 200) {
        this.setState({
          deleteVisible: false,
        })
        message.success("删除成功！")
        this.getData()
      }
    })
  }
  // 删除模板
  deleteTem = () => {
    let { recordData } = this.state
    if (recordData.uid) {
      this.deleteItem(recordData.uid)
    } else {
      this.setState({
        deleteVisible: false,
      })
    }
  }
  // 显示新增或修改的弹框
  showEdit = () => {
    this.setState({
      deleteVisible: true,
    })
  }
  // 新增或修改手术显示
  notShow = () => {
    this.setState({
      deleteVisible: false,
    })
  }
  // 新增或修改的保存
  addItem = () => {
    let { recordData } = this.state
    let { type } = this.props
    recordData.templateType = type
    if (recordData.uid) {
      this.modifyTem(recordData)
    } else {
      this.addTem(recordData)
    }
  }
  // 显示修改的窗口
  show = (title, data) => {
    this.setState({
      deleteVisible: true,
      recordData: data, //选中了哪行数据
      title: title,
    })
  }
  // 模板内容的修改
  changeEdit = (parm, val) => {
    let { recordData } = this.state
    recordData[parm] = val
    this.setState({
      recordData,
    })
  }
  render() {
    let { deleteVisible, getedTempalte, title, recordData } = this.state
    let { titleTop } = this.props
    let data = {
      uid: null,
      templateName: null,
      templateBody: null,
    }
    return (
      <>
        <div>
          <div>
            <PanelTag title={titleTop} />
            <Button
              onClick={() => this.show("新建手术模板", data)}
              type="primary"
              size="small"
              style={{ float: "right" }}
            >
              +
            </Button>
          </div>
          <div className="templateDiv">
            {getedTempalte.map((item, index) => {
              return (
                <div key={index}>
                  <div className="templateItem">
                    <div className="templateItemLeft">
                      {item.templateName}
                      <FormOutlined
                        className="editIcon"
                        onClick={() => this.show("编辑手术模板", item)}
                      />
                    </div>
                    <div className="noteItemDiv">{item.templateBody}</div>
                    <div className="templateItemRight">
                      <CheckCircleOutlined
                        className="gouDiv"
                        onClick={() => this.props.checkTem(item.templateBody)}
                      />
                    </div>
                  </div>
                  <Divider style={{ margin: "20px 0" }} />
                </div>
              )
            })}
          </div>
        </div>
        {deleteVisible ? (
          <BaseModal
            title={<PanelTag title={title} />}
            width="500px"
            closable={false}
            visible={deleteVisible}
            footer={[
              <Button
                key="delete"
                onClick={this.deleteTem}
                type="primary"
                danger
              >
                删除
              </Button>,
              <Button key="submit" type="primary" onClick={this.addItem}>
                保存
              </Button>,
            ]}
          >
            <div className="marginTopDiv">
              <div className="editTemplate">
                <span>模板名称</span>
                <span>
                  <Input
                    value={recordData.templateName}
                    onChange={(e) =>
                      this.changeEdit("templateName", e.target.value)
                    }
                  />
                </span>
              </div>
              <div className="editTemplate">
                <span>模板内容</span>
                <span>
                  <TextArea
                    rows={6}
                    value={recordData.templateBody}
                    onChange={(e) =>
                      this.changeEdit("templateBody", e.target.value)
                    }
                  />
                </span>
              </div>
            </div>
          </BaseModal>
        ) : null}
      </>
    )
  }
}
