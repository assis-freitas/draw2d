
/**
 * @class
 *
 *  An abstract class defining a general spline object.
 */
import draw2d from '../../packages'

class Spline {

    /**
     */
    constructor()
    {
    }
   /**
    * Create a spline based on the given control points.
    * The generated curve starts in the first control point and ends
    * in the last control point.
    *
    * @param {Array} controlPoints  Control points of spline (x0,y0,z0,x1,y1,z1,...).
    * @param {Number} parts Number of parts to divide each leg into.
    **/
    generate(controlPoints, parts){
        throw "inherit classes must implement the method 'draw2d.util.spline.Spline.generate()'";
    }

}

export default Spline;
