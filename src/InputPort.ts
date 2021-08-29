import draw2d from 'packages'


/**
 * @class
 * A InputPort is the start anchor for a {@link draw2d.Connection}.
 *
 * @author Andreas Herz
 * @extend draw2d.Port
 */
class InputPort extends Port {
    private locator: draw2d.layout.locator.InputPortLocator;
  /**
   * Create a new InputPort element
   *
   * @param {Object} [attr] the configuration of the shape
   */
  constructor(attr, setter, getter) {
    super(attr, setter, getter)

    // responsive for the arrangement of the port
    // calculates the x/y coordinates in relation to the parent node
    this.locator = new draw2d.layout.locator.InputPortLocator()
  }

  /**
   * @inheritdoc
   */
  createCommand (request) {
    // Connect request between two ports
    //
    if (request.getPolicy() === draw2d.command.CommandType.CONNECT) {
      return new draw2d.command.CommandConnect(request.source, request.target, request.source)
    }

    // ...else call the base class
    return super(request)
  }
}

export default InputPort;
