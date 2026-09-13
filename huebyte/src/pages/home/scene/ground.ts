import * as THREE from "three";
import { TERRAIN_GLSL, type SceneObject, type SharedUniforms } from "./shaders";

const vertexShader = /* glsl */ `
uniform vec2 uCamXZ;
varying float vDist;

${TERRAIN_GLSL}

void main() {
  vec4 wp = modelMatrix * vec4(position, 1.0);
  wp.y = terrainHeight(wp.xz) - 0.1;
  vDist = distance(wp.xz, uCamXZ);
  gl_Position = projectionMatrix * viewMatrix * wp;
}
`;

const fragmentShader = /* glsl */ `
uniform vec3 uNearColor;
uniform vec3 uFarColor;
uniform vec3 uFogColor;
uniform float uFogNear;
uniform float uFogFar;
varying float vDist;

void main() {
  // Dark plum soil between the blades up close, warming toward magenta before the haze takes it.
  vec3 col = mix(uNearColor, uFarColor, smoothstep(10.0, 120.0, vDist));
  col = mix(col, uFogColor, smoothstep(uFogNear, uFogFar, vDist));
  gl_FragColor = vec4(col, 1.0);
}
`;

export function createGround(segments: number, shared: SharedUniforms): SceneObject {
  // Wide enough that its edge never shows under the mountains, even with parallax.
  const geometry = new THREE.PlaneGeometry(1400, 800, segments, segments);
  geometry.rotateX(-Math.PI / 2);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      ...shared,
      uNearColor: { value: new THREE.Color("#1c0a20") },
      uFarColor: { value: new THREE.Color("#4a1a48") },
    },
    vertexShader,
    fragmentShader,
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.z = -150; // centre the plane on the part of the world the camera sees
  mesh.frustumCulled = false; // the shader displaces vertices, so the static bounds are wrong

  return {
    object: mesh,
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
