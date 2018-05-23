module.exports = {
    name: "channel",
    description: "Returns channel-ID into the console.log and current-channel",
    perm: 3,
    execute(message, client, args, lastStartup, cleanup) {
        console.log("Channel ID = " + message.channel);
        cleanup(message,
            ("Channel id is: " + message.channel + " -- *check console log for detailed info*"));
    },
};