/**
 * @class
 *
 * Command for the movement of figures.
 *
 * @inheritable
 * @author Andreas Herz
 *
 * @extends draw2d.command.Command
 */
import Command from "./Command";
import Configuration from "../Configuration";

class CommandMoveConnection extends Command {
    private line: any;
    private dx: number;
    private dy: number;

  /**
   * Create a new Command objects which can be execute via the CommandStack.
   *
   * @param {draw2d.Connection} figure the connection to move
   */
  constructor(figure: any) {
    super(Configuration.i18n.command.moveLine)
    this.line = figure
    this.dx = 0
    this.dy = 0
  }

  /**
   *
   * set the offset of the line translation
   *
   * @param {Number} dx
   * @param {Number} dy
   */
  setTranslation (dx: number, dy: number) {
    this.dx = dx
    this.dy = dy
  }

  /**
   * Returns [true] if the command can be execute and the execution of the
   * command modify the model. A CommandMove with [startX,startX] == [endX,endY] should
   * return false. <br>
   * the execution of the Command doesn't modify the model.
   *
   * @returns {Boolean}
   **/
  canExecute () {
    // return false if we doesn't modify the model => NOP Command
    return this.dx !== 0 && this.dy !== 0
  }

  /**
   * Execute the command the first time
   *
   **/
  execute () {
    this.redo()
  }

  /**
   * Undo the command
   *
   **/
  undo () {
    let _this = this
    this.line.getVertices().each((i, e) => {
      e.translate(-_this.dx, -_this.dy)
    })
    this.line.svgPathString = null
    // required to update resize handles and the painting of the line
    this.line.setPosition(this.line.getStartPosition())
  }

  /**
   * Redo the command after the user has undo this command
   *
   **/
  redo () {
    let _this = this
    this.line.getVertices().each(function (i, e) {
      e.translate(_this.dx, _this.dy)
    })
    this.line.svgPathString = null

    // required to update resize handles and the painting of the line
    this.line.setPosition(this.line.getStartPosition())
  }
}

export default CommandMoveConnection;
