import draw2d from '../../packages'
import SelectionPolicy from "./SelectionPolicy";


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
class SelectionFeedbackPolicy extends SelectionPolicy {
  /**
   *
   */
  constructor(attr) {
    super(attr)
  }

  /**
   *
   *
   * @param {draw2d.Figure} figure the unselected figure
   */
  onUnselect (canvas, figure) {
    super(canvas, figure)

    figure.selectionHandles.each( (i, e) => e.hide())
    figure.selectionHandles = new draw2d.util.ArrayList()
  }
  /**
   *
   * Called by the host if the policy has been installed.
   *
   * @param {draw2d.Figure} figure
   */
  onInstall (figure) {
    super(figure)

    let canvas = figure.getCanvas()
    if (canvas !== null) {
      if (canvas.getSelection().contains(figure)) {
        this.onSelect(canvas, figure, true)
      }
    }
  }

  /**
   *
   * Called by the host if the policy has been uninstalled.
   *
   * @param {draw2d.Figure} figure
   */
  onUninstall (figure) {
    super(figure)

    figure.selectionHandles.each( (i, e) => e.hide())
    figure.selectionHandles = new draw2d.util.ArrayList()
  }

}

export default SelectionFeedbackPolicy;
