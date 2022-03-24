import React from 'react'
import './index.scss'

//common display card (including the title) 通用的显示卡片区域(含标题)
const BlankView = ({ style, children }) => {
	return (
		<div className='blank' style={style}>
			{children}
		</div>
	)
}

export default BlankView