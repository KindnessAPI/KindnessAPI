varying vec3 vPos;
uniform float time;

void main () {
  gl_FragColor = vec4(vec3(vPos), 1.0);
}