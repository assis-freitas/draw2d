/**
 * @class
 *
 * Add a vertex to a polyline or polygon
 *
 * @inheritable
 * @author Andreas Herz
 *
 * @extends draw2d.command.Command
 */
import Configuration from "../Configuration";
import Command from "./Command";
import Point from "../geo/Point";
import PolyLine from "../shape/basic/PolyLine";

class CommandAddVertex extends Command {
    private newPoint;

    /**
     * Create a new Command objects which add a vertex to a PolyLine / Polygon.
     *
     * @param {draw2d.shape.basic.PolyLine} line the related line
     * @param {Number} index the index where to add
     * @param {Number} x the x coordinate for the new vertex
     * @param {Number} y the y coordinate for the new vertex
     */
    constructor(private line: PolyLine, private index: number, private x: number, private y: number) {
        super(Configuration.i18n.command.addVertex);

        this.newPoint = new Point(x, y)
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
        this.line.removeVertexAt(this.index)
    }

    /**
     *
     *
     * Redo the move command after the user has undo this command
     *
     **/
    redo() {
        this.line.insertVertexAt(this.index, this.newPoint.x, this.newPoint.y)
    }
}

export default CommandAddVertex;
