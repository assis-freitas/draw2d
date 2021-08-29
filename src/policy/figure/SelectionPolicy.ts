import draw2d from '../../packages'
import DragDropEditPolicy from "./DragDropEditPolicy";


/**
 * @class
 *
 * A {@link  draw2d.policy.SelectionFeedbackPolicy} that is sensitive to the canvas selection. Subclasses will typically
 * decorate the {@link draw2d.Figure figure} with things like selection handles and/or focus feedback.
 * <br>
 * If you want to change the handle visibility for a figure, then you should use SelectionFeedbackPolicy to do that.
 *
 * @author Andreas Herz
 * @extends draw2d.policy.figure.DragDropEditPolicy
 */
class SelectionPolicy extends DragDropEditPolicy {
  /**
   *
   */
  constructor(attr) {
    super(attr)
  }

  /**
   *
   *
   * @template
   * @param figure
   * @param isPrimarySelection
   */
  onSelect (canvas, figure, isPrimarySelection) {
  }

  /**
   *
   *
   * @param {draw2d.Figure} figure the unselected figure
   */
  onUnselect (canvas, figure) {
  }

}

export default SelectionPolicy;
