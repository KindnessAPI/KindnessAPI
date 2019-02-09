varying vec3 vPos;
uniform float time;
uniform vec3 accel;

void main () {
  vec3 newAccel = accel;
  // newAccel.y -= 0.2;
  gl_FragColor = vec4(vec3(vPos + abs(newAccel.y)), 1.0);
}