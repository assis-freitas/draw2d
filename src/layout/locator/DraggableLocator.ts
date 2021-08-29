import draw2d from '../../packages'
import Locator from "./Locator";


/**
 * @class
 *
 * A DraggableLocator is used to place figures relative to the parent top left corner. It is
 * possible to move a child node via drag&drop.
 *
 *
 *
 * @author Andreas Herz
 * @extend draw2d.layout.locator.Locator
 */
class DraggableLocator extends Locator {
  /**
   * Constructs a locator with associated parent.
   *
   */
  constructor(attr: any, setter: any, getter: any) {
    super(attr, setter, getter)
  }

  bind(parent: any, child: { setSelectionAdapter: (arg0: () => any) => void; }) {
    // override the parent implementation to avoid
    // that the child is "!selectable" and "!draggable"

    // Don't redirect the selection handling to the parent
    // Using the DraggableLocator provides the ability to the children
    // that they are selectable and draggable. Remove the SelectionAdapter from the parent
    // assignment.
    child.setSelectionAdapter(() => child)
  }
  unbind(parent, child) {
    // use default
    child.setSelectionAdapter(null)
  }
}

export default DraggableLocator;
