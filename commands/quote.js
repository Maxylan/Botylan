module.exports = {
    name: "quote",
    description: "Show a quote from a person!",
    perm: 1,
    execute(message, args, fs, t1Commands, t2Commands, t3Commands) {
        let messageCount = -1;
        let quotedUsers = [];
        readData = fs.readFileSync("./private/quote_db.txt", "utf8");
        for (let i = 0; i <= readData.length; i++) {
            if (readData.charAt(i) == "~") {
                ++messageCount;
                let a = readData.indexOf(":", i);
                let userToPush = readData.slice(i + 1, a);
                quotedUsers.push(userToPush);
            }
            else if (i === readData.length) {
                if (readData.charAt(i) == "~") {
                    ++messageCount;
                    let a = readData.indexOf(":", i);
                    let userToPush = readData.slice(i + 1, a);
                    quotedUsers.push(userToPush);
                    theActualCommand();
                }
                theActualCommand();
            }
        }
        function theActualCommand() {
            if (args[0] === "save") {
                if (args[1] != null && args[1] != typeof "object" && args[1].length >= 2 && args[1].length <= 128) {
                    fs.readFile("./private/quote_db.txt", "utf8", (err, data) => {
                        if (data.indexOf(message.author.username) != -1) {
                            let chance = Math.floor((Math.random() * 4) + 1);
                            if (chance === 1) {
                                let x = data.indexOf(message.author.username);
                                let y = data.indexOf("~", x) + 1;
                                oldData = data.slice(x, y);
                                newData = data.slice(0, x) + data.slice(y);
                                fs.writeFileSync("./private/quote_db.txt", newData + message.author.username + ": " + args[1] + "~", "utf8");
                                console.log("- Actively wrote over message \"" + oldData + "\" and saved the new message quote \"" + args[1] + "\" to \"quote_db.txt\"\n");
                                cleanup(message,
                                    ("Saved quote\n*" + message.author.username + " - \"" + args[1] + "\"*"));
                            }
                        }
                        else {
                            fs.writeFileSync("./private/quote_db.txt", data + message.author.username + ": " + args[1] + "~", "utf8", { "flags": "a" });
                            console.log("- Actively saved the message quote \"" + args[1] + "\" to \"quote_db.txt\"\n");
                            cleanup(message,
                                ("Saved quote\n*" + message.author.username + " - \"" + args[1] + "\"*"));
                        }
                    });
                }
                else if (args[1].length <= 2 || args[1].length >= 128) {
                    cleanup(message,
                        ("Quote was ***not*** saved as it was above 128 characters or below 2."));
                }
            }
            else {
                fs.readFile("./private/quote_db.txt", "utf8", (err, data) => {
                    console.log("\n### DEBUG => \n## Random quote being executed. \n# messageCount = \"" + messageCount + "\"\n# quotedUsers: \"" + quotedUsers + "\"\n");
                    let chance = Math.floor((Math.random() * messageCount));
                    let targetUser = quotedUsers[chance];
                    let b = data.indexOf(targetUser);
                    let z = data.indexOf(":", b);
                    let quoteToSend = data.slice(z + 2, data.indexOf("~", b));
                    message.channel.send("*" + targetUser + " - \"" + quoteToSend + "\"*");
                });
            }
        }
    },
};