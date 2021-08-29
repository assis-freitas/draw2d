/**
 * @class
 *
 * Command for the vertex movement of a polyline/polygon.
 *
 * @inheritable
 * @author Andreas Herz
 *
 * @extends draw2d.command.Command
 */
import Command from "./Command";
import Configuration from "../Configuration";


class CommandMoveVertex extends Command {
    private line: any;
    private index: number;
    private newPoint: any;
    private origPoint: any;

  /**
   * Create a new Command objects which can be execute via the CommandStack.
   *
   * @param {draw2d.shape.basic.PolyLine} line the related line
   */
  constructor(line: any) {
    super(Configuration.i18n.command.moveVertex)

    this.line = line
    this.index = -1
    this.newPoint = null
  }


  /**
   *
   * Set the index of the vertex of the polyline/polygon to modify.
   *
   * @param {Number} index the related index of the vertex
   **/
  setIndex (index: number) {
    this.index = index
    this.origPoint = this.line.getVertices().get(this.index).clone()
  }

  updatePosition (x, y) {
    this.newPoint = new draw2d.geo.Point(x, y)
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
    return this.index !== -1 && this.newPoint !== null
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
    this.line.setVertex(this.index, this.origPoint.x, this.origPoint.y)
  }

  /**
   *
   *
   * Redo the move command after the user has undo this command
   *
   **/
  redo () {
    this.line.setVertex(this.index, this.newPoint.x, this.newPoint.y)
  }
}

export default CommandMoveVertex;
