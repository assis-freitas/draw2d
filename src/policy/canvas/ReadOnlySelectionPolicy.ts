import draw2d from '../../packages'


/**
 * @class
 *
 *
 * @author Andreas Herz
 * @extends draw2d.policy.canvas.SelectionPolicy
 */
class ReadOnlySelectionPolicy extends SelectionPolicy {
  /**
   * Creates a new Router object
   */
  constructor(attr, setter, getter) {
    super(attr, setter, getter)
  }
  /**
   *
   * Called by the host if the policy has been installed.
   *
   * @param {draw2d.Canvas/draw2d.Canvas} canvas
   */
  onInstall (canvas) {
    super(canvas)
    canvas.getAllPorts().each(function (i, port) {
      port.setVisible(false)
    })
  }
  /**
   *
   * Called by the host if the policy has been uninstalled.
   *
   * @param {draw2d.Canvas} canvas
   */
  onUninstall (canvas) {
    canvas.getAllPorts().each(function (i, port) {
      port.setVisible(true)
    })

    super(canvas)
  }
  /**
   *
   *
   * @param {draw2d.Canvas} canvas
   * @param {Number} dx The x diff between start of dragging and this event
   * @param {Number} dy The y diff between start of dragging and this event
   * @param {Number} dx2 The x diff since the last call of this dragging operation
   * @param {Number} dy2 The y diff since the last call of this dragging operation
   * @param {Boolean} shiftKey true if the shift key has been pressed during this event
   * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
   * @template
   */
  onMouseDrag (canvas, dx, dy, dx2, dy2, shiftKey, ctrlKey) {
    let area = canvas.getScrollArea()
    area.scrollTop(area.scrollTop() - dy2)
    area.scrollLeft(area.scrollLeft() - dx2)
  }
}

export default ReadOnlySelectionPolicy;
