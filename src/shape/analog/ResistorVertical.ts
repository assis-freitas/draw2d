import draw2d from '../../packages'


/**
 * @class
 *
 *
 * @example
 *
 *    let figure =  new draw2d.shape.analog.ResistorVertical({x:10, y:10});
 *
 *    canvas.add(figure);
 *
 *
 * @extends draw2d.SVGFigure
 */
class ResistorVertical extends SetFigure {

  // // custom locator for the special design of the Input area
  // MyInputPortLocator: draw2d.layout.locator.PortLocator.extend({
  //   constructor() {
  //     super()
  //   }    relocate (index, figure) {
  //     let w = figure.getParent().getWidth()
  //     let h = figure.getParent().getHeight()
  //     this.applyConsiderRotation(figure, w / 2, h)
  //   }
  // }),
  //
  // // custom locator for the special design of the Output area
  // MyOutputPortLocator: draw2d.layout.locator.PortLocator.extend({
  //   constructor() {
  //     super()
  //   }    relocate (index, figure) {
  //     let w = figure.getParent().getWidth()
  //     this.applyConsiderRotation(figure, w / 2, 0)
  //   }
  // }),

  /**
   * Create a new instance
   *
   * @param {Object} [attr] the configuration of the shape
   */
  constructor(attr, setter, getter) {

    super(extend({width: 30, height: 50, bgColor: null}, attr), setter, getter)

    this.inputLocator = new this.MyInputPortLocator()
    this.outputLocator = new this.MyOutputPortLocator()

    this.createPort("hybrid", this.inputLocator)
    this.createPort("hybrid", this.outputLocator)
  }

  /**
   * @inheritdoc
   */
  createSet () {
    let set = super()

    set.push(this.canvas.paper.path("M15,0 L15,5 L0,7.5 L30,10 L0,15 L30,20 L0,25 L30,30 L15,32.5 L15,40"))

    return set
  }
}

export default ResistorVertical;
