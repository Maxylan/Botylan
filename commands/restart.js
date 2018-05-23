module.exports = {
    name: "restart",
    description: "Kills Botylan, then brings him back from the dead.",
    perm: 3,
    execute(message, client, args, lastStartup, cleanup) {
        d = new Date();
        d = d.toUTCString();
        console.log("\n !!! USER \"" + message.author.username + "\" INITIATED RESTART !!!");
        console.log("Time: \n" + d);
        console.log("Last Restart: \n" + lastStartup + "\n");
        cleanup(message,
            ("\n**!!! RESTARTING !!!**"));
        let restartTimeout = setTimeout(() => { process.exit(); }, 5750);
    },
};