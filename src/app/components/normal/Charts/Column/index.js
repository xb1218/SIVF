import React from "react"
import { Column } from "@ant-design/charts"
import styled from "styled-components"

const Content = styled.div`
  padding: 20px;
  text-align: left;
`
const DemoColumn: React.FC = ({ datas, colorlist, yAxis }) => {
  const config = {
    data: datas,
    isGroup: true,
    xField: "value",
    yField: "label",
    seriesField: "name",
    marginRatio: 0.2,
    columnWidthRatio: 0.4,
    legend: {
      visible: true,
      position: "bottom",
    },
    yAxis: yAxis ? yAxis : null,
    height: 260,
    color: colorlist,
    cursor: "pointer",
  }

  return (
    <Content>
      <Column {...config} />
    </Content>
  )
}

export default DemoColumn
