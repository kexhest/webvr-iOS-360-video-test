/*
 * This file is part of the three playground.
 *
 * (c) Magnus Bergman <hello@magnus.sexy>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

import THREE from 'three'

const { innerWidth, innerHeight } = window

const defaults = {
  angle: 75,
  aspect: innerWidth / innerHeight,
  near: 1,
  far: 10000
}

export default class Camera extends THREE.PerspectiveCamera {

  /**
   * Create Camera.
   *
   * @param {object} options
   *
   * @return {void}
   */
  constructor (options) {
    const { innerWidth, innerHeight } = window

    const opts = {
      ...defaults,
      ...options
    }

    super(opts.angle, opts.aspect, opts.near, opts.far)

    this.width = innerWidth
    this.height = innerHeight
  }

  /**
   * Set size.
   *
   * @param {number} width
   * @param {number} height
   *
   * @return {void}
   */
  setSize (width, height) {
    this.width = width
    this.height = height

    this.aspect = width / height
    this.updateProjectionMatrix()
  }

}
