import draw2d from '../../packages'


/**
 * @class
 *
 *
 * @example
 *
 *      circle =new draw2d.shape.basic.Circle();
 *      circle.installEditPolicy(new draw2d.policy.figure.GlowSelectionFeedbackPolicy());
 *      canvas.add(circle,90,50);
 *
 *      canvas.add(new draw2d.shape.basic.Label("Click on the circle to see the selection feedback"),20,10);
 *
 * @author Andreas Herz
 * @extends draw2d.policy.figure.SelectionFeedbackPolicy
 */
class GlowSelectionFeedbackPolicy extends SelectionFeedbackPolicy {
  /**
   * Creates a new Router object
   */
  constructor(attr, setter, getter) {
    super(attr, setter, getter)
  }

  /**
   *
   * Called by the framework of the Policy should show a resize handle for the given shape
   *
   * @param {Boolean} isPrimarySelection
   */
  onSelect (canvas, figure, isPrimarySelection) {
    figure.setGlow(true)
    this.moved(canvas, figure)
  }

  /**
   *
   *
   * @param {draw2d.Figure} figure the unselected figure
   */
  onUnselect (canvas, figure) {
    super(canvas, figure)
    figure.setGlow(false)
  }

}

export default GlowSelectionFeedbackPolicy;
