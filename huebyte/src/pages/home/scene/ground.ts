import * as THREE from "three";
import { NOISE_GLSL, TERRAIN_GLSL, type SceneObject, type SharedUniforms } from "./shaders";

const vertexShader = /* glsl */ `
uniform vec2 uCamXZ;
varying float vDist;

${NOISE_GLSL}
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
  // Dark soil between the blades up close; the distant dunes glow like the grass on them.
  vec3 col = mix(uNearColor, uFarColor, smoothstep(10.0, 120.0, vDist));
  col = mix(col, uFogColor, smoothstep(uFogNear, uFogFar, vDist));
  gl_FragColor = vec4(col, 1.0);
}
`;

export function createGround(segments: number, shared: SharedUniforms): SceneObject {
  const geometry = new THREE.PlaneGeometry(800, 800, segments, segments);
  geometry.rotateX(-Math.PI / 2);

  const material = new THREE.ShaderMaterial({
    uniforms: {
      ...shared,
      uNearColor: { value: new THREE.Color("#1c1206") },
      uFarColor: { value: new THREE.Color("#6a4712") },
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
