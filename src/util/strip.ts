import { Block, BlockPermutation, ItemStack, ItemUseAfterEvent, world } from "@minecraft/server";

export class Strip {
    private static maxReach: number = 8;
    private static initialized: boolean = false;
    public static initialize(typeIds: string[]): void {
        if (!Strip.initialized) {
            world.afterEvents.itemUse.subscribe((event: ItemUseAfterEvent)=>{
                const itemStack: ItemStack = event.itemStack;
                if (!itemStack.hasTag('minecraft:is_axe')) return;
                const block: Block | undefined = event.source.getBlockFromViewDirection({maxDistance: Strip.maxReach})?.block;
                if (!block || !typeIds.includes(block.typeId)) return;
                Strip.onStripUsed(block);
            })
            Strip.initialized = true;
        } else throw Error('Instance of Strip already active.')
    }

    private static onStripUsed(block: Block) {
        const states: Record<string, boolean | number | string> = block.permutation.getAllStates();
        const split: string[] = block.typeId.split(':');
        const typeId: string = `${split[0]}:stripped_${split[1]}`;
        const strippedBlock: BlockPermutation = BlockPermutation.resolve(typeId, states);
        block.setPermutation(strippedBlock);
    }
}