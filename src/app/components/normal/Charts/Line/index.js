import React from "react"
import { Line } from "@ant-design/charts"
import styled from "styled-components"

const Content = styled.div`
  padding: 20px;
  text-align: left;
`
const DemoLine: React.FC = ({ datas, colorlist, yAxis }) => {
  const config = {
    data: datas,
    xField: "month",
    yField: "cycleCounts",
    yAxis: yAxis ? yAxis : null,
    legend: {
      position: "bottom",
    },
    point: { visible: true },
    seriesField: "quarter",
    color: colorlist,
    height: 260,
    cursor: "pointer",
    lineWidth: 0.4,
  }

  return (
    <Content>
      <Line {...config} />
    </Content>
  )
}

export default DemoLine
