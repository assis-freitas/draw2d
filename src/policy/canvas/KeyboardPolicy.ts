import draw2d from '../../packages'
import CanvasPolicy from "./CanvasPolicy";


/**
 * @class
 * Default interface for keyboard interaction with the canvas.
 *
 *
 * @author Andreas Herz
 * @extends draw2d.policy.canvas.CanvasPolicy
 */
class KeyboardPolicy extends CanvasPolicy {
  /**
   *
   * Callback if the user release a key
   *
   * @param {draw2d.Canvas} canvas the related canvas
   * @param {Number} keyCode the pressed key
   * @param {Boolean} shiftKey true if the shift key has been pressed during this event
   * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
   * @private
   **/
  onKeyUp (canvas, keyCode, shiftKey, ctrlKey) {
    // do nothing per default
  }
  /**
   *
   * Callback if the user press a key down
   *
   * @param {draw2d.Canvas} canvas the related canvas
   * @param {Number} keyCode the pressed key
   * @param {Boolean} shiftKey true if the shift key has been pressed during this event
   * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
   * @private
   **/
  onKeyDown (canvas, keyCode, shiftKey, ctrlKey) {
    // do nothing per default
  }


}

export default KeyboardPolicy;
