import draw2d from '../../packages'
import SnapToEditPolicy from "./SnapToEditPolicy";


/**
 * @class
 *
 * A helper used to perform snapping to a grid, which is specified on the canvas via the various
 * properties defined in this class.
 *
 *
 * @author Andreas Herz
 *
 * @extends draw2d.policy.canvas.ShowGridEditPolicy
 */
class SnapToGridEditPolicy extends SnapToEditPolicy {
    /**
     * Creates a new constraint policy for snap to grid
     *
     * @param {Number} grid the grid width of the canvas
     */
    constructor(grid, showGrid) {
      super()
      this.grid = grid || 20

      // Default Value for "showGrid=true"
      if (typeof showGrid ==="undefined" || showGrid===true) {
        this.renderer = new draw2d.policy.canvas.ShowGridEditPolicy(this.grid)
      }
    }

    onInstall (canvas) {
      super(canvas)
      if (this.renderer) this.renderer.onInstall(canvas)
    }
    onUninstall (canvas) {
      super(canvas)
      if (this.renderer) this.renderer.onUninstall(canvas)
    }
    /**
     *
     * Set a new grid width/height
     *
     * @param {Number} grid
     * @since 5.0.3
     */
    setGrid (grid) {
      this.grid = grid
      if (this.renderer) this.renderer.setGrid(grid)
    }
      /**
     *
     * Applies a snapping correction to the given result.
     *
     * @param {draw2d.Canvas} canvas the related canvas
     * @param {draw2d.Figure} figure the figure to snap
     * @param {draw2d.geo.Point} modifiedPos the already modified position of the figure (e.g. from an another Policy)
     * @param {draw2d.geo.Point} originalPos the original requested position of the figure
     * @since 2.3.0
     */
    snap (canvas, figure, modifiedPos, originalPos) {
      // do nothing for lines
      if (figure instanceof draw2d.shape.basic.Line) {
        return modifiedPos
      }

      let snapPoint = figure.getSnapToGridAnchor()

      modifiedPos.x = modifiedPos.x + snapPoint.x
      modifiedPos.y = modifiedPos.y + snapPoint.y


      modifiedPos.x = this.grid * Math.floor(((modifiedPos.x + this.grid / 2.0) / this.grid))
      modifiedPos.y = this.grid * Math.floor(((modifiedPos.y + this.grid / 2.0) / this.grid))

      modifiedPos.x = modifiedPos.x - snapPoint.x
      modifiedPos.y = modifiedPos.y - snapPoint.y

      return modifiedPos
    }
  }

  export default SnapToGridEditPolicy;
