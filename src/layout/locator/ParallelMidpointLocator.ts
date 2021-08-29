import draw2d from '../../packages'
import extend from "../../util/extend";
import ConnectionLocator from "./ConnectionLocator";


/**
 * @class
 *
 * A ParallelMidpointLocator that is used to place label at the midpoint of a  routed
 * connection. The midpoint is always in the center of an edge.
 * The label is aligned to the connection angle at the calculated conection segment.
 *
 *
 * @author Andreas Herz
 * @extend draw2d.layout.locator.ConnectionLocator
 * @since 4.4.4
 */
class ParallelMidpointLocator extends ConnectionLocator {
    private distance: number;
    /**
     * Constructs a ParallelMidpointLocator with optional padding to the connection.
     *
     * if the parameter <b>distance</b> is less than zero the label is
     * placed above of the connection. Else the label is below the connection.
     *
     * @param {Object} attr object with {distance: <NUMBER>>} distance of the label to the connection.
     */
    constructor(attr: any, setter: any, getter: any) {
      super(extend({
          distance: -5
        }, attr),
        extend({
          x: this.setDistance
        }, setter),
        extend({
          distance: this.getDistance
        }, getter))

        this.distance = 0
    }
    /**
     * Set the distance to the connection
     *
     * @param {Number} distance the distance to the connection
     * @returns {this}
     */
    setDistance(distance: number) {
      this.distance = distance
      return this
    }
    /**
     * Returns the distance to the connection
     *
     * @returns {Number}
     */
    getDistance() {
      return this.distance
    }
    /**
     *
     * Relocates the given Figure always in the center of an edge.
     *
     * @param {Number} index child index of the target
     * @param {draw2d.Figure} target The figure to relocate
     **/
    relocate(index: any, target: { getParent: () => any; getHeight: () => number; getWidth: () => number; setRotationAngle: (arg0: number) => void; setPosition: (arg0: any, arg1: any) => void; }) {
      let conn = target.getParent()
      let points = conn.getVertices()

      let segmentIndex = Math.floor((points.getSize() - 2) / 2)
      if (points.getSize() <= segmentIndex + 1) {
        return
      }

      let p1 = points.get(segmentIndex)
      let p2 = points.get(segmentIndex + 1)

      // calculate the distance of the label (above or below the connection)
      let distance = this.distance <= 0 ? this.distance - target.getHeight() : this.distance

      // get the angle of the segment
      let nx = p1.x - p2.x
      let ny = p1.y - p2.y
      let length = Math.sqrt(nx * nx + ny * ny)
      let radian = -Math.asin(ny / length)
      let angle = (180 / Math.PI) * radian
      if (radian < 0) {
        if (p2.x < p1.x) {
          radian = Math.abs(radian) + Math.PI
          angle = 360 - angle
          distance = -distance - target.getHeight()
        } else {
          radian = Math.PI * 2 - Math.abs(radian)
          angle = 360 + angle
        }
      } else {
        if (p2.x < p1.x) {
          radian = Math.PI - radian
          angle = 360 - angle
          distance = -distance - target.getHeight()
        }
      }

      let rotAnchor = this.rotate(length / 2 - target.getWidth() / 2, distance, 0, 0, radian)

      // rotate the x/y coordinate with the calculated angle around "p1"
      //
      let rotCenterOfLabel = this.rotate(0, 0, target.getWidth() / 2, target.getHeight() / 2, radian)

      target.setRotationAngle(angle)
      target.setPosition(rotAnchor.x - rotCenterOfLabel.x + p1.x, rotAnchor.y - rotCenterOfLabel.y + p1.y)
    }
    rotate(x: number, y: number, xm: number, ym: number, radian: number) {
      let cos = Math.cos,
        sin = Math.sin

      // Subtract midpoints, so that midpoint is translated to origin
      // and add it in the end again
      return {
        x: (x - xm) * cos(radian) - (y - ym) * sin(radian) + xm,
        y: (x - xm) * sin(radian) + (y - ym) * cos(radian) + ym
      }
    }

  }

  export default ParallelMidpointLocator;
