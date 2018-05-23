module.exports = {
    name: "gaycounter",
    description: "Anti-degen device, depending on who you ask..",
    execute(message, fs, convosFile, pushGay, gayArray) {
        console.log("passiveGay triggered from message: \"" + message.content + "\"");
        pushGay(message);
        if (gayArray.length >= 4) {
            let chance = Math.floor((Math.random() * 5) + 1);
            if (chance === 4) {
                let target = gayArray[(Math.floor(Math.random() * gayArray.length))];
                message.channel.send(target + " is super gya xd");
                console.log("gay counter triggered and the user " + target + " is gay HAHAHAHA xddd");
            }
            if (chance === 2) {
                let target = gayArray[(Math.floor(Math.random() * gayArray.length))];
                message.channel.send(target + " is mega gaay xd");
                console.log("gay counter triggered and the user " + target + " is gay HAHAHAHA xddd");
            }
        }
        //message.channel.send("Hey");
        
    },
};