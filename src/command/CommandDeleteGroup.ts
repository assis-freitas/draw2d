/**
 * @class
 *
 * Command to remove a group with all related children.
 *
 * @extends draw2d.command.Command
 */
import Command from "./Command";
import Configuration from "../Configuration";
import Group from "../shape/composite/Group";
import CommandCollection from "./CommandCollection";
import CommandUngroup from "./CommandUngroup";
import CommandType from "./CommandType";

class CommandDeleteGroup extends Command {
    private parent: any;
    private readonly canvas: any;
    private batchDelete: any;
    /**
     * Create a delete command for the given figure.
     *
     * @param {draw2d.shape.composite.Group} group
     */
    constructor(private readonly group: Group) {
        super(Configuration.i18n.command.deleteShape);

        this.parent = group.getParent()
        this.group = group
        this.canvas = group.getCanvas()
        this.batchDelete = null
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
        // we can only delete the shape if a children can be deleted
        //
        let children = this.group.getAssignedFigures()
        for (let i = 0; i < children.getSize(); i++) {
            if (!children.get(i).isDeleteable()) {
                return false
            }
        }

        // we can only delete the figure if its part of the canvas.
        return this.group.getCanvas() !== null
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
        this.batchDelete.undo()
        this.canvas.setCurrentSelection(this.group)
    }

    /**
     *
     *
     * Redo the command after the user has undo this command
     *
     **/
    redo() {
        if (this.batchDelete === null) {
            this.batchDelete = new CommandCollection()

            // remove the assignment of the children to the group before we delete the group
            //
            this.batchDelete.add(new CommandUngroup(this.canvas, this.group))

            // add the delete command of the children to the batch
            //
            let children = this.group.getAssignedFigures()
            for (let i = 0; i < children.getSize(); i++) {
                let child = children.get(i)
                // request a delete Command from the child instead of create one by my own. May the child
                // provides its own implementation
                let cmd = child.createCommand(CommandType.DELETE)
                this.batchDelete.add(cmd)
            }

        }


        this.batchDelete.execute()
    }
}

export default CommandDeleteGroup;
