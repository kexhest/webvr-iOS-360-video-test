/*
 * This file is part of the three playground.
 *
 * (c) Magnus Bergman <hello@magnus.sexy>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import assetsLoader from 'assets-loader'

import App from './App'

const videoSrc = {
  ld: require('equirectangular-ld.mp4'),
  md: require('equirectangular-md.mp4'),
  hd: require('equirectangular.mp4')
}

const assetsManager = assetsLoader({log: true})

const iOS = /i(Pad|Phone)/i.test(navigator.userAgent)

function onError (error) {
  console.log('error: ', error)
}

function onProgress (progress) {
  console.log('progress: ', (progress * 100).toFixed() + '%')
}

function onComplete () {
  let src = assetsManager.get('video')
  let video = null

  if (window.Blob && src instanceof window.Blob) {
    src = window.URL.createObjectURL(src)
    video = document.createElement('video')

    video.autoplay = false
    video.preload = 'auto'
    video.muted = true

    video.src = src
  } else {
    video = src
  }

  video.load()

  window.app = new App(video, iOS)
}

assetsManager
  .add({
    id: 'video',
    url: iOS ? videoSrc.ld : videoSrc.hd,
    blob: true
  })
  .on('error', onError)
  .on('progress', onProgress)
  .on('complete', onComplete)

let LOADED = false

document.addEventListener('DOMContentLoaded', bootstrap, false)
window.addEventListener('load', bootstrap, false)

function bootstrap () {
  if (LOADED) return

  LOADED = true

  document.removeEventListener('DOMContentLoaded', bootstrap)
  window.removeEventListener('load', bootstrap)

  if (!window.WebGLRenderingContext) {
    window.location = 'http://get.webgl.org'
  } else {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('webgl')

    if (!context) {
      window.location = 'http://get.webgl.org/troubleshooting'
    } else {
      assetsManager.start()
    }
  }
}
