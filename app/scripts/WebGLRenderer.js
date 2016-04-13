/*
 * This file is part of the three playground.
 *
 * (c) Magnus Bergman <hello@magnus.sexy>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import THREE from 'three'

const BACKGROUND_COLOR = 0x080d23

export default class WebGLRenderer extends THREE.WebGLRenderer {

  /**
   * Create WebGLRenderer.
   *
   * @return {void}
   */
  constructor () {
    const { innerWidth, innerHeight, devicePixelRatio } = window

    super({antialias: true})

    this.setClearColor(BACKGROUND_COLOR)
    this.setSize(innerWidth, innerHeight)
    this.setPixelRatio(devicePixelRatio)

    this.shadowMap.enabled = true
    this.shadowMapSoft = true

    document.body.appendChild(this.domElement)
  }

}
