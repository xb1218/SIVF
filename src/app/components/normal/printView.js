import React from "react"
import { Button } from "antd"
import ReactToPrint from "react-to-print"

export default class PrintViewCard extends React.Component {
  render() {
    const { children, padding, bottom } = this.props
    return (
      <div>
        <ReactToPrint
          trigger={() => (
            <Button
              size="small"
              style={{
                float: "right",
                right: "2em",
                bottom: bottom ? bottom : "1em",
                background: "#FFA25C",
                color: "#fff",
                border: "none",
              }}
            >
              打印
            </Button>
          )}
          content={() => this.printRef}
        />
        <div
          ref={(el) => (this.printRef = el)}
          style={{
            padding: padding ? padding : "2em 1em 1em 1em",
            background: "#fff",
          }}
        >
          {children}
        </div>
      </div>
    )
  }
}
