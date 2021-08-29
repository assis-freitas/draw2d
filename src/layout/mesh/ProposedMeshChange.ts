
/**
 * @class
 * Change proposal for grid/mesh layout changes.
 *
 * @author Andreas Herz
 */
import draw2d from '../../packages'

class ProposedMeshChange {
    private readonly figure: any;
    private x: any;
    private y: any;

	/**
	 * Creates change object.
	 */
    constructor(figure: any, x: any, y: any)
    {
    	this.figure = figure;
    	this.x = x;
    	this.y = y;
    }

    /**
     *
     * Return the related figure.
     *
     * @returns {draw2d.Figure} the figure to the related change proposal
     */
    getFigure()
    {
    	return this.figure;
    }

    /**
     *
     * The proposed x-coordinate.
     *
     * @returns {Number}
     */
    getX()
    {
    	return this.x;
    }

    /**
     *
     * The proposed y-coordinate
     *
     * @returns {Number}
     */
    getY()
    {
    	return this.y;
    }

}

export default ProposedMeshChange;
