/**
 * @class
 *
 * Remove a vertex from a polyline or polygon
 *
 * @inheritable
 * @author Andreas Herz
 *
 * @extends draw2d.command.Command
 */
import Command from "./Command";
import Configuration from "../Configuration";

class CommandRemoveVertex extends Command {
    private line: { getVertices: () => { (): any; new(): any; get: { (arg0: any): { (): any; new(): any; clone: { (): any; new(): any } }; new(): any } } };
    private index: any;
    private oldPoint: any;

  /**
   * Create a new Command objects which add a vertex to a PloyLine.
   *
   * @param {draw2d.shape.basic.PolyLine} line the related line
   * @param {Number} index the index where to add
   */
  constructor(line: { getVertices: () => { (): any; new(): any; get: { (arg0: any): { (): any; new(): any; clone: { (): any; new(): any; }; }; new(): any; }; }; }, index: any) {
    super(Configuration.i18n.command.deleteVertex)

    this.line = line
    this.index = index
    this.oldPoint = line.getVertices().get(index).clone()
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
    return true
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
    this.line.insertVertexAt(this.index, this.oldPoint.x, this.oldPoint.y)
  }

  /**
   *
   *
   * Redo the move command after the user has undo this command
   *
   **/
  redo () {
    this.line.removeVertexAt(this.index)
  }
}

export default CommandRemoveVertex;
