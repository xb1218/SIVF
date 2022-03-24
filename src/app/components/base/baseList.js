import React, { Component } from "react"
import { List } from "antd"

export default class BaseList extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  choseItem = (id, title, cindex, type, rindex) => {
    if (type === "body") {
      this.props.choseItem(id, title, cindex)
    } else {
      let data = []
      this.props.handleChoseItem(id, cindex, rindex, type, data)
    }
  }
  render() {
    const { header, dataSource, type, id, typeIndex } = this.props
    return (
      <>
        <List
          header={header}
          dataSource={dataSource}
          id={id}
          renderItem={(item, index) => (
            <List.Item className={item.checked ? "itemActive" : "itemUnactive"}>
              <List.Item.Meta
                key={index}
                title={
                  <div
                    className={item.checked ? "itemActive" : "itemUnactive"}
                    onClick={(e) => {
                      e.preventDefault()
                      this.choseItem(
                        item.id,
                        item.inspectionName,
                        index,
                        type,
                        typeIndex
                      )
                    }}
                  >
                    <sup style={{ marginRight: 3, color: "#59b4f4" }}>
                      {item.inspectionCount !== 0 ? item.inspectionCount : null}
                    </sup>
                    {item.inspectionName}
                    <sup style={{ marginRight: 3, color: "#59b4f4" }}>
                      {item.isExpire ? (
                        <svg
                          style={{ width: "1.5em", height: "1.5em" }}
                          aria-hidden="true"
                        >
                          <use xlinkHref="#icondaoqishijian" />
                        </svg>
                      ) : null}
                    </sup>
                    {
                      item.source === 0 ? 
                      <span className="lisStyle">(Lis)</span> : null
                    }
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </>
    )
  }
}
