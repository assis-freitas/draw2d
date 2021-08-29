/**
 * @class
 * Command to ungroup a given group figures
 *
 * @extends draw2d.command.Command
 */
import Command from "./Command";
import Configuration from "../Configuration";
import Canvas from "../Canvas";
import ArrayList from "../util/ArrayList";
import Selection from "../Selection";
import Group from "../shape/composite/Group";


class CommandUngroup extends Command {
    private readonly group: any;
    private canvas: any;
    private readonly figures: any;

  /**
   * Create a group command for the given figure.
   *
   * @param {draw2d.Canvas} canvas the responsible canvas
   * @param {draw2d.util.ArrayList|draw2d.Selection} group the figures to group
   */
  constructor(canvas: Canvas, group: ArrayList | Selection | Group) {
    super(Configuration.i18n.command.ungroupShapes)
    if (group instanceof Selection) {
      this.group = group.getAll().first()
    }
    else {
      this.group = group
    }

    this.canvas = canvas
    this.figures = this.group.getAssignedFigures().clone()
  }


  /**
   *
   * Returns [true] if the command can be execute and the execution of the
   * command modifies the model. e.g.: a CommandMove with [startX,startX] == [endX,endY] should
   * return false. The execution of this Command doesn't modify the model.
   *
   * @returns {Boolean} return try if the command modify the model or make any relevant changes
   **/
  canExecute () {
    return !this.figures.isEmpty()
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
    this.figures.each((i, figure) => {
      this.group.assignFigure(figure)
    })
    this.canvas.add(this.group)
    this.canvas.setCurrentSelection(this.group)
  }

  /**
   *
   * Redo the command after the user has undo this command
   *
   **/
  redo () {
    this.figures.each((i, figure) => {
      this.group.unassignFigure(figure)
    })

    this.canvas.setCurrentSelection(this.figures)
    this.canvas.remove(this.group)
  }
}

export default CommandUngroup;
