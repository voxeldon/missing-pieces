import { Block, BlockPermutation, ItemUseOnAfterEvent, world } from "@minecraft/server";
import { Common } from "./common";

export class Slab {
    private static initialized: boolean = false;
    private static readonly stateId: string = 'vxl_mp:vertical_half';
    private static readonly stateType = {
        Top: "top",
        Bottom: "bottom",
        Double: "double"
    }
    public static initialize(typeIds: string[]): void {
        if (!Slab.initialized) {
            world.afterEvents.itemUseOn.subscribe((event: ItemUseOnAfterEvent)=>{
                if (!typeIds.includes(event.itemStack.typeId)) return;
                Slab.onSlabUsed(event);
            })
            Slab.initialized = true;
        } else throw Error('Instance of Slab already active.')
    }

    private static onSlabUsed(event: ItemUseOnAfterEvent){
        const block: Block = event.block;
        const faceY: number = event.faceLocation.y;
        const placedBlock = Common.getAdjacentBlock(event.blockFace, event.block.dimension, event.block.location)

        if (!placedBlock) return;
        
        if ((block.typeId === event.itemStack.typeId) && Slab.setAsDoubleStack(block, faceY)) {
            placedBlock.setPermutation(BlockPermutation.resolve('minecraft:air'));
            return;
        }

        placedBlock.setPermutation(Slab.setAsRegular(placedBlock, faceY));
    }

    private static setAsDoubleStack(block: Block, faceY: number): boolean {
        const state = block.permutation.getState(Slab.stateId) as string | undefined;
        if (state && (state === Slab.stateType.Top && faceY < 0.45) ||(state === Slab.stateType.Bottom && faceY === 0.5)) {
            block.setPermutation(block.permutation.withState(Slab.stateId, Slab.stateType.Double));
            return true;
        } return false;
    }

    private static setAsRegular(block: Block, faceY: number): BlockPermutation {
        if ((faceY > 0.5 && faceY < 1) || faceY === 0) {   
            return block.permutation.withState(Slab.stateId, Slab.stateType.Top);
        } return block.permutation.withState(Slab.stateId, Slab.stateType.Bottom);
    }
}