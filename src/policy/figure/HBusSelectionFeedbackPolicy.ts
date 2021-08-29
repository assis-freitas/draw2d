
/**
 * @class
 *
 *
 * @author Andreas Herz
 * @extends draw2d.policy.figure.BusSelectionFeedbackPolicy
 */
import draw2d from '../../packages'
import BusSelectionFeedbackPolicy from "./BusSelectionFeedbackPolicy";

class HBusSelectionFeedbackPolicy extends BusSelectionFeedbackPolicy {
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
     * @param figure
     *
     * @template
     */
    moved(canvas, figure){
        if(figure.selectionHandles.isEmpty()){
            return; // silently
        }
        var r4= figure.selectionHandles.find(function(handle){return handle.type===4});
        var r8= figure.selectionHandles.find(function(handle){return handle.type===8});

        r4.setDimension(r4.getWidth(), figure.getHeight());
        r8.setDimension(r4.getWidth(), figure.getHeight());

        super(canvas,figure);
     }


}

export default HBusSelectionFeedbackPolicy;
