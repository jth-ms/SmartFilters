import {
    BURN_17_17_34_LUT_DATA_URI,
    BW_17_17_34_LUT_DATA_URI,
    BW_COOL_17_17_34_LUT_DATA_URI,
    BW_HIGH_CONTRAST_17_17_34_LUT_DATA_URI,
    BW_WARM_17_17_34_LUT_DATA_URI,
    CALM_17_17_34_LUT_DATA_URI,
    COOL_LIGHT_17_17_34_LUT_DATA_URI,
    DRAMATIC_COOL_17_17_34_LUT_DATA_URI,
    FILM_17_17_34_LUT_DATA_URI,
    GOLDEN_17_17_34_LUT_DATA_URI,
    PUNCH_17_17_34_LUT_DATA_URI,
    RADIATE_17_17_34_LUT_DATA_URI,
    VINTAGE_17_17_34_LUT_DATA_URI,
    VIVID_COOL_17_17_34_LUT_DATA_URI,
    WARM_CONTRAST_17_17_34_LUT_DATA_URI,
    type TexturePreset,
} from "@babylonjs/smart-filters-editor";

/**
 * Texture presets are used to provide a list of assets that can be used
 * easily in the editor.
 *
 * You can either a base64 encoded image or a URL to an image.
 *
 * For a URL to an image, you can add the assets to packages/demo/www/assets then add them to this list.
 *
 */
export const texturePresets: TexturePreset[] = [
    {
        name: "Bablyon.js Logo",
        url: "/assets/logo.png",
    },
    {
        name: "Kittens",
        url: "/assets/kittens.jpg",
    },
    {
        name: "Burn LUT",
        url: BURN_17_17_34_LUT_DATA_URI,
    },
    {
        name: "BW LUT",
        url: BW_17_17_34_LUT_DATA_URI,
    },
    {
        name: "BW Cool LUT",
        url: BW_COOL_17_17_34_LUT_DATA_URI,
    },
    {
        name: "BW High Contrast LUT",
        url: BW_HIGH_CONTRAST_17_17_34_LUT_DATA_URI,
    },
    {
        name: "BW Warm LUT",
        url: BW_WARM_17_17_34_LUT_DATA_URI,
    },
    {
        name: "Calm LUT",
        url: CALM_17_17_34_LUT_DATA_URI,
    },
    {
        name: "Cool Light LUT",
        url: COOL_LIGHT_17_17_34_LUT_DATA_URI,
    },
    {
        name: "Dramatic Cool LUT",
        url: DRAMATIC_COOL_17_17_34_LUT_DATA_URI,
    },
    {
        name: "Film LUT",
        url: FILM_17_17_34_LUT_DATA_URI,
    },
    {
        name: "Golden LUT",
        url: GOLDEN_17_17_34_LUT_DATA_URI,
    },
    {
        name: "Punch LUT",
        url: PUNCH_17_17_34_LUT_DATA_URI,
    },
    {
        name: "Radiate LUT",
        url: RADIATE_17_17_34_LUT_DATA_URI,
    },
    {
        name: "Vintage LUT",
        url: VINTAGE_17_17_34_LUT_DATA_URI,
    },
    {
        name: "Vivid Cool LUT",
        url: VIVID_COOL_17_17_34_LUT_DATA_URI,
    },
    {
        name: "Warm Contrast LUT",
        url: WARM_CONTRAST_17_17_34_LUT_DATA_URI,
    },
];
