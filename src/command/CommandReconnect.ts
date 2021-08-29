/**
 * @class
 *
 * Reconnects two ports. This command is used during the DragDrop operation of a draw2d.Connection.
 *
 * @inheritable
 * @author Andreas Herz
 *
 * @extends draw2d.command.Command
 */
import Command from "./Command";
import Configuration from "../Configuration";


class CommandReconnect extends Command {
    private con: any;
    private oldSourcePort: any;
    private oldTargetPort: any;
    private newSourcePort: any;
    private newTargetPort: any;

  /**
   * Create a new Command objects which can be execute via the CommandStack.
   *
   * @param {draw2d.Connection} conn the related Connection which is currently in the drag&drop operation
   */
  constructor(conn: { getSource: () => any; getTarget: () => any; }) {
    super(Configuration.i18n.command.connectPorts)
    this.con = conn
    this.oldSourcePort = conn.getSource()
    this.oldTargetPort = conn.getTarget()
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
    return true
  }

  /**
   *
   * The new ports to use during the execute of this command.
   *
   * @param {draw2d.Port} source
   * @param {draw2d.Port} target
   */
  setNewPorts (source: any, target: any) {
    this.newSourcePort = source
    this.newTargetPort = target
  }


  setIndex (index) {
    // do nothing....but method is required for LineResizeHandle
    // With this common interface the ResizeHandle can handle Lines and Connections
    // with the same code
  }

  /**
   * compatibily method to the CommandMoveVertex to handle Line and Connections
   * transparent in the ResizeHandles
   *
   * @param x
   * @param y
   */
  updatePosition (x: any, y: any) {
    // do nothing....but method is required for LineResizeHandle
    // With this common interface the ResizeHandle can handle Lines and Connections
    // with the same code
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
   * Execute the command the first time
   *
   **/
  cancel () {
    this.con.setSource(this.oldSourcePort)
    this.con.setTarget(this.oldTargetPort)

    // force a routing of the connection and DON'T set the old reouter again because this reset all manual added
    // vertices
    this.con.routingRequired = true
    this.con.repaint()
  }

  /**
   *
   * Undo the command
   *
   **/
  undo () {
    this.con.setSource(this.oldSourcePort)
    this.con.setTarget(this.oldTargetPort)
    // force a routing of the connection and DON'T set the old reouter again because this reset all manual added
    // vertices
    this.con.routingRequired = true
    this.con.repaint()
  }

  /**
   *
   * Redo the command after the user has undo this command
   *
   **/
  redo () {
    this.con.setSource(this.newSourcePort)
    this.con.setTarget(this.newTargetPort)
    // force a routing of the connection and DON'T set the old reouter again because this reset all manual added
    // vertices
    this.con.routingRequired = true
    this.con.repaint()
  }

}

export default CommandReconnect;
