/**
 * @class
 *
 * Replace the vertices of a polyline.
 *
 * @inheritable
 * @author Andreas Herz
 *
 * @extends draw2d.command.Command
 */
import Command from "./Command";
import Configuration from "../Configuration";

class CommandReplaceVertices extends Command {
    private line: any;
    private originalVertices: any;
    private newVertices: any;

  /**
   * Create a new Command objects which add a segment to a PolyLine / Polygon.
   *
   * @param {draw2d.shape.basic.PolyLine} line the related line
   * @param {draw2d.util.ArrayList} originalVertices the original vertices of the polyline
   * @param {draw2d.util.ArrayList} newVertices the new vertices of the polyline
   */
  constructor(line: any, originalVertices: any, newVertices: any) {
    super(Configuration.i18n.command.addSegment)

    this.line = line
    this.originalVertices = originalVertices
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
    this.line.setVertices(this.originalVertices)
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

export default CommandReplaceVertices;
