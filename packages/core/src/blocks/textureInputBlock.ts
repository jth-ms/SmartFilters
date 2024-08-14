import type { ThinEngine } from "@babylonjs/core";
import type { SmartFilter } from "../smartFilter";
import { createStrongRef } from "../runtime/strongRef.js";
import { ConnectionPointType } from "../connection/connectionPointType.js";
import { InputBlock } from "./inputBlock.js";
import { createImageTexture } from "../utils/textureLoaders.js";

/**
 * Configuration for a texture input block.
 */
export type TextureConfig = {
    /**
     * Indicates if the Y axis should be flipped
     */
    flipY?: boolean;
    /**
     * The sampling mode to use
     */
    samplingMode?: number;
    /**
     * Defines the extension to use to pick the right loader
     */
    forcedExtension?: string;
    /**
     * Defines the anisotropic level to use
     */
    anisotropicFilteringLevel?: number;
};
/**
 * A block that represents a texture input.
 */
export class TextureInputBlock extends InputBlock<ConnectionPointType.Texture> {
    /**
     * TextureInputBlock
     * @param smartFilter - The smart filter to which this block belongs
     * @param engine - The engine to use to create the texture
     * @param url - The URL of the image to use as a texture
     * @param textureConfig - Configuration for the texture
     */
    constructor(smartFilter: SmartFilter, engine: ThinEngine, url: string, textureConfig?: TextureConfig) {
        const initialValue = createImageTexture(
            engine,
            url,
            textureConfig?.flipY,
            textureConfig?.samplingMode,
            textureConfig?.forcedExtension
        );
        initialValue.anisotropicFilteringLevel = textureConfig?.anisotropicFilteringLevel ?? 4;
        super(smartFilter, "Texture", ConnectionPointType.Texture, createStrongRef(initialValue));
    }
}
