import { Block, BlockComponentOnPlaceEvent, BlockComponentPlayerPlaceBeforeEvent, BlockCustomComponent, BlockPermutation, PlayerBreakBlockBeforeEvent, PlayerPlaceBlockAfterEvent, system, world } from "@minecraft/server";
import { BlockNeighbors, Common } from "./common";

export class FenceComponent implements BlockCustomComponent {
    constructor() {
        this.onPlace = this.onPlace.bind(this);
        this.beforeOnPlayerPlace = this.beforeOnPlayerPlace.bind(this);
    }

    public onPlace(event: BlockComponentOnPlaceEvent): void {
        Fence.processNeighbors(event.block);
    } 
    public beforeOnPlayerPlace(event: BlockComponentPlayerPlaceBeforeEvent): void {
        Fence.setAsPlaced(event.block);
    } 
}
export class Fence {
    private static initialized: boolean = false;
    private static tagId: string = '';
    private static readonly stateId = {
        North: "vxl_mp:connection_type_north",
        South: "vxl_mp:connection_type_south",
        East: "vxl_mp:connection_type_east",
        West: "vxl_mp:connection_type_west"
    }
    public static initialize(tagId: string) {
        if (!Fence.initialized) {
            Fence.tagId = tagId;
            world.beforeEvents.playerBreakBlock.subscribe((event: PlayerBreakBlockBeforeEvent) => {
                const run: number = system.run(()=>{
                    if (event.block.hasTag(Fence.tagId)) {
                        Fence.processNeighbors(event.block)
                    } else {
                        const neighbors: BlockNeighbors = Common.getBlockNeighbors(event.block);
                        for (const neighbor of Common.getNeighborIterator(neighbors)) {
                            if (neighbor.hasTag(Fence.tagId)) Fence.processNeighbors(neighbor);
                        }
                    }
                    system.clearRun(run);
                })
            })
            world.afterEvents.playerPlaceBlock.subscribe((event: PlayerPlaceBlockAfterEvent)=>{
                const neighbors: BlockNeighbors = Common.getBlockNeighbors(event.block);
                for (const neighbor of Common.getNeighborIterator(neighbors)) {
                    if (neighbor.hasTag(Fence.tagId)) Fence.processNeighbors(neighbor);
                }
            })
        } else throw Error('Instance of Fence already active')
    }
    public static processNeighbors(block: Block) {
        const directions = {
            north: Fence.stateId.North,
            south: Fence.stateId.South,
            east: Fence.stateId.East,
            west: Fence.stateId.West,
        };

        const blocks: Block[] = [block];
        const neighbors: BlockNeighbors = Common.getBlockNeighbors(block);

        // Collect all neighboring blocks of the same type
        for (const direction in neighbors) {
            const neighbor = neighbors[direction as keyof BlockNeighbors];
            if (neighbor) {
                blocks.push(neighbor);
            }
        }

        // Process each block in the list
        for (const currentBlock of blocks) {
            if (currentBlock.isAir || currentBlock.isLiquid || !currentBlock.isValid()) continue;
            let permutation: BlockPermutation = currentBlock.permutation;
            const currentNeighbors = Common.getBlockNeighbors(currentBlock);

            // Apply the states dynamically based on the current block's neighbors
            for (const [direction, stateId] of Object.entries(directions)) {
                if (permutation.getState(stateId) !== undefined) {
                    const isConnected = currentNeighbors[direction as keyof BlockNeighbors]?.isValid();
                    permutation = permutation.withState(stateId, isConnected || false);
                }
            }
            // Apply the final permutation with all the state changes to the current block
            currentBlock.setPermutation(permutation);
        }
    }

    public static setAsPlaced(block: Block): void {
        system.waitTicks(1).then(()=>{
            block.setPermutation(block.permutation.withState('vxl_mp:placed_bit', true));
        })
    }
}

