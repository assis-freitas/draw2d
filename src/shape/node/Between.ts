import draw2d from '../../packages'
import Rectangle from "../basic/Rectangle";


/**
 * @class
 * A simple Node which has a  InputPort and OutputPort. Mainly used for demo and examples.
 *
 *
 * @example
 *
 *    let figure =  new draw2d.shape.node.Between({color: "#3d3d3d"});
 *
 *    canvas.add(figure,50,10);
 *
 * @extends draw2d.shape.basic.Rectangle
 */
class Between extends Rectangle {
  DEFAULT_COLOR = new draw2d.util.Color("#4D90FE");

  /**
   *
   * @param {Object} [attr] the configuration of the shape
   */
  constructor(attr, setter, getter) {
    super(extend({
      bgColor: this.DEFAULT_COLOR,
      color: this.DEFAULT_COLOR.darker(),
      width: 50,
      height: 50
    }, attr), setter, getter)

    this.createPort("output")
    this.createPort("input")
  }
}

export default Between;
