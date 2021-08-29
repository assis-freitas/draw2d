
import Command from "./Command";
import Configuration from "../Configuration";
import Figure from "../Figure";
import Connection from "../Connection";
import Node from "../shape/node/Node";
import ArrayList from "../util/ArrayList";


/**
 * @class
 * Command to remove a figure with CommandStack support.
 *
 * @extends draw2d.command.Command
 */
class CommandDelete extends Command {
    private readonly parent: any;
    private canvas: any;
    private connections: any;
    private removedParentEntry: any;
    private indexOfChild: number;

    /**
     * Create a delete command for the given figure.
     *
     * @param {draw2d.Figure} figure
     */
    constructor(private figure: Figure) {
        super(Configuration.i18n.command.deleteShape);

        this.parent = figure.getParent()
        this.canvas = figure.getCanvas()
        this.connections = null
        this.removedParentEntry = null // can be null if the figure didn't have any parent shape assigned
        this.indexOfChild = -1
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
        // we can only delete the figure if its part of the canvas.
        return this.figure.getCanvas() !== null
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
        if (this.parent !== null) {
            this.parent.add(this.removedParentEntry.figure, this.removedParentEntry.locator, this.indexOfChild)
            this.canvas.setCurrentSelection(this.parent)
        }
        else {
            this.canvas.add(this.figure)
            this.canvas.setCurrentSelection(this.figure)
        }

        if (this.figure instanceof Connection) {
            this.figure.reconnect()
        }


        for (let i = 0; i < this.connections.getSize(); ++i) {
            this.canvas.add(this.connections.get(i))
            this.connections.get(i).reconnect()
        }
    }

    /**
     *
     *
     * Redo the command after the user has undo this command
     *
     **/
    redo() {
        this.canvas.setCurrentSelection(null)

        // Collect all connections that are bounded to the figure to delete. This connections
        // must be deleted too.
        //
        if (this.connections === null) {
            if (this.figure instanceof Node) {
                this.connections = this.figure.getConnections()
            }
            else {
                this.connections = new ArrayList()
            }
        }

        // already done in the canvas.remove(..) method
        //    if(this.figure instanceof draw2d.Connection){
        //        this.figure.disconnect();
        //    }


        // remove all connections
        //
        for (let i = 0; i < this.connections.getSize(); ++i) {
            this.canvas.remove(this.connections.get(i))
        }

        // remove this figure from the parent
        //
        if (this.parent !== null) {
            // determine the index of the child before remove
            this.indexOfChild = this.parent.getChildren().indexOf(this.figure)
            this.removedParentEntry = this.parent.remove(this.figure)
        }
        // or from the canvas
        else {
            this.canvas.remove(this.figure)
        }
    }
}

export default CommandDelete;
