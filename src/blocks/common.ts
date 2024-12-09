import { Block, Dimension, Direction } from "@minecraft/server";
import { Vector3 } from "../_import/vector";

export interface BlockNeighbors {
    north?: Block;
    south?: Block;
    east?:  Block;
    west?:  Block;
    above?: Block;
    below?: Block;
}

export class Common {
    public static getAdjacentBlock(face: Direction, dimension: Dimension, location: Vector3): Block | undefined{
        let offset: Vector3 = Vector3.ZERO;
        switch (face) {
            case Direction.North: offset = new Vector3(0,0,-1); break;
            case Direction.South: offset = new Vector3(0,0,1) ; break;
            case Direction.East : offset = new Vector3(1,0,0); break;
            case Direction.West : offset = new Vector3(-1,0,0) ; break;
            case Direction.Up   : offset = new Vector3(0,1,0) ; break;
            case Direction.Down : offset = new Vector3(0,-1,0); break;
        }
        return dimension.getBlock(Vector3.add(location, offset));
    }

    public static getBlockNeighbors(block: Block): BlockNeighbors {
        const neightbors = {
            north: block.north(), south: block.south(), east:  block.east(),
            west:  block.west(), above: block.above(), below: block.below()
        }
        return {
           north: neightbors.north?.typeId !== 'minecraft:short_grass'  && !neightbors.north?.hasTag('plant')  && !neightbors.north?.isAir  && !neightbors.north?.isLiquid ? neightbors.north : undefined,
           south: neightbors.south?.typeId !== 'minecraft:short_grass'  && !neightbors.south?.hasTag('plant')  && !neightbors.south?.isAir  && !neightbors.south?.isLiquid ? neightbors.south : undefined,
           east:  neightbors.east?.typeId !== 'minecraft:short_grass'   && !neightbors.east?.hasTag('plant')   && !neightbors.east?.isAir   && !neightbors.east?.isLiquid  ? neightbors.east  : undefined,
           west:  neightbors.west?.typeId !== 'minecraft:short_grass'   && !neightbors.west?.hasTag('plant')   && !neightbors.west?.isAir   && !neightbors.west?.isLiquid  ? neightbors.west  : undefined,
           above: neightbors.above?.typeId !== 'minecraft:short_grass'  && !neightbors.above?.hasTag('plant')  && !neightbors.above?.isAir  && !neightbors.above?.isLiquid ? neightbors.above : undefined,
           below: neightbors.below?.typeId !== 'minecraft:short_grass'  && !neightbors.below?.hasTag('plant')  && !neightbors.below?.isAir  && !neightbors.below?.isLiquid ? neightbors.below : undefined
        }
    }

    public static getNeighborIterator(neighbors: BlockNeighbors): Block[] {
        const blocks: Block[] = [];
        if (neighbors.north) blocks.push(neighbors.north);
        if (neighbors.south) blocks.push(neighbors.south);
        if (neighbors.east) blocks.push(neighbors.east);
        if (neighbors.west) blocks.push(neighbors.west);
        if (neighbors.above) blocks.push(neighbors.above);
        if (neighbors.below) blocks.push(neighbors.below);
        return blocks;
    }
    
}