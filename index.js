const Discord = require("discord.js");
const fs = require("fs");
let status = false;
let limit = false;
let limitCounter = 0;
const client = new Discord.Client();


fs.open("./private/token.txt", "r", (err, fd) => {
    if (err) throw err;
    fs.fstat(fd, (err, stat) => {
        if (err) throw err;
        let body = [];
        fs.readFile("./private/token.txt", "utf8", (err, data) => {
            client.login(data);
        });
        fs.close(fd, (err) => {
            if (err) throw err;
        });
    });
});

client.on("ready", () => {
    console.log("Botylan Online.");
    status = true;
});

//limiter
let limitCd = setInterval(() => {
    if (limitCounter >= 10) {
        limit = true;
    }
    else {
        limit = false;
    }
    if (limitCounter > 0) {
        limitCounter -= 1;
    }
}, 1000);

let messageContent = "";

let gaycount = 0;
let targetUser1 = null;
let targetUser2 = null;
let targetUser3 = null;
let target1 = null;
let target2 = null;
let target3 = null;
let currentMessage = "";
let currentChannel = "";

client.on("message", message => {
    let messageContent = message.content;
    let messageAuthor = message.author;
    let messageUser = messageAuthor.username;
    let messageChannel = message.channel;
    //let channelType = channel.type;


    /*if (messageUser == "Maxylan" && channelType == "dm") {
        currentMessage.currentChannel.send(messageContent);
    }
    else {
        currentMessage = messageContent;
        currentChannel = messageChannel;
    }*/
    //console.log("Message: " + "\"" + messageContent + "\"" + " -- at channel: " + "\"" + messageChannel + "\"");

    //limiter aka anti-spam.
    if (limit === false) {

        //ping command
        if (message.content.startsWith("++ping")) {
            commandFired("ping");
            if (limitCounter <= 10) {
                message.channel.send("Hey");
            }
            else if (limitCounter > 5) {
                message.channel.send("I feel used.");
            }
        }

        //date command
        if (message.content.startsWith("++date")) {
            commandFired("date");
            if (limitCounter <= 10) {
                message.channel.send("" + checkDate("date"));
            }
            else if (limitCounter > 5) {
                message.channel.send("Date is \n" + "" + checkDate("date") + "...I feel used.");
            }
        }

        if (message.content.startsWith("--channelId")) {
            /*if (checkPerms(messageUser) === 3) {

            }
            else {

            }*/
            message.channel.send("" + messageChannel);
            console.log("################# Admin command => channel id: " + messageChannel);
        }
        if (messageContent.search("booty") >= 0
            || messageContent.search("Booty") >= 0
            || messageContent.search("boty") >= 0
            || messageContent.search("Boty") >= 0
        /*|| messageContent.search("BOT") >= 0*/) {

            function checkStoredMessages() {
                fs.readFile("./private/convos.txt", "utf8", (err, data) => {
                    if (err) throw err;

                    let convosBody = [];
                    let currenti = 0;
                    let countLimit = 0;

                    for (let i = 0; i <= data.length + 1; i++) {
                        if (data.charAt(i) == "~") {
                            countLimit++;
                            let x = data.substring(currenti, i);
                            convosBody.push(x);
                            currenti = i + 1;
                        }
                        if (i == data.length) {
                            sendRandMessageHandler(convosBody, countLimit, data);
                            commandFired(messageSent);
                        }
                    }
                });
            }

            function sendRandMessageHandler(cB, cL, d) {
                console.log("Counted " + cL + " message(s) stored on file.");
                if (cL === 0) {
                    throw err = "Zero messages stored, something is wrong.";
                    console.log(err);
                }
                else {
                    let rand = Math.floor((Math.random() * cL));
                    console.log("Sending message number: " + (rand + 1));
                    message.channel.send(cB[rand]);
                    console.log("Botylan: \"" + cB[rand] + "\"");
                }
            }
        }
    }

    //When limiter is activated, this will be sent instead of the command.
    else {
        message.channel.send("Limit reached! Please wait while I chill the fuck out.");
    }

    //Passive commands aka shit that runs regardless of limiter.
    //Filter for what messages the bot won't save
    if (messageContent.search("http") >= 0
        || messageContent.search("<") >= 0
        || messageContent.search(">") >= 0
        || messageContent.search("fuc") >= 0
        || messageContent.search("Booty") >= 0
        || messageContent.search("booty") >= 0
        || messageContent.search("bot") >= 0
        || messageContent.search("Bot") >= 0
        || messageContent.search("BOT") >= 0
        || messageContent.search("gay") >= 0
        || messageContent.search("gya") >= 0
        || messageContent.search("Gay") >= 0
        || messageContent.search("GAY") >= 0
        || messageContent.search("loli") >= 0
        || messageContent.search("lolli") >= 0
        || messageContent.search("kid") >= 0
        || messageContent.search("young") >= 0
        || messageContent.search("preteen") >= 0
        || messageContent.search("children") >= 0
        || messageContent.search("~") >= 0
        || message.length > 128
        || messageUser == "Botylan"
        || messageUser == "Maxylan"
        || messageUser == "42"
        || messageUser == "BoatBot"
        || messageUser == "omeesu!"
        || messageChannel == "<#354629478372212736>" //inner-sanctum
        || messageChannel == "<#354628600286281728>" //bot-playground
        || messageChannel == "<#354629286768148503>" //event-organizing
        || messageChannel == "<#389857811707723776>" //mod-logs
        || messageChannel == "<#354625561890390016>" /*announcements*/) {
    }
    else {
        cDPHandler(messageContent);
    }

    //Conversation Bot, for fun. the if statement contains the trigger words that, when said, will make the bot reply.
    /*if (messageContent.search("booty") >= 0
        || messageContent.search("Booty") >= 0
        || messageContent.search("boty") >= 0
        || messageContent.search("Boty") >= 0
        || messageContent.search("BOT") >= 0) {

        function checkStoredMessages() {
            fs.readFile("./private/convos.txt", "utf8", (err, data ) => {
                if (err) throw err;

                let convosBody = [];
                let currenti = 0;
                let countLimit = 0;

                for (let i = 0; i <= data.length + 1; i++) {
                    if (data.charAt(i) == "~") {
                        countLimit++;
                        let x = data.substring(currenti, i);
                        convosBody.push(x);
                        currenti = i + 1;
                    }
                    if (i == data.length) {
                        sendRandMessageHandler(convosBody, countLimit, data);
                        commandFired(messageSent);
                    }
                }
            });
        }

            function sendRandMessageHandler(cB, cL, d) {
                console.log("Counted " + cL + " message(s) stored on file.");
                if (cL === 0) {
                    throw err = "Zero messages stored, something is wrong.";
                    console.log(err);
                }
                else {
                    let rand = Math.floor((Math.random() * cL));
                    console.log("Sending message number: " + (rand + 1));
                    message.channel.send(cB[rand]);
                    console.log("Botylan: \"" + cB[rand] + "\"");
                }
            }
        }
    }*/
    //Gay counter, for memes.
    if (messageContent.search("gay") >= 0
        || messageContent.search("Gay") >= 0
        || messageContent.search("GAY") >= 0
        || messageContent.search("gya") >= 0) {
        gaycount++;
        console.log("Current gay-counter: " + gaycount);

        if (gaycount === 1) {
            target1 = messageUser;
            console.log(target1 + ": " + messageContent);
        }
        else if (gaycount === 2) {
            target2 = messageUser;
            console.log(target2 + ": " + messageContent);
        }
        else if (gaycount === 3) {
            target3 = messageUser;
            console.log(target3 + ": " + messageContent);
        }
        if (gaycount === 4) {

            let target = Math.floor((Math.random() * 3) + 1);
            commandFired("passivegay");

            if (target === 1) {
                console.log("### Passive Action! ###");
                message.channel.send(target1 + " is super gya xd");
                console.log("target user: " + target + " -- " + target1);
            }
            else if (target === 2) {
                console.log("### Passive Action! ###");
                message.channel.send(target2 + " is super gya xd");
                console.log("target user: " + target + " -- " + target2);
            }
            else if (target === 3) {
                console.log("### Passive Action! ###");
                message.channel.send(target3 + " is super gya xd");
                console.log("target user: " + target + " -- " + target3);
            }
            gaycount = 0;
            target1 = null;
            target2 = null;
            target3 = null;
        }
    }
});

function checkPerms(user) {
    fs.readFile("./private/memberTierList.txt", "utf8", (err, data) => {
        let x = data.indexOf(user);
        let userperm = data.indexOf("~", x) + 1;
        user = userperm;
        return user;
    });
}

function commandFired(commandId) {
    limitCounter++;
    console.log("\"" + commandId + "\"" + " command fired at " + checkDate("date"));
    console.log("Command stack currently at: " + limitCounter);
}

function checkDate(str) {
    str = new Date();
    return str;
}

function cDPHandler(messageContent) {
    let currentDocPos = 0;
    fs.readFile("./private/convos.txt", "utf8", (err, data) => {
        if (err) throw err;
        if (data.indexOf("~") != -1) {
            currentDocPos = data.indexOf("~") + 1;
            saveRandMessage(currentDocPos, messageContent, data);
        } else {
            currentDocPos = 0;
            saveRandMessage(currentDocPos, messageContent, data);
        }
    });
}

function saveRandMessage(currentDocPos, messageContent, data) {
    let counter = Math.floor((Math.random() * 6) + 1);
    //console.log("saveRandMessage fired with rand: " + counter);
    if (counter === 6) {
        console.log("### Passive Action! ###");
        fs.writeFileSync("./private/convos2.txt", data + messageContent + "~", "UTF-8", { "flags": "a" });
        console.log("Passively saved the message " + "\"" + messageContent + "\"" + " to \"convos.txt\"");
    }
}

