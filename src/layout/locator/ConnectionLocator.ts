import draw2d from '../../packages'
import Locator from "./Locator";


/**
 * @class
 *
 * Repositions a Figure attached to a Connection when the
 * Connection is moved. Provides for alignment at the start
 * (source), middle, or end (target) of the Connection.
 *
 * @author Andreas Herz
 * @extend draw2d.layout.locator.Locator
 */
class ConnectionLocator extends Locator {
  /**
   * Default constructor for a Locator which can layout a figure in context of a
   * {@link draw2d.Connector}
   *
   */
  constructor(attr: any, setter: any, getter: any) {
    super(attr, setter, getter)
  }

}

export default ConnectionLocator;
