/**
 * @class
 * Util class to handle colors in the draw2d enviroment.
 *
 * @example
 *     // Create a new Color with RGB values
 *     var color = new draw2d.util.Color(127,0,0);
 *
 *     // of from a hex string
 *     var color2 = new draw2d.util.Color("#f00000");
 *
 *     // Create a little bit darker color
 *     var darkerColor = color.darker(0.2); // 20% darker
 *
 *     // create a optimal text color if 'color' the background color
 *     // (best in meaning of contrast and readability)
 *     var fontColor = color.getIdealTextColor();
 *
 * @param {Number|String|draw2d.util.Color|Array} red
 * @param {Number} green
 * @param {Number} blue
 * @param {Number} [alpha]
 */
import { isStringObject } from "util/types";


class Color {
    private readonly red: number;

    private hashString: string;
    constructor(red: string | number | Color | number[], private readonly green: number, private readonly blue: number, private readonly alpha?: number) {

      this.hashString = null;

      if(!red){
          this.hashString = "none";
      }
      else if(red instanceof Color){
          if(red.hashString==="none"){
              this.hashString = "none";
          }
          else{
              this.red = red.red;
              this.green = red.green;
              this.blue = red.blue;
              this.alpha = red.alpha;
          }
      }
      else if(isStringObject(red))
      {
           if (red === "none") {
              this.hashString = "none";
           }
           else {
              let rgba = this.hex2rgb(red);
              this.red = rgba[0];
              this.green = rgba[1];
              this.blue = rgba[2];
              this.alpha = rgba[3];
          }
      }
      // JSON struct of {red:###, green:###, blue:### }
      else if(typeof red === "object" && typeof (<any>red).red === "number")
      {
          const obj = <any>red;

        this.red= obj.red;
        this.green = obj.green;
        this.blue = obj.blue;
        this.alpha = obj.alpha;
      }
      // array detection 1
      else if(red instanceof Array && red.length===3)
      {
        this.red= red[0];
        this.green = red[1];
        this.blue = red[2];
        this.alpha = red[3];
      }
      // array detection 2
      else if(typeof red === "object" && typeof red.length ==="number" && red.length===3)
      {
        this.red= red[0]
        this.green = red[1]
        this.blue = red[2]
        this.alpha = red[3]
      }
      else
      {
        this.red= <number>red
        this.green = green
        this.blue = blue
        this.alpha = (!alpha) ? 1 : alpha
      }
    }

    /**
     *
     * Convert the color object into a HTML CSS representation
     * @returns {String} the color in rgb(##,##,##) representation
     **/
    getHTMLStyle()
    {
      if(!this.red)
        return "rgba(0,0,0,0)";

      return `rgba(${ this.red }, ${ this.green }, ${ this.blue }, ${ this.alpha })`;
    }

    /**
     *
     * The red part of the color.
     *
     * @returns {Number} the [red] part of the color.
     **/
    getRed()
    {
      return this.red
    }

    /**
     *
     * The green part of the color.
     *
     * @returns {Number} the [green] part of the color.
     **/
    getGreen()
    {
      return this.green;
    }

    /**
     *
     * The blue part of the color
     *
     * @returns {Number} the [blue] part of the color.
     **/
    getBlue()
    {
      return this.blue;
    }

    /**
     *
     * The alpha part of the color
     *
     * @returns {Number} the [alpha] part of the color.
     **/
    getAlpha()
    {
      return this.alpha;
    }
    /**
     *
     * Returns the ideal Text Color. Useful for font color selection by a given background color.
     *
     * @returns {draw2d.util.Color} The <i>ideal</i> inverse color.
     **/
    getIdealTextColor()
    {
       let nThreshold = 105;
       let bgDelta = (this.red * 0.299) + (this.green * 0.587) + (this.blue * 0.114);
       return (255 - bgDelta < nThreshold) ? new  Color(0,0,0) : new Color(255,255,255);
    }
    /**
     * return array of [r,g,b,a] from any valid color. if failed returns [0,0,0,1]
     *
     * @param hexcolor
     * @returns {*}
     */
    hex2rgb(color: string)
    {
      if (!color) {
        return [0, 0, 0, 1]
      }

      if (color.toLowerCase() === 'transparent') {
        return [0, 0, 0, 0]
      }

      if (color[0] === '#'){
        if (color.length < 7){
          // convert #RGB and #RGBA to #RRGGBB and #RRGGBBAA
          color = '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3] + (color.length > 4 ? color[4] + color[4] : '');
        }
        return [parseInt(color.substr(1, 2), 16),
          parseInt(color.substr(3, 2), 16),
          parseInt(color.substr(5, 2), 16),
          color.length > 7 ? parseInt(color.substr(7, 2), 16)/255 : 1]
      }

      if (color.indexOf('rgb') === -1){
        // convert named colors
        let temp_elem = document.body.appendChild(document.createElement('fictum')); // intentionally use unknown tag to lower chances of css rule override with !important
        let flag = 'rgb(1, 2, 3)' // this flag tested on chrome 59, ff 53, ie9, ie10, ie11, edge 14
        temp_elem.style.color = flag
        if (temp_elem.style.color !== flag) {
          return [0, 0, 0, 1] // color set failed - some monstrous css rule is probably taking over the color of our object
        }
        temp_elem.style.color = color

        if (temp_elem.style.color === flag || temp_elem.style.color === '') {
          return [0, 0, 0, 1] // color parse failed
        }
        color = getComputedStyle(temp_elem).color
        document.body.removeChild(temp_elem)
      }

      if (color.indexOf('rgb') === 0) {
        if (color.indexOf('rgba') === -1) {
          color += ',1'; // convert 'rgb(R,G,B)' to 'rgb(R,G,B)A' which looks awful but will pass the regxep below
        }
        return color.match(/[\.\d]+/g).map( a => +a);
      }
    }
    /**
     *
     **/
    hex()
    {
      return(
        this.int2hex(this.red)+
        this.int2hex(this.green)+
        this.int2hex(this.blue)
        // breaks raphaelJS...so don'T use it right now
        //(this.alpha * 255).toString(16).substring(0,2).toUpperCase()
      );
    }

    /**
     *
     * Convert the color object into a HTML CSS representation
     * @returns {String} the color in rgb(##,##,##) representation
     **/
    rgba()
    {
      return this.getHTMLStyle()
    }

    /**
     *
     * Convert the color object into a HTML CSS representation
     * @returns {String} the color in #RRGGBB representation
     **/
    hash()
    {
        if(this.hashString===null){
            this.hashString= "#"+this.hex();
        }
        return this.hashString;
    }
    /**
     * @private
     */
    int2hex(v: number)
    {
      v=Math.round(Math.min(Math.max(0,v),255));
      return("0123456789ABCDEF".charAt((v-v%16)/16)+"0123456789ABCDEF".charAt(v%16));
    }
    /**
     *
     * Returns a darker color of the given one. The original color is unchanged.
     *
     * @param {Number} fraction  Darkness fraction between [0..1].
     * @return{draw2d.util.Color}        Darker color.
     */
    darker(fraction: number)
    {
       // we can't "darker" a undefined color. In this case we return the undefnied color itself
       //
       if(this.hashString==="none")
           return this;

       fraction = (typeof fraction === 'undefined') ? 0.1 : fraction;

       const factor = (1.0 - fraction);

       return this.getColorByFactor(factor);
    }

    /**
     *
     * Make a color lighter. The original color is unchanged.
     *
     * @param {Number} fraction  lighter fraction between [0..1].
     * @returns {draw2d.util.Color} Lighter color.
     */
    lighter( fraction: number)
    {
        // we can't "lighter" a undefined color. In this case we return the undefined color itself
        //
        if(this.hashString==="none")
            return this;

        fraction = (typeof fraction === 'undefined') ? 0.1 : fraction;

        const factor = (1.0 + fraction);

        return this.getColorByFactor(factor);
    }
    /**
     *
     * Return a new color wich is faded to the given color.
     * @param {draw2d.util.Color} color
     * @param {Number} pc the fade percentage in [0..1]
     * @returns {draw2d.util.Color}
     *
     * @since 2.1.0
     */
    fadeTo(color: Color, pc: number){

        let r= Math.floor(this.red+(pc*(color.red-this.red)) + .5);
        let g= Math.floor(this.green+(pc*(color.green-this.green)) + .5);
        let b= Math.floor(this.blue+(pc*(color.blue-this.blue)) + .5);
        let a= Math.floor(this.alpha+(pc*(color.alpha-this.alpha)) + .5);

        return new Color(r,g,b,a);
    }
	/**
	 *
	 * Compares two color objects
	 *
	 * @param {draw2d.util.Color} o
	 * @returns {Boolean}
	 **/
	equals(o: Color)
	{
		if(!(o instanceof Color)){
			return false;
		}

		return this.rgba()===o.rgba();
	}

	private getDefaultValueColor(filter: number) {
        if (filter < 0) {
            return 0;
        } else if (filter > 255) {
            return 255;
        }

        return filter;
    }

    private getColorByFactor(factor: number) {
        let red   = this.getDefaultValueColor(Math.round (this.getRed()   * factor));
        let green = this.getDefaultValueColor(Math.round (this.getGreen() * factor));
        let blue  = this.getDefaultValueColor(Math.round (this.getBlue()  * factor));

        return new Color(red, green, blue, this.alpha);
    }

}

export default Color;
