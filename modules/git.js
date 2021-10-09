const {
    MessageType,
    Mimetype
} = require("@adiwajshing/baileys")
const STRINGS = require("../lib/db")
const got = require("got");
const format = require('python-format-js');

module.exports = {
    name: "git",
    description: STRINGS.git.DESCRIPTION,
    extendedDescription: STRINGS.git.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args) {
        let user_name = "";
        if (BotsApp.isReply) {
            user_name = BotsApp.replyMessage;
        }
        else {
            if (args.length == 0) {
                client.sendMessage(BotsApp.chatId, STRINGS.git.NO_ARG_ERROR, MessageType.text);
                return;
            }
            user_name = args[0];
        }
        try {
            let userResponse = await got("https://api.github.com/users/" + user_name);
            let user = JSON.parse(userResponse.body)
            Object.keys(user).forEach(function (key) {
                if (user[key] === null || user[key] === '') {
                    user[key] = 'N/A';
                }
            })
            // console.log(user.name);
            // console.log(user.html_url);
            // console.log(user.type);
            // console.log(user.company);
            // console.log(user.blog);
            // console.log(user.location);
            // console.log(user.bio);
            // console.log(user.followers);
            // console.log(user.following);
            // console.log(user.public_repos);
            // console.log(user.public_gists);
            // console.log(user.created_at);
            // console.log(user.updated_at);
            // console.log(repos);
            let caption = "*👤 Name :* " + user.name + "\n*💻 Link :* " + user.html_url + "\n*🔧 Type :* " + user.type + "\n*🏢 Company :* " + user.company + "\n*🔭 Blog :* " + user.blog + "\n*📍 Location :* " + user.location + "\n*📝 Bio :* " + user.bio + "\n*❤️ Followers :* " + user.followers + "\n*👁️ Following :* " + user.following + "\n*📊 Public Repos :* " + user.public_repos + "\n*📄 Public Gists :* " + user.public_gists + "\n*🔗 Profile Created :* " + user.created_at + "\n*✏️ Profile Updated :* " + user.updated_at;
            if (user.public_repos > 0) {
                let reposResponse = await got(user.repos_url);
                let reposData = JSON.parse(reposResponse.body);
                repos = reposData[0].name;
                for (let i = 1; i < reposData.length && i < 5; i++) {
                    repos += ' | ' + reposData[i].name;

                }
                // console.log(repos);
                caption += "\n*🔍 Some Repos :* " + repos;
            }
            await client.sendMessage(
                BotsApp.chatId,
                { url: user.avatar_url },
                MessageType.image,
                { mimetype: Mimetype.image, caption: caption }
            );
        }
        catch (err) {
            console.log(err);
            client.sendMessage(BotsApp.chatId, STRINGS.git.ERROR_MSG, MessageType.text);
        }
        return;
    }
}