/* global Stats, OrbitControls, StereoEffect, CardboardEffect, DeviceOrientationControls */

/*
 * This file is part of the three playground.
 *
 * (c) Magnus Bergman <hello@magnus.sexy>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import raf from 'raf'
import THREE from 'three'

import WebGLRenderer from 'WebGLRenderer'
import Scene from 'Scene'
import Camera from 'Camera'

import CanvasVideoPlayer from 'CanvasVideoPlayer/CanvasVideoPlayer'

const stats = new Stats()
stats.setMode(0)
stats.domElement.style.position = 'absolute'
stats.domElement.style.left = '0px'
stats.domElement.style.top = '0px'
stats.domElement.style.zIndex = '1'
document.body.appendChild(stats.domElement)

/**
 * This is the app class.
 */
export default class App {

  /**
   * Create App
   *
   * @param {object|string} video (src path or video element)
   * @param {bool} iOS
   *
   * @return {void}
   */
  constructor (video, iOS) {
    const { innerWidth, innerHeight } = window

    this.updateTexture = this.updateTexture.bind(this)
    this.setOrientationControls = this.setOrientationControls.bind(this)
    this.toggleVideo = this.toggleVideo.bind(this)
    // this.toggleFullScreen = this.toggleFullScreen.bind(this)

    this.clock = new THREE.Clock()
    this.renderer = new WebGLRenderer()

    this.scene = new Scene()

    this.camera = new Camera({ far: 1100 })
    this.camera.layers.enable(1)

    this.player = new CanvasVideoPlayer(video, {
      canvas: iOS,
      loop: true,
      onUpdate: this.updateTexture
    })

    if (iOS) {
      this.texture = new THREE.Texture(this.player.canvas)
    } else {
      this.texture = new THREE.VideoTexture(this.player.video)
    }

    this.texture.minFilter = THREE.LinearFilter
    this.texture.format = THREE.RGBFormat

    this.material = new THREE.MeshBasicMaterial({ map: this.texture })

    this.geometry = new THREE.SphereBufferGeometry(500, 60, 40)
    this.geometry.scale(-1, 1, 1)

    this.mesh = new THREE.Mesh(this.geometry, this.material)

    this.effect = new StereoEffect(this.renderer)
    this.effect.setSize(innerWidth, innerHeight)

    this.controls = new OrbitControls(this.camera, this.renderer.domElement)

    this.controls.target.set(
      this.camera.position.x + 0.1,
      this.camera.position.y,
      this.camera.position.z
    )

    this.controls.enableZoom = false
    this.controls.enablePan = false

    this.scene.add(this.mesh)

    this.bindEvents()
    this.update()
  }

  /**
   * Tell three that the texture of the material has changed. Called from within
   * CanvasVideoPlayer.
   *
   * @return {void}
   */
  updateTexture () {
    if (this.texture) this.texture.needsUpdate = true
  }

  /**
   * Bind DOM events.
   *
   * @return {void}
   */
  bindEvents () {
    window.addEventListener('resize', this.resize.bind(this), false)
    window.addEventListener('deviceorientation', this.setOrientationControls, true)

    // document.body.addEventListener('click', this.toggleFullScreen, false)

    document.body.addEventListener('touchstart', this.toggleVideo, false)
    document.body.addEventListener('click', this.toggleVideo, false)
  }

  /**
   * Play/pause video.
   *
   * @param {object} e
   *
   * @return {void}
   */
  toggleVideo (e) {
    e.preventDefault()
    e.stopPropagation()

    // document.body.removeEventListener('touchstart', this.toggleVideo)
    // document.body.removeEventListener('click', this.toggleVideo)

    this.player.togglePlayPause()
  }

  /**
   * Update controls to be deviceorientation based if deviceorientation is triggered.
   *
   * @param {object} e
   *
   * @return {void}
   */
  setOrientationControls (e) {
    if (!e.alpha) return

    this.controls = new DeviceOrientationControls(this.camera, true)
    this.controls.connect()
    this.controls.update()

    window.removeEventListener('deviceorientation', this.setOrientationControls, true)
  }

  /**
   * Toggle fullscreen mode.
   *
   * @return {void}
   */
  // toggleFullScreen () {
  //   if (!document.fullscreenElement && // alternative standard method
  //       !document.mozFullScreenElement &&
  //       !document.webkitFullscreenElement &&
  //       !document.msFullscreenElement) {  // current working methods
  //     if (document.documentElement.requestFullscreen) {
  //       document.documentElement.requestFullscreen()
  //     } else if (document.documentElement.msRequestFullscreen) {
  //       document.documentElement.msRequestFullscreen()
  //     } else if (document.documentElement.mozRequestFullScreen) {
  //       document.documentElement.mozRequestFullScreen()
  //     } else if (document.documentElement.webkitRequestFullscreen) {
  //       document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT)
  //     }
  //   } else {
  //     if (document.exitFullscreen) {
  //       document.exitFullscreen()
  //     } else if (document.msExitFullscreen) {
  //       document.msExitFullscreen()
  //     } else if (document.mozCancelFullScreen) {
  //       document.mozCancelFullScreen()
  //     } else if (document.webkitExitFullscreen) {
  //       document.webkitExitFullscreen()
  //     }
  //   }
  // }

  /**
   * Resize canvas and everything within according to new window size.
   *
   * @return {void}
   */
  resize () {
    const { innerWidth, innerHeight } = window

    this.camera.setSize(innerWidth, innerHeight)
    this.renderer.setSize(innerWidth, innerHeight)
    this.effect.setSize(innerWidth, innerHeight)
  }

  /**
   * Update loop.
   *
   * @return {void}
   */
  update () {
    raf(this.update.bind(this))

    stats.begin()

    this.render()

    stats.end()
  }

  /**
   * Render gl.
   *
   * @return {void}
   */
  render () {
    const delta = this.clock.getDelta()

    this.controls.update(delta)

    this.effect.render(this.scene, this.camera)
    // this.renderer.render(this.scene, this.camera)
  }
}
