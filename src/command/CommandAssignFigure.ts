/**
 * @class
 *
 * Assign a figure to a compiste
 *
 * @author Andreas Herz
 *
 * @extends draw2d.command.Command
 * @since 4.9.0
 */
import Configuration from "../Configuration";
import Command from "./Command";
import Figure from "../Figure";
import ArrayList from "../util/ArrayList";
import Node from "../shape/node/Node";
import Composite from "../shape/composite/Composite";
import StrongComposite from "../shape/composite/StrongComposite";

class CommandAssignFigure extends Command {
    private assignedConnections;
    private readonly oldBoundingBox;

    /**
     * Create a new Command objects which can be execute via the CommandStack.
     *
     * @param {draw2d.Figure} figure the figure to assign
     * @param {draw2d.Figure} composite the composite where the figure should assign
     */
    constructor(private figure: Figure, private composite: StrongComposite) {
        super(Configuration.i18n.command.assignShape);

        this.assignedConnections = new ArrayList();
        this.oldBoundingBox = composite.getBoundingBox()
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
        this.composite.assignFigure(this.figure)

        // get all connections of the shape and check if source/target node
        // part of the composite. In this case the connection will be part of
        // the composite as well
        if (this.figure instanceof Node) {
            let connections = this.figure.getConnections()
            connections.each((i, connection) => {
                if (connection.getSource().getParent().getComposite() === this.composite && connection.getTarget().getParent().getComposite() === this.composite) {
                    if (connection.getComposite() !== this.composite) {
                        this.assignedConnections.add({oldComposite: connection.getComposite(), connection: connection})
                        this.composite.assignFigure(connection)
                    }
                }
            })
        }
    }

    /**
     *
     *
     * Undo the move command
     *
     **/
    undo() {
        this.composite.unassignFigure(this.figure)
        this.assignedConnections.each( (i, entry) =>{
            if (entry.oldComposite !== null) {
                entry.oldComposite.assignFigure(entry.connection)
            }
            else {
                entry.connection.getComposite().unassignFigure(entry.connection)
            }
        })
        this.composite.stickFigures = true
        this.composite.setBoundingBox(this.oldBoundingBox)
        this.composite.stickFigures = false
    }

    /**
     *
     *
     * Redo the move command after the user has undo this command
     *
     **/
    redo() {
        this.composite.setBoundingBox(this.oldBoundingBox)
        this.composite.assignFigure(this.figure)
        this.assignedConnections.each( (i, entry) => this.composite.assignFigure(entry.connection))
    }
}

export default CommandAssignFigure;
