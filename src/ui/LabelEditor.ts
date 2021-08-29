


/**
 * @class
 *
 * Base class for all draw2d.shape.basic.Label editors. The default implementation is to open
 * a simple javascript prompt dialog.<br>
 * Use LabelInplaceEditor or your own implementation if you need more comfort.
 *
 * @example
 *
 *    let label =  new draw2d.shape.basic.Label({text:"Double Click on me"});
 *
 *    label.installEditor(new draw2d.ui.LabelEditor({
 *       // called after the value has been set to the LabelFigure
 *       onCommit: $.proxy(function(value){
 *           alert("new value set to:"+value);
 *       },this),
 *       // called if the user abort the operation
 *       onCancel(){
 *       }
 *    }));
 *
 *    canvas.add(label,50,10);
 *
 *
 * @author Andreas Herz
 */
class LabelEditor {
    private configuration: any;
   /**
     *
     * @param {Object} attr callback handler and configuration. **{ onCommit:function(){}}, onCancel(){}, onStart(){}, text:'My Dialog Title' }**
     */
    constructor(attr: any) {
      // register some default listener and override this with the handover one
      this.configuration = extend({
          onCommit () {
          }          onCancel () {
          }          onStart () {
          }          text: "Value"
        }        attr)
    }

    /**
     *
     * Trigger the edit of the label text.
     *
     * @param {draw2d.shape.basic.Label} label the label to edit
     */
    start(label) {
      this.configuration.onStart()
      let newText = prompt(this.configuration.text, label.getText())
      if (newText) {
        let cmd = new draw2d.command.CommandAttr(label, {text: newText})
        label.getCanvas().getCommandStack().execute(cmd)

        this.configuration.onCommit(label.getText())
      } else {
        this.configuration.onCancel()
      }
    }
  }

  export default LabelEditor;
