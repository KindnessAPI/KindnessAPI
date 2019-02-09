void main()	{
  vec2 cellSize = 1.0 / resolution.xy;
  vec2 newCell = gl_FragCoord.xy;
  vec2 uv = newCell * cellSize;
  vec4 lastPos = texture2D(tPos, uv);

  lastPos.y += 0.1;

  gl_FragColor = lastPos;
}