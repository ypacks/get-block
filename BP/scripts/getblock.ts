import {
    world,
    ItemStack,
    Player,
    Block,
    system,
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

        const player = arg.player;
        const block = arg.block;

        try {
            system.run(async () => {
                await getBlock(player, block);
            });
        } catch (err) {
            console.error(err);
        }

        arg.cancel = true;
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

export async function getBlock(
    player: Player | undefined,
    block: Block,
    placeBack: boolean = false
) {
    if (!player) return;
    if (placeBack) {
        const { x, y, z } = block.location;

        console.warn("block xyz");

        player?.runCommand(`setblock ${x} ${y} ${z} ${block.typeId}`);

        console.warn("putting block back");
    }
    player
        ?.getComponent("inventory")
        ?.container?.setItem(
            player.selectedSlotIndex,
            new ItemStack(block.typeId, 1)
        );
    player?.runCommand(`title @s actionbar §l${block.type}`);
}
