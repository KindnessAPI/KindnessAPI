#include <common>
uniform sampler2D tPos;

void main() {
  vec3 newPos = position;

  vec4 tt = texture2D(tPos, vec2(uv.x, uv.y / 30.0));

  newPos.y += sin(tt.y / 10.0) * 50.0;

  vec4 mvPosition = modelViewMatrix * vec4(newPos, 1.0);
  vec4 outputPos = projectionMatrix * mvPosition;

  gl_Position = outputPos;
}