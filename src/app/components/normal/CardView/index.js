import React from 'react'
import './index.scss'

//common display card (including the title) 通用的显示卡片区域(含标题)
const CardView = ({ style, title, subtitle, children,text }) => {
	return (
		<div className='card' style={style}>
			<div className='title'>
				<div className='flag' />
				<div className='name'>{title}</div>
				<div className='extra'>{subtitle}</div>
			</div>
			{
				text === 'true' ?
					<div className='text'>
						{children}
					</div> : <div className='contentWrap'>
						{children}
					</div>
			}

		</div>
	)
}

export default CardView