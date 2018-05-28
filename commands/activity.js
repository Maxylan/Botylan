module.exports = {
    name: "activity",
    description: "Changes what the bot is \"watching\"",
    perm: 2,
    execute(message, client, args, fs, convosFile, cleanup, filter, switchActivity, activityPresets, aPresetsRand) {

        if (args[0] > 0 && args[0] <= activityPresets.length) {
            parseInt(args[0]);
            args[0] -= 1;
            switchActivity(false, true, args[0], false);
            message.channel.send(message.author.username + " set my activity to:\n*\"Watching " + activityPresets[args[0]] + "\"*");
        }
        else if (args[0] === "next" || args[0] === "switch") {
            switchActivity(false, true, 0, true);
            cleanup(message,
                ("Swtiched to the next activity on-file!"));
        }
        else if (args[0] === "rand" || args[0] === "random") {
            switchActivity(true, true, 0, false);
            cleanup(message,
                ("Current activity randomly switched to:\n*\"Watching " + activityPresets[aPresetsRand] + "\"*"));
        }
        else if (args[0] === "list") {
            let list = [];
            let first = true;
            for (let i = 0; i < activityPresets.length; i++) {
                if (first != false) {
                    list.push(("**" + (i + 1) + ".** \"Watching " + activityPresets[i] + "\""));
                    first = false;
                }
                else {
                    list.push((" **" + (i + 1) + ".** \"Watching " + activityPresets[i] + "\""));
                }
            }
            message.channel.send("**List of all my activities**\nI currently have **" + (activityPresets.length) + "** activities saved on file.\n" + list);
        }
        else if (args[0] === "help") {
            message.channel.send("**Activity** - *Moderator Command*\n*what the bot is currently \"watching\"*\n\n``--activity <list | number | next/switch | rand/random>``\n\nSet what the current activity should be (each activity the bot has saved has a number, currently between **1** and **" + (activityPresets.length + 1) + "** activities saved.\nCan also switch to the next activity or have the bot pick a random one from it's files.");
        }
        else {
            switchActivity(true, true, 0, false);
            cleanup(message,
                ("Current activity randomly switched to:\n*\"Watching " + activityPresets[aPresetsRand] + "\"*"));
        }
    },
};