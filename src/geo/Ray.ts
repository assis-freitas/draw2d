/**
 * @class
 * Represents a vector within 2-dimensional Euclidean space.
 *
 * @inheritable
 * @extends draw2d.geo.Point
 * @author Andreas Herz
 */
import Point from "./Point";


class Ray extends Point {
    isHorizontal()
    {
        return this.x != 0;
    }

    similarity( otherRay: Ray)
    {
        return Math.abs(this.dot(otherRay));
    }

    getAveraged(otherRay: Ray)
    {
        return new Ray((this.x + otherRay.x) / 2, (this.y + otherRay.y) / 2);
    }
}

export default Ray;
