/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { buildFsSource } from './shaderUtils';

export interface ShaderParams {
  colors: {
    cyan: [number, number, number];
    yellow: [number, number, number];
    orange: [number, number, number];
    purple: [number, number, number];
    blue: [number, number, number];
  };
  speed: number;
  warp: number;
  noise: number;
  grain: number;
}

// ============= WebGL / JavaScript Export =============
export const exportWebGL = (params: ShaderParams): string => {
  const fs = buildFsSource(params);
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Fluid Gradient</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{width:100vw;height:100vh;overflow:hidden;background:#09090b}
canvas{position:absolute;inset:0;width:100%;height:100%}
</style>
</head>
<body>
<canvas id="c"></canvas>
<script>
const c=document.getElementById('c'),gl=c.getContext('webgl');
const vs=\`attribute vec4 p;void main(){gl_Position=p;}\`;
const fs=\`${fs.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
function sh(t,src){const s=gl.createShader(t);gl.shaderSource(s,src);gl.compileShader(s);return s;}
const prog=gl.createProgram();
gl.attachShader(prog,sh(gl.VERTEX_SHADER,vs));
gl.attachShader(prog,sh(gl.FRAGMENT_SHADER,fs));
gl.linkProgram(prog);
const buf=gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER,buf);
gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([1,-1,-1,-1,1,1,-1,1]),gl.STATIC_DRAW);
const ap=gl.getAttribLocation(prog,'p');
const ur=gl.getUniformLocation(prog,'u_resolution');
const ut=gl.getUniformLocation(prog,'u_time');
const t0=Date.now();
function draw(){
  if(c.width!==c.clientWidth||c.height!==c.clientHeight){c.width=c.clientWidth;c.height=c.clientHeight;}
  gl.viewport(0,0,c.width,c.height);gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER,buf);
  gl.vertexAttribPointer(ap,2,gl.FLOAT,false,0,0);
  gl.enableVertexAttribArray(ap);
  gl.uniform2f(ur,c.width,c.height);
  gl.uniform1f(ut,(Date.now()-t0)/1000);
  gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  requestAnimationFrame(draw);
}
draw();
</script>
</body>
</html>`;
};

// ============= Tailwind CSS Export =============
export const exportTailwind = (params: ShaderParams): string => {
  const rgbToTailwind = (rgb: [number, number, number]) => {
    const [r, g, b] = rgb.map(v => Math.round(v * 255));
    return `rgb(${r} ${g} ${b})`;
  };

  const colors = Object.entries(params.colors).map(
    ([name, rgb]) => `${name.toLowerCase()}: '${rgbToTailwind(rgb)}'`
  ).join(',\n    ');

  return `/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        gradient: {
          ${colors}
        }
      },
      backgroundImage: {
        'fluid-gradient': 'linear-gradient(135deg, rgb(13 178 217) 0%, rgb(242 230 102) 25%, rgb(230 89 26) 50%, rgb(140 26 204) 75%, rgb(26 64 230) 100%)'
      },
      animation: {
        'fluid-flow': 'fluidFlow 8s ease-in-out infinite'
      },
      keyframes: {
        fluidFlow: {
          '0%, 100%': { backgroundPosition: '0% 0%' },
          '50%': { backgroundPosition: '100% 100%' }
        }
      }
    }
  },
  plugins: []
}`;
};

// ============= CSS Custom Properties Export =============
export const exportCSS = (params: ShaderParams): string => {
  const rgbToCSS = (rgb: [number, number, number]) => {
    const [r, g, b] = rgb.map(v => Math.round(v * 255));
    return `rgb(${r}, ${g}, ${b})`;
  };

  let css = ':root {\n';
  css += '  /* Fluid Gradient Colors */\n';
  
  Object.entries(params.colors).forEach(([name, rgb]) => {
    css += `  --gradient-${name}: ${rgbToCSS(rgb)};\n`;
  });

  css += '\n  /* Animation Parameters */\n';
  css += `  --flow-speed: ${params.speed};\n`;
  css += `  --warp-bloom: ${params.warp};\n`;
  css += `  --noise-scale: ${params.noise};\n`;
  css += `  --grain-film: ${params.grain};\n`;
  css += '}\n\n';

  css += `.fluid-gradient {\n`;
  css += `  background: linear-gradient(135deg,\n`;
  css += `    var(--gradient-cyan) 0%,\n`;
  css += `    var(--gradient-yellow) 25%,\n`;
  css += `    var(--gradient-orange) 50%,\n`;
  css += `    var(--gradient-purple) 75%,\n`;
  css += `    var(--gradient-blue) 100%\n`;
  css += `  );\n`;
  css += `  background-size: 400% 400%;\n`;
  css += `  animation: fluidFlow 8s ease-in-out infinite;\n`;
  css += `}\n\n`;

  css += `@keyframes fluidFlow {\n`;
  css += `  0%, 100% { background-position: 0% 0%; }\n`;
  css += `  50% { background-position: 100% 100%; }\n`;
  css += `}`;

  return css;
};

// ============= TypeScript Export =============
export const exportTypeScript = (params: ShaderParams): string => {
  return `/**
 * Auto-generated Fluid Gradient Shader Configuration
 * Generated from FluidShader Editor
 */

export const FLUID_GRADIENT_CONFIG = {
  colors: {
    cyan: [${params.colors.cyan.join(', ')}] as [number, number, number],
    yellow: [${params.colors.yellow.join(', ')}] as [number, number, number],
    orange: [${params.colors.orange.join(', ')}] as [number, number, number],
    purple: [${params.colors.purple.join(', ')}] as [number, number, number],
    blue: [${params.colors.blue.join(', ')}] as [number, number, number],
  },
  animation: {
    speed: ${params.speed},
    warp: ${params.warp},
    noise: ${params.noise},
    grain: ${params.grain},
  },
} as const;

export type FluidGradientConfig = typeof FLUID_GRADIENT_CONFIG;

/**
 * Create a fluid gradient shader with the given configuration
 */
export function createFluidGradientShader(config: FluidGradientConfig = FLUID_GRADIENT_CONFIG): string {
  const fs = \`
    precision highp float;
    uniform vec2 u_resolution;
    uniform float u_time;
    
    // Colors (RGB 0-1)
    const vec3 cyan = vec3(\${params.colors.cyan.join(', ')});
    const vec3 yellow = vec3(\${params.colors.yellow.join(', ')});
    const vec3 orange = vec3(\${params.colors.orange.join(', ')});
    const vec3 purple = vec3(\${params.colors.purple.join(', ')});
    const vec3 blue = vec3(\${params.colors.blue.join(', ')});
    
    // Animation parameters
    const float speed = \${params.speed};
    const float warp = \${params.warp};
    const float noise = \${params.noise};
    const float grain = \${params.grain};
    
    void main() {
      // Shader implementation
      gl_FragColor = vec4(1.0);
    }
  \`;
  return fs;
}`;
};

// ============= Figma Variables Export =============
export const exportFigma = (params: ShaderParams): string => {
  const colorHex = (rgb: [number, number, number]) => {
    return '#' + rgb.map(v => Math.round(v * 255).toString(16).padStart(2, '0')).join('').toUpperCase();
  };

  return `{
  "name": "FluidShader Export",
  "variables": [
    {
      "name": "gradient/cyan",
      "type": "COLOR",
      "value": "${colorHex(params.colors.cyan)}"
    },
    {
      "name": "gradient/yellow",
      "type": "COLOR",
      "value": "${colorHex(params.colors.yellow)}"
    },
    {
      "name": "gradient/orange",
      "type": "COLOR",
      "value": "${colorHex(params.colors.orange)}"
    },
    {
      "name": "gradient/purple",
      "type": "COLOR",
      "value": "${colorHex(params.colors.purple)}"
    },
    {
      "name": "gradient/blue",
      "type": "COLOR",
      "value": "${colorHex(params.colors.blue)}"
    },
    {
      "name": "animation/speed",
      "type": "FLOAT",
      "value": ${params.speed}
    },
    {
      "name": "animation/warp",
      "type": "FLOAT",
      "value": ${params.warp}
    },
    {
      "name": "animation/noise",
      "type": "FLOAT",
      "value": ${params.noise}
    },
    {
      "name": "animation/grain",
      "type": "FLOAT",
      "value": ${params.grain}
    }
  ]
}`;
};

// ============= Video Capture Export =============
export class VideoCapture {
  private canvas: HTMLCanvasElement;
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];
  private isRecording = false;
  private stopTimeout: NodeJS.Timeout | null = null;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
  }

  async startRecording(duration: number = 10000): Promise<void> {
    try {
      // Ensure canvas has proper dimensions
      if (this.canvas.width === 0 || this.canvas.height === 0) {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      }

      // Try different codec options
      let stream: MediaStream;
      try {
        stream = this.canvas.captureStream(60); // 60 FPS
      } catch (e) {
        console.warn('captureStream failed, trying alternative:', e);
        throw e;
      }

      // Try VP9 codec first, fall back to VP8
      let options: any = {
        videoBitsPerSecond: 5000000, // 5 Mbps for high quality
      };

      // Check for codec support
      if (MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        options.mimeType = 'video/webm;codecs=vp9';
      } else if (MediaRecorder.isTypeSupported('video/webm;codecs=vp8')) {
        options.mimeType = 'video/webm;codecs=vp8';
      } else if (MediaRecorder.isTypeSupported('video/webm')) {
        options.mimeType = 'video/webm';
      }

      this.mediaRecorder = new MediaRecorder(stream, options);
      this.recordedChunks = [];
      this.isRecording = true;

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event.error);
        this.isRecording = false;
      };

      this.mediaRecorder.start(100); // Collect data every 100ms

      // Auto-stop after duration
      this.stopTimeout = setTimeout(() => {
        this.stopRecording().catch(err => console.error('Auto-stop error:', err));
      }, duration);
    } catch (error) {
      console.error('Error starting video recording:', error);
      this.isRecording = false;
      throw error;
    }
  }

  stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (this.stopTimeout) {
        clearTimeout(this.stopTimeout);
        this.stopTimeout = null;
      }

      if (!this.mediaRecorder || !this.isRecording) {
        reject(new Error('Not recording'));
        return;
      }

      const handleStop = () => {
        if (this.recordedChunks.length === 0) {
          reject(new Error('No video data recorded'));
          return;
        }

        const mimeType = this.mediaRecorder?.mimeType || 'video/webm';
        const blob = new Blob(this.recordedChunks, { type: mimeType });
        this.isRecording = false;
        this.mediaRecorder?.removeEventListener('stop', handleStop);
        resolve(blob);
      };

      this.mediaRecorder.addEventListener('stop', handleStop);
      this.mediaRecorder.stop();
    });
  }

  downloadVideo(blob: Blob, filename: string = 'fluid-gradient.webm'): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 100);
  }

  getVideoURL(blob: Blob): string {
    return URL.createObjectURL(blob);
  }
}
