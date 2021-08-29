import draw2d from '../../packages'
import SelectionFeedbackPolicy from "./SelectionFeedbackPolicy";


/**
 * @class
 *
 * Called by the framework if the user edit the position of a figure with a drag drop operation.
 * Sub class like SelectionEditPolicy or RegionEditPolicy cam adjust th e position of the figure or the selections handles.
 *
 * @author  Andreas Herz
 * @extends draw2d.policy.figure.SelectionFeedbackPolicy
 */
class VertexSelectionFeedbackPolicy extends SelectionFeedbackPolicy {

  /**
   * Creates a new Router object
   */
  constructor(attr, setter, getter) {
    super(attr, setter, getter)
  }

  /**
   *
   *
   * @param {draw2d.Canvas} canvas The host canvas
   * @param {draw2d.Connection} connection the selected figure
   * @param {Boolean} isPrimarySelection
   */
  onSelect (canvas, connection, isPrimarySelection) {
//    	super(canvas, connection, isPrimarySelection);

    let points = connection.getVertices()
    for (let i = 0; i < points.getSize(); i++) {
      let handle = new draw2d.shape.basic.VertexResizeHandle(connection, i)
      connection.selectionHandles.add(handle)
      handle.setDraggable(connection.isResizeable())
      handle.show(canvas)

      if (i !== 0) {
        let handle = new draw2d.shape.basic.GhostVertexResizeHandle(connection, i - 1)
        connection.selectionHandles.add(handle)
        handle.setDraggable(connection.isResizeable())
        handle.show(canvas)
      }
    }

    this.moved(canvas, connection)
  }
  /**
   *
   * Callback method if the figure has been moved.
   *
   * @param {draw2d.Canvas} canvas The host canvas
   * @param {draw2d.Figure} figure The related figure
   */
  moved (canvas, figure) {
    figure.selectionHandles.each( (i, e) => e.relocate())
  }


}

export default VertexSelectionFeedbackPolicy;
