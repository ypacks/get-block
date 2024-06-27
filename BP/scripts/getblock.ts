import {
    world,
    ItemStack,
    Player,
    PlayerBreakBlockAfterEvent,
} from "@minecraft/server";
import { itemStack } from "./bind";

let event: ((arg: PlayerBreakBlockAfterEvent) => void) | undefined = undefined;

export function start(starterPlayer: Player) {
    if (event) {
        starterPlayer.sendMessage("an item as already been bound!");
        return false;
    }
    event = world.afterEvents.playerBreakBlock.subscribe((arg) => {
        console.warn(itemStack.typeId)
        console.warn(arg.itemStackBeforeBreak?.typeId)
        if (!(itemStack.typeId == arg.itemStackBeforeBreak?.typeId)) return;

        const player = arg.player;
        const block = arg.block;

        const { x, y, z } = block.location;

        console.warn(block.typeId)
        player.runCommand(`setblock ${x} ${y} ${z} ${block.typeId}`);

        player
            .getComponent("inventory")
            ?.container?.setItem(
                player.selectedSlotIndex,
                new ItemStack(block.typeId, 1)
            );

        player.runCommand(`title @s actionbar §l${block.typeId}`);
    });

    return true;
}

export function stop(starterPlayer: Player) {
    if (event) {
        world.afterEvents.playerBreakBlock.unsubscribe(event);
    } else {
        starterPlayer.sendMessage("erm there isnt an item.");
        return;
    }
}
