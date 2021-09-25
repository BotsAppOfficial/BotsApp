const { MessageType } = require("@adiwajshing/baileys")
const Strings = require("../lib/db")
const format = require('python-format-js');
const alive = Strings.alive

module.exports = {
    name: "alive",
    description: alive.DESCRIPTION,
    extendedDescription: alive.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args){
        client.sendMessage(BotsApp.chatId, alive.ALIVE_MSG.format("Prince"), MessageType.text);
    }
}