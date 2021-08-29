/**
 * @class
 *
 * Set the rotation angle of the given figure
 *
 * @since 4.4.1
 * @inheritable
 * @author Andreas Herz
 * @extends draw2d.command.Command
 */
import Command from "./Command";
import Configuration from "../Configuration";


class CommandRotate extends Command {
    private figure: any;
    private oldAngle: any;
    private newAngle: any;
  /**
   * Create a new resize Command objects which can be execute via the CommandStack.
   *
   * @param {draw2d.Figure} figure the figure to resize
   * @param {Number} angle the angle to rotate
   */
  constructor(figure: { getRotationAngle: () => any; }, angle: any) {
    super(Configuration.i18n.command.rotateShape)
    this.figure = figure

    this.oldAngle = figure.getRotationAngle()
    this.newAngle = angle
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
    return this.oldAngle !== this.newAngle
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
   * Undo the command
   *
   **/
  undo () {
    this.rotate(this.oldAngle)
  }

  /**
   *
   * Redo the command after the user has undo this command
   *
   **/
  redo () {
    this.rotate(this.newAngle)
  }

  rotate (angle: any) {
    let w = this.figure.getWidth()
    let h = this.figure.getHeight()

    this.figure.setRotationAngle(angle)

    this.figure.setDimension(h, w)

    this.figure.portRelayoutRequired = true
  }
}

export default CommandRotate;
