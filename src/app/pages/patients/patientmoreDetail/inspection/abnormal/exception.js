import React from "react"
import { FlexItem } from "@/app/components/base/baseForms.js"
//体和查的显示
export const Exception = (props) => {
  let exceptions = props.exceptions
  return (
    <div style={{ marginBottom: 10 }}>
      {Object.keys(exceptions).length === 0 ? (
        <FlexItem style={{ marginTop: 0 }}>
          <div>
            <span>暂无异常</span>
          </div>
        </FlexItem>
      ) : (
        Object.keys(exceptions).map((key, index) => {
          return (
            <FlexItem key={index} style={{ marginTop: 0 }}>
              <div>
                <span>{key}</span>
                <span>
                  {Object.keys(exceptions[key]).map((itemKey, itemIndex) => {
                    return (
                      <FlexItem key={itemIndex} style={{ marginTop: 0 }}>
                        <div>
                          <span>
                            {itemKey === "体检异常项目" ? null : itemKey + "："}
                          </span>
                          <span
                            className="span_underline"
                            style={{ width: "auto" }}
                          >
                            {exceptions[key][itemKey].join(" ")}
                          </span>
                        </div>
                      </FlexItem>
                    )
                  })}
                </span>
              </div>
            </FlexItem>
          )
        })
      )}
    </div>
  )
}
