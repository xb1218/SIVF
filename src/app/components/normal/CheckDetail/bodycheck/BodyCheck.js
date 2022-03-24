import React, { Component } from "react"
import { observer, inject } from "mobx-react"
import BodyCheck from "./PatientsBodyCheck/index"

export default
@inject("store", "inspection")
@observer
class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      typeTitle: `${
        this.props.inspection.judgeSex(
          this.props.sex,
          this.props.store.patientSex
        )
          ? "女"
          : "男"
      }方体检`, //类型标题
    }
  }
  // 当父组件中的数组更改时，重新调用接口初始化
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      nextProps.sex !== this.props.sex ||
      nextProps.currentKey !== this.props.currentKey ||
      nextProps.patientId !== this.props.patientId
    ) {
      this.choseItem(null, this.props.itemTitle, null)
    }
  }
  componentDidMount() {
    this.props.onRef(this)
  }

  //左侧List选中一项
  choseItem = async (key, value, index) => {
    let { sex } = this.props
    let { patientSex } = this.props.store
    let { initNum } = this.props.inspection
    await this.setState({
      typeTitle:
        value === "体格检查"
          ? `${
              this.props.inspection.judgeSex(sex, patientSex) ? "女" : "男"
            }方体检`
          : value,
    })
    switch (value) {
      case "体格检查":
        this.BodyCheck.getBodyCheck()
        break
      case "妇科检查":
        this.BodyCheck.getCheck()
        break
      case "男科检查":
        this.BodyCheck.getCheck()
        break
      default:
        break
    }
    if (sex === null) {
      initNum()
    }
  }

  render() {
    let { typeTitle } = this.state
    let { sex } = this.props
    return (
      <div>
        <BodyCheck
          typeTitle={typeTitle}
          sex={sex}
          onRef={(ref) => (this.BodyCheck = ref)}
        />
      </div>
    )
  }
}
