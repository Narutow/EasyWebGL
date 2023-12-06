const vertex = `

precision mediump float;
attribute vec4 a_position;
varying vec4 v_color;

void main() {
    gl_Position = a_position;
    v_color = a_position;
}

`;
export default vertex