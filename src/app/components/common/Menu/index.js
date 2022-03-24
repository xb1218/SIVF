import React, { Component, useState } from 'react'
import { Button, Drawer, Row, Col, Checkbox } from 'antd'
import { observer, inject } from 'mobx-react'
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons'
import './index.scss'

export default @inject('store') @observer class index extends Component {
    state = { visible: false };

    showDrawer = () => {
        this.setState({
            visible: true
        })
    }

    onClose = () => {
        this.setState({
            visible: false
        })
    }

    render() {
        const { collapsed, setCollapse } = this.props.store
        return (
            <div className="breadRoot">
                <Button id="controlSider" icon={collapsed ? <CaretRightOutlined /> : <CaretLeftOutlined />} onClick={setCollapse}></Button>
                <Button id="seeRecord" type="primary" shape="round" onClick={this.showDrawer}>查看病历</Button>
                <Drawer
                    title="查看病历"
                    width={580}
                    placement="right"
                    closable={false}
                    onClose={this.onClose}
                    visible={this.state.visible}
                    mask={true}
                >
                    <Row>
                        <Col span={12}>

                            <table style={{ border: '1px solid' }}>
                                <tbody>
                                    <tr>
                                        <td>
                                            <span>
                                                <span>月经史</span>
                                            </span>
                                        </td>
                                        <td >
                                            <div >
                                                <span >初潮:</span>
                                                <span >15岁</span>
                                                <span >周期:</span>
                                                <span >7 / 30天 </span>
                                                <span >末次月经</span>
                                                <span >2013-11-22</span><br />
                                                <span >经量</span>



                                                <Checkbox value='正常'></Checkbox>
                                                <Checkbox >多</Checkbox>
                                                <Checkbox>少</Checkbox>
                                                <span ></span>
                                                <span type={'checkbox'}>痛经:</span>


                                                <Checkbox >无</Checkbox>
                                                <Checkbox >有</Checkbox>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>


                        </Col>
                    </Row>

                </Drawer>
            </div>
            // <Breadcrumb>
            //     <Breadcrumb.Item>首页</Breadcrumb.Item>
            //     <Breadcrumb.Item><a href='/book'>书籍</a></Breadcrumb.Item>
            //     <Breadcrumb.Item><a href='/child'>小孩</a></Breadcrumb.Item>
            // </Breadcrumb>
        )
    }
}
