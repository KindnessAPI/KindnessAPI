#include <common>

varying vec3 v_tt;

void main() {
  gl_FragColor = vec4(
    abs(v_tt.x),
    abs(v_tt.y),
    abs(v_tt.z),
    0.6
  );
}
