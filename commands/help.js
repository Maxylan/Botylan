module.exports = {
    name: "help",
    description: "Brings up a list of available commands.",
    perm: 1,
    execute(message, args, t1Commands, t2Commands, t3Commands) {
        if (args[0] === "1") {
            let mBody = [];
            for (let i = 0; i < t1Commands.length; (i += 2)) {
                if (i === (t1Commands.length - 1)) {
                    mBody.push(("**" + t1Commands[i] + ":**\n" + t1Commands[(i + 1)] + " \n"));
                    message.channel.send("**Help** - *Commands*\n\n" + mBody);
                }
                else { mBody.push(("**" + t1Commands[i] + ":**\n" + t1Commands[(i + 1)] + " \n")); }
            }
        }
        if (args[0] === "2" || args[0] === "mod" || args[0] === "moderator") {
            let mBody = [];
            for (let i = 0; i < t2Commands.length; (i += 2)) {
                if (i === (t2Commands.length - 1)) {
                    mBody.push(("**" + t2Commands[i] + ":**\n" + t2Commands[(i + 1)] + " \n"));
                    message.channel.send("**Help** - *Moderator Commands*\n\n" + mBody);
                }
                else { mBody.push(("**" + t2Commands[i] + ":**\n" + t2Commands[(i + 1)] + " \n")); }
            }
        }
        if (args[0] === "3" || args[0] === "admin" || args[0] === "owner") {
            let mBody = [];
            for (let i = 0; i < t3Commands.length; (i += 2)) {
                if (i === (t3Commands.length - 1)) {
                    mBody.push(("**" + t3Commands[i] + ":**\n" + t3Commands[(i + 1)] + " \n"));
                    message.channel.send("**Help** - *God-mode Admin Commands*\n\n" + mBody);
                }
                else { mBody.push(("**" + t3Commands[i] + ":**\n" + t3Commands[(i + 1)] + " \n")); }
            }
        }
        else {
            let mBody = [];
            for (let i = 0; i <= t1Commands.length; (i += 2)) {
                if (i === (t1Commands.length - 1)) {
                    mBody.push(("**" + t1Commands[i] + ":**\n" + t1Commands[(i + 1)] + " \n"));
                    message.channel.send("**Help** - *Commands*\n\n" + mBody);
                }
                else { mBody.push(("**" + t1Commands[i] + ":**\n" + t1Commands[(i + 1)] + " \n")); }
            }
        }
    },
};