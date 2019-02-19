#include <common>
uniform sampler2D tPos;
uniform sampler2D tIdx;
uniform sampler2D tAudio;

varying vec3 v_tt;

void main() {
  // vec3 newPos = vec3(1.0);

  // position is changed to host uv vals
  vec4 tt = texture2D(tPos, position.xy);
  vec4 idx = texture2D(tIdx, position.xy);
  float squareIDX = idx.y;

  vec2 audioTextureDimension = vec2(
    64.0,
    1.0
  );
  vec2 audioUV = vec2(mod(squareIDX, 64.0), 0.0) / audioTextureDimension;
  vec4 audio = texture2D(tAudio, audioUV);

  v_tt = normalize(tt.xyz);

  vec4 mvPosition = modelViewMatrix * tt;
  vec4 outputPos = projectionMatrix * mvPosition;

  gl_Position = outputPos;
}
