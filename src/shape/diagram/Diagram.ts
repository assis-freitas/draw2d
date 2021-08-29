import draw2d from '../../packages'
import extend from '../../util/extend'
import jsonUtil from '../../util/JSON'

/**
 * @class
 *
 * Base class for all diagrams.
 *
 * @param {Object} [attr] the configuration of the shape
 * @extends draw2d.SetFigure
 */
class Diagram extends SetFigure {
  constructor(attr, setter, getter) {
    this.data = []
    this.cache = {}

    super(
      extend({data: [], bgColor: "#8dabf2", stroke: 1, color: "#f0f0f0", radius: 2, resizeable: true}, attr),
      extend({}, {
        // @attr {Array} data the data to display in the diagram */
        data: this.setData
      }, setter),
      extend({}, {
        data: this.getData
      }, getter)
    )
  }
  /**
   *
   * Set the data for the chart/diagram element
   *
   * @param {Array} data
   *
   */
  setData (data) {
    this.data = data
    this.cache = {}


    if (this.svgNodes !== null) {
      this.svgNodes.remove()
      this.svgNodes = this.createSet()
    }

    this.repaint()
    this.fireEvent("change:data", {value: data})

  }
  /**
   *
   * Return the data of the diagram
   *
   * @since 5.0.0
   */
  getData () {
    return this.data
  }

  /**
   *
   * Set the dimension of the diagram and reset the cached calculation
   *
   * @since 5.0.0
   */
  setDimension (w, h) {
    this.cache = {}
    super(w, h)

    return this
  }

  /**
   *
   * Return the calculate width of the set. This calculates the bounding box of all elements.
   *
   * @returns {Number} the calculated width of the label
   **/
  getWidth () {
    return this.width
  }
  /**
   *
   * Return the calculated height of the set. This calculates the bounding box of all elements.
   *
   * @returns {Number} the calculated height of the label
   */
  getHeight () {
    return this.height
  }
  /**
   *
   * @param attributes
   */
  repaint (attributes) {
    if (this.repaintBlocked === true || this.shape == null) {
      return this
    }

    attributes = attributes || {}

    jsonUtil.ensureDefault(attributes, "fill", "none")

    return super(attributes)
  }
  applyTransformation () {
    if (this.isResizeable() === true) {
      this.svgNodes.transform("S" + this.scaleX + "," + this.scaleY + "," + this.getAbsoluteX() + "," + this.getAbsoluteY() + "t" + this.getAbsoluteX() + "," + this.getAbsoluteY())
    }
    else {
      this.svgNodes.transform("T" + this.getAbsoluteX() + "," + this.getAbsoluteY())
    }

    return this
  }


}

export default Diagram;
