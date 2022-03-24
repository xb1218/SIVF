import React, { Component } from "react"
import { BaseTable } from "@/app/components/base/baseTable"
import { Divider, Select } from "antd"
import { todayString } from "@/app/utils/const.js"
import "./index.scss"

export default class _setVisit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: [
        {
          title: "",
          children: [{ title: "诊室", dataIndex: "visitRoom" }],
        },
        {
          title: todayString,
          children: [
            { title: "上午", dataIndex: "amTypeProject" },
            { title: "下午", dataIndex: "pmTypeProject" },
          ],
        },
      ],
    }
  }
  render() {
    const { columns } = this.state
    const {
      selectOption,
      editData,
      setData,
      showEdit,
      getRowrecord,
      changeSelect,
      saveChange,
    } = this.props
    const editColumns = [
      {
        title: "",
        children: [{ title: "诊室", dataIndex: "visitRoom" }],
      },
      {
        title: todayString,
        children: [
          {
            title: "上午",
            dataIndex: "amTypeProject",
            render: (text, record) => {
              return (
                <Select
                  style={{ width: "98%" }}
                  dropdownMatchSelectWidth={150}
                  value={record.amTypeProject}
                  options={selectOption}
                  onChange={(value) =>
                    changeSelect(
                      record,
                      "amTypeProject",
                      "amTypeProjectUid",
                      value
                    )
                  }
                />
              )
            },
          },
          {
            title: "下午",
            dataIndex: "pmTypeProject",
            render: (text, record) => {
              return (
                <Select
                  style={{ width: "98%" }}
                  dropdownMatchSelectWidth={150}
                  value={record.pmTypeProject}
                  options={selectOption}
                  onChange={(value) =>
                    changeSelect(
                      record,
                      "pmTypeProject",
                      "pmTypeProjectUid",
                      value
                    )
                  }
                />
              )
            },
          },
        ],
      },
    ]
    return (
      <div>
        <BaseTable
          bordered
          columns={columns}
          dataSource={setData}
          rowKey={(record) => record.uid}
          pagination={false}
          scroll={{ y: `calc(100vh - 250px)` }}
          onRow={(record, index) => {
            return {
              onClick: () => getRowrecord(record, index),
            }
          }}
        />
        <div>
          {showEdit ? (
            <>
              <Divider>编辑</Divider>
              <div style={{ textAlign: "right" }}>
                <svg
                  style={{ width: "2em", height: "2em" }}
                  aria-hidden="true"
                  onClick={saveChange}
                >
                  <use xlinkHref="#iconcheck" />
                </svg>
              </div>
              <BaseTable
                bordered
                columns={editColumns}
                dataSource={editData}
                scroll={{ y: `calc(100vh - 250px)` }}
                pagination={false}
              />
            </>
          ) : null}
        </div>
      </div>
    )
  }
}
