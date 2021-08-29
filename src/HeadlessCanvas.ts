import draw2d from 'packages'


/**
 * @class
 *
 * Required for Node.js draw2d model read/write operations.
 *
 * @inheritable
 * @author Andreas Herz
 */

class HeadlessCanvas {
    private figures: draw2d.util.ArrayList;
    private lines: draw2d.util.ArrayList;
    private commonPorts: draw2d.util.ArrayList;
    private eventSubscriptions: {};
    private commandStack: draw2d.command.CommandStack;

    /**
     * Create a new canvas with the given HTML DOM references.
     *
     * @param {String} canvasId the id of the DOM element to use a parent container
     */
    constructor()
    {
        // internal document with all figures, ports, ....
        //
        this.figures     = new draw2d.util.ArrayList();
        this.lines       = new draw2d.util.ArrayList(); // crap - why are connections not just figures. Design by accident
        this.commonPorts = new draw2d.util.ArrayList();

        this.eventSubscriptions = {};

        // The CommandStack for undo/redo operations
        //
        this.commandStack = new draw2d.command.CommandStack();
    }
    /**
     *
     * Reset the canvas and delete all model elements.<br>
     * You can now reload another model to the canvas with a {@link draw2d.io.Reader}
     *
     * @since 1.1.0
     */
    clear()
    {
        // internal document with all figures, ports, ....
        //
        this.figures     = new draw2d.util.ArrayList();
        this.lines       = new draw2d.util.ArrayList();
        this.commonPorts = new draw2d.util.ArrayList();

        this.commandStack.markSaveLocation();

        return this;
    }

    calculateConnectionIntersection()
    {
    }
    /**
     *
     * Callback for any kind of image export tools to trigger the canvas to hide all unwanted
     * decorations. The method is called e.g. from the draw2d.io.png.Writer
     *
     * @since 4.0.0
     * @template
     */
    hideDecoration()
    {
    }
    /**
     *
     * callback method for any image export writer to reactivate the decoration
     * of the canvas. e.g. grids, rulers,...
     *
     *
     * @since 4.0.0
     * @template
     */
    showDecoration()
    {
    }

    /**
     *
     * Add a figure at the given x/y coordinate. This method fires an event.
     *
     * Example:
     *
     *     canvas.on("figure:add", function(emitter, event){
     *        alert("figure added:");
     *     });
     *
     *     // or more general if you want catch all figure related events
     *     //
     *     canvas.on("figure", function(emitter, event){
     *        // use event.figure.getCanvas()===null to determine if the
     *        // figure part of the canvas
     *
     *        alert("figure added or removed:");
     *     });
     *
     * @param {draw2d.Figure} figure The figure to add.
     * @param {Number/draw2d.geo.Point} [x] The new x coordinate of the figure or the x/y coordinate if it is an draw2d.geo.Point
     * @param {Number} [y] The y position.
     **/
    add( figure , x,  y)
    {
        if(figure.getCanvas()===this){
            return;
        }

        if(figure instanceof draw2d.shape.basic.Line){
         this.lines.add(figure);
        }
        else{
         this.figures.add(figure);
        }
        figure.canvas=this;


        return this;
    }
    /**
     *
     * Returns all lines/connections in this workflow/canvas.<br>
     *
     * @protected
     * @returns {draw2d.util.ArrayList}
     **/
    getLines()
    {
      return this.lines;
    }
    /**
     *
     * Returns the internal figures.<br>
     *
     * @protected
     * @returns {draw2d.util.ArrayList}
     **/
    getFigures()
    {
      return this.figures;
    }
    /**
     *
     * Returns the line or connection with the given id.
     *
     * @param {String} id The id of the line.
     *
     * @returns {draw2d.shape.basic.Line}
     **/
    getLine( id)
    {
      var count = this.lines.getSize();
      for(var i=0; i<count;i++)
      {
         var line = this.lines.get(i);
         if(line.getId()===id){
            return line;
         }
      }
      return null;
    }
    /**
     *
     * Returns the figure with the given id.
     *
     * @param {String} id The id of the figure.
     * @returns {draw2d.Figure}
     **/
    getFigure( id)
    {
      var figure = null;
      this.figures.each(function(i,e){
          if(e.id===id){
              figure=e;
              return false;
           }
      });
      return figure;
    }
    /**
     *
     * Register a port to the canvas. This is required for other ports to find a valid drop target.
     *
     * @param {draw2d.Port} port The new port which has been added to the Canvas.
     **/
    registerPort(port )
    {
      // All elements have the same drop targets.
      //
      if(!this.commonPorts.contains(port)){
          this.commonPorts.add(port);
      }

      return this;
    }
    /**
     *
     * Return all ports in the canvas
     *
     */
    getAllPorts()
    {
        return this.commonPorts;
    }
    /**
     *
     * Returns the command stack for the Canvas. Required for undo/redo support.
     *
     * @returns {draw2d.command.CommandStack}
     **/
    getCommandStack()
    {
      return this.commandStack;
    }

    // NEW EVENT HANDLING SINCE VERSION 5.0.0
    /**
     *
     * Execute all handlers and behaviors attached to the canvas for the given event type.
     *
     *
     * @param {String} event the event to trigger
     * @param {Object} [args] optional parameters for the triggered event callback
     *
     * @since 5.0.0
     */
    fireEvent(event, args)
    {
        if (typeof this.eventSubscriptions[event] === 'undefined') {
            return;
        }

        var subscribers = this.eventSubscriptions[event];
        for (var i=0; i<subscribers.length; i++) {
            try{
                subscribers[i](this, args);
            }
            catch(exc){
                console.log(exc);
                console.log(subscribers[i]);
                debugger;
            }
        }
    }
    /**
     *
     * Attach an event handler function for one or more events to the canvas.
     * To remove events bound with .on(), see {@link #off}.
     *
     * possible events are:<br>
     * <ul>
     *   <li>reset</li>
     *   <li>select</li>
     * </ul>
     *
     * Example:
     *
     *     canvas.on("clear", function(emitter, event){
     *        alert("canvas.clear() called.");
     *     });
     *
     *     canvas.on("select", function(emitter,event){
     *         if(event.figure!==null){
     *             alert("figure selected");
     *         }
     *         else{
     *             alert("selection cleared");
     *         }
     *     });
     *
     * @param {String}   event One or more space-separated event types
     * @param {Function} callback A function to execute when the event is triggered.
     * @param {draw2d.Canvas} callback.emitter the emitter of the event
     * @param {Object} [callback.obj] optional event related data
     *
     * @since 5.0.0
     */
    on(event, callback)
    {
        var events = event.split(" ");
        for(var i=0; i<events.length; i++){
            if (typeof this.eventSubscriptions[events[i]] === 'undefined') {
                this.eventSubscriptions[events[i]] = [];
            }
            this.eventSubscriptions[events[i]].push(callback);
        }
        return this;
    }
    /**
     *
     * The .off() method removes event handlers that were attached with {@link #on}.<br>
     * Calling .off() with no arguments removes all handlers attached to the canvas.<br>
     * <br>
     * If a simple event name such as "reset" is provided, all events of that type are removed from the canvas.
     *
     *
     * @param {String|Function} eventOrFunction the event name of the registerd function
     * @since 5.0.0
     */
    off( eventOrFunction)
    {
        if(typeof eventOrFunction ==="undefined"){
            this.eventSubscriptions = {};
        }
        else if( typeof eventOrFunction === 'string'){
            this.eventSubscriptions[eventOrFunction] = [];
        }
        else{
            for(var event in this.eventSubscriptions ){
                this.eventSubscriptions[event] =this.eventSubscriptions[event].filter( callback => { return callback !== eventOrFunction; });
            }
        }

        return this;
    }
}

export default HeadlessCanvas;
