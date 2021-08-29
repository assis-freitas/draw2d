
/**
 * @class
 *
 * Selection feedback policy for vertical bus figures.
 *
 * @author Andreas Herz
 * @extends draw2d.policy.figure.BusSelectionFeedbackPolicy
 */
import draw2d from '../../packages'
import BusSelectionFeedbackPolicy from "./BusSelectionFeedbackPolicy";

class VBusSelectionFeedbackPolicy extends BusSelectionFeedbackPolicy {
    /**
     * Creates a new Router object
     */
    constructor( attr, setter, getter)
    {
        super( attr, setter, getter);
    }

    /**
     *
     * Callback if the figure has been moved
     *
     * @param {draw2d.Canvas} canvas The host canvas
     * @param {draw2d.Figure} figure The related figure
     *
     **/
    moved(canvas,figure)
    {
        if(figure.selectionHandles.isEmpty()){
            return; // silently
        }

        var r2= figure.selectionHandles.find(function(handle){return handle.type===2});
        var r6= figure.selectionHandles.find(function(handle){return handle.type===6});

        var objWidth = figure.getWidth();
        // adjust the resize handles on the left/right to the new dimension of the shape
        //
        r2.setDimension(objWidth, r2.getHeight());
        r6.setDimension(objWidth, r6.getHeight());

        super(canvas,figure);
     }

}

export default VBusSelectionFeedbackPolicy;
