import React from "react"
import { Pie } from "@ant-design/charts"
import styled from "styled-components"

const Content = styled.div``
const DemoPie: React.FC = ({ datas, colorlist }) => {
  const config = {
    appendPadding: 35,
    forceFit: true,
    colorField: "type",
    color: colorlist,
    radius: 1,
    data: datas,
    legend: {
      position: "bottom",
      visible: true,
    },
    angleField: "value",
    label: {
      type: "inner",
      content: "{value}%",
    },
    height: 300,
  }

  return (
    <Content>
      <Pie {...config} />
    </Content>
  )
}

export default DemoPie
