import draw2d from '../../packages'
import SelectionFeedbackPolicy from "../figure/SelectionFeedbackPolicy";


/**
 * @class
 *
 *
 * @author Andreas Herz
 * @extends draw2d.policy.figure.SelectionFeedbackPolicy
 */
class LineSelectionFeedbackPolicy extends SelectionFeedbackPolicy {

  /**
   * Creates a new selection feedback policy for a line or connection
   */
  constructor(attr, setter, getter) {
    super(attr, setter, getter)
  }

  /**
   *
   * Called by the framework of the Policy should show a resize handle for the given shape
   *
   * @param {draw2d.Canvas} canvas The host canvas
   * @param {draw2d.Figure} figure The related figure
   * @param {Boolean} [isPrimarySelection]
   */
  onSelect (canvas, figure, isPrimarySelection) {
    if (figure.selectionHandles.isEmpty()) {
      figure.selectionHandles.add(new draw2d.shape.basic.LineStartResizeHandle(figure))
      figure.selectionHandles.add(new draw2d.shape.basic.LineEndResizeHandle(figure))

      figure.selectionHandles.each( (i, e) => {
        e.setDraggable(figure.isResizeable())
        e.show(canvas)
      })
    }
    this.moved(canvas, figure)
  }
  /**
   *
   * Callback method if the figure has been moved.
   *
   * @template
   */
  moved (canvas, figure) {
    figure.selectionHandles.each( (i, e) => e.relocate())
  }

}

export default LineSelectionFeedbackPolicy;
