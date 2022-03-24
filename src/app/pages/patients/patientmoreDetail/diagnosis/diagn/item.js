import React from "react"
import { DragSource, DropTarget } from "react-dnd"

function Item(props) {
  const {
    // 这些 props 由 React DnD注入，参考`collect`函数定义
    isDragging,
    connectDragSource,
    connectDragPreview,
    connectDropTarget,
    // 这些是组件收到的 props
    item,
    style = {},
    find,
    move,
    change,
    remove,
    ...restProps
  } = props
  const opacity = isDragging ? 0.5 : 1
  return connectDropTarget(
    // 列表项本身作为 Drop 对象
    connectDragPreview(
      // 整个列表项作为跟随拖动的影像
      <div {...restProps} style={Object.assign(style, { opacity })}>
        <p className="title">{item.title}</p>
        <ul className="oper-list">
          {
            connectDragSource(
              <li className="oper-item icon-move">
                <svg className="icon_s" aria-hidden="true">
                  <use xlinkHref="#iconsortdefault" />
                </svg>
              </li>
            ) // 拖动图标作为 Drag 对象
          }
        </ul>
      </div>
    )
  )
}

const type = "item"
const dragSpec = {
  // 拖动开始时，返回描述 source 数据。后续通过 monitor.getItem() 获得
  beginDrag: (props) => ({
    id: props.id,
    originalIndex: props.find(props.id).index,
  }),
  // 拖动停止时，处理 source 数据
  endDrag(props, monitor) {
    const { id: droppedId, originalIndex } = monitor.getItem()
    const didDrop = monitor.didDrop()
    // source 是否已经 drop 到 target
    if (!didDrop) {
      return props.move(droppedId, originalIndex)
    }
    return props.change(droppedId, originalIndex)
  },
}
const dragCollect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(), // 用于包装需要拖动的组件
  connectDragPreview: connect.dragPreview(), // 用于包装需要拖动跟随预览的组件
  isDragging: monitor.isDragging(), // 用于判断是否处于拖动状态
})
const dropSpec = {
  canDrop: () => false, // item 不处理 drop
  hover(props, monitor) {
    const { id: draggedId } = monitor.getItem()
    const { id: overId } = props
    // 如果 source item 与 target item 不同，则交换位置并重新排序
    if (draggedId !== overId) {
      const { index: overIndex } = props.find(overId)
      props.move(draggedId, overIndex)
    }
  },
}
const dropCollect = (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(), // 用于包装需接收拖拽的组件
})

const DndItem = DropTarget(
  type,
  dropSpec,
  dropCollect
)(DragSource(type, dragSpec, dragCollect)(Item))

export default DndItem
