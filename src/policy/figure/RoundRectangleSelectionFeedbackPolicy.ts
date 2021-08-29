import draw2d from '../../packages'
import RectangleSelectionFeedbackPolicy from "./RectangleSelectionFeedbackPolicy";


/**
 * @class
 *
 *
 * @example
 *      circle =new draw2d.shape.basic.Circle();
 *      circle.installEditPolicy(new draw2d.policy.RoundRectangleSelectionFeedbackPolicy());
 *      canvas.add(circle,90,50);
 *
 *      canvas.add(new draw2d.shape.basic.Label({text:"Click on the circle to see the selection feedback"}),20,10);
 *
 * @author Andreas Herz
 * @extends draw2d.policy.figure.RectangleSelectionFeedbackPolicy
 */
class RoundRectangleSelectionFeedbackPolicy extends RectangleSelectionFeedbackPolicy {
  /**
   * Creates a new Router object
   *
   */
  constructor(attr, setter, getter) {
    super(attr, setter, getter)
  }

  createResizeHandle (owner, type) {
    return new draw2d.ResizeHandle({owner: owner, type: type, width: 12, height: 12, radius: 4})
  }
}

export default RoundRectangleSelectionFeedbackPolicy;
