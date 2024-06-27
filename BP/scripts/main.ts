import { world, system, Block, Player, ItemStack } from "@minecraft/server";
import { bind, unbind } from "./bind";
import { getBlock } from "./getblock";

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

system.afterEvents.scriptEventReceive.subscribe(async (arg) => {
    if (arg.id !== "getblock:bind") return;

    const msg = arg.message;
    let debug: boolean = false;

    if (msg === "true" || msg === "false") {
        debug = JSON.parse(msg); // hopefully a boolean value
        console.warn("finna debug");
    }

    try {
        const entity = arg.initiator;
        const players = world.getAllPlayers();
        const player: Player | undefined = players.find(
            (player) => player.id === entity?.id
        );
        console.warn(player?.nameTag);

        const raycast = entity?.getBlockFromViewDirection({
            maxDistance: 10,
            excludeTypes: ["minecraft:air"],
            includePassableBlocks: false,
            includeLiquidBlocks: false,
        });

        const block: Block | undefined = raycast?.block;

        console.warn();
        console.warn(raycast?.faceLocation.x);
        console.warn(raycast?.faceLocation.y);
        console.warn(raycast?.faceLocation.z);

        console.warn(block?.typeId);

        console.warn(block);

        console.warn("found block");

        if (!block) return;

        try {
            await getBlock(player, block, true);
        } catch (err) {
            console.error(err);
        }
    } catch (error) {
        if (debug) {
            console.error(error);
            world.sendMessage("Error running main script : " + "§4§l" + error);
        }
    }
});
