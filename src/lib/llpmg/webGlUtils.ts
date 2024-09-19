// utils/webglUtils.ts
const vertexShaderSource = `
  precision mediump float;
  varying vec2 vUv;
  attribute vec2 a_position;
  void main() {
      vUv = .5 * (a_position + 1.);
      gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const fragmentShaderSource = `
  precision mediump float;
  varying vec2 vUv;
  uniform float u_time;
  uniform float u_ratio;
  uniform vec2 u_pointer_position;
  uniform float u_scroll_progress;
  vec2 rotate(vec2 uv, float th) {
      return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
  }
  float neuro_shape(vec2 uv, float t, float p) {
      vec2 sine_acc = vec2(0.);
      vec2 res = vec2(0.);
      float scale = 8.;
      for (int j = 0; j < 15; j++) {
          uv = rotate(uv, 1.);
          sine_acc = rotate(sine_acc, 1.);
          vec2 layer = uv * scale + float(j) + sine_acc - t;
          sine_acc += sin(layer);
          res += (.5 + .5 * cos(layer)) / scale;
          scale *= (1.2 - .07 * p);
      }
      return res.x + res.y;
  }
  void main() {
      vec2 uv = .5 * vUv;
      uv.x *= u_ratio;
      vec2 pointer = vUv - u_pointer_position;
      pointer.x *= u_ratio;
      float p = clamp(length(pointer), 0., 1.);
      p = .5 * pow(1. - p, 2.);
      float t = .001 * u_time;
      vec3 color = vec3(0.);
      float noise = neuro_shape(uv, t, p);
      noise = 1.2 * pow(noise, 3.);
      noise += pow(noise, 10.);
      noise = max(.0, noise - .5);
      noise *= (1. - length(vUv - .5));
      color = normalize(vec3(.2, .5 + .4 * cos(3. * u_scroll_progress), .5 + .5 * sin(3. * u_scroll_progress)));
      color = color * noise;
      gl_FragColor = vec4(color, noise);
  }
`;

export function initShader(gl: WebGLRenderingContext) {
  const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
  if (!program) return { render: () => {}, cleanup: () => {} };

  const uniforms = getUniforms(gl, program);
  const positionLocation = gl.getAttribLocation(program, 'a_position');

  const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  gl.useProgram(program);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  const render = (time: number, pointer: { x: number, y: number, tX: number, tY: number }) => {
    pointer.x += (pointer.tX - pointer.x) * 0.5;
    pointer.y += (pointer.tY - pointer.y) * 0.5;

    gl.uniform1f(uniforms.u_time, time);
    gl.uniform2f(uniforms.u_pointer_position, pointer.x / window.innerWidth, 1 - pointer.y / window.innerHeight);
    gl.uniform1f(uniforms.u_scroll_progress, window.pageYOffset / (2 * window.innerHeight));

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  const cleanup = () => {
    gl.deleteProgram(program);
    gl.deleteBuffer(vertexBuffer);
  };

  return { render, cleanup };
}

export function setupEvents(canvas: HTMLCanvasElement) {
  const pointer = { x: 0, y: 0, tX: 0, tY: 0 };

  const updateMousePosition = (eX: number, eY: number) => {
    pointer.tX = eX;
    pointer.tY = eY;
  };

  canvas.addEventListener('pointermove', (e) => updateMousePosition(e.clientX, e.clientY));
  canvas.addEventListener('touchmove', (e) => updateMousePosition(e.targetTouches[0].clientX, e.targetTouches[0].clientY));
  canvas.addEventListener('click', (e) => updateMousePosition(e.clientX, e.clientY));

  return pointer;
}

export function resizeCanvas(canvas: HTMLCanvasElement, gl: WebGLRenderingContext) {
  const devicePixelRatio = Math.min(window.devicePixelRatio, 2);
  canvas.width = window.innerWidth * devicePixelRatio;
  canvas.height = window.innerHeight * devicePixelRatio;
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.uniform1f(gl.getUniformLocation(gl.getParameter(gl.CURRENT_PROGRAM), 'u_ratio'), canvas.width / canvas.height);
}

function createShaderProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string) {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource);
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource);

  const program = gl.createProgram();
  if (!program || !vertexShader || !fragmentShader) return null;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(program));
    return null;
  }

  return program;
}

function loadShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function getUniforms(gl: WebGLRenderingContext, program: WebGLProgram) {
  return {
    u_time: gl.getUniformLocation(program, 'u_time'),
    u_ratio: gl.getUniformLocation(program, 'u_ratio'),
    u_pointer_position: gl.getUniformLocation(program, 'u_pointer_position'),
    u_scroll_progress: gl.getUniformLocation(program, 'u_scroll_progress'),
  };
}