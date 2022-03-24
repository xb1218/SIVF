import React,{Component} from 'react'
export default class SiderIcon extends Component{
	constructor(props){
		super(props)
		this.state={}
	}
	render(){
	
		const { type } = this.props
		const styleObj = {
			fontSize: '1.5em',
			height:'1.5em',
			width:'1em',
			
			marginRight: '.5em',
			verticalAlign: 'middle'
		}

		return(
			<svg className="icon" aria-hidden="true" style={styleObj}>
			<use xlinkHref={`#${type}`}></use>
		  </svg>
  

		)
	}
   
}