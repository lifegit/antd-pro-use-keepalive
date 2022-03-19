import { IRoute } from '@umijs/core'
import { IApi } from '@umijs/types'
import _ from '@umijs/deps/compiled/lodash'

export default function (api: IApi) {
  api.modifyRoutes((routes: IRoute[]) => modifyRoutes(_.clone(routes), true, false, false))
}

const modifyRoutes = (routes: IRoute[], topRoute: boolean, use404: boolean, useAuth: boolean) => {
  routes.forEach((x) => {
    if (x.hideInPanelTab !== true && x.name) {
      if (x.wrappers && x.wrappers.length > 0) {
        x.wrappers.push(...generatorWrappers(useAuth))
      } else {
        x.wrappers = generatorWrappers(useAuth)
      }
    }
    if (x.routes) {
      x.routes = modifyRoutes(x.routes, false, use404, useAuth)
    }
  })
  if (!topRoute) {
    if (use404) {
      add404(routes)
    }
  }
  return routes
}

const add404 = (routes: IRoute[]) =>
  routes.push({
    name: '页面未找到',
    component: '@@/plugin-panel-tabs/Result/404',
    wrappers: ['@@/plugin-panel-tabs/Wrappers/PanelTabsWrapper'],
  })

const generatorWrappers = (useAuth: boolean) => {
  if (useAuth) {
    return ['@/components/PanelTabsKeepAlive']
  }
  return ['@/components/PanelTabsKeepAlive']
}
