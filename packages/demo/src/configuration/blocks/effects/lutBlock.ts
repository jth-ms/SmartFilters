import type { Effect } from "@babylonjs/core/Materials/effect";
import type { SmartFilter, IDisableableBlock, RuntimeData } from "@babylonjs/smart-filters";
import {
    ShaderBlock,
    ConnectionPointType,
    ShaderBinding,
    injectDisableUniform,
    createStrongRef,
} from "@babylonjs/smart-filters";
import { BlockNames } from "../blockNames";
import { Vector2 } from "@babylonjs/core";

const shaderProgram = injectDisableUniform({
    fragment: {
        uniform: `
            uniform sampler2D _input_;
            uniform sampler2D _lutTexture_;
            uniform float _level_;
            uniform vec2 _blueSlicesIn2DLayout_;
            uniform vec2 _texSize_;
            `,

        mainFunctionName: "_lutFilter_",

        mainInputTexture: "_input_",

        functions: [
            {
                name: "_lutFilter_",
                code: `
                vec4 _lutFilter_(vec2 vUV) {
                    vec3 color = texture2D(_input_, vUV).rgb;
                    vec4 tempColor = _getColorInLookupTable_(color, _lutTexture_, _blueSlicesIn2DLayout_, _texSize_);
                    color = mix(color, tempColor.rgb, _level_);
                    return vec4(color, 1.0);
                }
            `,
            },
            {
                name: "_getColorInLookupTable_",
                code: `
                vec4 _getColorInLookupTable_(in vec3 color, in sampler2D lookupTable, in vec2 blueSlicesIn2DLayout, in vec2 texSize) {
                    color = clamp(color, 0., 1.);

                    mediump float unboundBlueSlice = color.b * (blueSlicesIn2DLayout.x * blueSlicesIn2DLayout.y - 1.);

                    // Find the nearest lower bound quad location
                    mediump vec2 lowerBoundBlueSlice;
                    lowerBoundBlueSlice.y = floor(floor(unboundBlueSlice) / blueSlicesIn2DLayout.x);
                    lowerBoundBlueSlice.x = floor(unboundBlueSlice) - (lowerBoundBlueSlice.y * blueSlicesIn2DLayout.x);

                    // Find the nearest upper bound quad location
                    mediump vec2 upperBoundBlueSlice;
                    upperBoundBlueSlice.y = floor(ceil(unboundBlueSlice) / blueSlicesIn2DLayout.x);
                    upperBoundBlueSlice.x = ceil(unboundBlueSlice) - (upperBoundBlueSlice.y * blueSlicesIn2DLayout.x);

                    // Within the slices, find the position of the rg values in UV space
                    highp vec2 texPos1 = (lowerBoundBlueSlice / blueSlicesIn2DLayout) + vec2(0.5, 0.5) / texSize + (((vec2(1., 1.) / blueSlicesIn2DLayout) - vec2(1., 1.) / texSize) * color.rg);
                    highp vec2 texPos2 = (upperBoundBlueSlice / blueSlicesIn2DLayout) + vec2(0.5, 0.5) / texSize + (((vec2(1., 1.) / blueSlicesIn2DLayout) - vec2(1., 1.) / texSize) * color.rg);

                    // Get the two colors that we will interpolate in the LUT texture
                    lowp vec4 newColor1 = texture2D(lookupTable, texPos1);
                    lowp vec4 newColor2 = texture2D(lookupTable, texPos2);

                    // Interpolate between the two depending on our blue channel
                    lowp vec4 newColor = mix(newColor1, newColor2, fract(unboundBlueSlice));
                    return newColor;
                }
            `,
            },
        ],
    },
});

/**
 * The shader bindings for the Contrast block.
 */
export class LUTShaderBinding extends ShaderBinding {
    private readonly _inputTexture: RuntimeData<ConnectionPointType.Texture>;
    private readonly _lutTexture: RuntimeData<ConnectionPointType.Texture>;
    private readonly _level: RuntimeData<ConnectionPointType.Float>;

    /**
     * Creates a new shader binding instance for the Contrast block.
     * @param parentBlock - The parent block
     * @param inputTexture - The input texture
     * @param lutTexture - The LUT input texture
     * @param level - The level of the effect
     */
    constructor(
        parentBlock: IDisableableBlock,
        inputTexture: RuntimeData<ConnectionPointType.Texture>,
        lutTexture: RuntimeData<ConnectionPointType.Texture>,
        level: RuntimeData<ConnectionPointType.Float>
    ) {
        super(parentBlock);
        this._inputTexture = inputTexture;
        this._lutTexture = lutTexture;
        this._level = level;
    }

    getBlueSlicesIn2DLayout(): Vector2 {
        return new Vector2(2.0 /**numBlueSlicesPerRowIn2DLayout */, 17.0 /**numBlueSlicesPerColumnIn2DLayout */);
    }

    calculateTextureSize(): Vector2 {
        return this.getBlueSlicesIn2DLayout().multiply({
            x: 17.0,
            y: 17.0,
        });
    }

    /**
     * Binds all the required data to the shader when rendering.
     * @param effect - defines the effect to bind the data to
     */
    public override bind(effect: Effect): void {
        super.bind(effect);
        effect.setTexture(this.getRemappedName("input"), this._inputTexture.value);
        effect.setTexture(this.getRemappedName("lutTexture"), this._lutTexture.value);
        effect.setFloat(this.getRemappedName("level"), this._level.value);
        effect.setVector2(this.getRemappedName("blueSlicesIn2DLayout"), this.getBlueSlicesIn2DLayout());
        effect.setVector2(this.getRemappedName("texSize"), this.calculateTextureSize());
    }
}

/**
 * A simple block to change the LUT of a texture.
 */
export class LutBlock extends ShaderBlock {
    /**
     * The class name of the block.
     */
    public static override ClassName = BlockNames.lut;

    /**
     * The input texture connection point.
     */
    public readonly input = this._registerInput("input", ConnectionPointType.Texture);

    /**
     * The lut input texture connection point.
     */
    public readonly lutTexture = this._registerInput("LutTexture", ConnectionPointType.Texture);

    /**
     * The level connection point.
     */
    public readonly level = this._registerOptionalInput("level", ConnectionPointType.Float, createStrongRef(0.5));

    /**
     * The shader program (vertex and fragment code) to use to render the block
     */
    public static override ShaderCode = shaderProgram;

    /**
     * Instantiates a new Block.
     * @param smartFilter - The smart filter this block belongs to
     * @param name - The friendly name of the block
     */
    constructor(smartFilter: SmartFilter, name: string) {
        super(smartFilter, name);
    }

    /**
     * Get the class instance that binds all the required data to the shader (effect) when rendering.
     * @returns The class instance that binds the data to the effect
     */
    public getShaderBinding(): ShaderBinding {
        const input = this._confirmRuntimeDataSupplied(this.input);
        const lutTexture = this._confirmRuntimeDataSupplied(this.lutTexture);
        const level = this.level.runtimeData;

        return new LUTShaderBinding(this, input, lutTexture, level);
    }
}
