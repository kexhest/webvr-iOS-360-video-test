/* eslint-env browser */

/*
 * This file is part of the Volkswagen Passat GTE 2016 application.
 */

import now from 'right-now'
import raf from 'raf'

import * as utils from './utils/utils'

const defaults = {
  fPS: 25,
  canvas: false,
  resume: false,
  loop: false,
  loadEvent: 'canplaythrough',
  onLoad: () => {},
  onUpdate: () => {}
}

let counter = 0

const { floor } = Math

/**
 * This is the CanvasVideoPlayer class.
 */
export default class CanvasVideoPlayer {

  /**
   * Create CanvasVideoPlayer.
   *
   * @param {element|object|array|string} src
   * @param {object} options
   *
   * @return {void}
   */
  constructor (src, options = {}) {
    if (!src) throw new Error('Source must be defined.')

    this.opts = {
      ...defaults,
      ...options
    }

    this.id = this.opts.id || counter++

    this.frameRate = (1 / this.opts.fPS)
    this.playing = false

    this.startTime = null
    this.lastUpdate = null
    this.elapsed = 0

    this.play = this.play.bind(this)
    this.pause = this.pause.bind(this)
    this.togglePlayPause = this.togglePlayPause.bind(this)
    this.update = this.update.bind(this)
    this.drawFrame = this.drawFrame.bind(this)
    this.onVideoCanPlay = this.onVideoCanPlay.bind(this)
    this.onVideoMetaDataLoaded = this.onVideoMetaDataLoaded.bind(this)

    if (src instanceof HTMLVideoElement) {
      this.video = src
      this.video.loop = this.opts.loop
    } else {
      this.sources = utils.prepareSources(src)

      this.video = utils.createVideo(this.sources, this.opts)
    }

    if (this.opts.canvas) {
      this.canvas = document.createElement('canvas')
      this.ctx = this.canvas.getContext('2d')
    }

    this.bindEvents()
  }

  /**
   * Bind events.
   *
   * @return {void}
   */
  bindEvents () {
    this.video.addEventListener('loadedmetadata', this.onVideoMetaDataLoaded, false)
    this.video.addEventListener(this.opts.loadEvent, this.onVideoCanPlay, false)

    if (this.opts.canvas) this.video.addEventListener('timeupdate', this.drawFrame, false)
  }

  /**
   * Event handler for when video meta data has loaded.
   *
   * @return {void}
   */
  onVideoMetaDataLoaded () {
    this.video.removeEventListener('loadedmetadata', this.onVideoMetaDataLoaded)
    this.width = this.video.videoWidth
    this.height = this.video.videoHeight

    this.duration = this.video.duration

    if (this.opts.canvas) this.setCanvasSize()
  }

  /**
   * Event handler for when enough data has been loaded so the video can start playing.
   * Calls loaded callback from options.
   *
   * @return {void}
   */
  onVideoCanPlay () {
    this.video.removeEventListener(this.opts.loadEvent, this.onVideoCanPlay)

    if (this.opts.canvas) this.drawFrame()

    this.video.pause()

    if (this.opts.onLoad && typeof this.opts.onLoad === 'function') this.opts.onLoad(this)
  }

  /**
   * Set canvas size.
   *
   * @return {void}
   */
  setCanvasSize () {
    this.canvas.width = this.width
    this.canvas.height = this.height

    this.canvas.setAttribute('width', this.width)
    this.canvas.setAttribute('height', this.height)
  }

  /**
   * Toggle play/pause state of video.
   *
   * @return {void}
   */
  togglePlayPause () {
    if (this.playing) {
      this.pause()
    } else {
      this.play()
    }
  }

  /**
   * Play video/audio.
   *
   * @return {void}
   */
  play () {
    if (this.playing) return

    this.playing = true

    if (this.opts.canvas) {
      this.startTime = this.opts.resume ? now() - floor(this.elapsed * 1000) : now()
      this.lastUpdate = now()

      this.update()
    } else {
      this.video.play()
    }
  }

  /**
   * Pause video/audio.
   *
   * @return {void}
   */
  pause () {
    if (!this.playing) return

    this.playing = false

    if (this.opts.canvas) {
      this.video.currentTime = this.opts.resume ? this.elapsed : 0
    } else {
      this.video.pause()
    }
  }

  /**
   * Increment video currentTime according to framerate.
   *
   * @return {void}
   */
  update () {
    if (!this.playing) return

    const time = now()
    this.elapsed = (time - this.startTime) * 0.001
    const interval = (time - this.lastUpdate) * 0.001

    if (interval >= this.frameRate) {
      this.video.currentTime = this.elapsed
      this.lastUpdate = time
    }

    if (this.video.currentTime >= this.video.duration) {
      if (this.opts.loop) {
        this.video.currentTime = 0
        this.startTime = this.lastUpdate = now()
      } else {
        this.pause()
      }
    }

    raf(this.update)
  }

  /**
   * Draw video image data to canvas.
   *
   * @return {void}
   */
  drawFrame () {
    this.ctx.clearRect(0, 0, this.width, this.height)
    this.ctx.drawImage(this.video, 0, 0, this.width, this.height)

    if (this.opts.onUpdate && typeof this.opts.onUpdate === 'function') this.opts.onUpdate(this)
  }
}
