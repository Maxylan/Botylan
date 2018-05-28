console.log("Botylan Launched.. \n");
const Discord = require("discord.js");
const fs = require("fs");

let status = false;
let t1Commands = [];
let t2Commands = [];
let t3Commands = [];
const {
    prefix,
    modPrefix,
    godmodePrefix,
    convosFile,
    timerExpiry,
    discardTimer,
    limitTimer,
    passiveLimitTimer,
    token
} = require("./private/config.json");
const {
    tier_2,
    tier_3
} = require("./private/memberTierList.json");
const {
    profanity,
    syntax,
    channel,
    blacklisteduser,
    maxLength,
    minLength
} = require("./private/filter.json");
const {
    gayCounterPrefix,
    botychatPrefix
} = require("./private/passiveActionPrefixes.json");
const {
    muted,
    activityPresets,
    activitySwitchInterval
} = require("./private/activity.json");

const client = new Discord.Client();
//Commands
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./commands");

for (const file of commandFiles)
{
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    
    if (command.perm === 1) {
        t1Commands.push(command.name);
        t1Commands.push(command.description);
    }
    else if (command.perm === 2) {
        t2Commands.push(command.name);
        t2Commands.push(command.description);
    }
    else if (command.perm === 3) {
        t3Commands.push(command.name);
        t3Commands.push(command.description);
    }

    console.log("Loaded command: " + command.name);
}
//Passive Functions/Commands
client.passiveCommands = new Discord.Collection();
const passiveCommandFiles = fs.readdirSync("./passives");

for (const file of passiveCommandFiles)
{
    const passiveCommand = require(`./passives/${file}`);
    client.passiveCommands.set(passiveCommand.name, passiveCommand);
    console.log("Loaded passiveCommand: " + passiveCommand.name);
}

client.login(token);
client.on("ready", () =>
{
    console.log("##################\n# Botylan ONLINE #\n##################\n");
    status = true;
});

let silenced = false;
let botSelfCleanup = false;
let lastStartup = "";
lastStartup = checkDate();
let timer = false;
let passiveLimit = false;
let limit = false;
let passiveLimitCounter = 0;
let limitCounter = 0;
let gayArray = [];

//Active limiter
let limitCd = setInterval(() =>
{
    if (limitCounter >= 8)
    {
        limit = true;
    }
    else
    {
        limit = false;
    }
    if (limitCounter > 0)
    {
        limitCounter -= 1;
    }
}, limitTimer);
//Passive limiter
let passiveLimitCd = setInterval(() =>
{
    if (passiveLimitCounter >= 8)
    {
        passiveLimit = true;
    }
    else
    {
        passiveLimit = false;
    }
    if (passiveLimitCounter > 0)
    {
        passiveLimitCounter -= 1;
    }
}, passiveLimitTimer);

let currentActivity = 0;
let aPresetsRand = 0;
let activitySwitcher = setInterval(() => { switchActivity(true, false, 0, false); }, activitySwitchInterval);;
function fixIntervalAS() {
    clearInterval(activitySwitcher);
    activitySwitcher = setInterval(() => { switchActivity(true, false, 0, false); }, activitySwitchInterval);
}
function stopIntervalAS() {
    clearInterval(activitySwitcher);
}
function startIntervalAS() {
    activitySwitcher = setInterval(() => { switchActivity(true, false, 0, false); }, activitySwitchInterval);
}
function switchActivity(isRandom, isManual, activityNum, isNext)
{
    if (isRandom === true)
    {
        while (aPresetsRand === currentActivity)
        {
            aPresetsRand = Math.floor(Math.random() * activityPresets.length);
        }
        if (silenced != true || timer != true)
        {
            client.user.setActivity(activityPresets[aPresetsRand], { type: "WATCHING" });
            console.log("Current activity: \"Watching " + activityPresets[aPresetsRand] + "\"");
            currentActivity = aPresetsRand;
            if (isManual === true) {
                fixIntervalAS();
            }
        }
        else if (silenced === true || timer === true)
        {
            client.user.setActivity("nothing, i got muted", { type: "LISTENING" });
        }
    }
    else if (isRandom === false) {
        if (isNext === true) {
            if (silenced != true || timer != true) {
                if (currentActivity + 1 > activityPresets.length) {
                    currentActivity = -1;
                }
                client.user.setActivity(activityPresets[(currentActivity + 1)], { type: "WATCHING" });
                console.log("Current activity: \"Watching " + activityPresets[activityNum] + "\"");
                ++currentActivity;
                fixIntervalAS();
            }
            else if (silenced === true || timer === true) {
                client.user.setActivity("nothing, i got muted", { type: "LISTENING" });
            }
        }
        else if (isNext === false) {
            if (silenced != true || timer != true) {
                client.user.setActivity(activityPresets[activityNum], { type: "WATCHING" });
                console.log("Current activity: \"Watching " + activityPresets[activityNum] + "\"");
                currentActivity = activityNum;
                fixIntervalAS();
            }
            else if (silenced === true || timer === true) {
                client.user.setActivity("nothing, i got muted", { type: "LISTENING" });
            }
        }
    }
}

client.on("message", message =>
{
    //Check if the author of the message is a bot and/or if the bot has sent something it wants to delete.
    if (botSelfCleanup === true && message.author.username === "Botylan")
    {
        botSelfCleanup = false;
        message.delete(discardTimer)
            .then(msg => {
                console.log("Cleaned up one of my messages.")
            })
            .catch(console.error);
    }
    else if (message.author.bot) return;
    else if (timer === true) return;
    else if (silenced === true) return;
    else if (passiveLimit === true || limit === true) return timeout(message);

    //Check if or what prefix is used.
    //Also used to determine what commands you can do with that prefix. Ties together with Permissions.
    /*
    * Supreme-leader-tier Permissions
    */
    if (message.content.startsWith(godmodePrefix))
    {
        const args = message.content.slice(godmodePrefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        if (!client.commands.has(command)) return console.log(message.author.username + " tried a God-mode command that doesn't exist.");

        let userPerm = checkPerm(message.author.username);
        if (userPerm < 3) return insufficientPermissions(message.author.username, command, message, godmodePrefix);

        commandHandler(message, client, args, command, userPerm, godmodePrefix);
    }
    /*
    * Moderator-tier Permissions
    */
    else if (message.content.startsWith(modPrefix))
    {
        const args = message.content.slice(modPrefix.length).split(/ +/);
        const command = args.shift().toLowerCase();

        if (!client.commands.has(command)) return console.log(message.author.username + " tried a moderator command that doesn't exist.");

        let userPerm = checkPerm(message.author.username);
        if (userPerm < 2) return insufficientPermissions(message.author.username, command, message, modPrefix);

        commandHandler(message, client, args, command, userPerm, modPrefix);
    }
    /*
    * Normie-tier Permissions
    */
    else if (message.content.startsWith(prefix))
    {
        const args = message.content.slice(prefix.length).split(/ +/);
        const command = args.shift().toLowerCase();
        //check if the command even exists.
        if (!client.commands.has(command)) return;

        commandHandler(message, client, args, command, 1, "-");
    }
    /*
    * Passive actions!
    * Filters out Profanity, Syntax, Blacklisted Channels, Blacklisted Users and messages over/under the set limit.
    */
    let m = message.content.toLowerCase();
    let x = 0;
    for (let i = 0; i <= profanity.length; ++i)
    {
        if (i === profanity.length && m.search(profanity[i]) != -1) {
            filterStageTwo();
            break;
        }
        else if (m.search(profanity[i]) != -1) { return; }
    }

    function filterStageTwo()
    {
        for (let i = 0; i <= syntax.length; ++i)
        {
            if (i === syntax.length && m.search(syntax[i]) != -1) {
                filterStageThree();
                break;
            }
            else if (m.search(syntax[i]) != -1) { return; }
        }
    }

    function filterStageThree()
    {
        for (let i = 0; i <= channel.length; i++)
        {
            if (i === channel.length && message.channel != channel[i]) filterStageFour();
            else if (message.channel === channel[i]) return;
        }
    }

    function filterStageFour()
    {
        if (message.author.bot) return;
        for (let i = 0; i <= blacklisteduser.length; i++)
        {
            if (i === blacklisteduser.length && message.author.username != blacklisteduser[i]) filterStageFive();
            else if (message.author.username === blacklisteduser[i]) return;
        }
    }

    function filterStageFive()
    {
        if (m.length >= minLength && m.length <= maxLength) filterPassed();
        else return;
    }

    //Succesfully ran through filter.

    function filterPassed() {
        try {
            for (let i = 0; i <= gayCounterPrefix.length; i++) {
                if (m.indexOf(gayCounterPrefix[i]) != -1) {
                    runPassiveCommand("gaycounter");
                    checkifBotychat();
                }
                else if (m.indexOf(gayCounterPrefix[i]) === -1 && i === gayCounterPrefix.length) { checkifBotychat(); }
            }
            function checkifBotychat() {
                for (let i = 0; i <= botychatPrefix.length; i++) {
                    if (m.indexOf(botychatPrefix[i]) != -1) {
                        runPassiveCommand("botychat");
                    }
                    else if (m.indexOf(botychatPrefix[i]) === -1 && i === botychatPrefix.length) { saveRandMessage(); }
                }
            }
            function saveRandMessage() {
                let coinToss = Math.floor((Math.random() * 3) + 1);
                if (coinToss === 2) {
                    runPassiveCommand("savedmessage");
                }
            }
            function runPassiveCommand(passiveCommand) {
                passiveCommandFired(passiveCommand);
                client.passiveCommands.get(passiveCommand).execute(message, fs, convosFile, pushGay, gayArray);
            }
        }
        catch (err) {
            botychatPrefix
            console.log("\n!!! Error when \"" + message.author.username + "\" executed a passive command !!!\nTime was \"" + checkDate() + "\"\n");
            cleanup(message,
                ("error occured trying to execute passive command"));
            console.error(err);
        }
    }
    
    
    /*
    * Where the command-magic happens!
    */
    function commandHandler(message, client, args, command, permissions, prefix)
    {
        try
        {
            if (permissions >= client.commands.get(command).perm)
            {
                if (client.commands.get(command).perm === 1)
                {
                    commandFired(command);
                    client.commands.get(command).execute(message, args, t1Commands, t2Commands, t3Commands);
                }
                else if (client.commands.get(command).perm === 2)
                {
                    modCommandFired(command, message);
                    client.commands.get(command).execute(message, client, args, fs, convosFile, cleanup, filter, switchActivity, activityPresets, aPresetsRand);
                }
                else if (client.commands.get(command).perm === 3)
                {
                    adminCommandFired(command, message);
                    client.commands.get(command).execute(message, client, args, lastStartup, cleanup);
                }
            }
            else return insufficientPermissions(message.author.username, command, message, prefix);
        }
        catch (err)
        {
            console.log("\n!!! Error when \"" + message.author.username + "\" executed \"" + command + "\" !!!\nTime was \"" + checkDate() + "\"\n");
            cleanup(message,
                ("error occured while executing your command!"));
            console.error(err);
        }
    }
});
//Part of gaycounter
function pushGay(message) {
    gayArray.push(message.author.username);
    if (gayArray.length > 6) { gayArray.shift(); }
}

function checkPerm(user)
{
    if (tier_3.indexOf(user) >= 0)
    {
        console.log(user + " has permissions level 3");
        return 3;
    }
    else if (tier_2.indexOf(user) >= 0)
    {
        console.log(user + " has permissions level 2");
        return 2;
    }
    else return 1;
}
function checkDate()
{
    d = new Date();
    return d.toUTCString();
}
//Filter as a function, so that commands can filter messages too.
function filter(input) {
    let m = input;
    if (typeof input === "string") {
        m = input.toLowerCase();
    }

    let filterIndex = [];

    for (let i = 0; i <= profanity.length; ++i) {
        if (i === profanity.length && m.indexOf(profanity[i]) != -1) {
            filterIndex.push(profanity[i]);
            returning();
        }
        else if (m.indexOf(profanity[i]) != -1) {
            filterIndex.push(profanity[i]);
        }
        else if (i === profanity.length) {
            returning();
        }
    }

    function filterStageTwo() {
        for (let i = 0; i <= syntax.length; ++i) {
            if (i === syntax.length && m.indexOf(syntax[i]) != -1) {
                filterIndex.push(syntax[i]);
                returning();
            }
            else if (m.indexOf(syntax[i]) != -1) {
                filterIndex.push(syntax[i]);
            }
            else if (i === syntax.length) {
                returning();
            }
        }
    }

    function returning() {
        if (typeof filterIndex === "object") {
            console.log("filterIndex returned as array");
            console.log("filterIndex: " + filterIndex);
            return filterIndex;
        }
        else {
            console.log("filterIndex returned as an empty array");
            return [];
        }
    }
}

function adminCommandFired(commandId, message)
{
    console.log("\n ##### Admin Command/User Action! #####");
    console.log("User: \"" + message.author.username + "\"");
    console.log("Message: \"" + message.content + "\"\n");
    console.log("\n" + message.author.username + ": \"" + commandId + "\"" + " executed at " + checkDate());
}
function modCommandFired(commandId, message)
{
    limitCounter++;
    console.log("\n #### Moderator Command/User Action! ####");
    console.log(message.author.username + ": \"" + commandId + "\"" + " executed at " + checkDate());
    console.log("Command stack currently at: " + limitCounter);
}
function commandFired(commandId)
{
    limitCounter++;
    console.log("\n ### Command/User Action! ###");
    console.log("\"" + commandId + "\"" + " command fired at " + checkDate());
    console.log("Command stack currently at: " + limitCounter);
}
function passiveCommandFired(commandId)
{
    passiveLimitCounter++;
    console.log("\n ## Passive Action! ## \"" + commandId + "\"" + " fired at " + checkDate());
    console.log("Passive stack currently at: " + passiveLimitCounter);
}
function insufficientPermissions(user, commandId, message, prefix)
{
    passiveLimitCounter++;
    console.log("!!! Insufficient Permissions !!! \"" + user + "\" tried \"" + commandId + "\" at \"" + checkDate() + "\"");
    console.log("Passive stack currently at: " + passiveLimitCounter);
    cleanup(message,
        ("does not meet the required permissions for **\"" + commandId + "\"**\n*this may be because you used the prefix \"" + prefix + "\", or you simply lack permissions*"));
}
function timeout(message) {
    console.log("\n###### Hard limit reached! \"" + checkDate() + "\"");
    timer = true;
    cleanup(message,
        ("Chill out! Limit reached, try again in \"" + timerExpiry/1000 + " seconds\""));
}

function cleanup(message, replyMessage)
{
    botSelfCleanup = true;
    message.reply(replyMessage);
}