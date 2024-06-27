import {
    world,
    ItemStack,
    Player,
    PlayerBreakBlockAfterEvent,
} from "@minecraft/server";
import { itemStack } from "./bind";

let event: (arg: PlayerBreakBlockAfterEvent) => void;

export function start(starterPlayer: Player) {
    if (!event) {
        starterPlayer.sendMessage("an item as already been bound!");
        return;
    }
    event = world.afterEvents.playerBreakBlock.subscribe((arg) => {
        if (!(itemStack.typeId == arg.itemStackBeforeBreak?.typeId)) return;

        const player = arg.player;
        const block = arg.block;

        const { x, y, z } = block.location;

        player.runCommand(`setblock ${x} ${y} ${z} ${block.typeId}`);

        player
            .getComponent("inventory")
            ?.container?.setItem(
                player.selectedSlotIndex,
                new ItemStack(block.typeId, 1)
            );
    });
}

export function stop(starterPlayer: Player) {
    if (event) {
        world.afterEvents.playerBreakBlock.unsubscribe(event);
    } else {
        starterPlayer.sendMessage("erm there isnt an item.");
        return;
    }
}
