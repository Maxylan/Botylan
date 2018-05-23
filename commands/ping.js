module.exports = {
    name: "ping",
    description: "Ping!",
    perm: 1,
    execute(message, args, t1Commands, t2Commands, t3Commands) {
        message.channel.send("Hey");
    },
};