


/**
 * @class
 *
 * Event class which will be fired for every CommandStack operation. Required for CommandStackListener.
 * @author Andreas Herz
 */

class CommandStackEventListener {

  /**
   * Creates a new Listener Object
   *
   */
  constructor() {
  }

  /**
   *
   * Sent when an event occurs on the command stack. draw2d.command.CommandStackEvent.getDetail()
   * can be used to identify the type of event which has occurred.
   *
   * @template
   *
   * @param {draw2d.command.CommandStackEvent} event
   **/
  stackChanged (event: any) {
  }

}

export default CommandStackEventListener;
