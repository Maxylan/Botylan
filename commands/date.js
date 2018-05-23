module.exports = {
    name: "date",
    description: "Gives you the current date and time",
    perm: 1,
    execute(message, args, t1Commands, t2Commands, t3Commands) {
        d = new Date();
        d.toUTCString();
        message.reply("Current date & time is:\n" + "" + d);
    },
};