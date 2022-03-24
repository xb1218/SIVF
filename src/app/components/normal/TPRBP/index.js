import React from 'react'
import { Input, } from 'antd'
import Item from '@/app/components/normal/Item'

export const SurgeryPhase = ({ T, P, R, BP }) => {
	return (
		<div style={{ display: 'flex' }}>
			<Item title='T'>
				<Input style={{ width: 80 }} />
				<span>℃</span>
			</Item>
			<Item title='P'>
				<Input style={{ width: 80 }} />
				<span>次/分</span>
			</Item>
			<Item title='R'>
				<Input style={{ width: 80 }} />
				<span>次/分</span>
			</Item>
			<Item title='BP'>
				<Input style={{ width: 80 }} />
				<span>mmHg</span>
			</Item>
		</div>
	)
}