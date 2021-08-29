import draw2d from "./packages";

/**
 * @class
 * Glow effect for ports. Just for internal use.
 *
 * @private
 * @extend draw2d.shape.basic.Circle
 */
class Corona extends Circle {

    constructor() {
        super()
        this.setAlpha(0.3)
        this.setBackgroundColor(new draw2d.util.Color(178, 225, 255))
        this.setColor(new draw2d.util.Color(102, 182, 252))
    }
    /**
     *
     * the the opacity of the element.
     *
     * @param {Number} percent
     */
    setAlpha (percent) {
        super(Math.min(0.3, percent))
        this.setDeleteable(false)
        this.setDraggable(false)
        this.setResizeable(false)
        this.setSelectable(false)

        return this
    }
}

export default Corona;
