// @ts-nocheck
import type { FC } from 'react'
import React, { cloneElement, useContext, useEffect } from 'react'
// @ts-ignore
import { KeepAlive, useHistory, useIntl } from 'umi'
import { Modal } from 'antd'
import { useAliveController } from '@@/core/umiExports'
import { useDebounceFn } from 'ahooks'
import { RouteContext } from '@ant-design/pro-layout'
import PanelTabs from './PanelTabs'
import { getLocationId } from './PanelTabs/PanelTabHook'

let len = 0
const PanelTabsWrapper: FC<{ children: React.ReactNode }> = ({ children }) => {
  const intl = useIntl()
  const routeContext = useContext(RouteContext)
  const history = useHistory()
  const { getCachingNodes } = useAliveController()
  const cachingNodes = getCachingNodes()
  const id = getLocationId(history.location)

  const useDebounce = useDebounceFn(
    () =>
      Modal.warn({
        title: intl.formatMessage({ id: 'panelTab.tabsLimitWarnTitle', defaultMessage: '提示' }),
        content: intl.formatMessage({
          id: 'panelTab.tabsLimitWarnContent',
          defaultMessage: '您当前打开页面过多, 请关闭不使用的页面以减少卡顿!',
        }),
      }),
    { wait: 500 },
  )

  useEffect(() => {
    const t = cachingNodes.length
    if (t > len && t > 10) {
      len = t
      useDebounce.run()
    }
  }, [cachingNodes])

  const cache = cachingNodes.find((item) => getLocationId(item.location) === id)
  const newChildren = cloneElement(children, {
    activateCount: (cache?.children.props?.activateCount ?? -1) + 1,
  })

  return (
    <>
      <PanelTabs />

      <KeepAlive
        id={id}
        name={id}
        route={routeContext.currentMenu}
        location={history.location}
        saveScrollPosition="screen"
      >
        {newChildren}
      </KeepAlive>
    </>
  )
}

export default PanelTabsWrapper
