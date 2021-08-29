import draw2d from '../../packages'
import extend from '../../util/extend'
import VectorFigure from "../../VectorFigure";

/**
 * @class
 * A Rectangle Figure.
 *
 *
 * @example
 *
 *    let rect1 =  new draw2d.shape.basic.Rectangle({
 *    	x:10,
 *     y:10
 *    });
 *
 *    let rect2 =  new draw2d.shape.basic.Rectangle({
 *      x: 100,
 *      y: 10,
 *      bgColor: "#f0f000",
 *      alpha  : 0.7,
 *      width: 100,
 *      height: 60,
 *      radius: 10
 *    });
 *
 *    canvas.add(rect1);
 *    canvas.add(rect2);
 *
 *    canvas.setCurrentSelection(rect2);
 *
 * @author Andreas Herz
 * @param {Object} [attr] the configuration of the shape
 * @param {Object} [setter] add or replace setter methods
 * @param {Object} [getter] add or replace getter methods
 * @extends draw2d.VectorFigure
 */
class Rectangle extends VectorFigure {
  constructor(attr, setter, getter) {
    this.dasharray = null

    super(
      extend({bgColor: "#a0a0a0", color: "#1B1B1B"}, attr),
      extend({}, {
        // @attr {String} dash The dot/dash pattern for the line style. Valid values: ["", "-", ".", "-.", "-..", ". ", "- ", "--", "- .", "--.", "--.."]*/
        dash: this.setDashArray,
        // @attr {String} dasharray The dot/dash pattern for the line style. Valid values: ["", "-", ".", "-.", "-..", ". ", "- ", "--", "- .", "--.", "--.."]*/
        dasharray: this.setDashArray
      }, setter),
      extend({}, {
        dash: this.getDashArray,
        dasharray: this.getDashArray
      }, getter)
    )
  }
  /**
   * @inheritdoc
   **/
  repaint (attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
      return
    }

    attributes = extend({}, {
      width: this.getWidth(),
      height: this.getHeight(),
      r: this.getRadius()
    }, attributes)

    if (this.dasharray !== null) {
      attributes["stroke-dasharray"] = this.dasharray
    }

    super(attributes)

    return this
  }
  /**
   * @inheritdoc
   */
  applyTransformation () {
    let ts = "R" + this.rotationAngle

    if (this.getRotationAngle() === 90 || this.getRotationAngle() === 270) {
      let ratio = this.getHeight() / this.getWidth()
      ts = ts + "S" + ratio + "," + 1 / ratio + "," + (this.getAbsoluteX() + this.getWidth() / 2) + "," + (this.getAbsoluteY() + this.getHeight() / 2)
    }

    this.shape.transform(ts)

    return this
  }
  /**
   * @inheritdoc
   */
  createShapeElement () {
    return this.canvas.paper.rect(this.getAbsoluteX(), this.getAbsoluteY(), this.getWidth(), this.getHeight())
  }

  /**
   *
   * Set the line style for dot/dash styling. Possible values are
   * ["", "-", ".", "-.", "-..", ". ", "- ", "--", "- .", "--.", "--.."]
   *
   *     // Alternatively you can use the attr method:
   *     figure.attr({
   *       dash: pattern
   *     });
   *
   * @param {String} pattern the string with the dot/dash pattern. valid values: ["", "-", ".", "-.", "-..", ". ", "- ", "--", "- .", "--.", "--.."]
   */
  setDashArray (pattern) {
    this.dasharray = pattern
    this.repaint()
    this.fireEvent("change:dashArray", {value: this.dasharray})

    return this
  }
  /**
   *
   * Get the line style for this object.
   *
   *     // Alternatively you can use the attr method:
   *     figure.attr("dash");
   *
   * @since 5.1.0
   */
  getDashArray () {
    return this.dasharray
  }
  /**
   * @inheritdoc
   */
  getPersistentAttributes () {
    let memento = super()

    if (this.dasharray !== null) {
      memento.dasharray = this.dasharray
    }

    return memento
  }

  /**
   * @inheritdoc
   */
  setPersistentAttributes (memento) {
    super(memento)

    if (typeof memento.dasharray === "string") {
      this.dasharray = memento.dasharray
    }

    return this
  }

}

export default Rectangle;
