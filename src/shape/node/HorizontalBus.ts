import draw2d from '../../packages'


/**
 * @class
 *
 * A horizontal bus shape with a special kind of port handling. The hole figure is a hybrid port.
 *
 *
 * @example
 *
 *    let figure =  new draw2d.shape.node.HorizontalBus({width:300, height:20, text:"Horizontal Bus"});
 *
 *    canvas.add(figure,50,10);
 *
 * @extends draw2d.shape.node.Hub
 */
class HorizontalBus extends Hub {
  /**
   *
   * @param {Object} [attr] the configuration of the shape
   */
  constructor(attr, setter, getter) {
    super(attr, setter, getter)

    this.setConnectionDirStrategy(1)

    this.installEditPolicy(new draw2d.policy.figure.HBusSelectionFeedbackPolicy())
  }

}

export default HorizontalBus;
