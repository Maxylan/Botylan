client.on("message", message => {
        if (message.content === "++ping" || message.content == "Ping Botylan") {
            message.channel.send("Hey.");
    }
});