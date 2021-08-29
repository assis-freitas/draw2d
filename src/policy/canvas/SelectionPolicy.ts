import draw2d from '../../packages'
import CanvasPolicy from "./CanvasPolicy";


/**
 * @class
 *
 *
 * @author Andreas Herz
 * @extends draw2d.policy.canvas.CanvasPolicy
 */
class SelectionPolicy extends CanvasPolicy {
  /**
   * Creates a new selection policy
   */
  constructor(attr, setter, getter) {
    super(attr, setter, getter)
  }
  /**
   *
   * Selects the given figure within the canvas. The policy must unselect already selected
   * figures or show any decorations.
   *
   * @param {draw2d.Canvas} canvas
   * @param {draw2d.Figure} figure
   *
   */
  select (canvas, figure) {
  }
  /**
   *
   * Unselect the given figure in the canvas and remove all resize handles
   *
   * @param {draw2d.Canvas} canvas
   * @param {draw2d.Figure} figure
   */
  unselect (canvas, figure) {
    canvas.getSelection().remove(figure)

    figure.unselect()

    // @since 6.1.42
    canvas.fireEvent("unselect", {figure: figure})
  }
}

export default SelectionPolicy;





