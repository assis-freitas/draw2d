import draw2d from '../../packages'


/**
 * @class
 *
 * Install this edit policy in a canvas if you want fadeout all decorations like ports, resize handles
 * if the user didn't move the mouse. This is good for a clean representation of your diagram.
 *
 *
 * @author Andreas Herz
 * @extends draw2d.policy.canvas.DecorationPolicy
 */
class FadeoutDecorationPolicy extends DecorationPolicy {
    DEFAULT_FADEOUT_DURATION = 60;
    DEFAULT_ALPHA_DECREMENT = 0.05;

    /**
     * Creates a new fade out policy. Don't forget to install them into the canvas.
     *
     */
    constructor() {
      super()
      this.alpha = 1.0
      this.alphaDec = this.DEFAULT_ALPHA_DECREMENT
      this.hidePortsCounter = this.DEFAULT_FADEOUT_DURATION
      this.portDragging = false
    }
    /**
     * @inheritDoc
     **/
    onInstall (canvas) {
      super(canvas)
      this.timerId = window.setInterval(this.onTimer.bind(this), 50)

      // initial hide all decorations after install of this policy
      //
      this.hidePortsCounter = 1
      this.alpha = 0.1
    }
    /**
     * @inheritDoc
     **/
    onUninstall (canvas) {
      window.clearInterval(this.timerId)
      this.canvas.getAllPorts().each(function (i, port) {
        port.setAlpha(1.0)
      })

      super(canvas)
    }
    /**
     *
     *
     * Timerfucntion to show/hide the related ports
     * @private
     **/
    onTimer () {
      this.hidePortsCounter--

      if (this.hidePortsCounter <= 0 && this.alpha > 0) {
        this.alpha = Math.max(0, this.alpha - this.alphaDec)

        this.canvas.getAllPorts().each((i, port) => {
          port.setAlpha(this.alpha)
        })

        this.canvas.getSelection().getAll().each((i, figure) => {
          figure.selectionHandles.each((i, handle) => {
            handle.setAlpha(this.alpha)
          })
        })
      } else if (this.hidePortsCounter > 0 && this.alpha !== 1.0) {
        this.alpha = 1// Math.min(1,this.alpha+0.1);
        this.alphaDec = this.DEFAULT_ALPHA_DECREMENT
        this.duringHide = false
        this.canvas.getAllPorts().each((i, port) => {
          port.setAlpha(this.alpha)
        })
        this.canvas.getSelection().getAll().each((i, figure) => {
          figure.selectionHandles.each((i, handle) => {
            handle.setAlpha(this.alpha)
          })
        })
      }
    }

    /**
     *
     *
     * @param {draw2d.Canvas} canvas
     * @param {Number} x the x-coordinate of the mouse down event
     * @param {Number} y the y-coordinate of the mouse down event
     * @param {Boolean} shiftKey true if the shift key has been pressed during this event
     * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
     */
    onMouseDown (canvas, x, y, shiftKey, ctrlKey) {
      this.hidePortsCounter = this.DEFAULT_FADEOUT_DURATION
      this.portDragging = (canvas.getBestFigure(x, y) instanceof draw2d.Port)
    }
    /**
     *
     *
     * @param {draw2d.Canvas} canvas
     * @param {Number} x the x-coordinate of the mouse event
     * @param {Number} y the y-coordinate of the mouse event
     * @param {Boolean} shiftKey true if the shift key has been pressed during this event
     * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
     */
    onMouseMove (canvas, x, y, shiftKey, ctrlKey) {
      this.hidePortsCounter = this.DEFAULT_FADEOUT_DURATION
      this.portDragging = false
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
     */
    onMouseDrag (canvas, dx, dy, dx2, dy2, shiftKey, ctrlKey) {
      if (this.portDragging === false) {
        this.hidePortsCounter = 0
        this.alphaDec = 0.1
        this.onTimer()
      }
    }
    /**
     *
     *
     * @param {draw2d.Canvas} canvas
     * @param {Number} x the x-coordinate of the mouse down event
     * @param {Number} y the y-coordinate of the mouse down event
     * @param {Boolean} shiftKey true if the shift key has been pressed during this event
     * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
     */
    onMouseUp (figure, x, y, shiftKey, ctrlKey) {
      this.hidePortsCounter = this.DEFAULT_FADEOUT_DURATION
      this.portDragging = false
    }

  }

  export default FadeoutDecorationPolicy;
