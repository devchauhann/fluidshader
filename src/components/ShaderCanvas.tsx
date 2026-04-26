/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, forwardRef } from 'react';
import { VS_SOURCE, buildFsSource } from '../shaderUtils';

interface ShaderCanvasProps {
  speed: number;
  noise: number;
  warp: number;
  grain: number;
  colors: {
    cyan: [number, number, number];
    yellow: [number, number, number];
    orange: [number, number, number];
    purple: [number, number, number];
    blue: [number, number, number];
  };
}

export const ShaderCanvas = forwardRef<HTMLCanvasElement, ShaderCanvasProps>(
  ({ speed, noise, warp, grain, colors }, ref) => {
    const internalRef = useRef<HTMLCanvasElement>(null);
    const canvasRef = ref || internalRef;
    const requestRef = useRef<number>(0);
    const startTimeRef = useRef<number>(Date.now());
    const glRef = useRef<WebGLRenderingContext | null>(null);
    const programRef = useRef<{
      program: WebGLProgram;
      attrib: number;
      uRes: WebGLUniformLocation | null;
      uTime: WebGLUniformLocation | null;
    } | null>(null);
    const posBufRef = useRef<WebGLBuffer | null>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const gl = canvas.getContext('webgl');
      if (!gl) return;
      glRef.current = gl;

      const posBuf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1, -1, -1, -1, 1, 1, -1, 1]), gl.STATIC_DRAW);
      posBufRef.current = posBuf;

      const compileShader = (type: number, src: string) => {
        const s = gl.createShader(type);
        if (!s) return null;
        gl.shaderSource(s, src);
        gl.compileShader(s);
        if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
          console.error(gl.getShaderInfoLog(s));
          gl.deleteShader(s);
          return null;
        }
        return s;
      };

      const updateProgram = () => {
        const fsSource = buildFsSource({ speed, noise, warp, grain, colors });
        const vs = compileShader(gl.VERTEX_SHADER, VS_SOURCE);
        const fs = compileShader(gl.FRAGMENT_SHADER, fsSource);
        if (!vs || !fs) return;

        const prog = gl.createProgram();
        if (!prog) return;
        gl.attachShader(prog, vs);
        gl.attachShader(prog, fs);
        gl.linkProgram(prog);

        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
          console.error(gl.getProgramInfoLog(prog));
          return;
        }

        if (programRef.current) {
          gl.deleteProgram(programRef.current.program);
        }

        programRef.current = {
          program: prog,
          attrib: gl.getAttribLocation(prog, 'aVertexPosition'),
          uRes: gl.getUniformLocation(prog, 'u_resolution'),
          uTime: gl.getUniformLocation(prog, 'u_time'),
        };
      };

      updateProgram();

      const render = () => {
        if (!gl || !programRef.current || !posBufRef.current || !canvas) {
          requestRef.current = requestAnimationFrame(render);
          return;
        }

        if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
          canvas.width = canvas.clientWidth;
          canvas.height = canvas.clientHeight;
        }

        gl.viewport(0, 0, canvas.width, canvas.height);
        const { program, attrib, uRes, uTime } = programRef.current;

        gl.useProgram(program);
        gl.bindBuffer(gl.ARRAY_BUFFER, posBufRef.current);
        gl.vertexAttribPointer(attrib, 2, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(attrib);
        gl.uniform2f(uRes, canvas.width, canvas.height);
        gl.uniform1f(uTime, (Date.now() - startTimeRef.current) / 1000);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        requestRef.current = requestAnimationFrame(render);
      };

      requestRef.current = requestAnimationFrame(render);

      return () => {
        cancelAnimationFrame(requestRef.current);
        if (programRef.current) {
          gl.deleteProgram(programRef.current.program);
        }
        if (posBufRef.current) {
          gl.deleteBuffer(posBufRef.current);
        }
      };
    }, [speed, noise, warp, grain, colors]);

    return (
      <canvas
        ref={canvasRef}
        className="fixed inset-0 w-full h-full -z-10"
        id="glcanvas"
      />
    );
  }
);
