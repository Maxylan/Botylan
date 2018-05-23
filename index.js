console.log("Botylan Launched.. \n");
const Discord = require("discord.js");
const fs = require("fs");

let status = false;
let lastStartup = checkDate();
let timer = false;
let passiveLimit = false;
let limit = false;
let passiveLimitCounter = 0;
let limitCounter = 0;

const { prefix, modPrefix, godmodePrefix, token } = require('./private/config.json');
const client = new Discord.Client();

client.login(token);
client.on("ready", () => {
    console.log("##################\n# Botylan ONLINE #\n##################\n");
    status = true;
});

//Active limiter
let limitCd = setInterval(() => {
    if (limitCounter >= 8) {
        limit = true;
    }
    else {
        limit = false;
    }
    if (limitCounter > 0) {
        limitCounter -= 1;
    }
}, 1750);
//Passive limiter
let passiveLimitCd = setInterval(() => {
    if (passiveLimitCounter >= 8) {
        passiveLimit = true;
    }
    else {
        passiveLimit = false;
    }
    if (passiveLimitCounter > 0) {
        passiveLimitCounter -= 1;
    }
}, 1500);

let gayCount = 0;
let target1 = null;
let target2 = null;
let target3 = null;
let convosFile = "./private/convos2.txt";
let currentMessage = "";
let currentChannel = "";

client.on("message", message => {
    let messageContent = message.content;
    let messageAuthor = message.author;
    let messageUser = messageAuthor.username;
    let messageChannel = message.channel;
    let perms = 0;
    let prefix = "";
    let rawprefix = "";

    if (messageContent.startsWith("-")) {
        for (let i = 0; i <= 4; i++) {
            if (messageContent.charAt(i) != "-") {
                prefixPerm();
                break;
            }
            else {
                prefix = prefix.concat("-");
            }

        }
        function prefixPerm() {
            let args = messageContent.slice(prefix.length).split(/ +/);
            let command = args.shift().toLowerCase();
            perms = checkPerms(message, messageUser);
            incommingMessageHandler(args, command, prefix);
        }
    }

    else { incommingMessageHandler("", "", ""); }

    function incommingMessageHandler(args, command, prefix) {
        //limiter aka anti-spam.
        if (limit === false && timer === false) {
            if (prefix === "-" && perms >= 1) {
                //ping command
                if (command === "ping") {
                    ping(message);
                }

                //date command
                if (command === "date") {
                    date(message);
                }
            }
            else if (prefix === "-" && perms < 1) {
                passiveCommandFired("insufficient_permissions");
                console.log("User \"" + messageUser + "\" tried the command \"" + messageContent + "\", with insufficient perms.");
            }

            if (prefix === "--" && perms >= 2) {
                //perm2 moderator commands goes here
            }
            else if (prefix === "--" && perms < 2) {
                passiveCommandFired("insufficient_permissions");
                console.log("User \"" + messageUser + "\" tried the MODERATOR command \"" + messageContent + "\", with insufficient perms.");
            }

            if (prefix === "---" && perms >= 3) {
                //Returns channel ID
                if (command === "channel") {
                    channel_ID(message, messageChannel, messageContent, messageUser);
                }

                //Get bot IQ
                if (command === "iq") {
                    checkStoredMessages(message, convosFile, messageContent, messageUser)
                }
                //Remove bot IQ :(
                if (command === "removeMemory") {
                    removeMemory(message, convosFile, args, messageContent, messageUser);
                }

                //Returns a users role ID's
                if (command === "getroles") {
                    if (!message.mentions.users.size) {
                        return message.reply("Tag a user in order to getRoles!");
                    }
                    let targetUser = message.mentions.users.first();
                    getRoles(message, args, targetUser, messageContent, messageChannel, messageUser);
                }
            }
            else if (prefix === "---" && perms < 3) {
                passiveCommandFired("insufficient_permissions");
                console.log("User \"" + messageUser + "\" tried the ADMIN command \"" + messageContent + "\", with insufficient perms.");
            }
        }
        else if (limit === true && timer === false) {
            //When limiter is activated, this will be sent instead of the command.
            console.log("/n ############################# HARD LIMIT REACHED");
            message.channel.send("Limit reached! Please wait while I chill the fuck out.");
            timer = true;
            setTimeout(() => { timer = false; }, 30000);
        }

        //Passive commands aka shit that runs off passiveLimiter.
        if (passiveLimit === false && timer === false) {
            if (!message.author.bot) {
                filter(message, messageContent, messageChannel, messageUser, convosFile);
            }
        }
        else if (passiveLimit === true && timer === false) {
            //When passiveLimiter is activated, this will be sent instead of the command.
            console.log("/n ############################# HARD PASSIVELIMIT REACHED");
            message.channel.send("Limit reached! Please wait while I chill the fuck out.");
            timer = true;
            setTimeout(() => { timer = false; }, 45000);
        }
    }
});

function filter(message, messageContent, messageChannel, messageUser, convosFile) {
    if (messageContent.search("http") >= 0
        || messageContent.search("sex") >= 0
        || messageContent.search("loli") >= 0
        || messageContent.search("lolli") >= 0
        || messageContent.search("kid") >= 0
        || messageContent.search("young") >= 0
        || messageContent.search("teen") >= 0
        || messageContent.search("child") >= 0) {
        console.log("\nBoty detected blacklisted item OR message sent from blacklisted user. " + messageUser + ": " + "\"" + messageContent + "\"");
    }
    else if (messageChannel == "<#354629478372212736>" //inner-sanctum
        || messageChannel == "<#443373798004359168>" //web-dev
        || messageChannel == "<#443373878215966740>" //software-dev
        || messageChannel == "<#354625561890390016>" //announcements
        || messageContent.search("-") >= 0
        || messageContent.search("~") >= 0
        || messageContent.search(":") >= 0
        || messageContent.search("<") >= 0
        || messageContent.search(">") >= 0
        || messageContent.search(";") >= 0
        || messageContent.search("t!") >= 0
        || messageContent.search("t@") >= 0
        || messageContent.length > 128
        || messageContent.length <= 1
        || messageContent.search("ping") >= 0
        || messageContent.search("date") >= 0
        || messageContent.search("channel") >= 0
        || messageContent.search("roles") >= 0) { }
    else {
        filterCheckPassed(message, messageContent, messageChannel, messageUser, convosFile);
    }
}
function filterCheckPassed(message, messageContent, messageChannel, messageUser, convosFile) {
    if (messageContent.search("booty") >= 0
        || messageContent.search("Booty") >= 0
        || messageContent.search("boty") >= 0
        || messageContent.search("Boty") >= 0
        || messageContent.search("BOTY") >= 0) {
        //Conversation Bot, for fun. the if statement contains the trigger words that, when said, will make the bot reply.
        chatBoty(message, convosFile);
    }
    else if (!messageChannel == "<#354629478372212736>" //inner-sanctum
        || !messageChannel == "<#354628600286281728>" //bot-playground
        || !messageChannel == "<#354629286768148503>" //event-organizing
        || !messageChannel == "<#389857811707723776>" //mod-logs
        || !messageChannel == "<#443372799789367316>" //bot
        || !messageChannel == "<#443373798004359168>" //web-dev
        || !messageChannel == "<#443373878215966740>" //software-dev
        || !messageChannel == "<#354625561890390016>" /*announcements*/) {
        let counter = Math.floor((Math.random() * 6) + 1);
        if (counter === 6) {
            saveRandMessage(messageContent, convosFile);
        }
    }

    if (messageContent.search("gay") >= 0
        || messageContent.search("gya") >= 0
        || messageContent.search("Gay") >= 0
        || messageContent.search("GAY") >= 0) {
        //Gay counter.
        passiveGay(message, messageContent, messageUser);
    }
}

function checkStoredMessages(message, convosFile, messageContent, messageUser) {
    fs.readFile(convosFile, "utf8", (err, data) => {
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
            if (i === data.length) {
                adminCommandFired("checkMessages", messageContent, messageUser);
                console.log("Counted " + countLimit + " message(s) stored on file.");
                console.log("Botylan: \"i currently have " + countLimit + " iq thanks to all of u <3\"");
                message.channel.send("i currently have " + countLimit + " iq thanks to all of u <3");
            }
        }
    });
}
function removeMemory(message, convosFile, args, messageContent, messageUser) {
    fs.readFile(convosFile, "utf8", (err, data) => {
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
            if (i === data.length) {
                adminCommandFired("removeMemory", messageContent, messageUser);
                fs.writeFileSync(convosFile, data + messageContent + "~", "utf8", { "flags": "a" });
                console.log("Counted " + countLimit + " message(s) stored on file.");
                console.log("Botylan: \"Fuck you. You removed " + + " From my memory\nI now have " + countLimit + " iq thanks to u </3\"");
                message.channel.send("Fuck you. You removed " + + " From my memory\nI now have " + countLimit + " iq thanks to u </3");
            }
        }
    });
}

function saveRandMessage(messageContent, convosFile) {
    fs.readFile(convosFile, "utf8", (err, data) => {
        if (err) throw err;

        passiveCommandFired("savedRandomMessage");
        fs.writeFileSync(convosFile, data + messageContent + "~", "utf8", { "flags": "a" });

        if (convosFile == "./private/convos.txt") {
            console.log("Passively saved the message \"" + messageContent + "\" to \"convos.txt\"");
        }
        else {
            console.log("Passively saved the message \"" + messageContent + "\" to reserve convo file. \nCurrent: \"" + convosFile + "\"");
        }
    });
}

function chatBoty(message, convosFile) {
    fs.readFile(convosFile, "utf8", (err, data) => {
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
                passiveCommandFired("messageSent");
                console.log("Counted " + countLimit + " message(s) stored on file.");
                if (countLimit === 0) {
                    throw err = "Zero messages stored, something is wrong.";
                    console.log(err);
                }
                else {
                    let rand = Math.floor((Math.random() * countLimit));
                    console.log("Sending message number: " + (rand + 1));
                    message.channel.send(convosBody[rand]);
                    console.log("Botylan: \"" + convosBody[rand] + "\"");
                }
            }
        }
    });
}

function passiveGay(message, messageContent, messageUser) {
    gayCount++;
    console.log("/nCurrent gay-counter: " + gayCount);

    if (gayCount === 1) {
        target1 = messageUser;
        console.log(target1 + ": " + messageContent);
    }
    else if (gayCount === 2) {
        target2 = messageUser;
        console.log(target2 + ": " + messageContent);
    }
    else if (gayCount === 3) {
        target3 = messageUser;
        console.log(target3 + ": " + messageContent);

        let target = Math.floor((Math.random() * 3) + 1);
        passiveCommandFired("passivegay");

        if (target === 1) {
            message.channel.send(target1 + " is super gya xd");
            console.log("Target gay user is: \"" + target1 + "\"; target number " + target);
        }
        else if (target === 2) {
            message.channel.send(target2 + " is super gya xd");
            console.log("Target gay user is: \"" + target2 + "\"; target number " + target);
        }
        else if (target === 3) {
            message.channel.send(target3 + " is super gya xd");
            console.log("Target gay user is: \"" + target3 + "\"; target number " + target);
        }

        gayCount = 0;
        target1 = null;
        target2 = null;
        target3 = null;
    }
}

function ping(message) {
    commandFired("ping");
    if (limitCounter <= 5) {
        message.channel.send("Hey");
    }
    else if (limitCounter > 5) {
        message.reply("I feel used.");
    }
}

function date(message) {
    commandFired("date");
    if (limitCounter <= 5) {
        message.channel.send("Date is \n" + checkDate());
    }
    else if (limitCounter > 5) {
        message.reply("Current date is: \n" + "" + checkDate() + "\n ...I feel used.");
    }
}
function checkDate() {
    d = new Date();
    return d.toUTCString();
}

function channel_ID(message, messageChannel, messageContent, messageUser) {
    adminCommandFired("channel_id", messageContent, messageUser);
    console.log("Channel ID = " + messageChannel);
    message.channel.send("Channel id is: " + messageChannel + " *check console log for info*");
}

function getRoles(message, args, targetUser, messageContent, messageChannel, messageUser) {
    adminCommandFired("get_roles", messageContent, messageUser);
    console.log("Roles for " + "\"" + targetUser + "\"" + " are == " + targetUser.roles);
    message.channel.send("Got role ID's for user \"" + targetUser + "\" *check console log for info*");
}

function checkPerms(message, user) {
    let data = fs.readFileSync("./private/memberTierList.txt", "utf8");
    if (data.search(user) == -1) {
        passiveCommandFired("savedUserPermData");
        let userperm = 0;
        if (user.roles) {
            userperm = 1;
        }
        fs.writeFileSync("./private/memberTierList.txt", data + user + "~" + userperm + "; ", "utf8", { "flags": "a" });
        console.log("\nChecked user-perm of \"" + user + "\" and registered user as a tier \"" + userperm + "\"");
    }
    else {
        let x = data.indexOf(user);
        let y = data.indexOf("~", x);
        let userperm = data.charAt((y + 1));
        userperm = parseInt(userperm);
        console.log("\nChecked user-perm of \"" + user + "\" and returned the tier \"" + userperm + "\"");
        return userperm;
    }
}

function adminCommandFired(commandId, messageContent, messageUser)
{
    console.log("\n ##### Admin Command/User Action! #####");
    console.log("User: " + messageUser);
    console.log("Message: " + messageContent);
    console.log("\"" + commandId + "\"" + " command fired at " + checkDate("date"));
}
function commandFired(commandId)
{
    limitCounter++;
    console.log("\n ### Command/User Action! ###");
    console.log("\"" + commandId + "\"" + " command fired at " + checkDate("date"));
    console.log("Command stack currently at: " + limitCounter);
}
function passiveCommandFired(commandId)
{
    passiveLimitCounter++;
    console.log("\n ## Passive Action! ## \"" + commandId + "\"" + " fired at " + checkDate("date"));
    console.log("Passive stack currently at: " + passiveLimitCounter);
}

