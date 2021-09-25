const { MessageType } = require("@adiwajshing/baileys");
const Strings = require("../lib/db");
const format = require('python-format-js');
const config = require('../config')
const HELP = Strings.help

module.exports = {
    name: "help",
    description: HELP.DESCRIPTION,
    extendedDescription: HELP.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args, commandHandler){
        var prefixes = /\/\^\[(.*)+\]\/\g/g.exec(config.PREFIX)[1];
        console.log("arguments -> ");
        if(!args[0]){
            console.log("Inside loop.")
            var helpMessage = HELP.HEAD;
            commandHandler.forEach(element => {
                helpMessage += HELP.TEMPLATE.format(prefixes[0] + element.name, element.description);
            });
            client.sendMessage(BotsApp.chatId, helpMessage, MessageType.text);
            return;
        }
        var helpMessage = HELP.COMMAND_INTERFACE;
        var command = commandHandler.get(args[0]);
        if(command){
            var triggers = " | "
            prefixes.split("").forEach(prefix => {
                triggers += prefix + command.name + " | "
            });
            helpMessage += HELP.COMMAND_INTERFACE_TEMPLATE.format(triggers, command.extendedDescription);
            const buttonMessage = {
                contentText: helpMessage,
                buttons: [{buttonId: 'id1', buttonText: {displayText: '.alive'}, type: 1}],
                headerType: 1
            }
            client.sendMessage(BotsApp.chatId, buttonMessage, MessageType.buttonsMessage);
            return;
        }
        client.sendMessage(BotsApp.chatId, HELP.COMMAND_INTERFACE + "*Invalid Command. Check the correct name from* ```.help``` *command list.* ", MessageType.text);
    }
}