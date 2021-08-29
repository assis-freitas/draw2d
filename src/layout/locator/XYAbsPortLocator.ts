import draw2d from '../../packages'
import extend from "../../util/extend";
import PortLocator from "./PortLocator";


/**
 * @class
 *
 * Create a locator for fixed x/y coordinate position. The port in the example below is
 * always 20px below of the top border.
 *
 *
 * @example
 *
 *    var figure =  new draw2d.shape.basic.Rectangle({x:130,y:30,width:100,height:60});
 *    figure.createPort("input", new draw2d.layout.locator.XYAbsPortLocator(0,20));
 *
 *    canvas.add(figure);
 *
 * @author Andreas Herz
 * @extend draw2d.layout.locator.PortLocator
 * @since 4.0.0
 */
class XYAbsPortLocator extends PortLocator {
    private y: number;
    private x: number;
    /**
     *
     * {@link draw2d.shape.node.Node}
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
        this.x = 0
        this.y = 0


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
    getX(){
      return this.x
    }
    /**
     * Returns the Y-Offset of the Locator
     *
     * @returns {Number}
     */
    getY(){
      return this.y
    }
    /**
     *
     * Controls the location of an {@link draw2d.Figure}
     *
     * @param {Number} index child index of the figure
     * @param {draw2d.Figure} figure the figure to control
     *
     * @template
     **/
    relocate(index: any, figure: any) {
      this.applyConsiderRotation(figure, this.x, this.y)
    }

  }

  export default XYAbsPortLocator;



