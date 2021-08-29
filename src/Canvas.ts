import $ from 'jquery';
import {RaphaelConstructionOptionsArray4, RaphaelConstructionOptionsArray5, RaphaelPaper} from "raphael";
import Figure from "./Figure";
import Point from "./geo/Point";
import Line from "./shape/basic/Line";
import PolyLine from "./shape/basic/PolyLine";
import ArrayList from "./util/ArrayList";
import {isStringObject} from "util/types";
import RegionEditPolicy from "./policy/figure/RegionEditPolicy";
import CommandStack from "./command/CommandStack";
import WheelZoomPolicy from "./policy/canvas/WheelZoomPolicy";
import DefaultKeyboardPolicy from "./policy/canvas/DefaultKeyboardPolicy";
import BoundingboxSelectionPolicy from "./policy/canvas/BoundingboxSelectionPolicy";
import DropInterceptorPolicy from "./policy/canvas/DropInterceptorPolicy";
import ComposedConnectionCreatePolicy from "./policy/connection/ComposedConnectionCreatePolicy";
import DragConnectionCreatePolicy from "./policy/connection/DragConnectionCreatePolicy";
import ClickConnectionCreatePolicy from "./policy/connection/ClickConnectionCreatePolicy";
import Selection from "./Selection";
import ZoomPolicy from "./policy/canvas/ZoomPolicy";
import KeyboardPolicy from "./policy/canvas/KeyboardPolicy";
import SelectionPolicy from "./policy/canvas/SelectionPolicy";
import ConnectionCreatePolicy from "./policy/connection/ConnectionCreatePolicy";
import Rectangle from "./geo/Rectangle";
import Connection from "./Connection";
import SnapToEditPolicy from "./policy/canvas/SnapToEditPolicy";
import EditPolicy from "./policy/EditPolicy";
import Port from "./Port";

/**
 * @class
 * A scrolling Canvas that contains Figures. Call `add(draw2d.Figure)` to add shapes to the Viewport.
 *
 *
 * @author Andreas Herz
 */
class Canvas {
    private readonly html: JQuery<HTMLElement>;
    private initialWidth: number;
    private initialHeight: number;
    private paper: RaphaelPaper;
    private zoomFactor: number;
    private readonly selection: Selection;
    private currentDropTarget: any;
    private currentHoverFigure: any;
    private zoomPolicy: ZoomPolicy;
    private readonly regionDragDropConstraint: RegionEditPolicy;
    private eventSubscriptions: any;
    private editPolicy: ArrayList;
    private figures: ArrayList;
    private lines: ArrayList;
    private commonPorts: ArrayList;
    private resizeHandles: ArrayList;
    private readonly commandStack: CommandStack;
    private linesToRepaintAfterDragDrop: ArrayList;
    private lineIntersections: ArrayList;
    private mouseDown: boolean;
    private mouseDownX: number;
    private mouseDownY: number;
    private mouseDragDiffX: number;
    private mouseDragDiffY: number;
    /**
     * Create a new canvas with the given HTML DOM references.
     *
     * @param {String} canvasId the id of the DOM element to use a parent container
     * @param width
     * @param height
     */
    constructor(private canvasId: string | number | HTMLElement | RaphaelConstructionOptionsArray4 | RaphaelConstructionOptionsArray5 | ((this: Window) => void) | undefined, private width: string | number, private height: string | number) {
        this.setScrollArea(document.body)
        this.canvasId = canvasId
        this.html = $("#" + canvasId)
        this.html.css({"cursor": "default"})
        if (!isNaN(parseFloat(<string>width)) && !isNaN(parseFloat(<string>height))) {
            if (isStringObject(width)) {
                this.initialWidth = parseInt(width)
            }
            if (isStringObject(height)) {
                this.initialHeight = parseInt(height)
            }
            this.html
                .height(this.initialHeight)
                .width(this.initialWidth)
        } else {
            this.initialWidth = this.getWidth()
            this.initialHeight = this.getHeight()
        }

        // avoid the "highlighting" in iPad, iPhone if the user tab/touch on the canvas.
        // .... I didn't like this.
        this.html.css({"-webkit-tap-highlight-color": "rgba(0,0,0,0)"})

        // Drag&Drop handling from foreign DIV into the Canvas
        // Only available in combination with jQuery-UI
        //
        // Create the droppable area for the css class "draw2d_droppable"
        // This can be done by a palette of toolbar or something else.
        // For more information see : http://jqueryui.com/demos/droppable/
        //
        $(this.html).droppable({
            accept: '.draw2d_droppable',
            over: (event, ui: any) => {
                this.onDragEnter(ui.draggable)
            },
            out:  (event, ui: any) => {
                this.onDragLeave(ui.draggable)
            },
            drop: (event, ui: any) => {
                event = this._getEvent(event);
                let helperPos = $(ui.helper).position()
                let pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY);
                this.onDrop(ui.draggable,
                    <number>pos.getX()- (event.clientX-helperPos.left)+5,
                    pos.getY()- (event.clientY-helperPos.top)+5, event.shiftKey, event.ctrlKey);
            }
        })


        // Create the jQuery-Draggable for the palette -> canvas drag&drop interaction
        //
        $(".draw2d_droppable").draggable({
            appendTo: "body",
            stack: "body",
            zIndex: 27000,
            helper: "clone",
            drag: (event, ui: any) => {
                event = this._getEvent(event)
                let pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY)
                this.onDrag(ui.draggable, <number>pos.x, pos.getY(), event.shiftKey, event.ctrlKey)
            },
            stop: (e, ui) => {
            },
            start: (e, ui) => {
                $(ui.helper).addClass("shadow")
            }
        })


        // painting stuff
        //
        if (!isNaN(parseFloat(<string>height))) {
            if (typeof width === "number" && typeof height === "number") {
                    this.paper = Raphael(<string>canvasId, width, height)
            }
        } else {
            this.paper = Raphael(<string>canvasId, <number>this.getWidth(), <number>this.getHeight())
        }
        (this.paper.canvas as SVGElement).style.position = "absolute"

        // Status handling
        //
        this.zoomPolicy = null // default ZoomEditPolicy
        this.zoomFactor = 1.0 // range [0.001..10]
        this.selection = new Selection()
        this.currentDropTarget = null
        this.currentHoverFigure = null

        // installed to all added figures to avoid that a figure can be placed outside the canvas area
        // during a drag&drop operation
        this.regionDragDropConstraint = new RegionEditPolicy(0, 0, this.getWidth(), this.getHeight())

        // event handling since version 5.0.0
        this.eventSubscriptions = {}

        this.editPolicy = new ArrayList()

        // internal document with all figures, ports, ....
        //
        this.figures = new ArrayList()
        this.lines = new ArrayList() // crap - why are connections not just figures. Design by accident
        this.commonPorts = new ArrayList()

        // all visible resize handles which can be drag&drop around. Selection handles like AntRectangleSelectionFeedback
        // are not part of this collection. Required for hitTest only
        this.resizeHandles = new ArrayList()

        // The CommandStack for undo/redo operations
        //
        this.commandStack = new CommandStack()

        // INTERSECTION/CROSSING handling for connections and lines
        //
        this.linesToRepaintAfterDragDrop = new ArrayList()
        this.lineIntersections = new ArrayList()

        // alternative/legacy zoom implementation
        // this.installEditPolicy( new draw2d.policy.canvas.ZoomPolicy());                  // Responsible for zooming
        this.installEditPolicy(new WheelZoomPolicy())                // Responsible for zooming with mouse wheel
        this.installEditPolicy(new DefaultKeyboardPolicy())          // Handles the keyboard interaction
        this.installEditPolicy(new BoundingboxSelectionPolicy())     // Responsible for selection handling
        this.installEditPolicy(new DropInterceptorPolicy())          // Responsible for drop operations
        this.installEditPolicy(new ComposedConnectionCreatePolicy(// Responsible for connection creation....
            [
                new DragConnectionCreatePolicy(),  // ....via drag/´drop
                new ClickConnectionCreatePolicy()  // or clicking on the ports and canvas.
            ])
        )

        // Calculate all intersection between the different lines
        //
        this.commandStack.addEventListener((event) => {
            if (event.isPostChangeEvent() === true) {
                this.calculateConnectionIntersection()
                this.linesToRepaintAfterDragDrop.each( (line) => {
                    line.svgPathString = null
                    line.repaint()
                })
                this.linesToRepaintAfterDragDrop = new ArrayList()
            }
        })

        // DragDrop status handling
        //
        this.mouseDown = false
        this.mouseDownX = 0
        this.mouseDownY = 0
        this.mouseDragDiffX = 0
        this.mouseDragDiffY = 0

        this.html.bind("mouseup touchend", (event) => {
            if (!this.mouseDown) {
                return
            }

            event = this._getEvent(event)
            this.calculateConnectionIntersection()

            this.mouseDown = false
            let pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY)
            this.editPolicy.each((policy) => {
                policy.onMouseUp(this, pos.x, pos.y, event.shiftKey, event.ctrlKey)
            })

            this.mouseDragDiffX = 0
            this.mouseDragDiffY = 0
        })

        this.html.bind("mousemove touchmove",  (event) => {
            event = this._getEvent(event)
            let pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY)
            if (!this.mouseDown) {
                // mouseEnter/mouseLeave events for Figures. Don't use the Raphael or DOM native functions.
                // Raphael didn't work for Rectangle with transparent fill (events only fired for the border line)
                // DOM didn't work well for lines. No eclipse area - you must hit the line exact to retrieve the event.
                // In this case I implement my own stuff...again and again.
                //
                // don't break the main event loop if one element fires an error during enter/leave event.
                try {
                    let hover = this.getBestFigure(<number>pos.x, pos.y)
                    if (hover !== this.currentHoverFigure && this.currentHoverFigure !== null) {
                        this.currentHoverFigure.onMouseLeave() // deprecated
                        this.currentHoverFigure.fireEvent("mouseleave")
                        this.fireEvent("mouseleave", {figure: this.currentHoverFigure})
                    }
                    if (hover !== this.currentHoverFigure && hover !== null) {
                        hover.onMouseEnter()
                        hover.fireEvent("mouseenter")
                        this.fireEvent("mouseenter", {figure: hover})
                    }
                    this.currentHoverFigure = hover
                } catch (exc) {
                    // just write it to the console
                    console.log(exc)
                }

                this.editPolicy.each( (policy) => {
                    policy.onMouseMove(this, pos.x, pos.y, event.shiftKey, event.ctrlKey)
                })
                this.fireEvent("mousemove", {
                    x: pos.x,
                    y: pos.y,
                    shiftKey: event.shiftKey,
                    ctrlKey: event.ctrlKey,
                    hoverFigure: this.currentHoverFigure
                })
            } else {
                let diffXAbs = (event.clientX - this.mouseDownX) * this.zoomFactor
                let diffYAbs = (event.clientY - this.mouseDownY) * this.zoomFactor
                this.editPolicy.each( (policy) => {
                    policy.onMouseDrag(this, diffXAbs, diffYAbs, diffXAbs - this.mouseDragDiffX, diffYAbs - this.mouseDragDiffY, event.shiftKey, event.ctrlKey)
                })
                this.mouseDragDiffX = diffXAbs
                this.mouseDragDiffY = diffYAbs
                this.fireEvent("mousemove", {
                    x: pos.x,
                    y: pos.y,
                    shiftKey: event.shiftKey,
                    ctrlKey: event.ctrlKey,
                    hoverFigure: this.currentHoverFigure
                })
            }
        })

        this.html.bind("mousedown",  (event) => {
            try {
                let pos: Point = null
                switch (event.which) {
                    case 1: //touch pressed
                    case 0: //Left mouse button pressed
                        try {
                            event.preventDefault()
                            event = this._getEvent(event)
                            this.mouseDownX = event.clientX
                            this.mouseDownY = event.clientY
                            this.mouseDragDiffX = 0
                            this.mouseDragDiffY = 0
                            pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY)
                            this.mouseDown = true
                            this.editPolicy.each((policy) => {
                                policy.onMouseDown(this, pos.x, pos.y, event.shiftKey, event.ctrlKey)
                            })
                        } catch (exc) {
                            console.log(exc)
                        }
                        break
                    case 3: //Right mouse button pressed
                        event.preventDefault()
                        if (typeof event.stopPropagation !== "undefined")
                            event.stopPropagation()
                        event = this._getEvent(event)
                        pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY)
                        this.onRightMouseDown(<number>pos.x, pos.y, event.shiftKey, event.ctrlKey)
                        return false
                    case 2:
                        //Middle mouse button pressed
                        break
                    default:
                    //You have a strange mouse
                }
            } catch (exc) {
                console.log(exc)
            }
        })


        // Catch the dblclick and route them to the Canvas hook.
        //
        this.html.on("dblclick", (event) => {
            event = this._getEvent(event)

            this.mouseDownX = event.clientX
            this.mouseDownY = event.clientY
            let pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY)
            this.onDoubleClick(<number>pos.x, pos.y, event.shiftKey, event.ctrlKey)
        })


        // Catch the click event and route them to the canvas hook
        //
        this.html.on("click", (event) => {
            event = this._getEvent(event)

            // fire only the click event if we didn't move the mouse (drag&drop)
            //
            if (this.mouseDownX === event.clientX || this.mouseDownY === event.clientY) {
                let pos = this.fromDocumentToCanvasCoordinate(event.clientX, event.clientY)
                this.onClick(<number>pos.x, pos.y, event.shiftKey, event.ctrlKey)
            }
        })

        // Important: MozMousePixelScroll is required to prevent 1px scrolling
        // in FF event if we call "e.preventDefault()"
        this.html.on('MozMousePixelScroll DOMMouseScroll mousewheel', (e) => {
            let event = this._getEvent(e)
            let pos = this.fromDocumentToCanvasCoordinate(event.originalEvent.clientX, event.originalEvent.clientY)

            let delta = 0
            const originalEvent: any = e.originalEvent;
            if (e.type === 'mousewheel') {
                delta = (originalEvent.wheelDelta * -1)
            } else if (e.type === 'DOMMouseScroll') {
                delta = 40 * originalEvent.detail
            }

            let returnValue = this.onMouseWheel(delta, <number>pos.x, pos.y, event.shiftKey, event.ctrlKey)

            if (!returnValue) {
                e.preventDefault()
            }
        })

        $(document).bind("keyup", this.keyupCallback)
        $(document).bind("keydown", this.keydownCallback)
    }

    // Catch the keyUp and CTRL-key and route them to the Canvas hook.
    //
    keyupCallback(event: any) {
        // don't initiate the delete command if the event comes from an INPUT field. In this case the user want delete
        // a character in the input field and not the related shape
        let target = $(event.target)
        if (!target.is("input") && !target.is("textarea")) {
            this.editPolicy.each((policy) => {
                if (policy instanceof KeyboardPolicy) {
                    policy.onKeyUp(this, event.keyCode, event.shiftKey, event.ctrlKey)
                }
            })
        }
    }

    // Catch the keyDown and CTRL-key and route them to the Canvas hook.
    //
    keydownCallback(event: any) {
        // don't initiate the delete command if the event comes from an INPUT field. In this case the user want delete
        // a character in the input field and not the related shape
        let target = $(event.target)
        if (!target.is("input") && !target.is("textarea")) {
            this.editPolicy.each((policy) => {
                if (policy instanceof KeyboardPolicy) {
                    policy.onKeyDown(this, event.keyCode, event.shiftKey, event.ctrlKey)
                }
            })
        }
    }

    /**
     *
     * Call this method if you didn't need the canvas anymore. The method unregister all even handlers
     * and frees all resources. The canvas is unusable after this call
     *
     * @since. 4.7.4
     */
    destroy() {
        this.clear()
        $(document).unbind("keydown", this.keydownCallback)
        $(document).unbind("keyup", this.keyupCallback)
        // reset the event handlers of the canvas without any notice
        //
        this.eventSubscriptions = {}

        try {
            this.paper.remove()
        } catch (exc) {
            // breaks in some ie7 version....don't care about this because ie7/8 isn't a state of the art browser  ;-)
        }
    }

    /**
     *
     * Reset the canvas and delete all model elements.<br>
     * You can now reload another model to the canvas with a {@link draw2d.io.Reader}
     *
     * @since 1.1.0
     * @returns {this}
     */
    clear() {
        // notice all listener that the canvas will be cleared
        this.fireEvent("clear")

        this.lines.clone().each((e) => {
            this.remove(e)
        })

        this.figures.clone().each((e) => {
            this.remove(e)
        })

        this.zoomFactor = 1.0
        this.selection.clear()
        this.currentDropTarget = null

        // internal document with all figures, ports, ....
        //
        this.figures = new ArrayList()
        this.lines = new ArrayList()
        this.commonPorts = new ArrayList()

        this.commandStack.markSaveLocation()

        // INTERSECTION/CROSSING handling for connections and lines
        //
        this.linesToRepaintAfterDragDrop = new ArrayList()
        this.lineIntersections = new ArrayList()

        return this
    }

    /**
     *
     * Callback for any kind of image export tools to trigger the canvas to hide all unwanted
     * decorations. The method is called e.g. from the draw2d.io.png.Writer
     *
     * @since 4.0.0
     * @@interface
     */
    hideDecoration() {
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
    showDecoration() {
    }

    /**
     *
     * Calculate all connection intersection of the canvas.
     * Required for "bridging" or "crossing decoration"
     *
     * @private
     */
    calculateConnectionIntersection() {

        this.lineIntersections = new ArrayList()
        let lines = this.getLines().clone()
        while (lines.getSize() > 0) {
            let l1 = lines.removeElementAt(0)
            lines.each((l2) => {
                let partInter = l1.intersection(l2)
                if (partInter.getSize() > 0) {
                    this.lineIntersections.add({line: l1, other: l2, intersection: partInter})
                    this.lineIntersections.add({line: l2, other: l1, intersection: partInter})
                }
            })
        }

        return this
    }


    /**
     *
     *
     * Install a new selection and edit policy into the canvas
     *
     * @since 2.2.0
     * @param {draw2d.policy.EditPolicy} policy
     */
    installEditPolicy(policy: EditPolicy) {

        // a canvas can handle only one selection policy
        //
        if (policy instanceof SelectionPolicy) {
            // reset old selection before install new selection strategy
            this.getSelection().getAll().each((figure: any) => {
                figure.unselect()
            })

            // remove existing selection policy
            this.editPolicy.grep((p) => {
                let stay = !(p instanceof SelectionPolicy)
                if (stay === false) {
                    p.onUninstall(this)
                }
                return stay
            })
        }
            // only one zoom policy at once
        //
        else if (policy instanceof ZoomPolicy) {
            // remove existing zoom policy
            this.editPolicy.grep((p) => {
                let stay = !(p instanceof ZoomPolicy)
                if (stay === false) {
                    p.onUninstall(this)
                }
                return stay
            })
            // replace the short cut handle for faster access
            this.zoomPolicy = policy
        } else if (policy instanceof ConnectionCreatePolicy) {
            this.editPolicy.grep((p) => {
                let stay = !(p instanceof ConnectionCreatePolicy)
                if (!stay) {
                    p.onUninstall(this)
                }
                return stay
            })
        } else if (policy instanceof DropInterceptorPolicy) {
            // think about if I allow to install only one drop policy
        }

        // remove doublicate edit policies
        if(policy.NAME) {
            this.uninstallEditPolicy(policy.NAME)
        }

        policy.onInstall(this)
        this.editPolicy.add(policy)

        return this
    }

    /**
     *
     *
     * UnInstall the selection and edit policy from the canvas.
     *
     * @since 2.2.0
     * @param {draw2d.policy.EditPolicy|String} policy
     */
    uninstallEditPolicy(policy: EditPolicy | string) {
        if (policy === null) {
            return //silently
        }

        // either remove exact the policy instance...
        //
        let removed = this.editPolicy.remove(policy)
        if (removed !== null) {
            removed.onUninstall(this)
            if (removed instanceof ZoomPolicy) {
                this.zoomPolicy = null
            }
        } else {
            // ..or all of the same class if the policy isn't installed before
            // With this kind of behaviour it is possible to deinstall all policies with
            // the same class at once
            //
            let name = (typeof policy === "string") ? policy : policy.NAME
            this.editPolicy.grep((p) => {
                if (p.NAME === name) {
                    p.onUninstall(this)
                    // remove short cut handle to the zoom policy
                    if (p instanceof ZoomPolicy) {
                        this.zoomPolicy = null
                    }
                    return false
                }
                return true
            })
        }
        return this
    }

    getDropInterceptorPolicies() {
        return this.editPolicy.clone().grep((p) => {
            return (p instanceof DropInterceptorPolicy)
        })
    }

    /**
     *
     * Set the new zoom factor for the canvas. The value must be between [0.01..10]
     *
     *     // you can register an eventhandler if the zoom factor did change
     *     canvas.on("zoom", function(emitterFigure, zoomData){
     *         alert("canvas zoomed to:"+zoomData.value);
     *     });
     *
     * @param {Number} zoomFactor new zoom factor. range [0.001..10]. 1.0 is no zoom.
     * @param {Boolean} [animated] set it to true for smooth zoom in/out
     */
    setZoom(zoomFactor: number, animated = false) {
        // redirect this legacy method to the new CanvasEditPolicy
        //
        if (this.zoomPolicy) {
            this.zoomPolicy.setZoom(zoomFactor, animated)
        }
    }

    /**
     *
     * Return the current zoom factor of the canvas.
     *
     * @returns {Number}
     */
    getZoom() {
        return this.zoomFactor
    }

    /**
     *
     * Return the dimension of the drawing area
     *
     * @since 4.4.0
     * @returns {draw2d.geo.Rectangle}
     */
    getDimension() {
        return new Rectangle(0, 0, this.initialWidth, this.initialHeight)
    }

    /**
     *
     * Tells the canvas to resize. If you do not specific any parameters
     * the canvas will attempt to determine the height and width by the enclosing bounding box
     * of all elements and set the dimension accordingly. If you would like to set the dimension
     * explicitly pass in an draw2d.geo.Rectangle or an object with <b>height</b> and <b>width</b> properties.
     *
     * @since 4.4.0
     * @param {draw2d.geo.Rectangle} [dim] the dimension to set or null for autodetect
     * @param {Number} [height] the height of the canvas if the first argument is a number and not a Rectangle
     */
    setDimension(dim: Rectangle, height?: number) {
        if (typeof dim === "undefined") {
            let widths = this.getFigures().clone().map(function (f) {
                return f.getAbsoluteX() + f.getWidth()
            })
            let heights = this.getFigures().clone().map(function (f) {
                return f.getAbsoluteY() + f.getHeight()
            })
            this.initialHeight = Math.max(...heights.asArray())
            this.initialWidth = Math.max(...widths.asArray())
        } else if (dim instanceof Rectangle) {
            this.initialWidth = dim.w
            this.initialHeight = dim.h
        } else if (typeof dim.width === "number" && typeof dim.height === "number") {
            this.initialWidth = dim.width
            this.initialHeight = dim.height
        } else if (typeof dim === "number" && typeof height === "number") {
            this.initialWidth = dim
            this.initialHeight = height
        }
        this.html.css({"width": this.initialWidth + "px", "height": this.initialHeight + "px"})
        this.paper.setSize(this.initialWidth, this.initialHeight)
        this.setZoom(this.zoomFactor, false)

        return this
    }


    /**
     *
     * Transforms a document coordinate to canvas coordinate.
     *
     * @param {Number} x the x coordinate relative to the window
     * @param {Number} y the y coordinate relative to the window
     *
     * @returns {draw2d.geo.Point} The coordinate in relation to the canvas [0,0] position
     */
    fromDocumentToCanvasCoordinate(x: number, y: number) {
        return new Point(
            (x - this.getAbsoluteX() + this.getScrollLeft()) * this.zoomFactor,
            (y - this.getAbsoluteY() + this.getScrollTop()) * this.zoomFactor)
    }

    /**
     *
     * Transforms a canvas coordinate to document coordinate.
     *
     * @param {Number} x the x coordinate in the canvas
     * @param {Number} y the y coordinate in the canvas
     *
     * @returns {draw2d.geo.Point} the coordinate in relation to the document [0,0] position
     */
    fromCanvasToDocumentCoordinate(x: number, y: number) {
        return new Point(
            ((x * (1 / this.zoomFactor)) + this.getAbsoluteX() - this.getScrollLeft()),
            ((y * (1 / this.zoomFactor)) + this.getAbsoluteY() - this.getScrollTop()))
    }

    /**
     *
     * The DOM host of the canvas
     *
     * @returns {HTMLElement}
     */
    getHtmlContainer() {
        return this.html
    }


    /**
     *
     * Return a common event object independed if we run on an iPad or desktop.
     *
     * @param event
     * @returns {DOMEventObject}
     * @private
     */
    _getEvent(event: any) {
        // check for iPad, Android touch events
        //
        if (typeof event.originalEvent !== "undefined") {
            if (event.originalEvent.touches && event.originalEvent.touches.length) {
                return event.originalEvent.touches[0]
            } else if (event.originalEvent.changedTouches && event.originalEvent.changedTouches.length) {
                return event.originalEvent.changedTouches[0]
            }
        }
        return event
    }

    /**
     *
     *
     * Set the area which are scrolling the canvas. This can be a jquery selector or
     * a jQuery node.
     *
     * @param {String/HTMLElement} elementSelector
     * @returns {this}
     **/
    setScrollArea(elementSelector: string | HTMLElement) {
        this.scrollArea = $(<any>elementSelector)

        return this
    }

    /**
     *
     *
     * return the scrolling area of the canvas. This is jQuery object
     *
     * @returns {JQueryElement}
     **/
    getScrollArea() {
        return this.scrollArea
    }

    /**
     *
     * The left scroll position.
     *
     * @returns {Number} the left scroll offset of the canvas
     **/
    getScrollLeft() {
        return this.getScrollArea().scrollLeft()
    }

    /**
     *
     * The top scroll position
     *
     * @returns {Number} the top scroll offset of the cnavas.
     **/
    getScrollTop() {
        return this.getScrollArea().scrollTop()
    }

    /**
     *
     * Set left scroll position.
     *
     * @param {Number} left the left scroll offset of the canvas
     **/
    setScrollLeft(left: number) {
        this.getScrollArea().scrollLeft(left)

        return this
    }

    /**
     *
     * set top scroll position
     *
     * @param {Number} top the top scroll offset of the canvas.
     **/
    setScrollTop(top: number) {
        this.getScrollArea().scrollTop(top)

        return this
    }

    /**
     *
     * set the new scroll position of the canvas
     *
     * @param {Number} top the top scroll offset of the canvas.
     * @param {Number} left the left scroll offset of the canvas
     * @since 5.8.0
     **/
    scrollTo(top: number, left: number) {
        this.getScrollArea().scrollTop(top).scrollLeft(left)

        return this
    }

    /**
     *
     * The absolute document x offset.
     *
     * @returns {Number}
     **/
    getAbsoluteX() {
        return this.html.offset().left
    }

    /**
     *
     * The absolute document y offset.
     *
     * @returns {Number}
     **/
    getAbsoluteY() {
        return this.html.offset().top
    }


    /**
     *
     * Return the width of the canvas
     *
     * @returns {Number}
     **/
    getWidth() {
        return this.html.width()
    }


    /**
     *
     * Return the height of the canvas.
     *
     * @returns {Number}
     **/
    getHeight() {
        return this.html.height()
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
    add(figure: Figure, x?: number | Point, y?: number) {
        if (figure.getCanvas() === this) {
            return
        }

        if (figure instanceof Line) {
            this.lines.add(figure)
            this.linesToRepaintAfterDragDrop = this.lines
        } else {
            this.figures.add(figure)
            if (typeof y !== "undefined") {
                figure.setPosition(x, y)
            } else if (typeof x !== "undefined") {
                figure.setPosition(x)
            }
        }
        figure.setCanvas(this)

        // to avoid drag&drop outside of this canvas
        figure.installEditPolicy(this.regionDragDropConstraint)

        // important initial call
        figure.getShapeElement()

        // init a repaint of the figure. This enforce that all properties
        // ( color, dim, stroke,...) will be set and pushed to SVG node.
        figure.repaint()

        // fire the figure:add event before the "move" event and after the figure.repaint() call!
        //   - the move event can only be fired if the figure part of the canvas.
        //     and in this case the notification event should be fired to the listener before
        this.fireEvent("figure:add", {figure: figure, canvas: this})

        // fire the event that the figure is part of the canvas
        figure.fireEvent("added", {figure: figure, canvas: this})

        // ...now we can fire the initial move event
        figure.fireEvent("move", {figure: figure, x: figure.getX(), y: figure.getY(), dx: 0, dy: 0})

        // this is only required if the used router requires the crossing information
        // of the connections
        if (figure instanceof PolyLine) {
            this.calculateConnectionIntersection()
            this.linesToRepaintAfterDragDrop.each((line) => {
                line.svgPathString = null
                line.repaint()
            })
            this.linesToRepaintAfterDragDrop = new ArrayList()
        }

        return this
    }


    /**
     *
     * Remove a figure or connection from the Canvas. This method fires an event
     * which can be catched.
     *
     * Example:
     *
     *     canvas.on("figure:remove", function(emitter, event){
     *        alert("figure removed:");
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
     *
     * @param {draw2d.Figure} figure The figure to remove
     **/
    remove(figure) {
        // don't fire events of calll callbacks if the fire isn'T part of this canvas
        //
        if (figure.getCanvas() !== this) {
            return this
        }

        // remove the figure from a selection handler as well and cleanup the
        // selection feedback
        if (this.getSelection().contains(figure)) {
            this.editPolicy.each((policy) => {
                if (typeof policy.unselect === "function") {
                    policy.unselect(this, figure)
                }
            })
        }

        if (figure instanceof Line) {
            this.lines.remove(figure)
        } else {
            this.figures.remove(figure)
        }

        figure.setCanvas(null)

        if (figure instanceof Connection) {
            figure.disconnect()
        }

        this.fireEvent("figure:remove", {figure: figure})

        figure.fireEvent("removed", {figure: figure, canvas: this})

        return this
    }

    /**
     *
     * Returns all lines/connections in this workflow/canvas.<br>
     *
     * @returns {ArrayList}
     **/
    getLines() {
        return this.lines
    }

    /**
     *
     * Returns the internal figures.<br>
     *
     * @returns {ArrayList}
     **/
    getFigures() {
        return this.figures
    }

    /**
     *
     * Returns the line or connection with the given id.
     *
     * @param {String} id The id of the line.
     *
     * @returns {draw2d.shape.basic.Line}
     **/
    getLine(id: string) {
        return this.lines.find((v) => v.getId() === id);
    }

    /**
     *
     * Returns the figure with the given id.
     *
     * @param {String} id The id of the figure.
     * @returns {draw2d.Figure}
     **/
    getFigure(id: string) {
        return this.figures.find((f) => f.id === id);
    }

    /**
     *
     * Return all intersections draw2d.geo.Point between the given line and all other
     * lines in the canvas.
     *
     * @param {draw2d.shape.basic.Line} line the line for the intersection test
     * @returns {ArrayList}
     */
    getIntersection(line: Line) {
        let result = new ArrayList()

        this.lineIntersections.each((entry) => {
            if (entry.line === line) {
                entry.intersection.each((p: any) => {
                    result.add({x: p.x, y: p.y, justTouching: p.justTouching, other: entry.other})
                })
            }
        })

        return result
    }


    /**
     *
     *  Adjust the coordinate with the installed SnapToHelper.
     *
     * @param  {draw2d.Figure} figure The related figure
     * @param  {draw2d.geo.Point} pos The position to adjust
     *
     * @returns {draw2d.geo.Point} the adjusted position
     * @private
     **/
    snapToHelper(figure: Figure, pos: Point) {
        // disable snapToPos if we have select more than one element
        // which are currently in Drag&Drop operation
        //
        if (this.getSelection().getSize() > 1) {
            return pos
        }

        let orig = pos.clone()
        this.editPolicy.each((policy) => {
            if (policy instanceof SnapToEditPolicy) {
                pos = policy.snap(this, figure, pos, orig)
            }
        })

        return pos
    }


    /**
     *
     * Register a port to the canvas. This is required for other ports to find a valid drop target.
     *
     * @param {draw2d.Port} port The new port which has been added to the Canvas.
     **/
    registerPort(port: Port) {
        // All elements have the same drop targets.
        //
        if (!this.commonPorts.contains(port)) {
            this.commonPorts.add(port)
        }

        return this
    }

    /**
     *
     * Remove a port from the internal cnavas registration. Now other ports can't find the
     * port anymore as drop target. The port itself is still visible.
     *
     * @param {draw2d.Port} port The port to unregister as potential drop target
     * @private
     * @returns {this}
     **/
    unregisterPort(port: Port) {
        this.commonPorts.remove(port)

        return this
    }

    /**
     *
     * Return all ports in the canvas
     *
     * @returns {ArrayList} all ports from all figures
     */
    getAllPorts() {
        return this.commonPorts
    }

    /**
     *
     * Returns the command stack for the Canvas. Required for undo/redo support.
     *
     * @returns {draw2d.command.CommandStack}
     **/
    getCommandStack() {
        return this.commandStack
    }

    /**
     *
     * Returns the current selected figure in the Canvas.
     *
     * @returns {draw2d.Figure}
     **/
    getPrimarySelection() {
        return this.selection.getPrimary()
    }

    /**
     *
     * Returns the current selection.
     *
     * @returns {draw2d.Selection}
     **/
    getSelection() {
        return this.selection
    }

    /**
     *
     * Set the current selected figure or figures in the canvas.<br>
     * <br>
     * You can hand over a ArrayList since version 4.8.0 for multiple selection.
     *
     * @param {draw2d.Figure| ArrayList} object The figure or list of figures to select.
     * @returns {this}
     **/
    setCurrentSelection(object: Figure | ArrayList) {
        // deselect the current selected figures
        //
        // clone the array (getAll) before iterate and modify the initial array
        this.selection.getAll().each((e) => {
            this.editPolicy.each((policy) => {
                if (typeof policy.unselect === "function") {
                    policy.unselect(this, e)
                }
            })
        })
        this.addSelection(object)

        return this
    }

    /**
     *
     * Add the current figure to the selection. If a single selection policy is installed in the
     * canvas the selection before is reseted and the figure is the one and only selection.
     *
     * @param {draw2d.Figure | ArrayList} object The figure(s) to add to the selection
     * @since 4.6.0
     * @returns {this}
     **/
    addSelection(object: Figure | ArrayList) {

        const add = (figure: any) =>{
            this.editPolicy.each( (policy) =>{
                if (typeof policy.select === "function") {
                    policy.select(this, figure)
                }
            })
        }

        if (object instanceof ArrayList || object instanceof Selection) {
            object.each(add)
        } else {
            add(object)
        }

        return this
    }


    /**
     *
     * Returns the best figure at the location [x,y]. It is a simple hit test. Keep in mind that only visible objects
     * are returned.
     *
     *
     * @param {Number} x The x position.
     * @param {Number} y The y position.
     * @param {draw2d.Figure|Array|Class} [blacklist] The figures or class which should be ignored.
     * @param {draw2d.Figure|Array|Class} [whitelist] The figures or class should be considered.
     *
     * @returns {draw2d.Figure}
     **/
    getBestFigure(x: number, y: number, blacklist?: Figure | Figure[], whitelist?: Figure | Figure[]) {
        if (!Array.isArray(blacklist)) {
            if (blacklist)
                blacklist = [blacklist]
            else
                blacklist = []
        }

        if (!Array.isArray(whitelist)) {
            if (whitelist)
                whitelist = [whitelist]
            else
                whitelist = []
        }

        let result: any = null
        let testFigure: any = null


        let isInList = (testFigure, list) => {
            for (let i = 0, len = list.length; i < len; i++) {
                let considering = list[i]
                if (typeof considering === "function") {
                    if (testFigure instanceof considering) {
                        return true
                    }
                } else if ((considering === testFigure) || (considering.contains(testFigure))) {
                    return true
                }
            }
            return false
        }
        let isInBlacklist = function (item) {
            return isInList(item, blacklist)
        }
        // empty whitelist means that every kind of object is allowed
        let isInWhitelist = whitelist.length === 0 ? () => {
            return true
        } : (item) => {
            return isInList(item, whitelist)
        }


        // tool method to check recursive a figure for hitTest
        //
        let checkRecursive = (children) => {
            children.each((i, e) => {
                let c = e.figure
                checkRecursive(c.children)
                if (result === null && c.isVisible() && c.hitTest(x, y) && !isInBlacklist(c) && isInWhitelist(c)) {
                    result = c
                }
                return result === null // break the each-loop if we found an element
            })
        }


        // ResizeHandles
        //
        for (let i = 0, len = this.resizeHandles.getSize(); i < len; i++) {
            testFigure = this.resizeHandles.get(i)
            if (testFigure.isVisible() && testFigure.hitTest(x, y) && !isInBlacklist(testFigure) && isInWhitelist(testFigure)) {
                return testFigure
            }
        }

        // Checking ports
        //
        for (let i = 0, len = this.commonPorts.getSize(); i < len; i++) {
            let port = this.commonPorts.get(i)
            // check first a children of the figure
            //
            checkRecursive(port.children)

            if (result === null && port.isVisible() && port.hitTest(x, y) && !isInBlacklist(port) && isInWhitelist(port)) {
                result = port
            }

            if (result !== null) {
                return result
            }
        }


        //  Check now the common objects.
        //  run reverse to aware the z-oder of the figures
        for (let i = (this.figures.getSize() - 1); i >= 0; i--) {
            let figure = this.figures.get(i)
            // check first a children of the figure
            //
            checkRecursive(figure.children)

            // ...and the figure itself
            //
            if (result === null && figure.isVisible() && figure.hitTest(x, y) && !isInBlacklist(figure) && isInWhitelist(figure)) {
                result = figure
                break
            }
        }

        let figureResult = result
        let childResult = null
        let lineResult = this.getBestLine(x, y, blacklist, whitelist)
        result = null


        // Check the children of the lines as well
        // Not selectable/draggable. But should receive onClick/onDoubleClick events
        // as well.
        let count = this.lines.getSize()
        for (let i = 0; i < count; i++) {
            let line = this.lines.get(i)
            // check first a children of the figure
            //
            checkRecursive(line.children)

            if (result !== null) {
                childResult = result
                break
            }
        }

        let figureIndex = figureResult !== null ? $(figureResult.shape.node).index() : -1
        let childIndex = childResult !== null ? $(childResult.shape.node).index() : -1
        let lineIndex = lineResult !== null ? $(lineResult.shape.node).index() : -1
        let array = [
            {i: figureIndex, f: figureResult}, {i: childIndex, f: childResult}, {i: lineIndex, f: lineResult}
        ]
        array = array.filter((e) => e.i !== -1);
        array = array.sort((a, b) => b.i - a.i)


        if (array.length > 0) {
            result = array[0].f
        }

        return result
    }


    /**
     *
     * Return the line which match the hands over coordinate
     *
     * @param {Number} x the x-coordinate for the hit test
     * @param {Number} y the x-coordinate for the hit test
     * @param {draw2d.shape.basic.Line} [lineToIgnore] a possible line which should be ignored for the hit test
     *
     * @private
     * @returns {draw2d.shape.basic.Line}
     **/
    getBestLine(x: number, y: number, lineToIgnore?: Line | Line[]) {
        if (!Array.isArray(lineToIgnore)) {
            if (lineToIgnore instanceof Figure) {
                lineToIgnore = [lineToIgnore]
            } else {
                lineToIgnore = []
            }
        }

        return this.lines.find((line) => line.isVisible() === true && line.hitTest(x, y) === true && $.inArray(line, <any[]>lineToIgnore) === -1);
    }


    /**
     *
     * Called by the framework during drag&drop operations.<br>
     * Droppable can be setup with:
     * <pre>
     *    $(".draw2d_droppable").draggable({
     *         appendTo:"#container",
     *         stack:"#container",
     *         zIndex: 27000,
     *         helper:"clone",
     *         start(e, ui){$(ui.helper).addClass("shadow");}
     *    });
     * </pre>
     * Draw2D use the jQuery draggable/droppable lib. Please inspect
     * http://jqueryui.com/demos/droppable/ for further information.
     *
     * @param {HTMLElement} draggedDomNode The DOM element which is currently dragging
     *
     * @template
     **/
    onDragEnter(draggedDomNode: HTMLElement) {
    }


    /**
     *
     * Called if the DragDrop object is moving around.<br>
     * <br>
     * Draw2D use the jQuery draggable/droppable lib. Please inspect
     * http://jqueryui.com/demos/droppable/ for further information.
     *
     * @param {HTMLElement} draggedDomNode The dragged DOM element.
     * @param {Number} x the x coordinate of the drag
     * @param {Number} y the y coordinate of the drag
     *
     * @param shiftKey
     * @param ctrlKey
     * @template
     **/
    onDrag(draggedDomNode: HTMLElement, x: number, y: number, shiftKey: boolean, ctrlKey: boolean) {
    }


    /**
     *
     * Called if the DragDrop object leaving the current hover figure.<br>
     * <br>
     * Graphiti use the jQuery draggable/droppable lib. Please inspect
     * http://jqueryui.com/demos/droppable/ for further information.
     *
     * @param {HTMLElement} draggedDomNode The figure which is currently dragging
     *
     * @template
     **/
    onDragLeave(draggedDomNode: HTMLElement) {
    }


    /**
     *
     * Called if the user drop the droppedDomNode onto the canvas.<br>
     * <br>
     * Draw2D use the jQuery draggable/droppable lib. Please inspect
     * http://jqueryui.com/demos/droppable/ for further information.
     *
     * @param {HTMLElement} droppedDomNode The dropped DOM element.
     * @param {Number} x the x-coordinate of the mouse up event
     * @param {Number} y the y-coordinate of the mouse up event
     * @param {Boolean} shiftKey true if the shift key has been pressed during this event
     * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
     *
     * @template
     **/
    onDrop(droppedDomNode: HTMLElement, x: number, y: number, shiftKey: boolean, ctrlKey: boolean) {
    }


    /**
     *
     * Callback method for the double click event. The x/y coordinates are relative to the top left
     * corner of the canvas.
     *
     * @private
     **/
    onDoubleClick(x: number, y: number, shiftKey: boolean, ctrlKey: boolean) {
        // check if a line has been hit
        //
        let figure = this.getBestFigure(x, y)

        // or a line/connection. May we should test the line before a figure..?
        // (since 4.0.0)
        if (figure === null) {
            figure = this.getBestLine(x, y)
        }

        this.fireEvent("dblclick", {figure: figure, x: x, y: y, shiftKey: shiftKey, ctrlKey: ctrlKey})

        // forward the event to all install policies as well.
        // (since 4.0.0)
        this.editPolicy.each((policy) => {
            policy.onDoubleClick(figure, x, y, shiftKey, ctrlKey)
        })
    }

    /**
     *
     * @param {Number} x the x coordinate of the event
     * @param {Number} y the y coordinate of the event
     * @param {Boolean} shiftKey true if the shift key has been pressed during this event
     * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
     * @private
     **/
    onClick(x: number, y: number, shiftKey: boolean, ctrlKey: boolean) {
        // check if a figure has been hit
        //
        let figure = this.getBestFigure(x, y)

        this.fireEvent("click", {
            figure: figure,
            x: x,
            y: y,
            relX: figure !== null ? x - figure.getAbsoluteX() : 0,
            relY: figure !== null ? y - figure.getAbsoluteY() : 0,
            shiftKey: shiftKey,
            ctrlKey: ctrlKey
        })

        // forward the event to all install policies as well.
        // (since 3.0.0)
        this.editPolicy.each((policy) => {
            policy.onClick(figure, x, y, shiftKey, ctrlKey)
        })
    }

    /**
     *
     * The user has triggered a right click. Redirect them to a responsible figure.
     *
     * @param {Number} x The x-coordinate of the click
     * @param {Number} y The y-coordinate of the click
     * @param {Boolean} shiftKey true if the shift key has been pressed during this event
     * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
     *
     * @private
     * @since 1.1.0
     **/
    onRightMouseDown(x: number, y: number, shiftKey: boolean, ctrlKey: boolean) {
        let figure = this.getBestFigure(x, y)
        this.fireEvent("contextmenu", {figure: figure, x: x, y: y, shiftKey: shiftKey, ctrlKey: ctrlKey})

        if (figure !== null) {
            figure.fireEvent("contextmenu", {figure: figure, x: x, y: y, shiftKey: shiftKey, ctrlKey: ctrlKey})
            // @deprecated legacy call
            figure.onContextMenu(x, y)

            // forward the event to all installed policies of the figure
            // soft migration from onHookXYZ to Policies.
            // since 4.4.0
            figure.editPolicy.each((policy) => {
                policy.onRightMouseDown(figure, x, y, shiftKey, ctrlKey)
            })
        }

        // forward the event to all install policies as well.
        // (since 4.4.0)
        this.editPolicy.each((policy) => {
            policy.onRightMouseDown(figure, x, y, shiftKey, ctrlKey)
        })

    }

    /**
     *
     * @param {Number} wheelDelta the delata of the wheel rotation
     * @param {Number} x the x coordinate of the event
     * @param {Number} y the y coordinate of the event
     * @param {Boolean} shiftKey true if the shift key has been pressed during this event
     * @param {Boolean} ctrlKey true if the ctrl key has been pressed during the event
     * @private
     **/
    onMouseWheel(wheelDelta: number, x: number, y: number, shiftKey: boolean, ctrlKey: boolean) {
        let returnValue = true
        this.fireEvent("wheel", {wheelDelta: wheelDelta, x: x, y: y, shiftKey: shiftKey, ctrlKey: ctrlKey})

        // forward the event to all install policies as well.
        // (since 3.0.0)
        this.editPolicy.each((policy) => {
            returnValue = policy.onMouseWheel(wheelDelta, x, y, shiftKey, ctrlKey) && returnValue
        })

        return returnValue
    }


    // NEW EVENT HANDLING SINCE VERSION 5.0.0
    /**
     *
     * Execute all handlers and behaviors attached to the canvas for the given event type.
     *
     *
     * @param {String} event the event to trigger
     * @param {Object} [args] optional parameters for the triggered event callback
     * @private
     * @since 5.0.0
     */
    fireEvent(event: string, args?: any) {
        if (typeof this.eventSubscriptions[event] === 'undefined') {
            return
        }

        let subscribers = this.eventSubscriptions[event]
        for (let i = 0; i < subscribers.length; i++) {
            try {
                subscribers[i](this, args)
            } catch (exc) {
                console.log(exc)
                console.log(subscribers[i])
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
     *        alert("figure selected");
     *     });
     *
     *     canvas.on("unselect", function(emitter,event){
     *        alert("figure unselected");
     *     });
     *
     * @param {String}   event One or more space-separated event types
     * @param {Function} callback A function to execute when the event is triggered.
     * @param {draw2d.Canvas} callback.emitter the emitter of the event
     * @param {Object} [callback.obj] optional event related data
     *
     * @since 5.0.0
     */
    on(event: string, callback: (event: any) => void) {
        let events = event.split(" ")
        for (let i = 0; i < events.length; i++) {
            if (typeof this.eventSubscriptions[events[i]] === 'undefined') {
                this.eventSubscriptions[events[i]] = []
            }
            this.eventSubscriptions[events[i]].push(callback)
        }
        return this
    }

    /**
     *
     * The `off()` method removes event handlers that were attached with {@link #on}.<br>
     * Calling .off() with no arguments removes all handlers attached to the canvas.<br>
     * <br>
     * If a simple event name such as "reset" is provided, all events of that type are removed from the canvas.
     *
     *
     * @param {String|Function} eventOrFunction the event name of the registerd function
     * @since 5.0.0
     */
    off(eventOrFunction: string | ((e: any) => void)) {
        if (typeof eventOrFunction === "undefined") {
            this.eventSubscriptions = {}
        } else if (typeof eventOrFunction === 'string') {
            this.eventSubscriptions[eventOrFunction] = []
        } else {
            for (let event in this.eventSubscriptions) {
                if (this.eventSubscriptions.hasOwnProperty(event)) {
                    this.eventSubscriptions[event] = this.eventSubscriptions[event].filter((callback: (e: any) => void) => {
                        return callback !== eventOrFunction
                    })
                }
            }
        }

        return this
    }
}

export default Canvas;
