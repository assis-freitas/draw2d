import draw2d from 'packages'


/**
 * @class
 * A OutputPort is the start anchor for a {@link draw2d.Connection}.
 *
 * @author Andreas Herz
 * @extends draw2d.Port
 */
class OutputPort extends Port {
    private locator: draw2d.layout.locator.OutputPortLocator;

    /**
     * Create a new OutputPort element
     *
     * @param {Object} [attr] the configuration of the shape
     */
    constructor(attr, setter, getter)
    {
        super(attr, setter, getter);

        // responsive for the arrangement of the port
        // calculates the x/y coordinates in relation to the parent node
        this.locator=new draw2d.layout.locator.OutputPortLocator();
    }

    /**
     * @inheritdoc
     */
    createCommand(request)
    {
       // Connect request between two ports
       //
       if(request.getPolicy() === draw2d.command.CommandType.CONNECT){
           // source and target are changed.
           return new draw2d.command.CommandConnect(request.target, request.source, request.source);
       }

       // ...else call the base class
       return super(request);
    }
}

export default OutputPort;
