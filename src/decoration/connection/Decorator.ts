import draw2d from '../../packages'
import Color from '../../util/Color'

/**
 * @class
 * Base class for any kind of Connection end/start decorations like arrows, bullets, circles, bars,...
 *
 * @author Andreas Herz
 */
class Decorator {
    protected width: number;
    protected height: number;
    private parent: any;
    private color: any;
    protected backgroundColor: any;

    constructor(width: number, height: number) {
        if (typeof width === "undefined" || width < 1) {
            this.width = 20
        } else {
            this.width = width
        }

        if (typeof height === "undefined" || height < 1) {
            this.height = 15
        } else {
            this.height = height
        }
        this.parent = null
        this.color = null // null => use the color of the connection
        this.backgroundColor = new Color(250, 250, 250)
    }

    /**
     *
     * Paint the decoration for a connector. The Connector starts always in
     * [0,0] and ends in [x,0].
     * It is not necessary to consider any rotation of the connection. This will be done by the
     * framework.
     *
     * <pre>
     *               | -Y
     *               |
     *               |
     *  --------------+-----------------------------&gt; +X
     *               |
     *               |
     *               |
     *               V +Y
     *
     *
     * </pre>
     *
     * See in ArrowConnectionDecorator for example implementation.
     * @param {RaphaelPaper} paper
     * @private
     */
    paint (paper: any) {
        // do nothing per default
    }

    /**
     *
     * @param {draw2d.Connection} parent
     * @private
     */
    setParent(parent: any){
        this.parent = parent
    }

    /**
     *
     * Set the stroke color for the decoration
     *
     * @param {draw2d.util.Color|String} c
     * @returns {this}
     */
    setColor (c: any) {
        this.color = new Color(c);
        if(this.parent!==null){
            this.parent.repaint()
        }
        return this
    }

    /**
     * Get the line color of the decoration
     *
     * @returns {drawd.util.Color} the current line color of null if the Decoration should use the color of the host connection
     */
    getColor(){
        return this.color
    }

    /**
     *
     * Set the background color for the decoration
     *
     * @param {draw2d.util.Color|String} c
     * @returns {this}
     */
    setBackgroundColor (c: any) {
        this.backgroundColor = new Color(c)
        if(this.parent!==null){
            this.parent.repaint()
        }

        return this
    }

    /**
     * Returns the fill color
     *
     * @returns {draw2d.util.Color}
     */
    getBackgroundColor(){
        return this.backgroundColor
    }

    /**
     *
     * Change the dimension of the decoration shape
     *
     * @param {Number} width  The new width of the decoration
     * @param {Number} height The new height of the decoration
     * @returns {this}
     **/
    setDimension (width: number, height: number) {
        this.width = width
        this.height = height

        return this
    }
}

export default Decorator;
