import { Block, BlockComponentOnPlaceEvent, BlockComponentPlayerPlaceBeforeEvent, BlockCustomComponent, BlockPermutation, PlayerBreakBlockBeforeEvent, PlayerPlaceBlockAfterEvent, system, world } from "@minecraft/server";
import { BlockNeighbors, Common } from "./common";

export class WallComponent implements BlockCustomComponent {
    constructor() {
        this.onPlace = this.onPlace.bind(this);
        this.beforeOnPlayerPlace = this.beforeOnPlayerPlace.bind(this);
    }

    public onPlace(event: BlockComponentOnPlaceEvent): void {
        Wall.processNeighbors(event.block);
    } 
    public beforeOnPlayerPlace(event: BlockComponentPlayerPlaceBeforeEvent): void {
        Wall.setAsPlaced(event.block);
    } 
}

export class Wall {
    private static initialized: boolean = false;
    private static tagId: string = '';
    private static readonly stateId = {
        PlacedBit: "vxl_mp:placed_bit",
        WallPostBit: "vxl_mp:wall_post_bit",
        North: "vxl_mp:connection_type_north",
        South: "vxl_mp:connection_type_south",
        East: "vxl_mp:connection_type_east",
        West: "vxl_mp:connection_type_west",
        Above: "vxl_mp:connection_type_above",
        Below: "vxl_mp:connection_type_below"
    }
    public static initialize(tagId: string) {
        if (!Wall.initialized) {
            Wall.tagId = tagId;
            world.beforeEvents.playerBreakBlock.subscribe((event: PlayerBreakBlockBeforeEvent) => {
                const run: number = system.run(()=>{
                    if (event.block.hasTag(Wall.tagId)) {
                        Wall.processNeighbors(event.block)
                    } else {
                        const neighbors: BlockNeighbors = Common.getBlockNeighbors(event.block);
                        for (const neighbor of Common.getNeighborIterator(neighbors)) {
                            if (neighbor.hasTag(Wall.tagId)) Wall.processNeighbors(neighbor);
                        }
                    }
                    system.clearRun(run);
                })
            })
            world.afterEvents.playerPlaceBlock.subscribe((event: PlayerPlaceBlockAfterEvent)=>{
                const neighbors: BlockNeighbors = Common.getBlockNeighbors(event.block);
                for (const neighbor of Common.getNeighborIterator(neighbors)) {
                    if (neighbor.hasTag(Wall.tagId)) Wall.processNeighbors(neighbor);
                }
            })
        } else throw Error('Instance of Wall already active')
    }
    public static processNeighbors(block: Block) {
        const directions = {
            above: Wall.stateId.Above,
            below: Wall.stateId.Below,
            north: Wall.stateId.North,
            south: Wall.stateId.South,
            east: Wall.stateId.East,
            west: Wall.stateId.West,
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

