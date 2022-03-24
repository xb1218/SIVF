import { Button } from "antd"
import React from "react"
import ReactToPrint from "react-to-print"
import "./index.scss"

class ComponentToPrint extends React.Component {
  render() {
    const src = this.props.src
    return (
      <iframe
        src={"http://sivf.dfinfo.net/sivf/" + src}
        id="parentHtml"
        title="iframe"
        ref={this.componentRef}
        frameBorder="0"
        width="100%"
        style={{ height: "calc(100vh - 46px)" }}
      />
    )
  }
}

export default class DataVerify extends React.Component {
  render() {
    const srcData = this.props.src
    return (
      <div className="printBox">
        <ReactToPrint
          trigger={() => (
            <Button type="primary" className="printBtn">
              打印
            </Button>
          )}
          content={() => this.componentRef}
        />
        <ComponentToPrint
          ref={(el) => (this.componentRef = el)}
          src={srcData}
        />
      </div>
    )
  }
}
