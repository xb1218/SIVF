import styled from 'styled-components'
import { Select } from 'antd'
import { observer } from 'mobx-react'
import { observable } from 'mobx'
import React from 'react'

const BaseSelect = styled(Select)`
  &.ant-select {
    font-size: 14px;
    width: ${(props) => props.width + 'px'};
    height: ${(props) => (props.height || 36) + 'px'};
    line-height: ${(props) => (props.height || 36) + 'px'};

    .ant-select-selector {
      width: ${(props) => props.width + 'px'};
      height: ${(props) => (props.height || 36) + 'px'};
      line-height: ${(props) => (props.height || 36) + 'px'};

      .ant-select-selection__rendered {
        width: ${(props) => props.width + 'px'};
        height: ${(props) => (props.height || 36) + 'px'};
        line-height: ${(props) => (props.height || 36) + 'px'};

        .ant-select-selection-selected-value {
          width: ${(props) => props.width + 'px'};
          height: ${(props) => (props.height || 36) + 'px'};
          line-height: ${(props) => (props.height || 36) + 'px'};
        }
      }
      .ant-select-selection-item{
        width: ${(props) => props.width + 'px'};
        height: ${(props) => (props.height || 36) + 'px'};
        line-height: ${(props) => (props.height || 36) + 'px'};
      }
    }
  }
`

@observer
class ComboboxSelect extends React.Component {
  @observable value = ''

  constructor(props) {
    super(props)

    this.value = this.props.defaultValue || ''
  }

  setValue = (e) => {
    const { clinicTeams } = this.props
    const team = clinicTeams.filter(team => team.id === e)
    this.value = team[0] && team[0].name
  }

  render() {
    const { defaultValue, onSelect, onChange, ...rest } = this.props
    return (
      <BaseSelect
        onChange={(e) => {
          if (this.lock) {
            this.lock = false
            return
          }
          this.setValue(e)
          onChange(e)
        }}
        value={this.value}
        defaultValue={defaultValue}
        mode='combobox'
        onSelect={(e, option) => {
          onSelect(e, option)
          this.setValue(e)
          this.lock = true
        }}
        {...rest}
      >
        {this.props.children}
      </BaseSelect>
    )
  }
}

export { ComboboxSelect }
export default BaseSelect
