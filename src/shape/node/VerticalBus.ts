import draw2d from '../../packages'
import Hub from "./Hub";


/**
 * @class
 *
 * A horizontal bus shape with a special kind of port handling. The hole figure is a hybrid port.
 *
 *
 * @example
 *
 *    let figure =  new draw2d.shape.node.VerticalBus({width:40, height:300, text:"Vertical Bus"});
 *
 *    canvas.add(figure,50,10);
 *
 * @extends draw2d.shape.node.Hub
 */
class VerticalBus extends Hub {
  /**
   *
   * @param {Object} [attr] the configuration of the shape
   */
  constructor(attr, setter, getter) {
    super(attr, setter, getter)

    this.setConnectionDirStrategy(2)
    this.installEditPolicy(new draw2d.policy.figure.VBusSelectionFeedbackPolicy())
  }

  /**
   *
   * set the label for the Hub
   *
   * @param {String} labelString
   * @since 3.0.4
   */
  setLabel (labelString) {
    let mustAdjustTheAngel = this.label === null

    super(labelString)

    if (mustAdjustTheAngel === true && this.label !== null) {
      this.label.setRotationAngle(90)
    }
  }
  /**
   * @inheritdoc
   */
  getMinHeight () {
    if (this.shape === null && this.label === null) {
      return 0
    }

    if (this.label !== null) {
      return this.label.getMinWidth()
    }

    return super()
  }
  /**
   * @inheritdoc
   */
  getMinWidth () {
    if (this.shape === null && this.label === null) {
      return 0
    }

    if (this.label !== null) {
      return this.label.getMinHeight()
    }

    return super()
  }


}

export default VerticalBus;
