module.exports = {
    name: "roll",
    description: "Roll a random number!",
    perm: 1,
    execute(message, args, t1Commands, t2Commands, t3Commands) {
        let rollRoof;
        let input;
        if (args[0] >= 2 || args[0] <= 9999) {
            if (typeof args[0] != "number") {
                input = parseInt(args[0]);
            }
        }
        if (typeof input != "number") {
            rollRoof = 100;
        }
        else if (input > 9999 || input < 2) {
            rollRoof = 100;
        }
        else {
            rollRoof = input;
        }
        let roll = Math.floor((Math.random() * rollRoof) + 1);
        message.channel.send("**" + message.author.username + "** rolls a \"" + roll + "\"");
    },
};