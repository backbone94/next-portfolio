import {
  BufferGeometry, Float32BufferAttribute, Group,
  LatheGeometry, Mesh, MeshPhysicalMaterial, Vector2,
  type Material,
} from 'three';

const TAU = Math.PI * 2;
const signedPower = (n: number, exponent: number) => Math.sign(n) * Math.abs(n) ** exponent;

// Each row is a closed contour. Sharing the seam vertices keeps highlights continuous.
function surface(rows: number, sides: number, point: (row: number, angle: number) => number[]) {
  const vertices: number[] = [];
  const indices: number[] = [];
  for (let row = 0; row <= rows; row++) {
    for (let side = 0; side < sides; side++) {
      vertices.push(...point(row, TAU * side / sides));
      if (row === rows) continue;
      const a = row * sides + side;
      const b = row * sides + (side + 1) % sides;
      indices.push(a, a + sides, b, b, a + sides, b + sides);
    }
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

function turned(profile: number[][], segments = 40) {
  return new LatheGeometry(profile.map(([radius, height]) => new Vector2(radius, height)), segments);
}

function makeFace() {
  const gaze = { value: new Vector2() };
  const lid = { value: 1 };
  const glass = new MeshPhysicalMaterial({
    color: '#17253c', roughness: .42, metalness: .025, specularIntensity: .32,
    clearcoat: .12, clearcoatRoughness: .33, envMapIntensity: .26,
  });
  // Draw the LEDs in the visor's local coordinates, so the light follows its curvature.
  glass.onBeforeCompile = shader => {
    shader.uniforms.junGaze = gaze;
    shader.uniforms.junLid = lid;
    shader.vertexShader = 'varying vec2 junFace;\n' + shader.vertexShader.replace(
      '#include <begin_vertex>', '#include <begin_vertex>\n junFace = position.xy;',
    );
    shader.fragmentShader = `
      varying vec2 junFace;
      uniform vec2 junGaze;
      uniform float junLid;
    ` + shader.fragmentShader.replace('#include <emissivemap_fragment>', `
      #include <emissivemap_fragment>
      vec2 p = junFace - junGaze;
      p.x = abs(p.x) - 0.394;
      p.y = (p.y + 0.082) / junLid;
      float d = length(p);
      float disc = 1.0 - smoothstep(0.144, 0.164, d);
      float halo = exp(-27.0 * max(d - 0.143, 0.0));
      vec2 smile = junFace - vec2(0.0, -0.245);
      float x = clamp(smile.x, -0.133, 0.133);
      float line = distance(smile, vec2(x, 3.1*x*x - 0.041));
      float mouth = 1.0 - smoothstep(0.018, 0.034, line);
      totalEmissiveRadiance += vec3(0.002, 0.18, 1.15) * (halo + 0.55*exp(-54.0*line))
        + vec3(0.065, 1.55, 2.15) * (disc + mouth);
    `);
  };
  return { glass, gaze, lid };
}

function helmet(front: Material, gasket: Material, pearl: Material) {
  // Section through visor, recessed seal, ceramic lip, temples and back dome.
  const contours = [
    [.001, .001, .755], [.21, .15, .752], [.45, .32, .732], [.69, .49, .692],
    [.81, .575, .638], [.846, .606, .603], [.856, .617, .570],
    [.871, .628, .574], [.884, .641, .604], [.914, .673, .617],
    [.970, .745, .550], [1.018, .802, .408], [1.042, .842, .188],
    [1.038, .854, -.06], [1.006, .832, -.26], [.946, .78, -.426],
    [.806, .67, -.562], [.57, .476, -.651], [.30, .25, -.70], [.001, .001, -.722],
  ];
  const sides = 80;
  const mesh = surface(contours.length - 1, sides, (row, a) => {
    const [w, h, z] = contours[row];
    const y = signedPower(Math.sin(a), .84);
    const x = signedPower(Math.cos(a), .84);
    return [x * w * (1 - .027 * y), y * h + .061 * Math.max(0, 1 - z / .6), z];
  });
  const stride = sides * 6;
  mesh.addGroup(0, 6 * stride, 0);
  mesh.addGroup(6 * stride, 2 * stride, 1);
  mesh.addGroup(8 * stride, (contours.length - 9) * stride, 2);
  return new Mesh(mesh, [front, gasket, pearl]);
}

export function makeJunModel() {
  const head = new Group();
  const pearl = new MeshPhysicalMaterial({
    color: '#f4f4fb', roughness: .42, metalness: .015, clearcoat: .22, clearcoatRoughness: .35,
  });
  const seam = new MeshPhysicalMaterial({ color: '#3b4253', roughness: .55 });
  const enamel = new MeshPhysicalMaterial({ color: '#0784e1', metalness: .12, roughness: .24 });
  const face = makeFace();
  head.add(helmet(face.glass, seam, pearl));
  const pod = turned([[0, -.122], [.55, -.118], [.84, -.086], [.98, -.035], [1, .015],
  [.97, .067], [.85, .117], [.66, .157], [.33, .186], [0, .198]]);
  for (const side of [-1, 1]) {
    const mount = new Group();
    mount.position.set(side * 1.006, -.091, -.039);
    mount.rotation.z = -side * Math.PI / 2;
    head.add(mount);

    const cap = new Mesh(pod, pearl);
    cap.scale.set(.351, 1, .322);
    const inset = new Mesh(pod, enamel);
    inset.position.y = .099;
    inset.scale.set(.277, .65, .251);
    mount.add(cap, inset);
  }

  function setNight(night: boolean) {
    pearl.color.set(night ? '#bac5e1' : '#f4f4fb');
    enamel.color.set(night ? '#397ddc' : '#0784e1');
  }
  function dispose() {
    const geometries = new Set<BufferGeometry>();
    const materials = new Set<Material>();
    head.traverse(object => {
      if (!(object instanceof Mesh)) return;
      geometries.add(object.geometry);
      for (const material of [object.material].flat()) materials.add(material);
    });
    geometries.forEach(g => g.dispose());
    materials.forEach(m => m.dispose());
  }
  return { head, face, setNight, dispose };
}
