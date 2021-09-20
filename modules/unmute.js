const { GroupSettingChange, MessageType } = require('@adiwajshing/baileys');

module.exports = {
    name: 'unmute',
    description: 'Unmute',
    extendedDescription: 'Unmute non-admin members of the group.',
    async handle(client, chat, BotsApp, args) {
        if(!BotsApp.isGroup) {
            client.sendMessage(BotsApp.from, "*.unmute*  ```command is only applicable for a group chat.```", MessageType.text);
            return;
        }
        if(!BotsApp.isBotGroupAdmin) {
            client.sendMessage(BotsApp.from, "```Sorry, dont have the permissions to do so since I am not an admin.```", MessageType.text);
            return;
        }
        client.groupSettingChange(BotsApp.from, GroupSettingChange.messageSend, false);
        client.sendMessage(BotsApp.from, "```Chat permissions changed to```  *all group members*.", MessageType.text);
    }
};