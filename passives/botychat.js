module.exports = {
    name: "botychat",
    description: "Let's talk",
    execute(message, fs, convosFile, pushGay, gayArray) {
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
    },
};