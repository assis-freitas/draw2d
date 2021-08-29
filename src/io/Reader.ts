/**
 * @class
 * Template class for general import of a document into the canvas.
 *
 * @author andreas Herz
 */
abstract class Reader {
    /**
     *
     *
     * Restore the canvas from a given String.
     *
     * @param {draw2d.Canvas} canvas the canvas to restore
     * @param {Object} document the document to read
     *
     * @returns {draw2d.util.ArrayList} the added elements
     * @template
     */
    abstract unmarshal(canvas, document);
}

export default Reader;
