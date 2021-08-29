
import Command from "./Command";
import Configuration from "../Configuration";
import Group from "../shape/composite/Group";
import Canvas from "../Canvas";
import ArrayList from "../util/ArrayList";
import Selection from "../Selection";


/**
 * @class
 * Command to group a given set of figures
 *
 * @extends draw2d.command.Command
 */
class CommandGroup extends Command {
    private group: Group;
    /**
     * Create a group command for the given figure.
     *
     * @param canvas
     * @param {draw2d.util.ArrayList} figures the figures to group
     */
    constructor(private canvas: Canvas, private readonly figures: ArrayList) {
        super(Configuration.i18n.command.groupShapes);

        if (figures instanceof Selection) {
            this.figures = figures.getAll()
        }

        // figures which already part of an non "Group" composite will be removed from the set.
        // It is not possible to assign a figure to two different composites.
        //
        this.figures.grep((figure) => {
            return figure.getComposite() === null
        })

        this.canvas = canvas
        this.group = new Group();
    }

    /**
     *
     * Returns [true] if the command can be execute and the execution of the
     * command modifies the model. e.g.: a CommandMove with [startX,startX] == [endX,endY] should
     * return false. The execution of this Command doesn't modify the model.
     *
     * @returns {Boolean} return try if the command modify the model or make any relevant changes
     **/
    canExecute() {
        return !this.figures.isEmpty()
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
        this.figures.each((i, figure) => {
            this.group.unassignFigure(figure)
        })

        this.canvas.remove(this.group)
        this.canvas.setCurrentSelection(this.figures)
    }

    /**
     *
     * Redo the command after the user has undo this command
     *
     **/
    redo() {
        this.figures.each((i, figure) => {
            this.group.assignFigure(figure)
        })

        this.canvas.add(this.group)
        this.canvas.setCurrentSelection(this.group)
    }
}

export default CommandGroup;
