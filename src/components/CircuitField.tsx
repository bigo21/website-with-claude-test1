import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { prefersReducedMotion } from '../lib/motion';

/**
 * Fond génératif du hero : une grille en perspective dont les pistes sont
 * interrompues, comme un circuit imprimé, parcourue par deux impulsions
 * qui allument les nœuds et les segments sur leur passage.
 *
 * Deux draw calls — les segments, puis les nœuds — et une seule fonction
 * de charge partagée par les deux shaders, pour que l'allumage soit
 * rigoureusement le même sur les points et sur les traits.
 */

const CHARGE = /* glsl */ `
  uniform float uTime;
  uniform vec2 uPointer;

  float chargeAt(vec3 pos) {
    float p1 = fract(uTime * 0.07 - pos.y * 0.03 - pos.x * 0.007);
    float p2 = fract(uTime * 0.042 + pos.x * 0.024 + 0.37);
    float c = pow(1.0 - abs(p1 - 0.5) * 2.0, 20.0)
            + pow(1.0 - abs(p2 - 0.5) * 2.0, 28.0) * 0.65;
    c += (1.0 - smoothstep(0.0, 6.5, distance(pos.xy, uPointer))) * 0.55;
    return clamp(c, 0.0, 1.0);
  }

  float swellAt(vec3 pos) {
    return sin(pos.x * 0.33 + uTime * 0.2) * cos(pos.y * 0.28 - uTime * 0.15) * 0.5;
  }

  float fadeAt(vec3 pos) {
    return 1.0 - smoothstep(12.0, 30.0, length(pos.xy));
  }
`;

const NODE_VERT = /* glsl */ `
  ${CHARGE}
  uniform float uPixelRatio;
  attribute float aSeed;
  varying float vCharge;
  varying float vFade;

  void main() {
    vec3 pos = position;
    pos.z += swellAt(pos);
    vCharge = chargeAt(pos);
    vFade = fadeAt(pos);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = (1.7 + vCharge * 4.6 + aSeed * 0.7) * uPixelRatio * (11.0 / -mv.z);
  }
`;

const NODE_FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uDim;
  uniform vec3 uAcc;
  varying float vCharge;
  varying float vFade;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float disc = 1.0 - smoothstep(0.32, 0.5, d);
    if (disc <= 0.001) discard;
    vec3 color = mix(uDim, uAcc, vCharge);
    gl_FragColor = vec4(color, disc * vFade * (0.16 + vCharge * 0.84));
  }
`;

const TRACE_VERT = /* glsl */ `
  ${CHARGE}
  varying float vCharge;
  varying float vFade;

  void main() {
    vec3 pos = position;
    pos.z += swellAt(pos);
    vCharge = chargeAt(pos);
    vFade = fadeAt(pos);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const TRACE_FRAG = /* glsl */ `
  precision mediump float;
  uniform vec3 uDim;
  uniform vec3 uAcc;
  varying float vCharge;
  varying float vFade;

  void main() {
    vec3 color = mix(uDim, uAcc, vCharge);
    gl_FragColor = vec4(color, vFade * (0.07 + vCharge * 0.62));
  }
`;

export default function CircuitField() {
  const holder = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = holder.current;
    if (!mount) return;

    const reduced = prefersReducedMotion();
    const narrow = window.matchMedia('(max-width: 760px)').matches;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      52,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, -2.4, 13);
    camera.lookAt(0, 1.6, 0);

    // --- Grille ---------------------------------------------------------
    const COLS = narrow ? 36 : 58;
    const ROWS = narrow ? 30 : 40;
    const SPACING = narrow ? 1.05 : 0.9;

    const at = (x: number, y: number): [number, number, number] => [
      (x - (COLS - 1) / 2) * SPACING,
      (y - (ROWS - 1) / 2) * SPACING,
      0,
    ];

    const nodes: number[] = [];
    const seeds: number[] = [];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        nodes.push(...at(x, y));
        seeds.push(Math.random());
      }
    }

    // Les pistes sont interrompues : un circuit n'est pas un quadrillage
    // plein, c'est un réseau de chemins qui s'arrêtent.
    const traces: number[] = [];
    for (let y = 0; y < ROWS; y++) {
      for (let x = 0; x < COLS; x++) {
        if (x < COLS - 1 && Math.random() > 0.52) {
          traces.push(...at(x, y), ...at(x + 1, y));
        }
        if (y < ROWS - 1 && Math.random() > 0.72) {
          traces.push(...at(x, y), ...at(x, y + 1));
        }
      }
    }

    const uniforms = {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPixelRatio: { value: renderer.getPixelRatio() },
      uDim: { value: new THREE.Color('#27333f') },
      uAcc: { value: new THREE.Color('#3df5a5') },
    };

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(nodes), 3),
    );
    nodeGeo.setAttribute(
      'aSeed',
      new THREE.BufferAttribute(new Float32Array(seeds), 1),
    );

    const traceGeo = new THREE.BufferGeometry();
    traceGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(traces), 3),
    );

    const shared = {
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    };

    const nodeMat = new THREE.ShaderMaterial({
      ...shared,
      vertexShader: NODE_VERT,
      fragmentShader: NODE_FRAG,
    });
    const traceMat = new THREE.ShaderMaterial({
      ...shared,
      vertexShader: TRACE_VERT,
      fragmentShader: TRACE_FRAG,
    });

    const group = new THREE.Group();
    group.rotation.x = -0.5;
    group.add(new THREE.LineSegments(traceGeo, traceMat));
    group.add(new THREE.Points(nodeGeo, nodeMat));
    scene.add(group);

    // --- Interaction et cycle de vie ------------------------------------
    const pointerTarget = new THREE.Vector2(0, 0);
    const onPointerMove = (event: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointerTarget.set(
        ((event.clientX - rect.left) / rect.width - 0.5) * 24,
        -((event.clientY - rect.top) / rect.height - 0.5) * 16,
      );
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });

    const onResize = () => {
      if (!mount.clientWidth) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      uniforms.uPixelRatio.value = renderer.getPixelRatio();
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    let visible = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
      },
      { threshold: 0 },
    );
    io.observe(mount);

    const clock = new THREE.Clock();
    let frame = 0;

    const render = () => {
      frame = requestAnimationFrame(render);
      if (!visible || document.hidden) return;
      uniforms.uTime.value = clock.getElapsedTime();
      uniforms.uPointer.value.lerp(pointerTarget, 0.04);
      renderer.render(scene, camera);
    };

    if (reduced) {
      uniforms.uTime.value = 6.5;
      renderer.render(scene, camera);
    } else {
      render();
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      ro.disconnect();
      io.disconnect();
      nodeGeo.dispose();
      traceGeo.dispose();
      nodeMat.dispose();
      traceMat.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div className="circuit" ref={holder} aria-hidden="true" />;
}
