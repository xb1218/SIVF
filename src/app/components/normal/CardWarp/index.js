import React from 'react'
import styled from 'styled-components'

const Border = styled.div`
  vertical-align:middle;
  margin:0 10px 0 10px;
  width:3px;
  height:14px;
  background-color: rgba(89,180,244,1);
`
const RowTop = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  padding:12px 0;
`
const Title = styled.div`
  font-weight: bold;
  line-height: 12px;
`
const Warp = styled.div`
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 3px;
  box-shadow: 3px 3px 5px #E5E7E9;
  width: -webkit-fill-available;
`
const CardWarp = ({ title, children }) => {
  return (
    <Warp >
      <RowTop>
        <Border />
        <Title>{title}</Title>
      </RowTop>

      {children}

    </Warp>
  )
}

export default CardWarp