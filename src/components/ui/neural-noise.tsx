"use client";

import { useEffect, useRef } from "react";

interface NeuralNoiseProps {
  color?: [number, number, number];
  opacity?: number;
  speed?: number;
}

const VS = `
  precision mediump float;
  varying vec2 vUv;
  attribute vec2 a_position;
  void main() {
    vUv = 0.5 * (a_position + 1.0);
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FS = `
  precision mediump float;
  varying vec2 vUv;
  uniform float u_time;
  uniform float u_ratio;
  uniform vec2 u_pointer_position;
  uniform vec3 u_color;
  uniform float u_speed;
  vec2 rotate(vec2 uv, float th) {
    return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
  }
  float neuro_shape(vec2 uv, float t, float p) {
    vec2 sine_acc = vec2(0.0);
    vec2 res = vec2(0.0);
    float scale = 8.0;
    for (int j = 0; j < 15; j++) {
      uv = rotate(uv, 1.0);
      sine_acc = rotate(sine_acc, 1.0);
      vec2 layer = uv * scale + float(j) + sine_acc - t;
      sine_acc += sin(layer) + 2.4 * p;
      res += (0.5 + 0.5 * cos(layer)) / scale;
      scale *= 1.2;
    }
    return res.x + res.y;
  }
  void main() {
    vec2 uv = 0.5 * vUv;
    uv.x *= u_ratio;
    vec2 pointer = vUv - u_pointer_position;
    pointer.x *= u_ratio;
    float p = clamp(length(pointer), 0.0, 1.0);
    p = 0.5 * pow(1.0 - p, 2.0);
    float t = u_speed * u_time;
    float noise = neuro_shape(uv, t, p);
    noise = 1.2 * pow(noise, 3.0);
    noise += pow(noise, 10.0);
    noise = max(0.0, noise - 0.5);
    noise *= (1.0 - length(vUv - 0.5));
    vec3 col = u_color * noise;
    gl_FragColor = vec4(col, noise);
  }
`;

export function NeuralNoise({
  color = [1.0, 0.42, 0.17],
  opacity = 0.85,
  speed = 0.0008,
}: NeuralNoiseProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const pointer = { x: 0.5, y: 0.5, tX: 0.5, tY: 0.5 };
    let rafId = 0;

    const gl = (
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")
    ) as WebGLRenderingContext | null;
    if (!gl) return;

    const mkShader = (type: number, src: string): WebGLShader | null => {
      const s = gl.createShader(type);
      if (!s) return null;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error("Shader:", gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    };

    const vs = mkShader(gl.VERTEX_SHADER, VS);
    const fs = mkShader(gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    if (!prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;

    const uniforms: Record<string, WebGLUniformLocation | null> = {};
    const uCount = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS) as number;
    for (let i = 0; i < uCount; i++) {
      const info = gl.getActiveUniform(prog, i);
      if (info) uniforms[info.name] = gl.getUniformLocation(prog, info.name);
    }

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.useProgram(prog);
    const posLoc = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);
    gl.uniform3f(uniforms.u_color, color[0], color[1], color[2]);
    gl.uniform1f(uniforms.u_speed, speed);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      gl.uniform1f(uniforms.u_ratio, canvas.width / canvas.height);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resize();
    window.addEventListener("resize", resize);

    const track = (x: number, y: number) => { pointer.tX = x; pointer.tY = y; };
    const onMove = (e: PointerEvent) => track(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      if (e.targetTouches[0]) track(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
    };
    const onClickEv = (e: MouseEvent) => track(e.clientX, e.clientY);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("touchmove", onTouch);
    window.addEventListener("click", onClickEv);

    const render = () => {
      pointer.x += (pointer.tX - pointer.x) * 0.2;
      pointer.y += (pointer.tY - pointer.y) * 0.2;
      gl.uniform1f(uniforms.u_time, performance.now());
      gl.uniform2f(
        uniforms.u_pointer_position,
        pointer.x / window.innerWidth,
        1 - pointer.y / window.innerHeight
      );
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("click", onClickEv);
    };
  }, [color, speed]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        opacity,
        zIndex: 0,
      }}
    />
  );
}
