import { system, Block, Player, world, ItemStack } from "@minecraft/server";

system.afterEvents.scriptEventReceive.subscribe((arg) => {
    if (arg.id !== "getblock:bind") return;

    const msg = arg.message;
    let debug: boolean = false;

    if (msg === "true" || msg === "false") {
        debug = JSON.parse(msg); // hopefully a boolean value
        console.log("finna debug");
    }

    console.log("passed this shit.");

    try {
        const entity = arg.initiator;
        console.log("getting entity");
        const players = world.getAllPlayers();
        const player: Player | undefined = players.find(
            (player) => player.id === entity?.id
        );

        console.log("found player");

        const block: Block | undefined = player?.getBlockFromViewDirection({
            maxDistance: 40,
        })?.block;

        console.log("found block");

        if (!block) return;

        const { x, y, z } = block.location;

        console.log("block xyz");

        player?.runCommand(`setblock ${x} ${y} ${z} ${block.typeId}`);

        console.log("putting block back");

        player
            ?.getComponent("inventory")
            ?.container?.setItem(
                player.selectedSlotIndex,
                new ItemStack(block.typeId, 1)
            );
        console.log("giving to player.");
        player?.runCommand(`title @s actionbar §l${block.typeId}`);
        console.log("completee.");
    } catch (error) {
        if (debug) {
            console.error(error);
            world.sendMessage("Error running main script : " + "§4§l" + error);
        }
    }
});
