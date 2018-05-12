const tier1_1 = require("./tier_1/ping.js");
if (typeof tier1_1.ping === undefined) {
    throw err = "Something fucked up loading \"tier1_1.ping\".";
    console.log(err);
}
else {
    console.log("\"tier1_1.ping\" - " + typeof tier1_1.ping + " - command loaded!");
}

const tier4_1 = require("./tier_4-passive/messageListener.js");
const tier4_2 = require("./tier_4-passive/reply.js");
