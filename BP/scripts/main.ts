import { world } from "@minecraft/server";
import { bind, unbind } from "./bind";

world.afterEvents.chatSend.subscribe((arg) => {
    const message = arg.message;
    const player = arg.sender;

    if (!player.isOp || !player.hasTag("worldedit")) return;

    if (message[0] !== "$") return;
    const command = message.slice(1); // removes prefix

    switch (command) {
        case "help":
            player.sendMessage("Commands: $help");
            break;
        case "bind":
            const bindOutput = bind(player);
            if (bindOutput.status) {
                player.sendMessage("Bound to !");
            } else {
                player.sendMessage("Bind failed!");
                console.error(bindOutput.error);
            }
            break;
        case "unbind":
            unbind(player);
            break;
        default:
            console.warn("Unknown command: $" + command);
            break;
    }
});
