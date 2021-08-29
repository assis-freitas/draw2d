/**
 * @class
 *
 * A CommandCollection works as a single command. You can add more than one
 * Command to this CommandCollection and execute/undo them onto the CommandStack as a
 * single Command.
 *
 * @inheritable
 * @author Andreas Herz
 *
 * @extends draw2d.command.Command
 */
import Configuration from "../Configuration";
import Command from "./Command";
import ArrayList from "../util/ArrayList";

class CommandCollection extends Command {
    private commands;

    /**
     * Create a new CommandConnect objects which can be execute via the CommandStack.
     *
     * @param {String} [commandLabel] the label to show on the command stack for the undo/redo operation
     */
    constructor(private commandLabel?: string) {
        super((!commandLabel) ? Configuration.i18n.command.collection : commandLabel);

        this.commands = new ArrayList();
    }

    /**
     *
     * Returns a label of the Command. e.g. "move figure".
     *
     * @returns {String} the label for this command
     **/
    getLabel() {
        //return the label of the one and only command
        //
        if (this.commands.getSize() === 1) {
            return this.commands.first().getLabel()
        }

        // return a common label if all commands have the same label.
        //
        if (this.commands.getSize() > 1) {
            let labels = this.commands.clone().map(function (e) {
                return e.getLabel()
            })
            labels.unique()
            if (labels.getSize() === 1) {
                return labels.first()
            }
        }
    }


    /**
     *
     * Add a command to the collection.
     *
     * @param {draw2d.command.Command} command
     */
    add(command: any) {
        this.commands.add(command)
    }

    /**
     *
     * Returns [true] if the command can be execute and the execution of the
     * command modifies the model. e.g.: a CommandMove with [startX,startX] == [endX,endY] should
     * return false. The execution of this Command doesn't modify the model.
     *
     * @returns {Boolean}
     **/
    canExecute() {
        // We ask all cmd's if they make any changes.
        // Keep in mind: the command will be execute if at least ONE command return [true]!!!!
        // doesn't matter if the other commands return [false].
        // The method should be renamed into: modifiesTheModel()....design flaw.
        let canExec = false
        this.commands.each((i, cmd) => {
            canExec = canExec || cmd.canExecute()
        })
        return canExec
    }

    /**
     *
     * Execute the command the first time
     *
     **/
    execute() {
        this.commands.each((i, cmd) => {
            cmd.execute()
        })
    }

    /**
     *
     * Redo the command after the user has undo this command.
     *
     **/
    redo() {
        this.commands.each((i, cmd) => {
            cmd.redo()
        })
    }

    /**
     *
     * Undo the command.
     *
     **/
    undo() {
        // execute the undo operation in reverse direction.

        this.commands.reverse()
        this.commands.each((i, cmd) => {
            cmd.undo()
        })
        this.commands.reverse()
    }
}

export default CommandCollection;
