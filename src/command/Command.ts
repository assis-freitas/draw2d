/**
 * @class
 *
 * Commands are passed around throughout editing. They are used to encapsulate and combine
 * changes to the application's model. An application has a single command stack. Commands must
 * be executed using the command stack rather than directly calling execute.
 * <br>
 * This is required for a generic support for the undo/redo concept within draw2d.<br>
 *
 * @inheritable
 * @author Andreas Herz
 */
class Command {
  /**
   * Create a new Command objects which can be execute via the CommandStack.
   *
   * @param {String} label
   */
  constructor(public readonly label: string) {
  }

  /**
   *
   * Returns [true] if the command can be execute and the execution of the
   * command modifies the model. e.g.: a CommandMove with [startX,startX] == [endX,endY] should
   * return false. The execution of this Command doesn't modify the model.
   *
   * @returns {Boolean} return try if the command modify the model or make any relevant changes
   **/
  canExecute(): boolean {
    return true
  }

  /**
   *
   * Execute the command the first time.
   * Sup-classes must implement this method.
   *
   * @template
   **/
  execute(): void {
  }

  /**
   *
   * Will be called if the user cancel the operation.
   *
   * @template
   **/
  cancel(): void {
  }

  /**
   *
   * Undo the command.
   * Sup-classes must implement this method.
   *
   * @template
   **/
  undo(): void {
  }

  /**
   *
   * Redo the command after the user has undo this command.
   * Sup-classes must implement this method.
   *
   * @template
   **/
  redo(): void {
  }

}

export default Command;
