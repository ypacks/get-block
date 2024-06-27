import { world, Player, ItemStack } from "@minecraft/server";
import { start, stop } from "./getblock";

export let itemStack: ItemStack | undefined;

/**
 * Returns bool, if true then success.
 */
export async function bind(player: Player) {
    try {
        const item = player
            .getComponent("inventory")
            ?.container?.getItem(player.selectedSlotIndex);
        console.log(item?.typeId);
        if (item?.typeId) {
            itemStack = item;
            return {
                status: await start(player),
                error: "Eror in main code.",
                itemStack: item,
            };
        } else {
            return { status: false, error: "Item has no id?" };
        }
    } catch (error) {
        return { status: false, error };
    }
}

export function unbind(player: Player) {
    if (!itemStack) {
        player.sendMessage("No item bind found.");
        return;
    }
    itemStack = undefined;
    stop(player);
    player.sendMessage("Unbound.");
}
