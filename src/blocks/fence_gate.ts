import { BlockComponentOnPlaceEvent, BlockComponentPlayerInteractEvent, BlockCustomComponent, world } from "@minecraft/server";


export class FenceGateComponent implements BlockCustomComponent {
    constructor() {
        this.onPlace = this.onPlace.bind(this);
        this.onPlayerInteract = this.onPlayerInteract.bind(this);
    }

    public onPlace(event: BlockComponentOnPlaceEvent): void {
        const { block } = event;
        block.setPermutation(block.permutation.withState('vxl_mp:placed_bit', true));
    } 

    public onPlayerInteract(event: BlockComponentPlayerInteractEvent): void {
        const { block, face } = event;
        const open_bit = block.permutation.getState('vxl_mp:open_bit');
        const cardinal_direction = block.permutation.getState('minecraft:cardinal_direction');
        if(open_bit == false) {
            if(face == 'South' && (cardinal_direction == 'north'|| cardinal_direction == 'south')) {
                block.setPermutation(block.permutation.withState('minecraft:cardinal_direction', 'north'));
                block.setPermutation(block.permutation.withState('vxl_mp:open_bit', true));
            }
            if(face == 'North' && (cardinal_direction == 'north'|| cardinal_direction == 'south')) {
                block.setPermutation(block.permutation.withState('minecraft:cardinal_direction', 'south'));
                block.setPermutation(block.permutation.withState('vxl_mp:open_bit', true));
            }
            if(cardinal_direction == 'north' || cardinal_direction == 'south') {
                block.setPermutation(block.permutation.withState('vxl_mp:open_bit', true));
                block.dimension.playSound('open.fence_gate', block.location);
            }
            if(face == 'East' && (cardinal_direction == 'west'|| cardinal_direction == 'east')) {
                block.setPermutation(block.permutation.withState('minecraft:cardinal_direction', 'east'));
                block.setPermutation(block.permutation.withState('vxl_mp:open_bit', true));
            }
            if(face == 'West' && (cardinal_direction == 'west'|| cardinal_direction == 'east')) {
                block.setPermutation(block.permutation.withState('minecraft:cardinal_direction', 'west'));
                block.setPermutation(block.permutation.withState('vxl_mp:open_bit', true));
            }
            if(cardinal_direction == 'west' || cardinal_direction == 'east') {
                block.setPermutation(block.permutation.withState('vxl_mp:open_bit', true));
                block.dimension.playSound('open.fence_gate', block.location);
            }
        }
        if(open_bit == true) {
            if(face == 'South' && (cardinal_direction == 'north'|| cardinal_direction == 'south')) {
                block.setPermutation(block.permutation.withState('minecraft:cardinal_direction', 'north'));
                block.setPermutation(block.permutation.withState('vxl_mp:open_bit', false));
            }
            if(face == 'North' && (cardinal_direction == 'north'|| cardinal_direction == 'south')) {
                block.setPermutation(block.permutation.withState('minecraft:cardinal_direction', 'south'));
                block.setPermutation(block.permutation.withState('vxl_mp:open_bit', false));
            }
            if(cardinal_direction == 'north' || cardinal_direction == 'south') {
                block.setPermutation(block.permutation.withState('vxl_mp:open_bit', false));
                block.dimension.playSound('close.fence_gate', block.location);
            }
            if(face == 'East' && (cardinal_direction == 'west'|| cardinal_direction == 'east')) {
                block.setPermutation(block.permutation.withState('minecraft:cardinal_direction', 'east'));
                block.setPermutation(block.permutation.withState('vxl_mp:open_bit', false));
            }
            if(face == 'West' && (cardinal_direction == 'west'|| cardinal_direction == 'east')) {
                block.setPermutation(block.permutation.withState('minecraft:cardinal_direction', 'west'));
                block.setPermutation(block.permutation.withState('vxl_mp:open_bit', false));
            }
            if(cardinal_direction == 'west' || cardinal_direction == 'east') {
                block.setPermutation(block.permutation.withState('vxl_mp:open_bit', false));
                block.dimension.playSound('close.fence_gate', block.location);
            }
        }
    } 
}
