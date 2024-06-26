import { world, Player } from "@minecraft/server";

export let id: string = "";

/**
 * Returns bool, if true then success.
 */
export function bind(player: Player) {
    try {
        const item = player
            .getComponent("inventory")
            ?.container?.getItem(player.selectedSlotIndex);
        if (item?.typeId) {
            id = item.typeId;
            return { status: true };
        } else {
            return { status: false, error: "Item has no id?" };
        }
    } catch (error) {
        return { status: false, error };
    }
}
