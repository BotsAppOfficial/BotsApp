const { MessageType, MimetypeMap } = require("@adiwajshing/baileys");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs");
const inputSanitization = require("../sidekick/input-sanitization");
const { JSDOM } = require("jsdom");
const { window } = new JSDOM();

const Strings = require("../lib/db");
const STOI = Strings.stoi;

module.exports = {
    name: "stoi",
    description: STOI.DESCRIPTION,
    extendedDescription: STOI.EXTENDED_DESCRIPTION,
    async handle(client, chat, BotsApp, args) {
        // Task starts here
        var startTime = window.performance.now();

        // Function to convert media to sticker
        const convertToImage = async (stickerId, replyChat) => {
            var downloading = await client.sendMessage(
                BotsApp.chatId,
                STOI.DOWNLOADING,
                MessageType.text
            );

            console.log("StickerMessageId --> " + stickerId);
            const fileName = "./tmp/convert_to_image-" + stickerId;
            const filePath = await client.downloadAndSaveMediaMessage(
                replyChat,
                fileName
            );
            const imagePath = "./tmp/image-" + stickerId + ".jpeg";
            try {
                await ffmpeg(filePath)
                    .save(imagePath)
                    .on("error", function (err, stdout, stderr) {
                        console.log("-------------------\nERROR " + err.message +"\n-------------------");
                        client.sendMessage(
                            BotsApp.chatId,
                            STOI.ANIMATED_STICKER_ERROR,
                            MessageType.text
                        );
                        inputSanitization.deleteFiles(filePath);
                        inputSanitization.performanceTime(startTime);
                        client.deleteMessage(BotsApp.chatId, {
                            id: downloading.key.id,
                            remoteJid: BotsApp.chatId,
                            fromMe: true,
                        });
                        return;
                    })
                    .on("end", async () => {
                        await client.sendMessage(
                            BotsApp.chatId,
                            fs.readFileSync(imagePath),
                            MessageType.image
                        );
                        inputSanitization.deleteFiles(filePath, imagePath);
                        inputSanitization.performanceTime(startTime);
                        return await client.deleteMessage(BotsApp.chatId, {
                            id: downloading.key.id,
                            remoteJid: BotsApp.chatId,
                            fromMe: true,
                        });
                    });
            } catch (err) {
                console.log(err.statuscode);
            }
        };

        // Function to check if sticker is animated
        const isAnimated = async (chatObject) => {
            if (chatObject.message.stickerMessage.isAnimated === true) {
                client.sendMessage(
                    BotsApp.chatId,
                    STOI.ANIMATED_STICKER_ERROR,
                    MessageType.text
                );
                return true;
            } else {
                return false;
            }
        };

        // User sends media message along with command in caption
        if (BotsApp.isSticker) {
            var replyChatObject = {
                message: chat.message,
            };
            // if (isAnimated(replyChatObject)) {
            //     console.log(
            //         "-----------Process terminated because tagged sticker is animated----------"
            //     );
            //     return;
            // }
            var stickerId = chat.key.id;
            convertToImage(stickerId, replyChatObject);
        }
        // Replied to a sticker
        else if (BotsApp.isReplySticker) {
            var replyChatObject = {
                message:
                    chat.message.extendedTextMessage.contextInfo.quotedMessage,
            };

            // if (isAnimated(replyChatObject)) {
            //     console.log(
            //         "-----------Process terminated because tagged sticker is animated----------"
            //     );
            //     return;
            // }
            var stickerId =
                chat.message.extendedTextMessage.contextInfo.stanzaId;
            convertToImage(stickerId, replyChatObject);
        } else {
            client.sendMessage(
                BotsApp.chatId,
                STOI.TAG_A_VALID_STICKER_MESSAGE,
                MessageType.text
            );
            inputSanitization.performanceTime(startTime);
        }
        return;
    },
};