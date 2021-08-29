import Configuration from "../Configuration";
import Canvas from "../Canvas";
import Command from "./Command";
import Figure from "../Figure";
import Point from "../geo/Point";

/**
 * @class
 *
 * Command to add a figure with CommandStack support.
 *
 * @extends draw2d.command.Command
 */
class CommandAdd extends Command {
    private pos;

    /**
     * Create a add command for the given figure.
     *
     * @param {draw2d.Canvas} canvas the canvas to use
     * @param {draw2d.Figure} figure the figure to add
     * @param {Number|draw2d.geo.Point} x the x-coordinate or a complete point where to place the figure
     * @param {Number} [y] the y-coordinate if x is a number and not a complete point
     */
    constructor(private canvas: Canvas, private figure: Figure, private x: number | Point, private y: number) {
        super(Configuration.i18n.command.addShape);

        this.pos = new Point(x, y)
    }

    /**
     *
     * Returns [true] if the command can be execute and the execution of the
     * command modifies the model. e.g.: a CommandMove with [startX,startX] == [endX,endY] should
     * return false. The execution of this Command doesn't modify the model.
     *
     * @returns {Boolean} return try if the command modify the model or make any relevant changes
    */
    canExecute(): boolean {
        // we can only add the figure once to the canvas
        return this.figure.getCanvas() === null;
    }

    /**
     *
     * Execute the command the first time
     *
     **/
    execute() {
        this.canvas.add(this.figure, this.pos.x, this.pos.y)
    }

    /**
     *
     * Redo the command after the user has undo this command
     *
     **/
    redo() {
        this.execute()
    }

    /**
     *
     * Undo the command
     *
     **/
    undo() {
        this.canvas.remove(this.figure)
    }
}

export default CommandAdd;
