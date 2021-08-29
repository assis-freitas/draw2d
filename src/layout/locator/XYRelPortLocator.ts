import draw2d from '../../packages'
import extend from "../../util/extend";
import PortLocator from "./PortLocator";


/**
 * @class
 *
 * Create a locator for a relative x/y coordinate position. The coordinates are named in percentage [0..100%]
 * relative to the top/left corner of the parent node.<br>
 * <br>
 * <br>
 * Resize the shape in the example to see what happens. The port top position is always 20% of the shape height.
 *
 *
 * @example
 *
 *    let figure =  new draw2d.shape.basic.Rectangle({x:130,y:30,width:100,height:60});
 *    figure.createPort("input", new draw2d.layout.locator.XYRelPortLocator(0,20));
 *
 *    canvas.add(figure);
 *
 *
 * @author Andreas Herz
 * @extend draw2d.layout.locator.PortLocator
 * @since 4.0.0
 */
class XYRelPortLocator extends PortLocator {
    private x: number;
    private y: number;

    /**
     *
     *
     * @param attr
     * @param setter
     * @param getter
     */
    constructor(attr: any, setter: any, getter: any) {
        super(attr,
            extend({
                x: this.setX,
                y: this.setY
            }, setter),
            extend({
                x: this.getX,
                y: this.getY
            }, getter));
        // legacy code handling
        // new draw2d.layout.locator.XYRelPortLocator(10,30)
        if (typeof attr === "number" && typeof setter === "number") {
            this.x = attr
            this.y = setter
        }
            // new constructor
        // new draw2d.layout.locator.XYRelPortLocator({x:10, y:30}})
        else {
            this.x = 0
            this.y = 0
        }
    }

    /**
     * Set the X Offset for the Locator
     * @param {Number} x
     */
    setX(x) {
      this.x = x
    }
    /**
     * Set the y-offset of the locator
     *
     * @param {Number} y
     */
    setY(y) {
      this.y = y
    }
    /**
     * Get the X-Offset of the Locator
     *
     * @returns {Number}
     */
    getX() {
      return this.x
    }
    /**
     * Returns the Y-Offset of the Locator
     *
     * @returns {Number}
     */
    getY() {
      return this.y
    }
    /**
     *
     * Controls the location of an I{@link draw2d.Figure}
     *
     * @param {Number} index child index of the figure
     * @param {draw2d.Figure} figure the figure to control
     *
     * @template
     **/
    relocate(index, figure) {
      let parent = figure.getParent()

      this.applyConsiderRotation(
        figure,
        parent.getWidth() / 100 * this.x,
        parent.getHeight() / 100 * this.y
      )
    }

  }

  export default XYRelPortLocator;



