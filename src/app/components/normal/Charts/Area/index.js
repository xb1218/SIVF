import React from "react"
import { Area } from "@ant-design/charts"
import styled from "styled-components"

const Content = styled.div`
  padding: 20px;
`
const DemoArea: React.FC = ({ datas, yAxis }) => {
  const config = {
    forceFit: true,
    data: datas,
    xField: "date",
    yField: "value",
    yAxis: yAxis ? yAxis : { min: 0, max: 100 },
    legend: {
      position: "bottom",
    },
    point: {
      size: 4,
      shape: "circle",
    },
    seriesField: "type",
    color: "#65D7E2",
    responsive: true,
    smooth: "smooth",
    height: 270,
    areaStyle: function areaStyle() {
      return { fill: "l(270) 0:#ffffff 0.4:#ADE3E8 1:#65D7E2" }
    },
    cursor: "pointer",
  }

  return (
    <Content>
      <Area {...config} />
    </Content>
  )
}
export default DemoArea
