// @ts-nocheck
import React, { useEffect, useRef, useState } from 'react'
import { useIntl, useHistory, useLocation } from 'umi'
// @ts-ignore
import type { CachingNode } from 'react-activation'
import { Space, Dropdown, Menu, Tag } from 'antd'
import usePanelTab from './PanelTabHook'
import { getLocationId } from './PanelTabHook'

const PanelTab: React.FC<{ node: CachingNode }> = ({ node }) => {
  const intl = useIntl()
  const panelTabRef = useRef<HTMLSpanElement>()
  const { close, closeOther, refresh, closeAll } = usePanelTab()
  const history = useHistory()
  const location = useLocation()
  const locationId = getLocationId(node.location)
  const [nodeCache, setNodeCache] = useState<{ name: string; locationId: string }>({
    name: node.name!!,
    locationId,
  })

  const isActive = getLocationId(location) === locationId

  // 第二次打开同名但是不同地址的页签时, 刷新页签内容
  useEffect(() => {
    if (nodeCache.name === node.name && nodeCache.locationId !== locationId) {
      setNodeCache({ name: node.name!!, locationId })
      refresh({ name: node.name, location: node.location })
    }
    if (isActive && panelTabRef.current) {
      // 父元素信息
      const parentNode = panelTabRef.current?.parentElement
      // 获取元素信息
      const parentNodeBCR = parentNode?.getBoundingClientRect()
      const currentNodeBCR = panelTabRef.current?.getBoundingClientRect()
      // 元素被遮挡在左侧, 向右滚动
      if (currentNodeBCR.left < parentNodeBCR.left) {
        parentNode.scrollLeft -= parentNodeBCR.left - currentNodeBCR.left + currentNodeBCR.width
      }
      // 元素被遮挡在右侧, 向左滚动
      if (currentNodeBCR.right > parentNodeBCR.right) {
        parentNode.scrollLeft += currentNodeBCR.right - parentNodeBCR.right + currentNodeBCR.width
      }
    }
  }, [locationId])

  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item
            style={{ fontSize: '12px', padding: '0px 12px' }}
            key="closeSelf"
            onClick={() => close({ name: node.name!!, location: node.location })}
          >
            {intl.formatMessage({ id: 'panelTab.close', defaultMessage: '关闭' })}
          </Menu.Item>
          <Menu.Item
            style={{ fontSize: '12px', padding: '0px 12px' }}
            key="closeOther"
            onClick={() => closeOther({ name: node.name!!, location: node.location })}
          >
            {intl.formatMessage({ id: 'panelTab.closeOther', defaultMessage: '关闭其他' })}
          </Menu.Item>
          <Menu.Item
            style={{ fontSize: '12px', padding: '0px 12px' }}
            key="closeAll"
            onClick={closeAll}
          >
            {intl.formatMessage({ id: 'panelTab.closeAll', defaultMessage: '关闭所有' })}
          </Menu.Item>
          <Menu.Divider style={{ fontSize: '12px', padding: '0px 12px' }} />
          <Menu.Item
            style={{ fontSize: '12px', padding: '0px 12px' }}
            key="refreshSelf"
            onClick={() => refresh({ name: node.name!!, location: node.location })}
          >
            {intl.formatMessage({ id: 'panelTab.refresh', defaultMessage: '刷新' })}
          </Menu.Item>
        </Menu>
      }
      trigger={['contextMenu']}
    >
      <Tag
        ref={panelTabRef}
        style={{
          paddingLeft: '12px',
          paddingRight: '12px',
          height: '34px',
          textAlign: 'center',
          lineHeight: '30px',
          fontSize: '13px',
          backgroundColor: '#fff',
          cursor: 'default',
          borderRadius: '2px',
          border: '1px solid #EEECECFF',
        }}
        onClick={() => history.push(node.location)}
        closable
        onClose={(e) => {
          e.preventDefault()
          close({ name: node.name!!, location: node.location })
        }}
      >
        <Space style={{ marginRight: '8px' }}>
          <Dot active={isActive} />
          {node.route.name}
        </Space>
      </Tag>
    </Dropdown>
  )
}

export default PanelTab

const Dot = (props: { active: boolean }) => (
  <div
    style={{
      width: 10,
      height: 10,
      backgroundColor: props.active ? '#1a90ff' : '#d9d9d9',
      borderRadius: '50%',
      display: 'inline-block',
      marginRight: 5,
    }}
  />
)
