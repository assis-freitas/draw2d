/**
 * @class
 *
 * Connects two ports with a connection.
 *
 * @inheritable
 * @author Andreas Herz
 *
 * @extends draw2d.command.Command
 */
import Command from "./Command";
import Configuration from "../Configuration";
import Port from "../Port";
import Connection from "../Connection";

class CommandConnect extends Command {
    private canvas: any;
    public connection: Connection;
    /**
     * Create a new CommandConnect objects which can be execute via the CommandStack.
     *
     * @param {draw2d.Port} source the source port for the connection to create
     * @param {draw2d.Port} target the target port for the connection to create
     * @param {draw2d.Port} [dropTarget] the port who has initiate the connection creation. mainly the drop target
     */
    constructor(private readonly source: Port, private readonly target: Port, private readonly dropTarget?: Port) {
        super(Configuration.i18n.command.connectPorts);

        this.canvas = target.getCanvas()
        this.connection = null;
    }

    /**
     *
     * Execute the command the first time
     *
     **/
    execute() {
        let optionalCallback = (conn: any) => {
            this.connection = conn
            this.connection.setSource(this.source)
            this.connection.setTarget(this.target)
            this.canvas.add(this.connection)
        }

        // the createConnection must return either a connection or "undefined". If the method return "undefined"
        // the asynch callback must be called. Usefull if the createConnection shows a selection dialog
        //
        if (this.connection) {
            // deprecated call!!!!
            //
            let result = Configuration.factory.createConnection(this.source, this.target, optionalCallback, this.dropTarget)
            // will be handled by the optional callback
            if (!result) {
                return
            }

            this.connection = result
        }

        optionalCallback(this.connection)
    }

    /**
     *
     * Redo the command after the user has undo this command.
     *
     **/
    redo() {
        this.canvas.add(this.connection)
        this.connection.reconnect()
    }

    /**
     *
     * Undo the command.
     *
     **/
    undo() {
        this.canvas.remove(this.connection)
    }
}

export default CommandConnect;
