import draw2d from '../../packages'
import CanvasPolicy from "./CanvasPolicy";


/**
 * @class
 * The base class for any canvas decoration like grid, chessboard, graph paper or
 * other.
 *
 * @author Andreas Herz
 * @extends draw2d.policy.canvas.CanvasPolicy
 */
class DecorationPolicy extends CanvasPolicy {
  /**
   *
   */
  constructor(attr, setter, getter) {
    super(attr, setter, getter)
  }

}

export default DecorationPolicy;

