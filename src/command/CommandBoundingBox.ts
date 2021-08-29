/**
 * @class
 * Set the bounding box of a figure with undo/redo support
 *
 * @inheritable
 * @author Andreas Herz
 * @extends draw2d.command.Command
 */
import Configuration from "../Configuration";
import Command from "./Command";
import Figure from "../Figure";
import Rectangle from "../geo/Rectangle";

class CommandBoundingBox extends Command {
    private readonly oldBoundingBox;
    private readonly newBoundingBox;

    /**
     * Create a new resize Command objects which can be execute via the CommandStack.
     *
     * @param {draw2d.Figure} figure the figure to resize
     * @param {draw2d.geo.Rectangle} boundingBox the new bounding box of the figure
     */
    constructor(private figure: Figure, private boundingBox: Rectangle) {
        super(Configuration.i18n.command.resizeShape);

        this.oldBoundingBox = this.figure.getBoundingBox()
        this.newBoundingBox = boundingBox
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
    canExecute() {
        // return false if we doesn't modify the model => NOP Command
        return !this.oldBoundingBox.equals(this.newBoundingBox)
    }

    /**
     *
     * Execute the command the first time
     *
     **/
    execute() {
        this.redo()
    }

    /**
     *
     * Undo the command
     *
     **/
    undo() {
        this.figure.setBoundingBox(this.oldBoundingBox)
    }

    /**
     *
     * Redo the command after the user has undo this command
     *
     **/
    redo() {
        this.figure.setBoundingBox(this.newBoundingBox)
    }
}

export default CommandBoundingBox;
