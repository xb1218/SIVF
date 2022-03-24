import React from "react"
import { Bar } from "@ant-design/charts"
import styled from "styled-components"

const Content = styled.div`
  margin: 0 auto;
  width: 95%;
  text-align: left;
  height: ${(props) =>
    props.height === 660 ? `calc(100vh - 70px)` : `calc(100vh - 237px)`};
`
const DemoBar: React.FC = ({
  datas,
  colorlist,
  label,
  xAxis,
  height,
  name,
}) => {
  const config = {
    data: [...datas],
    isGroup: true,
    xField: "value",
    yField: "label",
    seriesField: "type",
    marginRatio: 1,
    legend: {
      offsetY: 5,
      layout: "horizontal",
      position: "bottom",
    },
    label: label
      ? null
      : {
          position: "middle",
          layout: [
            { type: "interval-adjust-position" },
            { type: "adjust-color" },
          ],
        },
    xAxis: xAxis || false,
    color: colorlist,
  }
  return (
    <Content height={height}>
      <Bar {...config} />
    </Content>
  )
}

export default DemoBar
