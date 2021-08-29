import draw2d from '../../packages'
import ConnectionRouter from "./ConnectionRouter";


/**
 * @class
 *
 * Router for direct connections between two ports. Beeline
 * <br>
 * <br>
 *
 * @example
 *
 *    let createConnection=function(){
 *       let con = new draw2d.Connection();
 *       con.setRouter(new draw2d.layout.connection.DirectRouter());
 *       return con;
 *    };
 *
 *    // install a custom connection create policy
 *    //
 *    canvas.installEditPolicy(  new draw2d.policy.connection.DragConnectionCreatePolicy({
 *           createConnection: createConnection
 *    }));
 *
 *    // create and add two nodes which contains Ports (In and OUT)
 *    //
 *    let start = new draw2d.shape.node.Start();
 *    let end   = new draw2d.shape.node.End();

 *    // ...add it to the canvas
 *    canvas.add( start, 50,50);
 *    canvas.add( end, 230,80);
 *
 *    // first Connection
 *    //
 *    let c = createConnection();
 *    c.setSource(start.getOutputPort(0));
 *    c.setTarget(end.getInputPort(0));
 *    canvas.add(c);
 *
 *
 * @inheritable
 * @author Andreas Herz
 *
 * @extends  draw2d.layout.connection.ConnectionRouter
 */

class DirectRouter extends ConnectionRouter {
  /**
   * Creates a new Router object
   */
  constructor (){
    super()
  }

  /**
   *
   * Callback method if the router has been assigned to a connection.
   *
   * @param {draw2d.Connection} connection The assigned connection
   * @template
   * @since 2.7.2
   */
  onInstall(connection: { installEditPolicy: (arg0: any) => void; }) {
    connection.installEditPolicy(new draw2d.policy.line.LineSelectionFeedbackPolicy())
  }

  /**
   *
   * Invalidates the given Connection
   */
  invalidate() {
  }

  /**
   * @inheritdoc
   */
  route(connection: { getStartPosition: () => any; getEndPosition: () => any; addPoint: (arg0: any) => void; svgPathString: string; }, routingHints: any) {
    let start = connection.getStartPosition()
    let end = connection.getEndPosition()

    // required for hit tests
    //
    connection.addPoint(start)
    connection.addPoint(end)

    // calculate the path
    let path = ["M", start.x, " ", start.y]
    path.push("L", end.x, " ", end.y)

    connection.svgPathString = path.join("")
  }
}

export default DirectRouter;
