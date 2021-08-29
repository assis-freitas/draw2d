import draw2d from '../../packages'


/**
 * @class
 *
 *
 * @example
 *
 *      circle =new draw2d.shape.basic.Circle();
 *      circle.installEditPolicy(new draw2d.policy.figure.BigRectangleSelectionFeedbackPolicy());
 *      canvas.add(circle,90,50);
 *
 *      canvas.add(new draw2d.shape.basic.Label({text:"Click on the circle to see the selection feedback"}),20,10);
 *
 * @author Andreas Herz
 * @extends draw2d.policy.figure.SelectionFeedbackPolicy
 */
class BigRectangleSelectionFeedbackPolicy extends RectangleSelectionFeedbackPolicy {
  /**
   * Creates a new Router object
   */
  constructor(attr, setter, getter) {
    super(attr, setter, getter)
  }


  createResizeHandle (owner, type){
    return new draw2d.ResizeHandle({ owner:owner, type:type, width:15, height:15 });
  }

}

export default BigRectangleSelectionFeedbackPolicy;
