/*
 * This file is part of the Volkswagen Passat GTE 2016 application.
 */

/**
 * Create source element.
 *
 * @param {object} src
 *
 * @return {element}
 */
export const createSource = (media) => {
  const source = document.createElement('source')
  source.src = media.src
  source.type = media.mime

  return source
}

/**
 * Create array of source elements from src object, array or string.
 *
 * @param {object|array|string} src
 *
 * @return {array}
 */
export const prepareSources = (media) => {
  const sources = []
  let el = null

  if (typeof media === 'string') {
    el = createSource({ media })
    sources.push(el)
  } else if (typeof media === 'object') {
    if (media.length) {
      media.forEach(part => {
        el = createSource(part)
        sources.push(el)
      })
    } else {
      el = createSource(media)
      sources.push(el)
    }
  } else {
    throw new Error('Could not parse source.')
  }

  return sources
}

/**
 * Create video element with sources and load it.
 *
 * @param {array} sources
 * @param {object} options
 *
 * @return {element}
 */
export const createVideo = (sources, options) => {
  const video = document.createElement('video')

  video.autoplay = false
  video.preload = 'auto'
  video.loop = options.loop
  video.muted = true

  sources.forEach(source => video.appendChild(source))

  video.load()

  return video
}
