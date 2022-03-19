// @ts-nocheck
import React, { useContext, useRef } from 'react'
import type { FC } from 'react'
// @ts-ignore
import { useAliveController } from 'umi'
import PanelTab from './PanelTab'
import { CaretLeftOutlined, CaretRightOutlined } from '@ant-design/icons'
import { Space } from 'antd'
import { RouteContext } from '@ant-design/pro-layout'

const PanelTabs: FC = () => {
  const { getCachingNodes } = useAliveController()
  const cachingNodes = getCachingNodes()
  const routeContext = useContext(RouteContext)
  const scrollContainer = useRef<HTMLDivElement>()

  return (
    <>
      <div
        style={{
          position: 'fixed',
          zIndex: 9,
          width: '100%',
          padding: '5px 0px',
          backgroundColor: '#eff2f5',
          borderBottom: '1px solid #e2e5ec',
          boxShadow: '#0000000d 0 1px 6px 0, #0000000a 0 0 6px 0',
        }}
      >
        <style>{`
.panelTabsBar {
  width: calc(100% - ${routeContext.siderWidth}px);
  display: flex;
  overflow-x: scroll;
  padding: 0 50px 0px 5px;
}
.panelTabsBar::-webkit-scrollbar {
  display: none;
}
  `}</style>
        <div className="panelTabsBar" ref={scrollContainer}>
          {cachingNodes.map((node, idx) => (
            <PanelTab key={idx} node={node} />
          ))}
          <Space
            style={{
              backgroundColor: '#FFFFFF',
              position: 'fixed',
              right: 1,
              paddingRight: '5px',
              height: '35px',
              textAlign: 'center',
              lineHeight: '30px',
              fontSize: '18px',
            }}
          >
            <CaretLeftOutlined
              style={{ display: 'inline-block', cursor: 'pointer' }}
              onClick={() =>
                (scrollContainer.current.scrollLeft = scrollContainer.current.scrollLeft - 100)
              }
            />
            <CaretRightOutlined
              style={{ display: 'inline-block', cursor: 'pointer' }}
              onClick={() =>
                (scrollContainer.current.scrollLeft = scrollContainer.current.scrollLeft + 100)
              }
            />
          </Space>
        </div>
      </div>
      <div style={{ height: 45 }} />
    </>
  )
}

export default PanelTabs
