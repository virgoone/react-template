import React, { useRef, useEffect } from 'react'
import loadLottie from '@/utils/lottie'
import './style.less'

export interface PageFailedProps {
  code?: number
  httpCode?: number
  message?: string
  retry?: (() => void) | null
}

export default function PageFailed(props: PageFailedProps) {
  const { message = '', httpCode, code } = props
  let { retry } = props
  let hint = '呜呜呜~老汉找不到家啦'
  const lottieElement = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const animate = async () => {
      if (!lottieElement.current) {
        return
      }
      const lottieWeb = await loadLottie()

      const lottieAnimation = lottieWeb.loadAnimation({
        container: lottieElement.current,
        animationData: require('./error-animation.json'),
        renderer: 'svg',
        loop: true,
        autoplay: true,
        name: 'entry',
      })

      return () => {
        lottieAnimation.destroy()
      }
    }
    animate()
  }, [])

  if (httpCode && httpCode >= 400) {
    if (httpCode === 401) {
      retry = null
      hint = '请先登录哦'
    } else {
      hint = '数据加载失败'
    }
  }

  hint = `${hint}${httpCode || code ? `(${httpCode},${code})` : ''}`

  return (
    <div className="page-failed-wrapper">
      <div className="page-failed-animate" ref={lottieElement} />
      <div className="page-failed-box">
        <div className="page-failed-text">
          <p>{hint}</p>
          <p>{message}</p>
        </div>
        {retry && (
          <button onClick={retry} className="page-failed-retry">
            点击重试
          </button>
        )}
      </div>
    </div>
  )
}