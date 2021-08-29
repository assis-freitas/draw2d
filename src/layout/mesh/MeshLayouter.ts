
/**
 * @class
 * Layouter for a mesh or grid.
 *
 * @author Andreas Herz
 */

class MeshLayouter {

	/**
     *
     * Return a changes list for an existing mesh/canvas to ensure that the element to insert
     * did have enough space.
     *
     * @param {draw2d.Canvas} canvas the canvas to use for the analytic
     * @param {draw2d.Figure} figure The figure to add to the exising canvas
     *
     *
     * @returns {draw2d.util.ArrayList} a list of changes to apply if the user want to insert he figure.
     */
    add( canvas: any, figure: any)
    {
    	return new draw2d.util.ArrayList();
    }
}

export default MeshLayouter;
