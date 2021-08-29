/**
 * @class
 *
 * Command for the vertices movement of a polyline/polygon.
 *
 * @inheritable
 * @author Andreas Herz
 *
 * @extends draw2d.command.Command
 */
import Command from "./Command";
import Configuration from "../Configuration";

class CommandMoveVertices extends Command {
    private line: { getVertices: () => { (): any; new(): any; clone: { (arg0: boolean): any; new(): any } } };
    private oldVertices: any;
    private newVertices: any;

  /**
   * Create a new Command objects which can be execute via the CommandStack.
   *
   * @param {draw2d.shape.basic.PolyLine} line the related line
   */
  constructor(line: { getVertices: () => { (): any; new(): any; clone: { (arg0: boolean): any; new(): any; }; }; }) {
    super(Configuration.i18n.command.moveVertices)

    this.line = line
    this.oldVertices = line.getVertices().clone(true)
    this.newVertices = null
  }


  updateVertices (newVertices: any) {
    this.newVertices = newVertices
  }

  /**
   *
   * Returns [true] if the command can be execute and the execution of the
   * command modify the model. A CommandMove with [startX,startX] == [endX,endY] should
   * return false. <br>
   * the execution of the Command doesn't modify the model.
   *
   * @returns {Boolean}
   **/
  canExecute () {
    // return false if we doesn't modify the model => NOP Command
    return this.newVertices !== null
  }

  /**
   *
   * Execute the command the first time
   *
   **/
  execute () {
    this.redo()
  }

  /**
   *
   *
   * Undo the move command
   *
   **/
  undo () {
    this.line.setVertices(this.oldVertices)
  }

  /**
   *
   *
   * Redo the move command after the user has undo this command
   *
   **/
  redo () {
    this.line.setVertices(this.newVertices)
  }
}

export default CommandMoveVertices;
