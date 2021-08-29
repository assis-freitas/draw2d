import draw2d from '../../packages'


/**
 * @class
 *
 * Connection designed for a state diagram with arrow decoration at the
 * target of the connection and a label
 *
 *
 * @example
 *
 *    // create and add two nodes which contains Ports (In and OUT)
 *    //
 *    let start = new draw2d.shape.state.Start();
 *    let end   = new draw2d.shape.state.End();

 *    // ...add it to the canvas
 *    canvas.add( start, 50,50);
 *    canvas.add( end, 230,180);
 *
 *    // Create a Connection and connect the Start and End node
 *    //
 *    let c = new draw2d.shape.state.Connection({
 *    	 source : start.getOutputPort(0),
 *      target : end.getInputPort(0)
 *    });
 *
 *    // and finally add the connection to the canvas
 *    canvas.add(c);
 *
 *
 * @extends draw2d.Connection
 */
class Connection extends Connection {
  DEFAULT_COLOR = new draw2d.util.Color("#4D90FE");

  constructor(attr, setter, getter) {
    super(extend({router: null, stroke: 2}, attr), setter, getter)

    this.setTargetDecorator(new draw2d.decoration.connection.ArrowDecorator(17, 8))


    this.label = new draw2d.shape.basic.Label({text: "label"})
    this.label.setStroke(1)
    this.label.setPadding(2)
    this.label.setBackgroundColor("#f0f0f0")
    this.add(this.label, new draw2d.layout.locator.ParallelMidpointLocator())

  }  /**
   *
   * Set the text to show if the state shape
   *
   * @param {String} text
   */
  setLabel (text) {
    this.label.setText(text)

    // hide the label if no text available
    this.label.setVisible(!(text === null || text === ""))
    this.fireEvent("change:label", {value: text})

    return this
  }

  /**
   *
   * Return the label of the shape
   *
   */
  getLabel () {
    return this.label.getText()
  }

  /**
   * @inheritdoc
   */
  getPersistentAttributes () {
    return extend(super(), {
      label: this.getLabel()
    })
  }
  /**
   * @inheritdoc
   */
  setPersistentAttributes (memento) {
    super(memento)

    if (typeof memento.label !== "undefined") {
      this.setLabel(memento.label)
    }
  }

}

export default Connection;
