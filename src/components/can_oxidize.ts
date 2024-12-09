import { Block, BlockComponentPlayerDestroyEvent, BlockComponentRandomTickEvent, BlockCustomComponent, BlockPermutation, Vector3, world } from "@minecraft/server";

export class CanOxidizeComponent implements BlockCustomComponent {
    private agePropertyId: string = 'vxl_mp:age'
    private stateId: string = 'vxl_mp:stage'
    constructor() {
        this.onRandomTick = this.onRandomTick.bind(this);
        this.onPlayerDestroy = this.onPlayerDestroy.bind(this);
    }

    public onRandomTick(event: BlockComponentRandomTickEvent): void {
        let age = this.getBlockAge(event.block);
        if (age > 3) return;
    
        this.setBlockAge(event.block, age + 1);
    
        const stateMap = new Map<number, string>([
            [1, 'exposed_copper'],
            [2, 'oxidized_copper'],
            [3, 'weathered_copper']
        ]);
    
        const state = stateMap.get(age) || 'copper';
        const permutation: BlockPermutation = event.block.permutation;
        const currentState = permutation.getState(this.stateId) as string;
    
        if (state !== currentState) {
            event.block.setPermutation(permutation.withState(this.stateId, state));
        }
    }

    public onPlayerDestroy(event: BlockComponentPlayerDestroyEvent): void {
        const location: Vector3 = event.block.location;
        this.clearBlockAge(location);
    }

    private getBlockAgeId(location: Vector3): string {
        return `${this.agePropertyId}_${JSON.stringify(location)}`;
    }

    private getBlockAge(block: Block): number {
        const propertyId: string = this.getBlockAgeId(block);
        let age = world.getDynamicProperty(propertyId) as number | undefined;
        if (!age) age = 0;
        return age;
    }

    private setBlockAge(block: Block, number: number) {
        const propertyId: string = this.getBlockAgeId(block.location);
        world.setDynamicProperty(propertyId, number);
    }

    private clearBlockAge(location: Vector3) {
        const propertyId: string = this.getBlockAgeId(location);
        world.setDynamicProperty(propertyId, undefined);
    }
}