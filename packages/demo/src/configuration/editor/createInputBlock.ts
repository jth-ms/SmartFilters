import type { Nullable } from "@babylonjs/core/types";
import {
    ConnectionPointType,
    createImageTexture,
    createStrongRef,
    type BaseBlock,
    type RuntimeData,
} from "@babylonjs/smart-filters";
import { createDefaultValue, type GlobalState } from "@babylonjs/smart-filters-editor";
import { WebCamInputBlock } from "../blocks/inputs/webCamInputBlock";
import { LutTextureInputBlock } from "../blocks/inputs/lutTextureInputBlock";
import { BURN_17_17_34_LUT_DATA_URI } from "@babylonjs/smart-filters-editor";
/**
 * Intercepts the creation of an input block and can return specialized input blocks.
 * @param globalState - The global state of the editor.
 * @param type - The type of input block to create.
 * @returns Optionally creates an InputBock and returns it, null otherwise
 */
export function createInputBlock(globalState: GlobalState, type: string): Nullable<BaseBlock> {
    switch (type) {
        case "WebCam":
            return new WebCamInputBlock(
                globalState.smartFilter,
                globalState.engine,
                createDefaultValue(ConnectionPointType.Texture, globalState.engine)
            );
        case "LutTexture":
            return new LutTextureInputBlock(
                globalState.smartFilter,
                createStrongRef(
                    createImageTexture(globalState.engine, BURN_17_17_34_LUT_DATA_URI, false, undefined, undefined, 1)
                ) as RuntimeData<ConnectionPointType.Texture>
            );
    }
    return null;
}
