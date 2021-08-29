import draw2d from '../../packages'


/**
 * @class
 *
 * Base class for all port feedback policies. Used for grow, highlight or
 * other decorations during drag&drop and connecting of ports.
 *
 * @author Andreas Herz
 * @extends draw2d.policy.figure.DragDropEditPolicy
 */
class PortFeedbackPolicy extends DragDropEditPolicy {
  /**
   */
  constructor(attr, setter, getter) {
    super(attr, setter, getter)
  }
  /**
   *
   * Called if the dragged port hove another port
   *
   * @param {draw2d.Canvas} canvas
   * @param {draw2d.Port}   draggedFigure
   * @param {draw2d.Figure} hoverFigure
   */
  onHoverEnter (canvas, draggedFigure, hoverFigure) {
  }
  /**
   *
   * Fired if the dragged figures leaves the hover figure
   *
   * @param {draw2d.Canvas} canvas
   * @param {draw2d.Port}   draggedFigure
   * @param {draw2d.Figure} hoverFigure
   */
  onHoverLeave (canvas, draggedFigure, hoverFigure) {
  }
}

export default PortFeedbackPolicy;
