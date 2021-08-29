import draw2d from '../../packages'


/**
 * @class
 * Base class for all diagrams.
 *
 * @extends draw2d.SetFigure
 */
class Widget extends SetFigure {
  constructor(attr, setter, getter) {
    super(attr, setter, getter)
  }
}

export default Widget;
