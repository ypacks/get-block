import { world, Player, ItemStack } from "@minecraft/server";
import { start, stop } from "./getblock";

export let itemStack: ItemStack;

/**
 * Returns bool, if true then success.
 */
export function bind(player: Player) {
    try {
        const item = player
            .getComponent("inventory")
            ?.container?.getItem(player.selectedSlotIndex);
        if (item?.typeId) {
            itemStack = item;
            return { status: start(player), error: "Eror in main code." };
        } else {
            return { status: false, error: "Item has no id?" };
        }
    } catch (error) {
        return { status: false, error };
    }
}

export function unbind(player: Player) {
    stop(player);
}
