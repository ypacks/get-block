import {
    world,
    ItemStack,
    Player,
    PlayerBreakBlockBeforeEvent,
} from "@minecraft/server";
import { itemStack } from "./bind";

let event: ((arg: PlayerBreakBlockBeforeEvent) => void) | undefined = undefined;

export async function start(starterPlayer: Player) {
    if (event) {
        starterPlayer.sendMessage("an item as already been bound!");
        return false;
    }
    event = world.beforeEvents.playerBreakBlock.subscribe(async (arg) => {
        if (!(itemStack?.typeId == arg.itemStack?.typeId)) return;

        arg.cancel = true;

        const player = arg.player;
        const block = arg.block;

        // const { x, y, z } = block.location;

        // await player.runCommandAsync(`setblock ${x} ${y} ${z} ${block.typeId}`);

        player
            .getComponent("inventory")
            ?.container?.setItem(
                player.selectedSlotIndex,
                new ItemStack(block.typeId, 1)
            );

        player.runCommand(
            `title @s actionbar §l${block.getItemStack(1)?.nameTag}`
        );
    });

    return true;
}

export function stop(starterPlayer: Player) {
    if (event) {
        world.beforeEvents.playerBreakBlock.unsubscribe(event);
    } else {
        starterPlayer.sendMessage("erm there isnt an item.");
        return;
    }
}
