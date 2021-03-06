// WEBGL BUILT-IN TYPES
// 1) Exports all WebGL constants as {GL}
// 2) Enables app to "import" WebGL types
//    - Importing these types makes them known to eslint etc.
//    - Provides dummy types for WebGL2 when not available to streamline
//      library code.
//    - Exports types from headless gl when running under Node.js

/* eslint-disable quotes, no-console */
/* global console */
import {global} from '../utils/globals';
import isBrowser from '../utils/is-browser';

export const ERR_HEADLESSGL_LOAD = `\
luma.gl: WebGL contexts can not be created in Node.js since headless gl is not installed. \
If this is desired, install headless gl using "npm install gl --save-dev" or "yarn add -D gl"`;

// Load headless gl dynamically, if available
export let headlessTypes = null;

if (!isBrowser) {
  try {
    headlessTypes = module.require('gl/wrap');
  } catch (error) {
    console.info(ERR_HEADLESSGL_LOAD);
  }
}

class DummyType {}

const {
  WebGLRenderingContext = DummyType,
  WebGLProgram = DummyType,
  WebGLShader = DummyType,
  WebGLBuffer = DummyType,
  WebGLFramebuffer = DummyType,
  WebGLRenderbuffer = DummyType,
  WebGLTexture = DummyType,
  WebGLUniformLocation = DummyType,
  WebGLActiveInfo = DummyType,
  WebGLShaderPrecisionFormat = DummyType
} = headlessTypes || global;

export const webGLTypesAvailable =
  WebGLRenderingContext !== DummyType &&
  WebGLProgram !== DummyType &&
  WebGLShader !== DummyType &&
  WebGLBuffer !== DummyType &&
  WebGLFramebuffer !== DummyType &&
  WebGLRenderbuffer !== DummyType &&
  WebGLTexture !== DummyType &&
  WebGLUniformLocation !== DummyType &&
  WebGLActiveInfo !== DummyType &&
  WebGLShaderPrecisionFormat !== DummyType;

// Ensures that WebGL2RenderingContext is defined in non-WebGL2 environments
// so that apps can test their gl contexts with instanceof
// E.g. if (gl instanceof WebGL2RenderingContext) { }
function getWebGL2RenderingContext() {
  class WebGL2RenderingContextNotSupported {}
  return global.WebGL2RenderingContext || WebGL2RenderingContextNotSupported;
}

// Ensure that Image is defined under Node.js
function getImage() {
  class ImageNotSupported {}
  return global.Image || ImageNotSupported;
}

const WebGL2RenderingContext = getWebGL2RenderingContext();
const Image = getImage();

// Export the standard WebGL types
export {
  Image,

  WebGLRenderingContext,
  WebGLProgram,
  WebGLShader,
  WebGLBuffer,
  WebGLFramebuffer,
  WebGLRenderbuffer,
  WebGLTexture,
  WebGLUniformLocation,
  WebGLActiveInfo,
  WebGLShaderPrecisionFormat,

  WebGL2RenderingContext
};
