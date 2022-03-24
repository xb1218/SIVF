import React from "react"
import styled from "styled-components"

const MainContent = ({ children, ...rest }) => <div {...rest}>{children}</div>

export default styled(MainContent)`
    padding-top: 55px;
    position: relative;
    margin-left: 50px;
    height: 100vh;
    background: #f0f2f5;
}
`
