/**
 * @class
 *
 *Command to change attributes of a shape with undo/redo support
 *
 * @inheritable
 * @author Andreas Herz
 *
 * @extends draw2d.command.Command
 */
import Configuration from "../Configuration";
import Command from "./Command";
import Figure from "../Figure";

class CommandAttr extends Command {
    private readonly oldAttributes: any;

    /**
     * Create a new Command objects which provides undo/redo for attributes.
     *
     * @param {draw2d.Figure} figure the figure to handle
     * @param newAttributes
     */
    constructor(private figure: Figure, private newAttributes: {}) {
        super(Configuration.i18n.command.changeAttributes);

        this.oldAttributes = {}
        // Get the current attributes from the shape before we modify them.
        // Required for undo/redo
        Object.keys(newAttributes).forEach( (key) => {
            this.oldAttributes[key] = figure.attr(key)
        })
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
        return true
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
     *
     * Undo the move command
     *
     **/
    undo() {
        this.figure.attr(this.oldAttributes)
    }

    /**
     *
     *
     * Redo the move command after the user has undo this command
     *
     **/
    redo() {
        this.figure.attr(this.newAttributes)
    }
}

export default CommandAttr;
