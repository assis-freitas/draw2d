import draw2d from '../../packages'
import Locator from "./Locator";


/**
 * @class
 *
 * A CenterLocator is used to place figures in the center of a parent shape.
 *
 *
 *
 * @example
 *
 *
 *    // create a basic figure and add a Label/child via API call
 *    //
 *    let circle = new draw2d.shape.basic.Circle({diameter:120});
 *    circle.setStroke(3);
 *    circle.setColor("#A63343");
 *    circle.setBackgroundColor("#E65159");
 *    circle.add(new draw2d.shape.basic.Label({text:"Center Label"}), new draw2d.layout.locator.CenterLocator());
 *    canvas.add( circle, 100,50);
 *
 *
 * @author Andreas Herz
 * @extend draw2d.layout.locator.Locator
 */
class CenterLocator extends Locator {
  /**
   * Constructs a locator with associated parent.
   *
   */
  constructor(attr: any, setter: any, getter: any) {
    super(attr, setter, getter)
  }

  /**
   *
   * Relocates the given Figure.
   *
   * @param {Number} index child index of the target
   * @param {draw2d.Figure} target The figure to relocate
   **/
  relocate(index: any, target: { getParent: () => any; setPosition: (arg0: number, arg1: number) => void; getBoundingBox: () => any; }) {
    let parent = target.getParent()
    let boundingBox = parent.getBoundingBox()

    // TODO: instanceof is always a HACK. ugly. Redirect the call to the figure instead of
    // determine the position with a miracle.
    //
    if (target instanceof draw2d.Port) {
      target.setPosition(boundingBox.w / 2, boundingBox.h / 2)
    }
    else {
      let targetBoundingBox = target.getBoundingBox()
      target.setPosition(((boundingBox.w / 2 - targetBoundingBox.w / 2) | 0) + 0.5, ((boundingBox.h / 2 - (targetBoundingBox.h / 2)) | 0) + 0.5)
    }
  }
}

export default CenterLocator;
