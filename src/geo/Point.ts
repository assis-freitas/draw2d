/**
 * Represents a point (x, y) in 2-dimensional space.
 *
 * @class
 */
import Rectangle from "./Rectangle";
import PositionConstants from "./PositionConstants";

class Point {
    private _x: number | Point;
    public y: number;
    protected bx: number;
    protected by: number;
    protected bw: number;
    protected bh: number;
    /**
     * Creates a new Point object with the hands over coordinates.
     *
     * @param {Number|draw2d.geo.Point} x
     * @param {Number} y
     */
    constructor(x: number|Point, y: number) {
        if (x instanceof Point) {
            this._x = x.x;
            this.y = x.y;
        }
        else {
            this._x = x;
            this.y = y;
        }


        // limit for the maxi/minimum boundary of this rectangle
        // It is not possible that the rect leave the boundary if set.
        this.bx = null;
        this.by = null;
        this.bw = null;
        this.bh = null;
    }

    /**
     *
     * Ensure the boundary of the rectangle. If set, the rectangle keeps always inside
     * the boundary. It is like a virtual fence.
     *
     * @returns {this}
     */
    setBoundary (bx: number | Rectangle, by: number, bw: number, bh: number) {
        if (bx instanceof Rectangle) {
            this.bx = bx.x
            this.by = bx.y
            this.bw = bx.w
            this.bh = bx.h
        } else {
            this.bx = bx
            this.by = by
            this.bw = bw
            this.bh = bh
        }

        this.adjustBoundary()

        return this
    }


    /**
     *
     * @private
     * @returns {this}
     */
    adjustBoundary () {
        if (this.bx === null) {
            return this
        }

        this.x = Math.min(Math.max(this.bx, this.x), this.bw)
        this.y = Math.min(Math.max(this.by, this.y), this.bh)

        return this
    }

    /**
     *
     * Moves this Rectangle horizontally by dx and vertically by dy, then returns
     * this Rectangle for convenience.<br>
     * <br>
     * The method return the object itself. This allows you to do command chaining, where
     * you can perform multiple methods on the same elements.
     *
     * @param {Number} dx  Shift along X axis
     * @param {Number} dy  Shift along Y axis
     * @returns {this}
     **/
    translate (dx: number, dy: number) {
        this.x += dx
        this.y += dy
        this.adjustBoundary()

        return this
    }

    /**
     *
     * The X value of the point
     *
     * @since 0.1
     * @returns {Number} The x coordinate of the top left corner
     */
    get x(): number {
        if (this._x instanceof Point) {
            return this._x.x;
        }

        return this._x;
    }

    set x(x: number) {
        this._x = x;
    }

    /**
     *
     * The y value of the point
     *
     * @returns {Number} The y coordinate of the top left corner
     */
    getY () {
        return this.y
    }

    /**
     *
     * Set the new X value of the point
     *
     * @param {Number} x the new x coordinate of the rect
     * @returns {this}
     */
    setX (x: number) {
        this.x = x
        this.adjustBoundary()

        return this
    }

    /**
     *
     * Set the new Y value of the point
     *
     * @param {Number} y the new y coordinate of the rect
     * @returns {this}
     */
    setY (y: number) {
        this.y = y
        this.adjustBoundary()

        return this
    }

    /**
     *
     * Set the new x/y coordinates of this point
     *
     * @param {Number|draw2d.geo.Point} x
     * @param {Number} [y]
     * @returns {this}
     */
    setPosition (x: number | Point, y: number) {
        if (x instanceof Point) {
            this.x = x.x
            this.y = x.y
        }
        else {
            this.x = x
            this.y = y
        }
        this.adjustBoundary()

        return this
    }

    /**
     *
     * Calculates the relative position of the specified Point to this Point.
     *
     * @param {draw2d.geo.Point} p The reference Point
     * @returns {Number} NORTH, SOUTH, EAST, or WEST, as defined in {@link draw2d.geo.PositionConstants}
     */
    getPosition (p: Point) {
        let dx = p.x - this.x
        let dy = p.y - this.y
        if (Math.abs(dx) > Math.abs(dy)) {
            if (dx < 0)
                return PositionConstants.WEST
            return PositionConstants.EAST
        }
        if (dy < 0) {
            return PositionConstants.NORTH
        }
        return PositionConstants.SOUTH
    }

    /**
     *
     * Compares two points and return [true] if x and y are equals.
     *
     * @param {draw2d.geo.Point} p the point to compare with
     *
     * @returns {Boolean} True if the given p[x,y] has an exact match with the point
     */
    equals (p: Point) {
        return this.x === p.x && this.y === p.y
    }

    /**
     *
     * Return the distance between this point and the hands over.
     *
     * @param {draw2d.geo.Point} other the point to use
     * @returns {Number} The distance to the given point
     */
    distance (other: Point) {
        return Math.sqrt((this.x - other.x) * (this.x - other.x) + (this.y - other.y) * (this.y - other.y))
    }
    /* @deprecated */
    getDistance (other: Point) {
        return this.distance(other)
    }


    /**
     *
     * Return the length of the vector measured from [0,0]
     *
     * @returns {Number} The length of the vector [0,0][x,y]
     * @since 2.10.0
     */
    length () {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    /**
     *
     * Return a new Point translated with the x/y values of the hands over point.
     *
     * @param {draw2d.geo.Point|Number} x the x translation or the complete point to translate
     * @param {Number} [y] the y translation. Required if x is a simple number instead of a draw2d.geo.Point
     * @returns {draw2d.geo.Point} A instance of a translated point.
     */
    translated (x: Point | number, y: number): Point | Rectangle {
        let other = new Point(x, y)
        return new Point(this.x + other.x, this.y + other.y)
    }

    /**
     *
     * Scales this point with the handover factor
     *
     * @param {Number} factor the factor to scaled the point.
     * @param dh
     * @returns {this}
     */
    scale (factor: number, dh?: number) {
        this.x *= factor
        this.y *= factor
        this.adjustBoundary()

        return this
    }

    /**
     *
     * Return a **new** Point scaled with the givben factor
     *
     * @param {Number} factor the factor to scaled the new point.
     * @returns {draw2d.geo.Point} The new translated point.
     */
    scaled (factor: number) {
        return new Point(this.x * factor, this.y * factor)
    }

    /* @deprecated */
    getScaled (factor: number) {
        return this.scaled(factor)
    }

    /**
     *
     * Return an objects with all important attributes for XML or JSON serialization
     *
     * @returns {Object}
     */
    getPersistentAttributes () {
        return {
            x: this.x,
            y: this.y
        }
    }

    /**
     *
     * Read all attributes from the serialized properties and transfer them into the shape.
     *
     * @param {Object} memento
     * @returns {this}
     */
    setPersistentAttributes (memento: any) {
        this.x = memento.x
        this.y = memento.y

        return this
    }

    /**
     *
     * substract the given point and return the **new** point.
     *
     * @param that
     * @returns {draw2d.geo.Point}
     */
    subtract (that: Point) {
        return new Point(this.x - that.x, this.y - that.y)
    }


    dot (that: Point) {
        return this.x * that.x + this.y * that.y
    }

    cross (that: Point) {
        return this.x * that.y - this.y * that.x
    }


    lerp (that: Point, t: number) {
        return new Point(this.x + (that.x - this.x) * t, this.y + (that.y - this.y) * t)
    }


    /**
     *
     * Return a cloned point
     *
     * @returns {draw2d.geo.Point}
     */
    clone () {
        return new Point(this.x, this.y)
    }
}


export default Point;
