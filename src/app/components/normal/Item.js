import React from "react"
import "@/app/styles/sass/base.scss"

const Item = ({ title, required, children, ...rest }) => {
  return (
    <div id="grid-cell">
      <div id="grid-item">
        <p id="grid-title">
          {required && (
            <span style={{ color: "#FF0000", marginRight: 4 }}>*</span>
          )}
          {title ? <span>{title} :</span> : null}
        </p>
        {children}
      </div>
    </div>
  )
}

export default Item
