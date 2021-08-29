import draw2d from '../../packages'
import Circle from "../basic/Circle";


/**
 * @class
 *
 * The start node for a state diagram
 *
 *
 * @example
 *
 *    let figure =  new draw2d.shape.state.Start({color:"#3d3d3d"});
 *
 *    canvas.add(figure,50,10);
 *
 * @extends draw2d.shape.basic.Rectangle
 */
class Start extends Circle {
  DEFAULT_COLOR = new draw2d.util.Color("#3369E8");

  constructor(attr, setter, getter) {
    super(attr, setter, getter)

    this.port = this.createPort("output", new draw2d.layout.locator.BottomLocator())
    this.port.setConnectionAnchor(new draw2d.layout.anchor.ShortesPathConnectionAnchor(this.port))

    this.setDimension(50, 50)
    this.setBackgroundColor(this.DEFAULT_COLOR)
    this.installEditPolicy(new draw2d.policy.figure.AntSelectionFeedbackPolicy())

    this.setStroke(0)
    //this.setColor(this.DEFAULT_COLOR.darker());

    let label = new draw2d.shape.basic.Label({text: "START"})
    label.setStroke(0)
    label.setFontColor("#ffffff")
    label.setFontFamily('"Open Sans",sans-serif')
    this.add(label, new draw2d.layout.locator.CenterLocator())
  }
}

export default Start;
