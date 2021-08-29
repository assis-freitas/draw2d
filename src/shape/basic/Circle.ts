import draw2d from '../../packages'
import extend from '../../util/extend'
import Oval from "./Oval";

/**
 * @class
 * A circle figure with basic background and stroke API. <br>
 * A circle can not be streched. <strong>The aspect ration is always 1:1</strong>.
 *
 *
 * @example
 *
 *    let shape =  new draw2d.shape.basic.Circle({x:40,y:10, stroke:3, color:"#3d3d3d", bgColor:"#3dff3d"});
 *
 *    canvas.add(shape);
 *
 *
 * @author Andreas Herz
 * @extends draw2d.shape.basic.Oval
 */
class Circle extends Oval {

    /**
     *
     * @param {Object} [attr] the configuration of the shape
     * @param {Object} [setter] add or replace setter methods
     * @param {Object} [getter] add or replace getter methods
     **/
    constructor(attr, setter, getter) {
      super(
        attr,
        extend({
          // @attr {Number} diameter the diameter of the circle */
          diameter: this.setDiameter,
          // @attr {Number} radius the radius of the circle */
          radius: this.setRadius
        }, setter),
        extend({
          diameter: this.getDiameter,
          radius: this.getRadius
        }, getter))

      this.setKeepAspectRatio(true)
    }
    /**
     *
     * Set the diameter of the circle. The center of the circle will be retained.
     *
     * @param {Number} d The new diameter of the circle.
     * @since 4.0.0
     * @returns {this}
     **/
    setDiameter (d) {
      let center = this.getCenter()
      this.setDimension(d, d)
      this.setCenter(center)
      this.fireEvent("change:diameter", {value: d})

      return this
    }
    /**
     *
     * Get the diameter of the circle.
     *
     * @since 4.0.0
     * @returns {Number} the diameter of the circle
     **/
    getDiameter () {
      return this.getWidth()
    }

    /**
     *
     * Set the radius of the circle. The center of the circle will be retained.
     *
     * @param {Number} r The new radius of the circle.
     * @since 4.0.0
     * @returns {this}
     **/
    setRadius (r) {
      this.setDiameter(r * 2)
      this.fireEvent("change:radius", {value: r})

      return this
    }
    /**
     * Get the radius of the circle
     *
     * @returns {Number} the radius of the circle
     */
    getRadius(){
      return this.getWidth()/2
    }
    /**
     * @inheritdoc
     * @returns {Object}
     */
    getPersistentAttributes () {
      let memento = super()
      // delete the radius attribute of the parent. Because the "radius" is the corner radius
      // of the shape and not the "radius" of the circle. Design flaw.  :-/
      delete memento.radius

      return memento
    }
  }

  export default Circle;
