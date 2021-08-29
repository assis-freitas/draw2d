/**
 * @class
 *
 * EditPolicies should determine an Figures editing capabilities.
 * It is possible to implement an Figure such that it handles all editing
 * responsibility.<br>
 * However, it is much more flexible and object-oriented to use
 * EditPolicies. Using policies, you can pick and choose the editing behavior for
 * an Figure without being bound to its class hierarchy. Code reuse is increased,
 * and code management is easier.
 *
 * @author Andreas Herz
 */

enum CommandType {
    DELETE = "DELETE",
    MOVE = "MOVE",
    CONNECT = "CONNECT",
    MOVE_BASEPOINT = "MOVE_BASEPOINT",
    MOVE_VERTEX = "MOVE_VERTEX",
    MOVE_VERTICES = "MOVE_VERTICES",
    MOVE_GHOST_VERTEX = "MOVE_GHOST_VERTEX",
    RESIZE = "RESIZE",
    RESET = "RESET",
    ROTATE = "ROTATE"
}

export default CommandType;
