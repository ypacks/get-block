import { world, system, Block, Player, ItemStack } from "@minecraft/server";
import { bind, unbind } from "./bind";

world.afterEvents.chatSend.subscribe(async (arg) => {
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
            const bindOutput = await bind(player);
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

system.afterEvents.scriptEventReceive.subscribe((arg) => {
    console.warn(arg);
    console.warn("the fucking id is below you numbskull");
    console.warn(arg.id);
    if (arg.id !== "getblock:bind") return;

    const msg = arg.message;
    let debug: boolean = false;

    if (msg === "true" || msg === "false") {
        debug = JSON.parse(msg); // hopefully a boolean value
        console.warn("finna debug");
    }

    console.warn("passed this shit.");

    try {
        const entity = arg.initiator;
        console.warn("getting entity");
        const players = world.getAllPlayers();
        const player: Player | undefined = players.find(
            (player) => player.id === entity?.id
        );

        console.warn("found player");

        const block: Block | undefined = entity?.getBlockFromViewDirection({
            maxDistance: 40,
            excludeTypes: ["minecraft:air"],
        })?.block;

        console.warn("found block");

        console.log(block?.typeId);

        if (!block) return;

        const { x, y, z } = block.location;

        console.warn("block xyz");

        player?.runCommand(`setblock ${x} ${y} ${z} ${block.typeId}`);

        console.warn("putting block back");

        player
            ?.getComponent("inventory")
            ?.container?.setItem(
                player.selectedSlotIndex,
                new ItemStack(block.typeId, 1)
            );
        console.warn("giving to player.");
        player?.runCommand(`title @s actionbar §l${block.typeId}`);
        console.warn("completee.");
    } catch (error) {
        if (debug) {
            console.error(error);
            world.sendMessage("Error running main script : " + "§4§l" + error);
        }
    }
});
