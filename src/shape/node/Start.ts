import draw2d from '../../packages'


/**
 * @class
 *
 * A generic Node which has an OutputPort. Mainly used for demos and examples.
 *
 *
 * @example
 *
 *    let figure =  new draw2d.shape.node.Start({color: "#3d3d3d"});
 *
 *    canvas.add(figure,50,10);
 *
 * @extends draw2d.shape.basic.Rectangle
 */
class Start extends Rectangle {
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
  }

}

export default Start;
