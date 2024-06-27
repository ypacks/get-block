import { world, system, Block, Player, ItemStack } from "@minecraft/server";
import { bind, unbind } from "./bind";
import { getBlock } from "./getblock";

interface command {
    name: string;
    description: string;
    use: string;
    howtouse?: string;
}

const commands: command[] = [
    {
        name: "bind",
        description:
            "Bind a tool to the get block command. (1 tool/item per world)",
        use: "$bind",
        howtouse:
            "Make sure you have the tool selected in your hotbar while running this command.",
    },
    {
        name: "unbind",
        description: "Unbind a tool.",
        use: "$unbind",
        howtouse: "Does to require for you to hold the item in your hotbar.",
    },
    {
        name: "help",
        description: "Help list",
        use: "$help",
    },
    {
        name: "help-we",
        description: "Help with binding to SIsilicon's World Edit addon.",
        use: "$help-we",
    },
];

function commandsList() {
    let output: string[] = [];
    commands.forEach((command) => {
        const values: string[] = Object.values(command);
        output.push("§l" + values[0]); // name
        output.push("§o" + values[1]); // description
        output.push("Usage: §i" + values[2]); // usage
        if (values[3]) {
            output.push(values[3]);
        }
    });
    return output;
}

world.afterEvents.chatSend.subscribe(async (arg) => {
    const message = arg.message;
    const player = arg.sender;

    if (!player.isOp || !player.hasTag("worldedit")) return;

    if (message[0] !== "$") return;
    const command = message.slice(1); // removes prefix

    switch (command) {
        case "help":
            commandsList().forEach((str) => player.sendMessage(str));
            player.sendMessage(
                "Run (help-we) to bind in SIsilicon's WorldEdit addon"
            );
            break;
        case "bind":
            const bindOutput = await bind(player);
            if (bindOutput.status) {
                player.sendMessage(`Bound to ${bindOutput.itemStack?.type}!`);
            } else {
                player.sendMessage("Bind failed!");
                console.error(bindOutput.error);
            }
            break;
        case "unbind":
            unbind(player);
            break;
        case "help-we":
            player.sendMessage(
                "$o$lThis addon is NOT affiliated or related to SIsilicon's WorldEdit addon. Therefore if this doesn't work, it's not his problem."
            );
            player.sendMessage(
                "Enter the following text into the §lCommand Tool §roption in the new tool menu:"
            );
            player.sendMessage("scriptevent gb:bind false");
        default:
            console.warn("Unknown command: $" + command);
            break;
    }
});

system.afterEvents.scriptEventReceive.subscribe(async (arg) => {
    if (arg.id !== "gb:bind") return;

    const msg = arg.message;
    let debug: boolean = false;

    if (msg === "true" || msg === "false") {
        debug = JSON.parse(msg); // hopefully a boolean value
    }

    try {
        const entity = arg.sourceEntity;
        const players = world.getAllPlayers();
        const player: Player | undefined = players.find(
            (player) => player.id === entity?.id
        );

        const raycast = entity?.getBlockFromViewDirection({
            maxDistance: 10,
            excludeTypes: ["minecraft:air"],
            includePassableBlocks: false,
            includeLiquidBlocks: false,
        });

        const block: Block | undefined = raycast?.block;

        if (!block) return;

        try {
            await getBlock(player, block, true);
        } catch (err) {
            console.error(err);
        }
    } catch (error) {
        if (debug) {
            console.error(error);
            world.sendMessage("Error running main script : " + "§4§l" + error);
        }
    }
});
