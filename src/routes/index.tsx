
import React from 'react'
import { RouteConfig } from 'react-router-config'
import PageFailed from '@/pages/page-failed'
import IndexPage from '@/pages/home'

function PageNotFound() {
  return <PageFailed code={404} message="ERR_NOT_FOUND" />
}

let routes: RouteConfig[] = []

routes = [
  {
    path: '/',
    component: IndexPage,
    exact: true,
  },
  {
    component: PageNotFound,
  },
]

export default routes