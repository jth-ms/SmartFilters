import { BlockNodeData } from "./blockNodeData.js";
import type { ConnectionPoint, SmartFilter, RuntimeData } from "@babylonjs/smart-filters";
import { InputBlock, ConnectionPointType, createStrongRef, createImageTexture } from "@babylonjs/smart-filters";
import type { GlobalState } from "../globalState";
import type { INodeContainer } from "@babylonjs/shared-ui-components/nodeGraphSystem/interfaces/nodeContainer";
import type { IPortData } from "@babylonjs/shared-ui-components/nodeGraphSystem/interfaces/portData";
import type { StateManager } from "@babylonjs/shared-ui-components/nodeGraphSystem/stateManager";
import type { ThinEngine } from "@babylonjs/core/Engines/thinEngine";
import { BURN_17_17_34_LUT_DATA_URI } from "../assets/lutDataURIs.js";

import "@babylonjs/core/Engines/Extensions/engine.dynamicTexture.js";
import "@babylonjs/core/Engines/Extensions/engine.videoTexture.js";

/**
 * Creates a default value for the input block of a certain type
 * @param type - defines the type of the input block
 * @param engine - defines the ThinEngine of the input block
 * @param name - defines the name of the input block
 * @returns a strong ref containing the default value
 */
export function createDefaultValue<U extends ConnectionPointType>(
    type: U,
    engine: ThinEngine,
    name?: string
): RuntimeData<U> {
    // conversion needed due to https://github.com/microsoft/TypeScript/issues/33014
    switch (type) {
        case ConnectionPointType.Boolean:
            return createStrongRef(false) as RuntimeData<U>;
        case ConnectionPointType.Float:
            return createStrongRef(0) as RuntimeData<U>;
        case ConnectionPointType.Color3:
            return createStrongRef({ r: 0, g: 0, b: 0 }) as RuntimeData<U>;
        case ConnectionPointType.Texture:
            if (name === "LutTexture") {
                return createStrongRef(
                    createImageTexture(engine, BURN_17_17_34_LUT_DATA_URI, false, undefined, undefined, 1)
                ) as RuntimeData<U>;
            } else {
                return createStrongRef(createImageTexture(engine, "/assets/logo.png")) as RuntimeData<U>;
            }
        default:
            throw new Error(`Unknown connection point type ${type}`);
    }
}

export function createDefaultInput<U extends ConnectionPointType>(
    smartFilter: SmartFilter,
    type: U,
    engine: ThinEngine
): InputBlock<U> {
    const name = ConnectionPointType[type] ?? "Unknown";
    const inputBlock = new InputBlock(smartFilter, name, type, createDefaultValue(type, engine, name));
    return inputBlock;
}

export function createDefaultInputForConnectionPoint<U extends ConnectionPointType>(
    smartFilter: SmartFilter,
    point: ConnectionPoint<U>,
    engine: ThinEngine
): InputBlock<U> {
    const name = point.name;
    const inputBlock = new InputBlock(
        smartFilter,
        name,
        point.type,
        point.defaultRuntimeData ?? createDefaultValue(point.type, engine, point.name)
    );
    return inputBlock;
}

export const RegisterDefaultInput = (stateManager: StateManager) => {
    stateManager.createDefaultInputData = (rootData: any, portData: IPortData, nodeContainer: INodeContainer) => {
        const point = portData.data as ConnectionPoint;
        // const customInputBlock = point.createCustomInputBlock();
        const pointName = "output";
        // let emittedBlock;

        const globalState = rootData as GlobalState;

        const smartFilter = globalState.smartFilter;
        // if (!customInputBlock) {
        // if (point.type === SmartFilterConnectionPointTypes.AutoDetect) {
        //     return null;
        // }
        const emittedBlock = createDefaultInputForConnectionPoint(smartFilter, point, globalState.engine);
        // } else {
        //     [emittedBlock, pointName] = customInputBlock;
        // }

        // TODO. Dynamic block creation
        // smartFilter.attachedBlocks.push(emittedBlock);
        // if (!emittedBlock.isInput) {
        //     emittedBlock.autoConfigure(smartFilter);
        // }

        return {
            data: new BlockNodeData(emittedBlock, nodeContainer),
            name: pointName,
        };
    };
};
