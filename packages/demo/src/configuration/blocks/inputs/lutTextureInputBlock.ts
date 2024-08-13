import { ConnectionPointType, type SmartFilter, type RuntimeData, InputBlock } from "@babylonjs/smart-filters";

export class LutTextureInputBlock extends InputBlock<ConnectionPointType.Texture> {
    constructor(smartFilter: SmartFilter, initialValue: RuntimeData<ConnectionPointType.Texture>) {
        super(smartFilter, "LutTexture", ConnectionPointType.Texture, initialValue);
    }
}
