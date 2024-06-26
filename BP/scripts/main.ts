import { world } from "@minecraft/server"

world.afterEvents.chatSend.subscribe((arg) => {
    const message = arg.message
    const player = arg.sender

    if (!player.isOp || !player.hasTag("worldedit")) return

    if (message[0] !== "$") return
    const command = message.slice(1) // removes prefix
})