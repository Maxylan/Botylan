module.exports = {
    name: "quotemessage",
    description: "Let's document",
    execute(message, fs, convosFile, pushGay, gayArray) {
        fs.readFile("./private/quote_db.txt", "utf8", (err, data) => {
            if (err) throw err;
            if (data.indexOf(message.author.username) != -1) {
                console.log("User has a quote saved, rolling if it should be overwritten...");
                let chance = Math.floor((Math.random() * 4) + 1);
                if (chance === 1) {
                    let x = data.indexOf(message.author.username);
                    let y = data.indexOf("~", x) + 1;
                    oldData = data.slice(x, y);
                    newData = data.slice(0, x) + data.slice(y);
                    fs.writeFileSync("./private/quote_db.txt", newData + message.author.username + ": " + message.content + "~", "utf8");
                    console.log("Passively wrote over message \"" + oldData + "\" and saved the new message quote \"" + message.content + "\" to \"quote_db.txt\"\n");
                }
            }
            else {
                fs.writeFileSync("./private/quote_db.txt", data + message.author.username + ": " + message.content + "~", "utf8", { "flags": "a" });
                console.log("Passively saved the message quote \"" + message.content + "\" to \"quote_db.txt\"\n");
            }
        });
    },
};