
import Command from "./Command";
import Configuration from "../Configuration";


/**
 * @class
 *
 * Command for the movement of figures.
 *
 * @author Andreas Herz
 *
 * @extends draw2d.command.Command
 */
class CommandMove extends Command {
    private figure: { getX: () => any; getY: () => any };
    private oldX: any;
    private oldY: any;
    private newX: any;
    private newY: any;

    /**
     * Create a new Command objects which can be execute via the CommandStack.
     *
     * @param {draw2d.Figure} figure the figure to move
     * @param {Number} [x] the current x position
     * @param {Number} [y] the current y position
     */
    constructor(figure: { getX: () => any; getY: () => any; }, x: any, y: any) {
        super(Configuration.i18n.command.moveShape)
        this.figure = figure
        if (typeof x === "undefined") {
            this.oldX = figure.getX()
            this.oldY = figure.getY()
        }
        else {
            this.oldX = x
            this.oldY = y
        }
    }

    /**
     *
     * Set the initial position of the element
     *
     * @param {Number} x the new initial x position
     * @param {Number} y the new initial y position
     **/
    setStartPosition (x: any, y: any) {
        this.oldX = x
        this.oldY = y
    }

    /**
     *
     * Set the target/final position of the figure move command.
     *
     * @param {Number} x the new x position
     * @param {Number} y the new y position
     **/
    setPosition (x: any, y: any) {
        this.newX = x
        this.newY = y
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
        return this.newX !== this.oldX || this.newY !== this.oldY
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
        this.figure.setPosition(this.oldX, this.oldY)
    }

    /**
     *
     *
     * Redo the move command after the user has undo this command
     *
     **/
    redo () {
        this.figure.setPosition(this.newX, this.newY)
    }
}

export default CommandMove;
