import type { ThinEngine } from "@babylonjs/core/Engines/thinEngine";
import {
    ConnectionPointType,
    InputBlock,
    SmartFilter,
    createImageTexture,
    createStrongRef,
} from "@babylonjs/smart-filters";
import { HardCodedSmartFilterNames } from "./hardCodedSmartFilterNames";
import { LutBlock } from "../../blocks/effects/lutBlock";
import { LutTextureInputBlock } from "../../blocks/inputs/lutTextureInputBlock";
import { BURN_17_17_34_LUT_DATA_URI } from "@babylonjs/smart-filters-editor";

export function creatLutKittensFilter(engine: ThinEngine): SmartFilter {
    const smartFilter = new SmartFilter(HardCodedSmartFilterNames.lutKittens);
    const kittenTexture = createImageTexture(engine, "/assets/kittens.jpg");
    const kittenInput = new InputBlock(
        smartFilter,
        "kittenImage",
        ConnectionPointType.Texture,
        createStrongRef(kittenTexture)
    );
    const lutBlock = new LutBlock(smartFilter, "Lut");
    const lutDisabled = new InputBlock(smartFilter, "lutDisabled", ConnectionPointType.Boolean, false);
    const lutLevel = new InputBlock(smartFilter, "lutLevel", ConnectionPointType.Float, 1.0);
    const lutBWWarmTexture = createImageTexture(engine, BURN_17_17_34_LUT_DATA_URI, false, undefined, undefined, 1);
    const lutTexture = new LutTextureInputBlock(smartFilter, createStrongRef(lutBWWarmTexture));

    kittenInput.output.connectTo(lutBlock.input);
    lutDisabled.output.connectTo(lutBlock.disabled);
    lutLevel.output.connectTo(lutBlock.level);
    lutTexture.output.connectTo(lutBlock.lutTexture);
    lutBlock.output.connectTo(smartFilter.output);

    return smartFilter;
}
