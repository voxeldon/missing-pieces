import { world } from "@minecraft/server";
import { Slab } from "./blocks/slab";
import { Strip } from "./util/strip";
import { ClimbableComponent } from "./blocks/ladder";
import { Wall, WallComponent } from "./blocks/wall";
import { Fence, FenceComponent } from "./blocks/fence";
import { CanOxidizeComponent } from "./components/can_oxidize";
import { AcmApi, AddonConfiguration } from "./_import/acm_api";
import { FenceGateComponent } from "./blocks/fence_gate";

const logSlabTypeIds: string[] = [
    "vxl_mp:acacia_log_slab",
    "vxl_mp:birch_log_slab",
    "vxl_mp:cherry_log_slab",
    "vxl_mp:crimson_stem_slab",
    "vxl_mp:dark_oak_log_slab",
    "vxl_mp:jungle_log_slab",
    "vxl_mp:oak_log_slab",
    "vxl_mp:spruce_log_slab",
    "vxl_mp:warped_stem_slab",
    "vxl_mp:mangrove_log_slab",
    "vxl_mp:pale_oak_log_slab"
]

const strippedSlabTypeIds: string[] = [
    "vxl_mp:stripped_acacia_log_slab",
    "vxl_mp:stripped_birch_log_slab",
    "vxl_mp:stripped_cherry_log_slab",
    "vxl_mp:stripped_crimson_stem_slab",
    "vxl_mp:stripped_dark_oak_log_slab",
    "vxl_mp:stripped_jungle_log_slab",
    "vxl_mp:stripped_oak_log_slab",
    "vxl_mp:stripped_spruce_log_slab",
    "vxl_mp:stripped_warped_stem_slab",
    "vxl_mp:stripped_mangrove_log_slab",
    "vxl_mp:stripped_pale_oak_log_slab"
]

const slabTypeIds: string[] = [...logSlabTypeIds, ...strippedSlabTypeIds];

Slab.initialize(slabTypeIds);
Strip.initialize(logSlabTypeIds);

world.beforeEvents.worldInitialize.subscribe(initEvent => {
    initEvent.blockComponentRegistry.registerCustomComponent('vxl_mp:climbable', new ClimbableComponent());
    initEvent.blockComponentRegistry.registerCustomComponent('vxl_mp:wall', new WallComponent());
    initEvent.blockComponentRegistry.registerCustomComponent('vxl_mp:fence', new FenceComponent());
    initEvent.blockComponentRegistry.registerCustomComponent('vxl_mp:fence_gate', new FenceGateComponent());
    initEvent.blockComponentRegistry.registerCustomComponent('vxl_mp:can_oxidize', new CanOxidizeComponent());
});

Wall.initialize('vxl_mp_wall');
Fence.initialize('vxl_mp_fence');

const missingPieces: AddonConfiguration = {
    authorId: 'vxl',
    packId: 'mp',
    iconPath: 'voxel/vxl_mp/pack_icon',
    guideKeys: [
        "guide.title",
        "guide.recipes.title",
        "guide.recipes.desc",
        "guide.items.title",
        "guide.items.desc",
        "guide.blocks.title",
        "guide.ac.title",
        "guide.ac.desc",
        "guide.bi.title",
        "guide.bi.desc",
        "guide.ch.title",
        "guide.ch.desc",
        "guide.cr.title",
        "guide.cr.desc",
        "guide.do.title",
        "guide.do.desc",
        "guide.ju.title",
        "guide.ju.desc",
        "guide.ma.title",
        "guide.ma.desc",
        "guide.oak.title",
        "guide.oak.desc",
        "guide.po.title",
        "guide.po.desc",
        "guide.sp.title",
        "guide.sp.desc",
        "guide.wa.title",
        "guide.wa.desc",
        "guide.cd.title",
        "guide.cd.desc",
        "guide.cb.title",
        "guide.cb.desc",
        "guide.mc.title",
        "guide.mc.desc",
        "guide.da_pr.title",
        "guide.da_pr.desc",
        "guide.pr_br.title",
        "guide.pr_br.desc",
        "guide.co.title",
        "guide.co.desc"
    ]
}
AcmApi.generateAddonProfile(missingPieces);