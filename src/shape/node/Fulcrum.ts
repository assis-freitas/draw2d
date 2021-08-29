import draw2d from '../../packages'
import jsonUtil from '../../util/JSON'


/**
 * @class
 *
 * A horizontal bus shape with a special kind of port handling. The hole figure is a hybrid port.
 *
 *
 * @example
 *
 *    canvas.add( new draw2d.shape.node.Fulcrum(),50,10);
 *    canvas.add( new draw2d.shape.node.Fulcrum(),80,100);
 *    canvas.add( new draw2d.shape.node.Fulcrum(),150,50);
 *
 * @extends draw2d.shape.node.Hub
 */
class Fulcrum extends Hub {
  /**
   *
   * @param {Object} [attr] the configuration of the shape
   */
  constructor(attr, setter, getter) {
    super(extend({width: 40, height: 40}, attr), setter, getter)


    this.port.setConnectionAnchor(new draw2d.layout.anchor.ConnectionAnchor(this.port))
    this.port.setVisible(true)
    this.port.hitTest = this.port._orig_hitTest

    this.setConnectionDirStrategy(0)
    this.setColor(null)
    this.setRadius(10)
    this.setBackgroundColor(null)
    this.setStroke(0)
    this.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy())
  }
  /**
   * @inheritdoc
   */
  repaint (attributes) {
    if (this.repaintBlocked === true || this.shape === null) {
      return this
    }

    attributes = attributes || {}

    // set some good defaults if the parent didn't
    jsonUtil.ensureDefault(attributes, "fill", this.bgColor.rgba())

    return super(attributes)
  }

}

export default Fulcrum;
