module.exports = {
    name: "savedmessage",
    description: "Let's learn",
    execute(message, fs, convosFile, pushGay, gayArray) {
        fs.readFile(convosFile, "utf8", (err, data) => {
            if (err) throw err;
            let convosBody = [];
            let currenti = 0;
            let countLimit = 0;
            let indexOfSecondMessage;

            for (let i = 0; i <= data.length + 1; i++) {
                if (data.charAt(i) == "~") {
                    countLimit++;
                    let x = data.substring(currenti, i);
                    convosBody.push(x);
                    currenti = i + 1;
                    if (countLimit === 2) {
                        indexOfSecondMessage = currenti;
                    }
                }
                if (i == data.length) {
                    console.log("Counted " + countLimit + " message(s) stored on file.");
                    if (countLimit > 300) {
                        console.log("Limit of 300 reached: Removing messages \"" + convosBody[0] + "\" and \"" + convosBody[1] + "\"");
                        deleteOldMessages(indexOfSecondMessage);
                    }
                    else {
                        saveCurrentMessage();
                    }
                }
            }
        });

        function deleteOldMessages(indexOfMessage) {
            fs.readFile(convosFile, "utf8", (err, data) => {
                let extractedData = data.slice(0, indexOfMessage);
                let remainingData = data.slice(indexOfMessage);
                console.log("extractedData = \"" + extractedData + "\"");
                fs.writeFileSync(convosFile, remainingData, "utf8");
                saveCurrentMessage();
            });
        }

        function saveCurrentMessage() {
            fs.readFile(convosFile, "utf8", (err, data) => {
                if (err) throw err;
                
                fs.writeFileSync(convosFile, data + message.content + "~", "utf8", { "flags": "a" });

                if (convosFile == "./private/convos.txt") {
                    console.log("Passively saved the message \"" + message.content + "\" to \"convos.txt\"");
                }
                else {
                    console.log("Passively saved the message \"" + message.content + "\" to reserve convo file. \nCurrent: \"" + convosFile + "\"");
                }
            });
        }
    },
};