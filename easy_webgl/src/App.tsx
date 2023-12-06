import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import vshader from './vshader';
import fshader from './fshader';
import { initShaders } from './utils';

function App() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [gl, setGl] = useState<WebGLRenderingContext>();
  const [positions, setPositions] = useState<number[][]>([]);
  const [program, setProgram] = useState<WebGLProgram>();

  const onCanvasClick = (event: any) => {
    const rect = event.target.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const canvasHeight = canvas.current?.height ?? 0;
    const canvasWidth = canvas.current?.width?? 0;
    const glX = (x - canvasWidth / 2) / (canvasWidth / 2); 
    const glY = (canvasHeight / 2 - y) / (canvasHeight / 2); 
    positions.push([glX, glY]);
    setPositions([...positions]);
  }

  useEffect(() => {
    if (canvas.current) {
      const context = canvas.current.getContext('webgl');
      if (context) {
        setGl(context);
      }
      canvas.current.onclick = (event) => {
        onCanvasClick(event);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas]);

  const aPosition = useRef(-1);

  useEffect(() => {
    if (gl) {
      const program = initShaders(gl, vshader, fshader);
      setProgram(program);
      aPosition.current = gl.getAttribLocation(program, 'a_position');

      gl.clearColor(0, 0, 0, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
      const size = initVertexBuffers(gl, program);
      if (size < 0) {
        return;
      }
      gl.drawArrays(gl.TRIANGLES, 0, size);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl]);

  function initVertexBuffers(gl: WebGLRenderingContext, program: WebGLProgram) {
    if (!program) {
      return -1;
    }
    const vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
      return -1;
    }
    const vertices = [0.0, 0.5, -0.5, -0.5, 0.5, -0.5];
    const size = vertices.length / 2;
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    const aPosition = gl.getAttribLocation(program, 'a_position');
    if (aPosition < 0) {
      return -1;
    }
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
    return size;
  }

  return (
    <div className="App">
      <canvas className="App-header" ref={canvas} />
    </div>
  );
}

export default App;
