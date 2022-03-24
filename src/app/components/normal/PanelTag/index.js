import React from "react"
import { LeftBorder } from "@/app/components/base/baseForms.js"

const PanelTag = ({ title, children }) => {
  return (
    <span>
      <LeftBorder />
      {title}
      {children}
    </span>
  )
}
export default PanelTag
