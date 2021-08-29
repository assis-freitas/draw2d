
/**
 * @class
 * A composed connection create policy. Use this to install more than one
 * ConnectionCreatePolicy into the canvas. Normally it is not allowed to install
 * more than one policy from the same type.
 *
 *
 * @author Andreas Herz
 *
 * @extends draw2d.policy.connection.ConnectionCreatePolicy
 */
import draw2d from '../../packages'
import ConnectionCreatePolicy from "./ConnectionCreatePolicy";

class ComposedConnectionCreatePolicy extends ConnectionCreatePolicy {
    /**
     *
     * Creates a new connection create policy instance
     *
     * @param {array} policies the policies to use
     */
    constructor( private policies: any[] )
    {
        super();
    }
    onMouseDown()
    {
        let _arg = arguments;
        this.policies.forEach((p)=>{
            p.onMouseDown.apply(p,_arg);
        });
    }    onMouseDrag()
    {
      let _arg = arguments;
      this.policies.forEach((p)=>{
            p.onMouseDrag.apply(p,_arg);
        });
    }
    onMouseUp()
    {
      let _arg = arguments;
      this.policies.forEach((p)=>{
            p.onMouseUp.apply(p,_arg);
        });
    }
    onClick()
    {
      let _arg = arguments;
      this.policies.forEach((p)=>{
            p.onClick.apply(p,_arg);
        });
    }    onMouseMove()
    {
      let _arg = arguments;
      this.policies.forEach((p)=>{
            p.onMouseMove.apply(p,_arg);
        });
    }
    /**
     * @inheritDoc
     **/
    onKeyUp(canvas, keyCode, shiftKey, ctrlKey)
    {
      let _arg = arguments;
      this.policies.forEach((p)=>{
            p.onKeyUp.apply(p,_arg);
        });
    }
    /**
     * @inheritDoc
     **/
    onKeyDown(canvas, keyCode, shiftKey, ctrlKey)
    {
      let _arg = arguments;
      this.policies.forEach((p)=>{
            p.onKeyDown.apply(p,_arg);
        });
    }
    /**
     *
     * Called if the policy is installed into the canvas.
     *
     * @param {draw2d.Canvas} canvas
     */
    onInstall(canvas)
    {
      let _arg = arguments;
      this.policies.forEach((p)=>{
            p.onInstall.apply(p,_arg);
        });
    }
    /**
     *
     * Called if the policy is deinstalled from the canvas
     *
     * @param {draw2d.Canvas} canvas
     */
    onUninstall(canvas)
    {
      let _arg = arguments;
      this.policies.forEach((p)=>{
            p.onUninstall.apply(p,_arg);
        });
    }

}

export default ComposedConnectionCreatePolicy;

