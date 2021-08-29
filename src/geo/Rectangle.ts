/**
 * @class
 *
 * Represents a Rectangle(x, y, width, height).
 *
 * @author Andreas Herz
 * @extends draw2d.geo.Point
 */
import Point from "./Point";
import ArrayList from "../util/ArrayList";
import Line from "../shape/basic/Line";
import Direction from "./Direction";

class Rectangle extends Point {
    /**
     * Creates a new Point object with the hands over coordinates.
     * <br>
     * The constructor consumes almost any kind of rectangel definitions
     * like:
     *      let rect0 = new draw2d.geo.Rectangle({x:0,y:0,width:20,height:20});
     *      let rect1 = new draw2d.geo.Rectangle({x:0,y:0,w:20,h:20});
     *      let rect2 = new draw2d.geo.Rectangle($("#divid")[0].getBoundingClientRect());
     *      let rect3 = new draw2d.geo.Rectangle(rect1);
     *
     * The rectangle class is usefull for any kind of intersection, hitTest, contains,...calculation
     * or to set the bounding box of any shape.
     *
     * @param {Number|draw2d.geo.Rectangle} x
     * @param {Number} y
     * @param {Number} w
     * @param {Number} h
     */
    constructor(x: number | Rectangle, y: number, public w: number, public h: number) {
        super(<number>x, y);

        if (x instanceof Rectangle) {
            super(x.x, x.y);
        }
    }

    adjustBoundary() {
        this.x = Math.min(Math.max(this.bx, this.x), this.bw - this.w);
        this.y = Math.min(Math.max(this.by, this.y), this.bh - this.h);
        this.w = Math.min(this.w, this.bw);
        this.h = Math.min(this.h, this.bh);

        return this;
    }

    /**
     *
     * Resizes this Rectangle by the values supplied as input and returns this for
     * convenience. This Rectangle's width will become this.width + dw. This
     * Rectangle's height will become this.height + dh.
     * <br>
     * The method return the object itself. This allows you to do command chaining, where
     * you can perform multiple methods on the same elements.
     *
     *
     * @param {Number} dw  Amount by which width is to be resized
     * @param {Number} dh  Amount by which height is to be resized
     * @returns  {this}
     **/
    resize (dw: number, dh: number) {
        this.w += dw;
        this.h += dh;
        this.adjustBoundary();

        return this;
    }

    /**
     * Adds the specified padding to the rectangle's bounds. This Rectangle's width
     * will become this.width + dw. The Rectangle's height will become this.height + dh.
     * The top left corner moves -dw/2, -dh/2
     *
     * @param {Number} dw  Amount by which width is to be resized
     * @param {Number} dh  Amount by which height is to be resized
     * @returns  {this}
     **/
    scale (dw: number, dh: number) {
        this.w += (dw);
        this.h += (dh);
        this.x -= (dw / 2);
        this.y -= (dh / 2);
        this.adjustBoundary();

        return this;
    }

    /**
     * Translate the rectangle with the given x/y coordiante.
     *
     * @param {draw2d.geo.Point|Number} x the x translation or the complete point to translate
     * @param {Number} [y] the y translation. Required if x is a simple number instead of a draw2d.geo.Point
     *
     *
     * @since 5.6.0
     * @returns  {this}
     */
    translate (x: number, y?: number) {
        let other = new Point(x, y);
        this.x += other.x;
        this.y += other.y;
        this.adjustBoundary();

        return this;
    }


    /**
     *
     * Returns a copy of the translated rectangle
     *
     * @param {draw2d.geo.Point|Number} x the x translation or the complete point to translate
     * @param {Number} [y] the y translation. Required if x is a simple number instead of a draw2d.geo.Point
     *
     * @returns {draw2d.geo.Rectangle} The new translated rectangle.
     * @since 5.6.0
     */
    translated (x: Point, y?: number): Point | Rectangle {
        let other = new Point(x, y);
        return new Rectangle(this.x + other.x, this.y + other.y, this.w, this.h);
    }


    /**
     * Sets the parameters of this Rectangle from the Rectangle passed in and
     * returns this for convenience.<br>
     * <br>
     * The method return the object itself. This allows you to do command chaining, where
     * you can perform multiple methods on the same elements.
     *
     * @returns  {this}
     * @param rect
     */
    setBounds (rect: Rectangle) {
        this.setPosition(rect.x, rect.y);

        this.w = rect.w;
        this.h = rect.h;

        return this;
    }

    /**
     *
     * Returns <code>true</code> if this Rectangle's width or height is less than or
     * equal to 0.
     *
     * @returns {Boolean}
     */
    isEmpty () {
        return this.w <= 0 || this.h <= 0;
    }

    /**
     *
     * The width of the dimension element.
     *
     * @returns {Number}
     **/
    getWidth () {
        return this.w;
    }

    /**
     *
     * Set the new width of the rectangle.
     *
     * @param {Number} w the new width of the rectangle
     * @returns  {this}
     */
    setWidth (w: number) {
        this.w = w;
        this.adjustBoundary();

        return this;
    }

    /**
     *
     * The height of the dimension element.
     *
     * @returns {Number}
     **/
    getHeight () {
        return this.h;
    }

    /**
     *
     * Set the new height of the rectangle.
     *
     * @param {Number} h the new height of the rectangle
     * @returns  {this}
     */
    setHeight (h: number) {
        this.h = h;
        this.adjustBoundary();

        return this;
    }

    /**
     *
     * The x coordinate of the left corner.
     *
     * @returns {Number}
     **/
    getLeft () {
        return this.x;
    }

    /**
     *
     * The x coordinate of the right corner.
     *
     * @returns {Number}
     **/
    getRight () {
        return this.x + this.w;
    }

    /**
     *
     * The y coordinate of the top.
     *
     *@return {Number}
     **/
    getTop () {
        return this.y;
    }

    /**
     *
     * The y coordinate of the bottom.
     *
     *@return {Number}
     **/
    getBottom () {
        return this.y + this.h;
    }

    /**
     *
     * The top left corner of the dimension object.
     *
     * @returns {draw2d.geo.Point} a new point objects which holds the coordinates
     **/
    getTopLeft () {
        return new Point(this.x, this.y);
    }

    /**
     *
     * The top center coordinate of the dimension object.
     *
     * @returns {draw2d.geo.Point} a new point objects which holds the coordinates
     **/
    getTopCenter () {
        return new Point(this.x + (this.w / 2), this.y);
    }

    /**
     *
     * The top right corner of the dimension object.
     *
     * @returns {draw2d.geo.Point} a new point objects which holds the coordinates
     **/
    getTopRight () {
        return new Point(this.x + this.w, this.y);
    }

    /**
     *
     * The center left  of the dimension object.
     *
     * @returns {draw2d.geo.Point} a new point objects which holds the coordinates
     **/
    getCenterLeft () {
        return new Point(this.x, this.y + (this.h / 2));
    }

    /**
     *
     * The center right  of the dimension object.
     *
     * @returns {draw2d.geo.Point} a new point objects which holds the coordinates
     **/
    getCenterRight () {
        return new Point(this.x+ this.w, this.y + (this.h / 2));
    }


    /**
     *
     * The bottom left corner of the dimension object.
     *
     * @returns {draw2d.geo.Point} a new point objects which holds the coordinates
     **/
    getBottomLeft () {
        return new Point(this.x, this.y + this.h);
    }

    /**
     *
     * The bottom center coordinate of the dimension object.
     *
     * @returns {draw2d.geo.Point} a new point objects which holds the coordinates
     **/
    getBottomCenter () {
        return new Point(this.x + (this.w / 2), this.y + this.h);
    }

    /**
     *
     * The center of the dimension object
     *
     * @returns {draw2d.geo.Point} a new point which holds the center of the object
     **/
    getCenter () {
        return new Point(this.x + this.w / 2, this.y + this.h / 2);
    }


    /**
     *
     * Bottom right corner of the object
     *
     * @returns {draw2d.geo.Point} a new point which holds the bottom right corner
     **/
    getBottomRight () {
        return new Point(this.x + this.w, this.y + this.h);
    }

    /**
     *
     * Return all points of the rectangle as array. Starting at topLeft and the
     * clockwise.
     *
     * @returns {draw2d.util.ArrayList} the points starting at top/left and the clockwise
     */
    getVertices () {
        let result = new ArrayList();
        // don't change the order. We expect always that the top left corner has index[0]
        // and goes clock wise
        //
        result.add(this.getTopLeft());
        result.add(this.getTopRight());
        result.add(this.getBottomRight());
        result.add(this.getBottomLeft());

        return result;
    }

    /**
     *
     * Return a new rectangle which fits into this rectangle. <b>ONLY</b> the x/y coordinates
     * will be changed. Not the dimension of the given rectangle.
     *
     * @param {draw2d.geo.Rectangle} rect the rectangle to adjust
     * @returns the new shifted rectangle
     */
    moveInside (rect: Rectangle) {
        let newRect = new Rectangle(rect.x, rect.y, rect.w, rect.h);
        // shift the coordinate right/down if coordinate not inside the rect
        //
        newRect.x = Math.max(newRect.x, this.x);
        newRect.y = Math.max(newRect.y, this.y);

        // ensure that the right border is inside this rect (if possible).
        //
        if (newRect.w < this.w) {
            newRect.x = Math.min(newRect.x + newRect.w, this.x + this.w) - newRect.w;
        } else {
            newRect.x = this.x;
        }

        // ensure that the bottom is inside this rectangle
        //
        if (newRect.h < this.h) {
            newRect.y = Math.min(newRect.y + newRect.h, this.y + this.h) - newRect.h;
        } else {
            newRect.y = this.y;
        }

        return newRect;
    }

    /**
     *
     * Return the minimum distance of this rectangle to the given {@link draw2d.geo.Point} or
     * {link draw2d.geo.Rectangle}.
     *
     * @param {draw2d.geo.Point|draw2d.geo.Rectangle} pointOrRectangle the reference point/rectangle for the distance calculation
     */
    getDistance (pointOrRectangle: Point | Rectangle) {
        let cx = this.x;
        let cy = this.y;
        let cw = this.w;
        let ch = this.h;

        let ox = pointOrRectangle.x;
        let oy = pointOrRectangle.getY();
        let ow = 1;
        let oh = 1;

        if (pointOrRectangle instanceof Rectangle) {
            ow = pointOrRectangle.getWidth();
            oh = pointOrRectangle.getHeight();
        }
        let oct = 9;

        // Determin Octant
        //
        // 0 | 1 | 2
        // __|___|__
        // 7 | 9 | 3
        // __|___|__
        // 6 | 5 | 4

        if (cx + cw <= ox) {
            if ((cy + ch) <= oy) {
                oct = 0;
            } else if (cy >= (oy + oh)) {
                oct = 6;
            } else {
                oct = 7;
            }
        } else if (cx >= ox + ow) {
            if (cy + ch <= oy) {
                oct = 2;
            } else if (cy >= oy + oh) {
                oct = 4;
            } else {
                oct = 3;
            }
        } else if (cy + ch <= oy) {
            oct = 1;
        } else if (cy >= oy + oh) {
            oct = 5;
        } else {
            return 0;
        }


        // Determine Distance based on Quad
        //
        switch (oct) {
            case 0:
                cx = (cx + cw) - ox;
                cy = (cy + ch) - oy;
                return -(cx + cy);
            case 1:
                return -((cy + ch) - oy);
            case 2:
                cx = (ox + ow) - cx;
                cy = (cy + ch) - oy;
                return -(cx + cy);
            case 3:
                return -((ox + ow) - cx);
            case 4:
                cx = (ox + ow) - cx;
                cy = (oy + oh) - cy;
                return -(cx + cy);
            case 5:
                return -((oy + oh) - cy);
            case 6:
                cx = (cx + cw) - ox;
                cy = (oy + oh) - cy;
                return -(cx + cy);
            case 7:
                return -((cx + cw) - ox);
        }

        throw "Unknown data type of parameter for distance calculation in draw2d.geo.Rectangle.getDistance(..)";
    }


    /**
     *
     * Determin the octant of r2 in relation to this rectangle.
     * <pre>
     *
     *    0 | 1 | 2
     *    __|___|__
     *    7 | 8 | 3
     *    __|___|__
     *    6 | 5 | 4
     * </pre>
     *
     * @param {draw2d.geo.Rectangle} r2
     *
     */
    determineOctant (r2: Rectangle | Point) {
        let HISTERESE = 3; // Toleranz um diese vermieden wird, dass der Octant "8" zurückgegeben wird

        let ox = this.x + HISTERESE;
        let oy = this.y + HISTERESE;
        let ow = this.w - (HISTERESE * 2);
        let oh = this.h - (HISTERESE * 2);

        let cx = r2.x;
        let cy = r2.y;
        let cw = 2;
        let ch = 2;
        if (r2 instanceof Rectangle) {
            cw = r2.w;
            ch = r2.h;
        }

        let oct = 0;

        if (cx + cw <= ox) {
            if ((cy + ch) <= oy) {
                oct = 0;
            } else if (cy >= (oy + oh)) {
                oct = 6;
            } else {
                oct = 7;
            }
        } else if (cx >= ox + ow) {
            if (cy + ch <= oy) {
                oct = 2;
            } else if (cy >= oy + oh) {
                oct = 4;
            } else {
                oct = 3;
            }
        } else if (cy + ch <= oy) {
            oct = 1;
        } else if (cy >= oy + oh) {
            oct = 5;
        } else {
            oct = 8;
        }

        return oct;
    }


    /**
     *
     * Returns the direction the point <i>p</i> is in relation to the given rectangle.
     * Util method for inherit router implementations.
     *
     * <p>
     * Possible values:
     * <ul>
     *   <li>up -&gt; 0</li>
     *   <li>right -&gt; 1</li>
     *   <li>down -&gt; 2</li>
     *   <li>left -&gt; 3</li>
     * </ul>
     * <p>
     *
     * @param {draw2d.geo.Point} other the point in relation to the given rectangle
     *
     * @returns {Number} the direction from <i>r</i> to <i>p</i>
     */
    getDirection (other: Point) {
        let current = this.getTopLeft();
        switch (this.determineOctant(other)) {
            case 0:
                if ((current.x - other.x) < (current.y - other.y))
                    return Direction.UP;
                return Direction.LEFT;
            case 1:
                return Direction.UP;
            case 2:
                current = this.getTopRight();
                if ((other.x - current.x) < (current.y - other.y))
                    return Direction.UP;
                return Direction.RIGHT;
            case 3:
                return Direction.RIGHT;
            case 4:
                current = this.getBottomRight();
                if ((other.x - current.x) < (other.y - current.y))
                    return Direction.DOWN;
                return Direction.RIGHT;
            case 5:
                return Direction.DOWN;
            case 6:
                current = this.getBottomLeft();
                if ((current.x - other.x) < (other.y - current.y))
                    return Direction.DOWN;
                return Direction.LEFT;
            case 7:
                return Direction.LEFT;
            case 8:
                if (other.y > this.y) {
                    return Direction.DOWN;
                }
                return Direction.UP;

        }
        return Direction.UP;
    }


    /**
     *
     * Compares two rectangle objects
     *
     * @param {draw2d.geo.Rectangle} o
     *
     * @returns {Boolean}
     **/
    equals (o: Rectangle) {
        return this.x == o.x && this.y == o.y && this.w == o.w && this.h == o.h;
    }

    /**
     *
     * Detect whenever the hands over coordinate is inside the rectangle.
     *
     * @param {Number/draw2d.geo.Point} iX
     * @param {Number} iY
     * @returns {Boolean}
     */
    hitTest (iX: number | Point, iY?: number) {
        if (iX instanceof Point) {
            iY = iX.y;
            iX = iX.x;
        }
        let iX2 = this.x + this.getWidth();
        let iY2 = this.y + this.getHeight();
        return (iX >= this.x && iX <= iX2 && iY >= this.y && iY <= iY2);
    }

    /**
     *
     * return true if this rectangle inside the hand over rectangle
     *
     *
     * @param {draw2d.geo.Rectangle} rect
     * @returns {Boolean}
     */
    isInside (rect: Rectangle) {
        return rect.hitTest(this.getTopLeft())
            && rect.hitTest(this.getTopRight())
            && rect.hitTest(this.getBottomLeft())
            && rect.hitTest(this.getBottomRight());
    }

    /**
     *
     * return true if this rectangle contains the hand over rectangle.
     *
     *
     * @param {draw2d.geo.Rectangle} rect
     * @returns {Boolean}
     * @since 4.7.2
     */
    contains (rect: Rectangle) {
        return this.hitTest(rect.getTopLeft())
            && this.hitTest(rect.getTopRight())
            && this.hitTest(rect.getBottomLeft())
            && this.hitTest(rect.getBottomRight());
    }

    /**
     *
     * checks whenever the rectangles has an intersection.
     *
     * @param {draw2d.geo.Rectangle} rect
     * @returns {Boolean}
     */
    intersects (rect: Rectangle) {
        let x11 = rect.x,
            y11 = rect.y,
            x12 = rect.x + rect.w,
            y12 = rect.y + rect.h,
            x21 = this.x,
            y21 = this.y,
            x22 = this.x + this.w,
            y22 = this.y + this.h;

        let x_overlap = Math.max(0, Math.min(x12, x22) - Math.max(x11, x21));
        let y_overlap = Math.max(0, Math.min(y12, y22) - Math.max(y11, y21));

        return x_overlap * y_overlap !== 0;
    }

    /**
     * Merge this rectangle with the given one.
     *
     * @param {draw2d.geo.Rectangle} rect
     * @since 4.8.0
     * @returns  {this}
     */
    merge (rect: Rectangle) {
        let r = Math.max(rect.getRight(), this.getRight());
        let b = Math.max(rect.getBottom(), this.getBottom());

        this.setPosition(Math.min(this.x, rect.x), Math.min(this.y, rect.y));

        this.w = r - this.x;
        this.h = b - this.y;

        return this;
    }

    /**
     *
     * returns the intersection points with the given line if any exists
     *
     * @param {draw2d.geo.Point} start
     * @param {draw2d.geo.Point} end
     */
    intersectionWithLine (start: Point, end: Point) {
        let result = new ArrayList();
        let v = this.getVertices();
        v.add(v.first());
        let p1 = v.first();
        let p2 = null;
        for (let i = 1; i < 5; i++) {
            p2 = v.get(i);
            p1 = Line.intersection(start, end, p1, p2);
            if (p1 !== null) {
                result.add(p1);
            }
            p1 = p2;
        }
        return result;
    }

    /**
     *
     * Returns a copy of this rectangle
     *
     *
     * @returns {draw2d.geo.Rectangle}
     * @since 5.6.0
     */
    clone () {
        return new Rectangle(this.x, this.y, this.w, this.h);
    }

    /**
     *
     * converts the rectangle to JSON representation. required for the draw2d.io.Writer
     *
     * @returns {Object}
     */
    toJSON () {
        return {
            width: this.w,
            height: this.h,
            x: this.x,
            y: this.y
        };
    }
}

export default Rectangle;
