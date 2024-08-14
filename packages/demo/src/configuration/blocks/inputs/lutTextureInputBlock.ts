import type { ThinEngine } from "@babylonjs/core";
import { TextureInputBlock, type SmartFilter, type TextureConfig } from "@babylonjs/smart-filters";

export class LutTextureInputBlock extends TextureInputBlock {
    constructor(smartFilter: SmartFilter, engine: ThinEngine, url: string) {
        const textureConfig: TextureConfig = { anisotropicFilteringLevel: 1, flipY: false };
        super(smartFilter, engine, url, textureConfig);
    }
}
