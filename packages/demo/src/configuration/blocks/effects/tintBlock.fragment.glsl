uniform sampler2D input; // main
uniform float intensity;
uniform vec3 tintColor;

vec4 tint(vec2 vUV) { // main
    
    vec4 textureColor = texture2D(_input_, vUV);
    vec3 tintedRGB = mix(textureColor.rgb, tintColor, intensity);
    return vec4(tintedRGB, textureColor.a);
}