const { MessageType } = require("@adiwajshing/baileys")

module.exports = {
    name: "invite",
    description: "OOF",
    extendedDescription: "Not OOOf",
    async handle(client, chat, BotsApp, args) {
        if (!BotsApp.isGroup) {
            client.sendMessage(BotsApp.from, "*This is not a group. 😑*", MessageType.text);
            return;
        }
        if (!BotsApp.isBotGroupAdmin) {
            client.sendMessage(BotsApp.from, "*I am not group admin.*", MessageType.text);
            return;
        }
        const code = await client.groupInviteCode(BotsApp.from);
        client.sendMessage(BotsApp.from, 'https://chat.whatsapp.com/' + code, MessageType.text);
        return;
    }
}