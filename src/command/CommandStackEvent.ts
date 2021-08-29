


/**
 * @class
 * Event class which will be fired for every CommandStack operation. Required for CommandStackListener.
 */
class CommandStackEvent {
    private stack: any;
    private command: any;
    private details: any;
    private action: any;

  /**
   * Create a new CommandStack objects which can be execute via the CommandStack.
   *
   * @param stack
   * @param {draw2d.command.Command} command the related command
   * @param {Number} details the current state of the command execution
   *
   * @param action
   */
  constructor(stack: any, command: any, details: any, action: any) {
    this.stack = stack
    this.command = command
    this.details = details // deprecated
    this.action = action
  }


  /**
   *
   * Return the corresponding stack of the event.
   *
   * @returns {draw2d.command.CommandStack}
   **/
  getStack () {
    return this.stack
  }


  /**
   *
   * Returns null or a Command if a command is relevant to the current event.
   *
   * @returns {draw2d.command.Command}
   **/
  getCommand () {
    return this.command
  }

  /**
   *
   * Returns an integer identifying the type of event which has occurred.
   * Defined by {@link draw2d.command.CommandStack}.
   *
   * @returns {Number}
   **/
  getDetails () {
    return this.details
  }


  /**
   *
   * Returns true if this event is fired after the stack having changed.
   *
   * @returns {Boolean} true if post-change event
   **/
  isPostChangeEvent () {
    return 0 !== (this.getDetails() & draw2d.command.CommandStack.POST_MASK)
  }

  /**
   *
   * Returns true if this event is fired prior to the stack changing.
   *
   * @returns {Boolean} true if pre-change event
   **/
  isPreChangeEvent () {
    return 0 !== (this.getDetails() & draw2d.command.CommandStack.PRE_MASK)
  }
}

export default CommandStackEvent;
