
/**
 * @class
 *  An object to which a {@link draw2d.Connection} will be anchored.
 *
 * @inheritable
 * @author Andreas Herz
 */

class ConnectionAnchor {
    private owner: any;

    /**
    *
    * @param {draw2d.Figure} owner the figure to use for the anchor calculation
    */
    constructor (owner: any) {
    this.owner = owner
    }

  /**
   *
   * Returns the location where the Connection should be anchored in absolute coordinates.
   * The anchor may use the given reference Point to calculate this location.
   *
   * @param {draw2d.geo.Point} reference the opposite reference point
   * @param {draw2d.Connection} inquiringConnection the connection who ask for the location.
   *
   * @returns {draw2d.geo.Point}
   */
  getLocation(reference: any, inquiringConnection: any) {
    // return the center of the owner/port.
    return this.getReferencePoint(inquiringConnection)
  }

  /**
   *
   * Returns the Figure that contains this ConnectionAnchor.
   *
   * @returns {draw2d.Figure} The Figure that contains this ConnectionAnchor
   */
  getOwner() {
    return this.owner
  }

  /**
   *
   * Set the owner of the Anchor.
   *
   * @param {draw2d.Figure} owner the new owner of the anchor locator
   */
  setOwner(owner: any) {
    if (typeof owner === "undefined") {
      throw "Missing parameter for 'owner' in ConnectionAnchor.setOwner"
    }
    this.owner = owner
  }

  /**
   *
   * Returns the bounds of this Anchor's owner.  Subclasses can override this method
   * to adjust the box. Maybe you return the box of the port parent (the parent figure)
   *
   * @returns {draw2d.geo.Rectangle} The bounds of this Anchor's owner
   */
  getBox() {
    return this.getOwner().getAbsoluteBounds()
  }

  /**
   *
   * Returns the reference point for this anchor in absolute coordinates. This might be used
   * by another anchor to determine its own location.
   *
   * @param {draw2d.Connection} [inquiringConnection] the connection who ask for the location.
   *
   * @returns {draw2d.geo.Point} The reference Point
   */
  getReferencePoint(inquiringConnection: any) {
    return this.getOwner().getAbsolutePosition()
  }
}

export default ConnectionAnchor;
