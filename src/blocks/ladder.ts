import { BlockComponentTickEvent, BlockCustomComponent, Entity, } from "@minecraft/server";
import { Vector3 } from "../_import/vector";

export class ClimbableComponent implements BlockCustomComponent {
    constructor() {
        this.onTick = this.onTick.bind(this);
    }

    public onTick(event: BlockComponentTickEvent): void {
        const entity: Entity | undefined = event.block.dimension.getEntities({ location: new Vector3(event.block.location.x,event.block.location.y + 0.25 ,event.block.location.z), maxDistance: 1 })[0];
        if (entity) this.processClimb(entity);
    }

    public processClimb(entity: Entity) {
        const i = Vector3.normalize(entity.getViewDirection());
        const rotX: number = entity.getRotation().x;
        if (entity.isSneaking && !entity.isOnGround) {
            entity.applyKnockback(0, 0, 0, 0.012)
        } else if (rotX > 55) {
            entity.applyKnockback(i.x, i.z, 0.1, -0.1);
        } else entity.applyKnockback(i.x, i.z, 0.1, 0.1);

    }
}

