import {GL} from './webgl-types';
import formatCompilerError from 'gl-format-compiler-error';
import getShaderName from 'glsl-shader-name';
import {log, uid, isBrowser} from '../utils';

// For now this is an internal class
export class Shader {

  /* eslint-disable max-statements */
  constructor(gl, shaderSource, shaderType) {
    this.id = getShaderName(shaderSource) || uid(this.getTypeName(shaderType));
    this.gl = gl;
    this.shaderType = shaderType;
    this.shaderSource = shaderSource;
    this.handle = gl.createShader(shaderType);
    if (this.handle === null) {
      throw new Error(`Error creating shader with type ${shaderType}`);
    }
    this.compile();
  }

  delete() {
    const {gl} = this;
    if (this.handle) {
      gl.deleteShader(this.handle);
      this.handle = null;
    }
  }

  getName() {
    return getShaderName(this.shaderSource);
  }

  getTypeName(shaderType) {
    switch (shaderType) {
    case GL.VERTEX_SHADER: return 'vertex-shader';
    case GL.FRAGMENT_SHADER: return 'fragment-shader';
    default: return 'shader';
    }
  }

  compile() {
    const {gl} = this;
    gl.shaderSource(this.handle, this.shaderSource);
    gl.compileShader(this.handle);
    const compiled = gl.getShaderParameter(this.handle, GL.COMPILE_STATUS);
    if (!compiled) {
      const info = gl.getShaderInfoLog(this.handle);
      gl.deleteShader(this.handle);
      /* eslint-disable no-try-catch */
      let formattedLog;
      try {
        formattedLog =
          formatCompilerError(info, this.shaderSource, this.shaderType);
        if (log.priority > 0) {
          this.copyToClipboard(this.shaderSource);
        }
      } catch (error) {
        log.warn('Error formatting glsl compiler error:', error);
        throw new Error(`Error while compiling the shader ${info}`);
      }
      /* eslint-enable no-try-catch */
      throw new Error(formattedLog.long);
    }
  }
  /* eslint-enable max-statements */

  // TODO - move to debug utils?
  copyToClipboard(text) {
    if (isBrowser) {
      /* global document */
      const input = document.createElement('textarea');
      document.body.appendChild(input);
      input.value = ('Place text to be copied in here');
      input.focus();
      input.select();
      document.execCommand('Copy');
      input.remove();
    }
  }
}

export class VertexShader extends Shader {
  constructor(gl, shaderSource) {
    super(gl, shaderSource, GL.VERTEX_SHADER);
  }
}

export class FragmentShader extends Shader {
  constructor(gl, shaderSource) {
    super(gl, shaderSource, GL.FRAGMENT_SHADER);
  }
}