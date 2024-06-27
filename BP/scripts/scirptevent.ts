import { system, Block, Player, world, ItemStack } from "@minecraft/server";

system.afterEvents.scriptEventReceive.subscribe((arg) => {
    if (arg.id !== "getblock:bind") return;

    const msg = arg.message;
    let debug: boolean = false;

    if (msg === "true" || msg === "false") {
        debug = JSON.parse(msg); // hopefully a boolean value
    }

    try {
        const entity = arg.initiator;

        const players = world.getAllPlayers();
        const player: Player | undefined = players.find(
            (player) => player.id === entity?.id
        );

        const block: Block | undefined = player?.getBlockFromViewDirection({
            maxDistance: 40,
        })?.block;

        if (!block) return;

        const { x, y, z } = block.location;

        player?.runCommand(`setblock ${x} ${y} ${z} ${block.typeId}`);

        player
            ?.getComponent("inventory")
            ?.container?.setItem(
                player.selectedSlotIndex,
                new ItemStack(block.typeId, 1)
            );
        player?.runCommand(`title @s actionbar §l${block.typeId}`);
    } catch (error) {
        if (debug) {
            console.error(error);
            world.sendMessage("Error running main script : " + "§4§l" + error);
        }
    }
});
