import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ZONES_DATA, CALLOUT_ITEMS } from '../data/festivalData';
import { ZoneId } from '../types/festival';

export interface SiteMap3DHandle {
  focusZone: (zoneId: string) => void;
  resetView: () => void;
  setLighting: (mode: 'day' | 'sunset' | 'night') => void;
  focusActivityCam: (key: string) => void;
}

interface SiteMap3DProps {
  onSelectZone: (zoneId: string) => void;
  activeZoneId?: string | null;
  className?: string;
  isCinemaMode?: boolean;
  onToggleCinema?: () => void;
}

export const SiteMap3D = forwardRef<SiteMap3DHandle, SiteMap3DProps>(({
  onSelectZone,
  activeZoneId,
  className = '',
  isCinemaMode = false,
  onToggleCinema
}, ref) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const domOverlayRef = useRef<HTMLDivElement>(null);

  // UI state
  const [lightingMode, setLightingMode] = useState<'day' | 'sunset' | 'night'>('day');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isTouring, setIsTouring] = useState<boolean>(false);
  const [isDockCollapsed, setIsDockCollapsed] = useState<boolean>(false);
  const [expandedCards, setExpandedCards] = useState<boolean>(false);
  const [crowdDensity, setCrowdDensity] = useState<'quiet' | 'normal' | 'peak'>('peak');
  const [showCrowdPanel, setShowCrowdPanel] = useState<boolean>(false);
  const [crowdStats, setCrowdStats] = useState({ total: 148, adults: 54, kids: 52, babies: 22, strollers: 8, staff: 12 });
  const [inspectedPerson, setInspectedPerson] = useState<{ icon: string; roleTitle: string; label: string } | null>(null);
  const [personScreenPos, setPersonScreenPos] = useState<{ x: number; y: number } | null>(null);

  // Layer Visibility Toggles
  const [layerVisibility, setLayerVisibility] = useState({
    labels: true,
    flow: true,
    barriers: true,
    trees: true
  });

  // References to Three.js runtime internals
  const internalsRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    animateCameraTo: (targetPos: THREE.Vector3, targetLook: THREE.Vector3, duration?: number) => void;
    calloutRuntimes: Array<{
      id: string;
      zoneId: string;
      polyEl: SVGPolygonElement;
      badgeEl: HTMLDivElement;
      anchorVec: THREE.Vector3;
      labelVec: THREE.Vector3;
      hiddenByFilter: boolean;
    }>;
    setLighting: (mode: 'day' | 'sunset' | 'night') => void;
    setDensity: (level: 'quiet' | 'normal' | 'peak') => void;
    toggleGroup: (layer: 'flow' | 'barriers' | 'trees', visible: boolean) => void;
    focusActivityCam: (key: string) => void;
  } | null>(null);

  // Expose imperative handle for parent and zone navigation
  useImperativeHandle(ref, () => ({
    focusZone: (zoneId: string) => {
      const z = ZONES_DATA[zoneId];
      if (z && internalsRef.current) {
        internalsRef.current.animateCameraTo(
          new THREE.Vector3(z.camPos.x, z.camPos.y, z.camPos.z),
          new THREE.Vector3(z.camTarget.x, z.camTarget.y, z.camTarget.z),
          1050
        );
        onSelectZone(zoneId);
      }
    },
    resetView: () => {
      if (internalsRef.current) {
        internalsRef.current.animateCameraTo(
          new THREE.Vector3(0, 68, 74),
          new THREE.Vector3(-2, 0, 2),
          1000
        );
      }
    },
    setLighting: (mode) => {
      if (internalsRef.current) {
        internalsRef.current.setLighting(mode);
        setLightingMode(mode);
      }
    },
    focusActivityCam: (key: string) => {
      if (internalsRef.current) {
        internalsRef.current.focusActivityCam(key);
      }
    }
  }));

  useEffect(() => {
    const container = mountRef.current;
    const svgLayer = svgRef.current;
    const domLayer = domOverlayRef.current;
    if (!container || !svgLayer || !domLayer) return;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a261e);
    scene.fog = new THREE.FogExp2(0x1a261e, 0.0028);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.5, 600);
    const POSTER_CAM_POS = new THREE.Vector3(0, 68, 74);
    const POSTER_CAM_TARGET = new THREE.Vector3(-2, 0, 2);
    camera.position.copy(POSTER_CAM_POS);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Studio Environment Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(POSTER_CAM_TARGET);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.minDistance = 6;
    controls.maxDistance = 180;
    controls.update();

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.62);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x3f6212, 0.55);
    hemiLight.position.set(0, 80, 0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 1.25);
    sunLight.position.set(-45, 78, 42);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 200;
    const d = 68;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const stageSpot1 = new THREE.PointLight(0xa855f7, 0, 28);
    stageSpot1.position.set(7, 8, 0);
    const stageSpot2 = new THREE.PointLight(0x38bdf8, 0, 28);
    stageSpot2.position.set(13, 8, 0);
    const poolGlowLight = new THREE.PointLight(0x38bdf8, 0, 25);
    poolGlowLight.position.set(-26, 3, 15);
    const ledGlowLight = new THREE.PointLight(0x60a5fa, 0, 18);
    ledGlowLight.position.set(-39, 5, 25);
    scene.add(stageSpot1, stageSpot2, poolGlowLight, ledGlowLight);

    const applyLighting = (mode: 'day' | 'sunset' | 'night') => {
      if (mode === 'day') {
        scene.background = new THREE.Color(0x1a261e);
        if (scene.fog) scene.fog.color.setHex(0x1a261e);
        ambientLight.intensity = 0.62;
        sunLight.intensity = 1.25;
        sunLight.color.setHex(0xfffbeb);
        stageSpot1.intensity = 0;
        stageSpot2.intensity = 0;
        poolGlowLight.intensity = 0;
        ledGlowLight.intensity = 0;
      } else if (mode === 'sunset') {
        scene.background = new THREE.Color(0x2d1b24);
        if (scene.fog) scene.fog.color.setHex(0x2d1b24);
        ambientLight.intensity = 0.45;
        sunLight.intensity = 1.1;
        sunLight.color.setHex(0xfb923c);
        stageSpot1.intensity = 1.2;
        stageSpot2.intensity = 1.2;
        poolGlowLight.intensity = 0.9;
        ledGlowLight.intensity = 0.8;
      } else {
        scene.background = new THREE.Color(0x090d16);
        if (scene.fog) scene.fog.color.setHex(0x090d16);
        ambientLight.intensity = 0.25;
        sunLight.intensity = 0.32;
        sunLight.color.setHex(0x818cf8);
        stageSpot1.intensity = 2.4;
        stageSpot2.intensity = 2.4;
        poolGlowLight.intensity = 1.8;
        ledGlowLight.intensity = 1.5;
      }
    };

    // Camera animation state
    let camAnim: {
      startPos: THREE.Vector3;
      startLook: THREE.Vector3;
      endPos: THREE.Vector3;
      endLook: THREE.Vector3;
      startTime: number;
      duration: number;
    } | null = null;

    const animateCameraTo = (targetPos: THREE.Vector3, targetLook: THREE.Vector3, duration = 1100) => {
      camAnim = {
        startPos: camera.position.clone(),
        startLook: controls.target.clone(),
        endPos: targetPos.clone(),
        endLook: targetLook.clone(),
        startTime: performance.now(),
        duration
      };
    };

    // Dedicated Layer Groups for Toggling & Animation
    const worldGroup = new THREE.Group();
    scene.add(worldGroup);

    const gatesAndBarriersGroup = new THREE.Group();
    worldGroup.add(gatesAndBarriersGroup);

    const treesAndFloraGroup = new THREE.Group();
    worldGroup.add(treesAndFloraGroup);

    const pathwaysInfraGroup = new THREE.Group();
    worldGroup.add(pathwaysInfraGroup);

    const crowdGroup = new THREE.Group();
    worldGroup.add(crowdGroup);

    const swayingTrees: Array<{ grp: THREE.Group; phase: number; speed: number; amp: number }> = [];
    const floatingBubbles: THREE.Mesh[] = [];
    let poolWaterMat: THREE.MeshStandardMaterial | null = null;
    let exitBoomArmPivot: THREE.Group | null = null;
    let exitBeaconMesh: THREE.Mesh | null = null;

    const clickableMeshes: THREE.Mesh[] = [];
    const registerZoneMesh = (mesh: THREE.Mesh, zoneId: string) => {
      mesh.userData.zoneId = zoneId;
      clickableMeshes.push(mesh);
    };

    // 2. Build 3D Terrain & Procedural Textures
    const outerGroundGeo = new THREE.PlaneGeometry(340, 340);
    const outerGroundMat = new THREE.MeshStandardMaterial({ color: 0x2a3b24, roughness: 0.95 });
    const outerGround = new THREE.Mesh(outerGroundGeo, outerGroundMat);
    outerGround.rotation.x = -Math.PI / 2;
    outerGround.position.y = -0.35;
    outerGround.receiveShadow = true;
    worldGroup.add(outerGround);

    const westRoadGeo = new THREE.PlaneGeometry(14, 130);
    const dirtRoadMat = new THREE.MeshStandardMaterial({ color: 0x7c5846, roughness: 0.92 });
    const westRoad = new THREE.Mesh(westRoadGeo, dirtRoadMat);
    westRoad.rotation.x = -Math.PI / 2;
    westRoad.position.set(-55, -0.25, 0);
    westRoad.receiveShadow = true;
    worldGroup.add(westRoad);

    const southExitRoadGeo = new THREE.PlaneGeometry(45, 14);
    const southExitRoad = new THREE.Mesh(southExitRoadGeo, dirtRoadMat);
    southExitRoad.rotation.x = -Math.PI / 2;
    southExitRoad.rotation.z = -0.35;
    southExitRoad.position.set(16, -0.18, 41);
    southExitRoad.receiveShadow = true;
    worldGroup.add(southExitRoad);

    // Context Buildings in background
    const addContextBuilding = (x: number, z: number, w: number, d: number, rotY: number, roofColor: number) => {
      const grp = new THREE.Group();
      grp.position.set(x, -0.2, z);
      grp.rotation.y = rotY;
      const wall = new THREE.Mesh(
        new THREE.BoxGeometry(w, 2.2, d),
        new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.85 })
      );
      wall.position.y = 1.1;
      const roof = new THREE.Mesh(
        new THREE.BoxGeometry(w + 0.6, 0.35, d + 0.6),
        new THREE.MeshStandardMaterial({ color: roofColor, roughness: 0.7 })
      );
      roof.position.y = 2.3;
      grp.add(wall, roof);
      worldGroup.add(grp);
    };
    addContextBuilding(-62, -26, 12, 8, 0.05, 0xcbd5e1);
    addContextBuilding(-5, 52, 18, 10, -0.25, 0xe2e8f0);
    addContextBuilding(12, 55, 14, 9, -0.25, 0xcbd5e1);
    addContextBuilding(48, -6, 14, 12, 0, 0x64748b);

    // Park Ground Terrain
    const terrainCanvas = document.createElement('canvas');
    terrainCanvas.width = 1024;
    terrainCanvas.height = 1024;
    const tCtx = terrainCanvas.getContext('2d');
    if (tCtx) {
      const grad = tCtx.createLinearGradient(0, 0, 1024, 1024);
      grad.addColorStop(0, '#6a8d48');
      grad.addColorStop(0.5, '#769a50');
      grad.addColorStop(1, '#5d823d');
      tCtx.fillStyle = grad;
      tCtx.fillRect(0, 0, 1024, 1024);

      const dryGrad = tCtx.createRadialGradient(480, 260, 30, 480, 260, 260);
      dryGrad.addColorStop(0, 'rgba(186, 158, 108, 0.82)');
      dryGrad.addColorStop(0.6, 'rgba(168, 148, 98, 0.45)');
      dryGrad.addColorStop(1, 'rgba(118, 154, 80, 0)');
      tCtx.fillStyle = dryGrad;
      tCtx.fillRect(0, 0, 1024, 1024);

      const pathGrad = tCtx.createRadialGradient(520, 620, 20, 520, 620, 210);
      pathGrad.addColorStop(0, 'rgba(182, 160, 114, 0.65)');
      pathGrad.addColorStop(1, 'rgba(118, 154, 80, 0)');
      tCtx.fillStyle = pathGrad;
      tCtx.fillRect(0, 0, 1024, 1024);

      for (let i = 0; i < 4000; i++) {
        tCtx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)';
        tCtx.fillRect(Math.random() * 1024, Math.random() * 1024, 3, 3);
      }
    }
    const terrainTexture = new THREE.CanvasTexture(terrainCanvas);
    terrainTexture.colorSpace = THREE.SRGBColorSpace;

    const parkGround = new THREE.Mesh(
      new THREE.PlaneGeometry(88, 86),
      new THREE.MeshStandardMaterial({ map: terrainTexture, roughness: 0.88, metalness: 0.02 })
    );
    parkGround.rotation.x = -Math.PI / 2;
    parkGround.position.set(-4, 0, 0);
    parkGround.receiveShadow = true;
    worldGroup.add(parkGround);

    // Basketball Court Texture
    const courtCanvas = document.createElement('canvas');
    courtCanvas.width = 1024;
    courtCanvas.height = 512;
    const cCtx = courtCanvas.getContext('2d');
    if (cCtx) {
      cCtx.fillStyle = '#5c6b64';
      cCtx.fillRect(0, 0, 1024, 512);
      cCtx.strokeStyle = '#e2e8f0';
      cCtx.lineWidth = 6;
      cCtx.strokeRect(40, 36, 944, 440);
      cCtx.beginPath();
      cCtx.moveTo(512, 36);
      cCtx.lineTo(512, 476);
      cCtx.stroke();
      cCtx.beginPath();
      cCtx.arc(512, 256, 58, 0, Math.PI * 2);
      cCtx.stroke();
      cCtx.strokeRect(40, 176, 150, 160);
      cCtx.strokeRect(834, 176, 150, 160);
    }
    const courtTexture = new THREE.CanvasTexture(courtCanvas);
    courtTexture.colorSpace = THREE.SRGBColorSpace;

    // Billboard Texture
    const billboardCanvas = document.createElement('canvas');
    billboardCanvas.width = 512;
    billboardCanvas.height = 320;
    const bCtx = billboardCanvas.getContext('2d');
    const billboardTexture = new THREE.CanvasTexture(billboardCanvas);
    billboardTexture.colorSpace = THREE.SRGBColorSpace;

    const renderBillboard = (step: number) => {
      if (!bCtx) return;
      const slides = [
        { header: 'BAMBINO WORLD', sub: 'WELCOME TO THE LITTLE FARM!', bg: '#0284c7', subtext: 'SATURDAY 5 DEC 2026' },
        { header: 'SAFETY FIRST', sub: 'WRISTBANDS & SUPERVISION', bg: '#059669', subtext: 'FENCED PONDS & POOL BUFFER' },
        { header: 'TICKETS & FOOD', sub: 'UNLIMITED CANDYFLOSS & WAFFLES', bg: '#d97706', subtext: 'EXPLORER PASSPORT INCLUDED' }
      ];
      const s = slides[step % slides.length];
      bCtx.fillStyle = s.bg;
      bCtx.fillRect(0, 0, 512, 320);
      bCtx.fillStyle = '#ef4444';
      bCtx.fillRect(16, 16, 480, 56);
      bCtx.fillStyle = '#ffffff';
      bCtx.font = '900 28px Outfit, sans-serif';
      bCtx.textAlign = 'center';
      bCtx.fillText(s.header, 256, 54);
      bCtx.fillStyle = '#facc15';
      bCtx.font = '800 18px Inter, sans-serif';
      bCtx.fillText(s.sub, 256, 110);
      bCtx.fillStyle = '#ffffff';
      bCtx.fillRect(28, 130, 456, 110);
      bCtx.fillStyle = '#0f172a';
      bCtx.font = '700 16px Inter, sans-serif';
      bCtx.fillText(s.subtext, 256, 190);
      bCtx.fillStyle = '#22c55e';
      bCtx.fillRect(16, 260, 480, 44);
      bCtx.fillStyle = '#052e16';
      bCtx.font = '800 16px Inter, sans-serif';
      bCtx.fillText('LIVE AT MEYRICK PARK • HARARE', 256, 288);
      billboardTexture.needsUpdate = true;
    };
    renderBillboard(0);
    const bbTimer = setInterval(() => {
      renderBillboard(Math.floor(Date.now() / 4000));
    }, 4000);

    // Polyline Ribbon & Fence Helpers
    const createPolylineRibbon = (points: number[][], colorHex: number, yOffset = 0.14, radius = 0.28) => {
      const group = new THREE.Group();
      const mat = new THREE.MeshStandardMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.28,
        roughness: 0.4
      });
      for (let i = 0; i < points.length - 1; i++) {
        const p1 = new THREE.Vector3(points[i][0], yOffset, points[i][1]);
        const p2 = new THREE.Vector3(points[i + 1][0], yOffset, points[i + 1][1]);
        const dist = p1.distanceTo(p2);
        const cyl = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, dist, 8), mat);
        cyl.position.copy(p1).add(p2).multiplyScalar(0.5);
        cyl.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), p2.clone().sub(p1).normalize());
        group.add(cyl);
      }
      return group;
    };

    const createDetailedFence = (points: number[][], style = 'farm-timber', skipSegments: number[] = []) => {
      const grp = new THREE.Group();
      const woodPostMat = new THREE.MeshStandardMaterial({ color: 0x5c3a21, roughness: 0.85 });
      const woodRailMat = new THREE.MeshStandardMaterial({ color: 0x7c5230, roughness: 0.8 });
      const capMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfacc15, emissiveIntensity: 0.2 });
      const orangeMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.5 });
      const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });

      for (let i = 0; i < points.length - 1; i++) {
        if (skipSegments.includes(i)) continue;
        const p1 = new THREE.Vector3(points[i][0], 0, points[i][1]);
        const p2 = new THREE.Vector3(points[i + 1][0], 0, points[i + 1][1]);
        const dist = p1.distanceTo(p2);
        const dir = p2.clone().sub(p1).normalize();
        const angleY = Math.atan2(dir.x, dir.z);

        if (style === 'farm-timber') {
          const postSpacing = 3.2;
          const numPosts = Math.max(2, Math.floor(dist / postSpacing));
          for (let p = 0; p <= numPosts; p++) {
            const pos = p1.clone().lerp(p2, p / numPosts);
            const post = new THREE.Mesh(new THREE.BoxGeometry(0.24, 1.35, 0.24), woodPostMat);
            post.position.set(pos.x, 0.68, pos.z);
            post.rotation.y = angleY;
            post.castShadow = true;
            const cap = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.08, 0.28), capMat);
            cap.position.set(pos.x, 1.38, pos.z);
            cap.rotation.y = angleY;
            grp.add(post, cap);
          }
          [0.48, 0.98].forEach(ry => {
            const rail = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.12, dist), woodRailMat);
            rail.position.copy(p1).add(p2).multiplyScalar(0.5);
            rail.position.y = ry;
            rail.rotation.y = angleY;
            rail.castShadow = true;
            grp.add(rail);
          });
        } else if (style === 'orange-safety') {
          const postSpacing = 2.8;
          const numPosts = Math.max(2, Math.floor(dist / postSpacing));
          for (let p = 0; p <= numPosts; p++) {
            const pos = p1.clone().lerp(p2, p / numPosts);
            const post = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 1.25, 8), orangeMat);
            post.position.set(pos.x, 0.62, pos.z);
            grp.add(post);
          }
          const meshBarrier = new THREE.Mesh(
            new THREE.BoxGeometry(0.05, 0.75, dist),
            new THREE.MeshStandardMaterial({ color: 0xfb923c, transparent: true, opacity: 0.45, roughness: 0.6 })
          );
          meshBarrier.position.copy(p1).add(p2).multiplyScalar(0.5);
          meshBarrier.position.y = 0.6;
          meshBarrier.rotation.y = angleY;
          grp.add(meshBarrier);
        } else if (style === 'white-picket') {
          const picketSpacing = 0.45;
          const numPickets = Math.max(2, Math.floor(dist / picketSpacing));
          for (let p = 0; p <= numPickets; p++) {
            const pos = p1.clone().lerp(p2, p / numPickets);
            const h = 0.85 + Math.sin((p / numPickets) * Math.PI * 4) * 0.08;
            const picket = new THREE.Mesh(new THREE.BoxGeometry(0.06, h, 0.16), whiteMat);
            picket.position.set(pos.x, h / 2 + 0.15, pos.z);
            picket.rotation.y = angleY;
            picket.castShadow = true;
            grp.add(picket);
          }
          [0.38, 0.72].forEach(ry => {
            const rail = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, dist), whiteMat);
            rail.position.copy(p1).add(p2).multiplyScalar(0.5);
            rail.position.y = ry;
            rail.rotation.y = angleY;
            grp.add(rail);
          });
        }
      }
      return grp;
    };

    const createJerseyBarrierLine = (points: number[][]) => {
      const grp = new THREE.Group();
      const redMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.45 });
      const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.45 });
      let unitIndex = 0;

      for (let i = 0; i < points.length - 1; i++) {
        const p1 = new THREE.Vector3(points[i][0], 0, points[i][1]);
        const p2 = new THREE.Vector3(points[i + 1][0], 0, points[i + 1][1]);
        const dist = p1.distanceTo(p2);
        const dir = p2.clone().sub(p1).normalize();
        const angleY = Math.atan2(dir.x, dir.z);
        const segLen = 1.65;
        const count = Math.max(1, Math.floor(dist / segLen));

        for (let k = 0; k < count; k++) {
          const pos = p1.clone().lerp(p2, (k + 0.5) / count);
          const mat = unitIndex % 2 === 0 ? redMat : whiteMat;
          unitIndex++;
          const jb = new THREE.Group();
          jb.position.set(pos.x, 0.14, pos.z);
          jb.rotation.y = angleY;
          const baseFoot = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.28, segLen * 0.92), mat);
          baseFoot.position.y = 0.14;
          const upperWall = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.48, segLen * 0.92), mat);
          upperWall.position.y = 0.48;
          jb.add(baseFoot, upperWall);
          grp.add(jb);
        }
      }
      return grp;
    };

    const createSteelBarricadeLine = (points: number[][]) => {
      const grp = new THREE.Group();
      const steelMat = new THREE.MeshStandardMaterial({ color: 0xcbd5e1, metalness: 0.75, roughness: 0.28 });
      for (let i = 0; i < points.length - 1; i++) {
        const p1 = new THREE.Vector3(points[i][0], 0, points[i][1]);
        const p2 = new THREE.Vector3(points[i + 1][0], 0, points[i + 1][1]);
        const dist = p1.distanceTo(p2);
        const dir = p2.clone().sub(p1).normalize();
        const angleY = Math.atan2(dir.x, dir.z);
        const rackLen = 2.0;
        const count = Math.max(1, Math.floor(dist / rackLen));

        for (let k = 0; k < count; k++) {
          const pos = p1.clone().lerp(p2, (k + 0.5) / count);
          const rack = new THREE.Group();
          rack.position.set(pos.x, 0.15, pos.z);
          rack.rotation.y = angleY;
          const topBar = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, rackLen * 0.92, 8), steelMat);
          topBar.rotation.x = Math.PI / 2;
          topBar.position.y = 0.95;
          const botBar = topBar.clone();
          botBar.position.y = 0.22;
          rack.add(topBar, botBar);
          for (let b = -3; b <= 3; b++) {
            const vBar = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.74, 6), steelMat);
            vBar.position.set(0, 0.58, b * 0.24);
            rack.add(vBar);
          }
          grp.add(rack);
        }
      }
      return grp;
    };

    const createLifebuoyRing = (x: number, y: number, z: number, rotY = 0) => {
      const grp = new THREE.Group();
      grp.position.set(x, y, z);
      grp.rotation.y = rotY;
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(0.36, 0.11, 10, 20),
        new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.35 })
      );
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        const band = new THREE.Mesh(
          new THREE.BoxGeometry(0.14, 0.24, 0.24),
          new THREE.MeshStandardMaterial({ color: 0xf8fafc })
        );
        band.position.set(Math.cos(a) * 0.36, Math.sin(a) * 0.36, 0);
        band.rotation.z = a;
        grp.add(band);
      }
      grp.add(ring);
      return grp;
    };

    // Perimeter fences & ribbons
    const parkPerimeterPts = [
      [-46, -42], [26, -42], [38, 12], [9, 14], [11, 31], [23, 39], [21, 42],
      [6, 32], [-12, 23], [-35, 44], [-47, 40], [-46, -42]
    ];
    worldGroup.add(createPolylineRibbon(parkPerimeterPts, 0xfef08a, 0.16, 0.26));
    gatesAndBarriersGroup.add(createDetailedFence(parkPerimeterPts, 'farm-timber', [5, 6, 9]));

    const staffPerimeterPts = [
      [9, 14], [38, 12], [44, 44], [25, 36], [11, 31], [9, 14]
    ];
    worldGroup.add(createPolylineRibbon(staffPerimeterPts, 0xfdba74, 0.17, 0.25));
    gatesAndBarriersGroup.add(createDetailedFence(staffPerimeterPts, 'orange-safety', [2, 3]));

    // 3. Multi-Species Trees & Botanical Landscaping
    const createDeciduousTree = (x: number, z: number, scale = 1, dark = false) => {
      const grp = new THREE.Group();
      grp.position.set(x, 0, z);
      grp.scale.setScalar(scale);

      const barkMat = new THREE.MeshStandardMaterial({ color: 0x4a3525, roughness: 0.92 });
      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.46, 2.0, 8), barkMat);
      trunk.position.y = 1.0;
      trunk.castShadow = true;
      grp.add(trunk);

      const limbConfigs = [
        [0.45, 2.1, 0.25, 0.38, -0.25],
        [-0.45, 2.0, -0.25, -0.35, 0.28],
        [0.1, 2.2, -0.45, 0.15, 0.42]
      ];
      limbConfigs.forEach(([lx, ly, lz, rx, rz]) => {
        const limb = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.22, 1.5, 6), barkMat);
        limb.position.set(lx, ly, lz);
        limb.rotation.set(rx, 0, rz);
        grp.add(limb);
      });

      const leafPalette = dark
        ? [0x14381f, 0x1b4328, 0x234f2e]
        : [0x2d5a27, 0x3f7028, 0x4d7c2b, 0x659132];

      const puffs = [
        [0, 3.1, 0, 1.85, 0.58],
        [1.15, 2.65, 0.65, 1.45, 0.55],
        [-1.1, 2.75, -0.55, 1.45, 0.55],
        [0.45, 3.6, -0.7, 1.35, 0.52],
        [-0.65, 3.4, 0.75, 1.25, 0.52]
      ];
      puffs.forEach(([px, py, pz, r, flatY], idx) => {
        const puff = new THREE.Mesh(
          new THREE.DodecahedronGeometry(r, 1),
          new THREE.MeshStandardMaterial({ color: leafPalette[idx % leafPalette.length], roughness: 0.82 })
        );
        puff.position.set(px, py, pz);
        puff.scale.set(1.12, flatY, 1.12);
        puff.castShadow = true;
        grp.add(puff);
      });

      swayingTrees.push({ grp, phase: (x + z) * 0.3, speed: 1.4, amp: 0.018 });
      treesAndFloraGroup.add(grp);
      return grp;
    };

    const createJacarandaTree = (x: number, z: number, scale = 1) => {
      const grp = new THREE.Group();
      grp.position.set(x, 0, z);
      grp.scale.setScalar(scale);

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.24, 0.4, 2.3, 8),
        new THREE.MeshStandardMaterial({ color: 0x3e2c23, roughness: 0.9 })
      );
      trunk.position.y = 1.15;
      grp.add(trunk);

      const blossomColors = [0x8b5cf6, 0x7c3aed, 0xa855f7, 0x9333ea];
      const puffs = [
        [0, 3.2, 0, 1.8],
        [1.0, 2.8, 0.6, 1.35],
        [-1.0, 2.9, -0.5, 1.4],
        [0.4, 3.7, -0.6, 1.25],
        [-0.5, 3.5, 0.7, 1.2]
      ];
      puffs.forEach(([px, py, pz, r], idx) => {
        const puff = new THREE.Mesh(
          new THREE.DodecahedronGeometry(r, 1),
          new THREE.MeshStandardMaterial({ color: blossomColors[idx % blossomColors.length], roughness: 0.75 })
        );
        puff.position.set(px, py, pz);
        puff.scale.set(1.15, 0.65, 1.15);
        puff.castShadow = true;
        grp.add(puff);
      });

      const petalCarpet = new THREE.Mesh(
        new THREE.CircleGeometry(2.1, 14),
        new THREE.MeshStandardMaterial({ color: 0x9333ea, transparent: true, opacity: 0.32, roughness: 0.9 })
      );
      petalCarpet.rotation.x = -Math.PI / 2;
      petalCarpet.position.y = 0.17;
      grp.add(petalCarpet);

      swayingTrees.push({ grp, phase: (x - z) * 0.4, speed: 1.6, amp: 0.022 });
      treesAndFloraGroup.add(grp);
      return grp;
    };

    const createPalmTree = (x: number, z: number, scale = 1) => {
      const grp = new THREE.Group();
      grp.position.set(x, 0, z);
      grp.scale.setScalar(scale);

      const trunkMat = new THREE.MeshStandardMaterial({ color: 0x6b4f35, roughness: 0.88 });
      const ringMat = new THREE.MeshStandardMaterial({ color: 0x523a24, roughness: 0.92 });

      for (let s = 0; s < 7; s++) {
        const t = s / 7;
        const rBot = THREE.MathUtils.lerp(0.36, 0.20, t);
        const rTop = THREE.MathUtils.lerp(0.36, 0.20, (s + 1) / 7);
        const seg = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBot, 0.65, 8), trunkMat);
        const curveX = Math.sin(t * 1.3) * 0.32;
        seg.position.set(curveX, s * 0.6 + 0.32, 0);
        seg.rotation.z = -Math.cos(t * 1.3) * 0.08;
        seg.castShadow = true;
        grp.add(seg);

        const ring = new THREE.Mesh(new THREE.TorusGeometry(rTop * 1.02, 0.03, 6, 10), ringMat);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(curveX, (s + 1) * 0.6, 0);
        grp.add(ring);
      }

      const crownX = Math.sin(1.3) * 0.32;
      const crownY = 7 * 0.6 + 0.1;

      for (let i = 0; i < 11; i++) {
        const angle = (i / 11) * Math.PI * 2;
        const tierTilt = i < 7 ? -Math.PI / 2.5 : -Math.PI / 3.4;
        const frondPivot = new THREE.Group();
        frondPivot.position.set(crownX, crownY, 0);
        frondPivot.rotation.y = angle;

        const frondBlade = new THREE.Mesh(
          new THREE.ConeGeometry(0.68, 2.95, 4),
          new THREE.MeshStandardMaterial({ color: 0x2e6f40, roughness: 0.65, side: THREE.DoubleSide })
        );
        frondBlade.position.set(1.25, 0.15, 0);
        frondBlade.rotation.z = tierTilt;
        frondBlade.scale.set(0.32, 1, 0.9);
        frondBlade.castShadow = true;
        frondPivot.add(frondBlade);
        grp.add(frondPivot);
      }

      swayingTrees.push({ grp, phase: (x + z) * 0.5, speed: 2.1, amp: 0.028 });
      treesAndFloraGroup.add(grp);
      return grp;
    };

    const createCypressTree = (x: number, z: number, scale = 1) => {
      const grp = new THREE.Group();
      grp.position.set(x, 0, z);
      grp.scale.setScalar(scale);

      const trunk = new THREE.Mesh(
        new THREE.CylinderGeometry(0.18, 0.28, 1.4, 7),
        new THREE.MeshStandardMaterial({ color: 0x4a3525, roughness: 0.9 })
      );
      trunk.position.y = 0.7;
      grp.add(trunk);

      for (let t = 0; t < 3; t++) {
        const cone = new THREE.Mesh(
          new THREE.ConeGeometry(1.15 - t * 0.26, 2.8 - t * 0.35, 9),
          new THREE.MeshStandardMaterial({ color: 0x1b4d2a, roughness: 0.85 })
        );
        cone.position.y = 2.1 + t * 1.35;
        cone.castShadow = true;
        grp.add(cone);
      }
      swayingTrees.push({ grp, phase: x * 0.4, speed: 1.5, amp: 0.015 });
      treesAndFloraGroup.add(grp);
      return grp;
    };

    const createFloralPlanterBox = (x: number, z: number, length = 2.2, rotY = 0) => {
      const grp = new THREE.Group();
      grp.position.set(x, 0.14, z);
      grp.rotation.y = rotY;

      const box = new THREE.Mesh(
        new THREE.BoxGeometry(length, 0.52, 0.68),
        new THREE.MeshStandardMaterial({ color: 0x7c4d2b, roughness: 0.85 })
      );
      box.position.y = 0.26;
      grp.add(box);

      const count = Math.max(3, Math.floor(length * 2.2));
      const flowerColors = [0xf43f5e, 0xfacc15, 0xa855f7, 0xf97316, 0x38bdf8];
      for (let i = 0; i < count; i++) {
        const fx = (i / (count - 1) - 0.5) * (length - 0.35);
        const fz = (i % 2 === 0 ? -0.12 : 0.12);
        const bloom = new THREE.Mesh(
          new THREE.SphereGeometry(0.13, 8, 8),
          new THREE.MeshStandardMaterial({ color: flowerColors[i % flowerColors.length], roughness: 0.4 })
        );
        bloom.position.set(fx, 0.78, fz);
        grp.add(bloom);
      }
      treesAndFloraGroup.add(grp);
      return grp;
    };

    // Instantiate Context & Internal Trees
    const contextTreeCoords = [
      [-64, -10, 1.6], [-62, 5, 1.8], [-60, 18, 1.5], [-65, 32, 1.7],
      [36, -38, 1.6], [42, -26, 1.9], [48, -18, 1.7], [46, 2, 1.6],
      [50, 14, 1.8], [52, 26, 1.5], [-20, -47, 1.4], [10, -47, 1.5]
    ];
    contextTreeCoords.forEach(([tx, tz, sc]) => createDeciduousTree(tx, tz, sc, true));

    [[-48, -38], [-48, -22], [-48, -4], [-38, -44], [-10, -44], [18, -44], [32, -40]].forEach(([cx, cz]) => {
      createCypressTree(cx, cz, 1.15);
    });

    [[-43, 21, 1.15], [-13, 28, 1.1], [31, -24, 1.2], [-15, -36, 1.15], [37, 6, 1.1], [-32, 38, 1.15], [-2, 38, 1.2], [12, 36, 1.1], [38, 22, 1.2]].forEach(([jx, jz, sc]) => {
      createJacarandaTree(jx, jz, sc);
    });

    [[-1, -2, 1.35], [1, 2, 1.15], [-3, 1, 1.1], [-5, -20, 1.1], [-4, -15, 0.95], [-43, 8, 1.1], [-43, 15, 1.15], [-17, 16, 0.95], [-16, 21, 0.9]].forEach(([tx, tz, sc]) => {
      createDeciduousTree(tx, tz, sc, false);
    });

    [[-37, 15, 1.05], [-15, 13, 1.1], [-39, 34, 1.0], [-37, -15, 1.15], [-31, -17, 1.25], [-24, -17.5, 1.2], [-17, -15.5, 1.3], [-14, -11, 1.15]].forEach(([px, pz, sc]) => {
      createPalmTree(px, pz, sc);
    });

    // 4. Construct All 12 Zones with Authentic Features
    // ZONE 1: Fish Pond
    const pondGroup = new THREE.Group();
    pondGroup.position.set(-31, 0, -28);
    const pondBank = new THREE.Mesh(
      new THREE.CylinderGeometry(8.5, 9.2, 0.35, 36),
      new THREE.MeshStandardMaterial({ color: 0x7c6f52, roughness: 0.9 })
    );
    pondBank.scale.set(1.35, 1, 0.88);
    pondBank.position.y = 0.12;
    const pondWater = new THREE.Mesh(
      new THREE.CylinderGeometry(7.9, 7.9, 0.38, 36),
      new THREE.MeshStandardMaterial({ color: 0x698856, roughness: 0.18, metalness: 0.35 })
    );
    pondWater.scale.set(1.35, 1, 0.88);
    pondWater.position.y = 0.15;
    registerZoneMesh(pondWater, 'fish-pond');
    pondGroup.add(pondBank, pondWater);

    // Pond 48-Post Safety Barrier
    const pondFenceGroup = new THREE.Group();
    for (let i = 0; i < 48; i++) {
      const ang = (i / 48) * Math.PI * 2;
      const fx = Math.cos(ang) * 8.35 * 1.35;
      const fz = Math.sin(ang) * 8.35 * 0.88;
      const post = new THREE.Mesh(
        new THREE.BoxGeometry(0.14, 1.4, 0.14),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.45 })
      );
      post.position.set(fx, 0.75, fz);
      post.rotation.y = -ang;
      pondFenceGroup.add(post);

      if (i % 4 === 0) {
        const rock = new THREE.Mesh(
          new THREE.DodecahedronGeometry(0.45 + (i % 3) * 0.15, 0),
          new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.9 })
        );
        rock.position.set(fx * 0.93, 0.28, fz * 0.93);
        rock.scale.y = 0.65;
        pondFenceGroup.add(rock);
      }
    }
    pondFenceGroup.add(createLifebuoyRing(0, 1.05, 7.55, 0));
    pondGroup.add(pondFenceGroup);
    worldGroup.add(pondGroup);

    // ZONE 2: The Little Garden (Baby Garden 6M–2Y)
    const gardenGroup = new THREE.Group();
    worldGroup.add(gardenGroup);

    const gardenFloorShape = new THREE.Shape();
    gardenFloorShape.moveTo(-45, -14);
    gardenFloorShape.quadraticCurveTo(-28, -22, -14, -17);
    gardenFloorShape.lineTo(-7, 2);
    gardenFloorShape.lineTo(-18, 9);
    gardenFloorShape.lineTo(-45, 12);
    gardenFloorShape.closePath();

    const gardenTurf = new THREE.Mesh(
      new THREE.ExtrudeGeometry(gardenFloorShape, { depth: 0.15, bevelEnabled: false }),
      new THREE.MeshStandardMaterial({ color: 0x3b7a2e, roughness: 0.85 })
    );
    gardenTurf.rotation.x = Math.PI / 2;
    gardenTurf.position.y = 0.16;
    gardenTurf.receiveShadow = true;
    registerZoneMesh(gardenTurf, 'little-garden');
    gardenGroup.add(gardenTurf);

    gatesAndBarriersGroup.add(createDetailedFence([
      [-35, -17.3], [-23, -18.8], [-14.5, -16.4], [-7.6, 1.8], [-18, 8.4], [-44, 11.4]
    ], 'white-picket'));

    // Garden Pergola Gate
    const createGardenPergolaGate = (x: number, z: number, rotY: number) => {
      const pg = new THREE.Group();
      pg.position.set(x, 0.16, z);
      pg.rotation.y = rotY;
      const whiteWood = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.35 });
      [[-1.6, -0.5], [1.6, -0.5], [-1.6, 0.5], [1.6, 0.5]].forEach(([px, pz]) => {
        const post = new THREE.Mesh(new THREE.BoxGeometry(0.18, 2.7, 0.18), whiteWood);
        post.position.set(px, 1.35, pz);
        post.castShadow = true;
        pg.add(post);
      });
      const beam = new THREE.Mesh(new THREE.BoxGeometry(3.8, 0.18, 0.18), whiteWood);
      beam.position.set(0, 2.7, 0);
      pg.add(beam);
      for (let r = -3; r <= 3; r++) {
        const rafter = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.12, 1.45), whiteWood);
        rafter.position.set(r * 0.52, 2.84, 0);
        pg.add(rafter);
      }
      return pg;
    };
    gatesAndBarriersGroup.add(createGardenPergolaGate(-11.2, -5.2, 1.18));

    // Pram Bay & Planters
    const pramBay = new THREE.Mesh(
      new THREE.BoxGeometry(4.2, 0.08, 2.4),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.7 })
    );
    pramBay.position.set(-14.5, 0.2, -3.5);
    pramBay.rotation.y = -0.35;
    gardenGroup.add(pramBay);
    createFloralPlanterBox(-12.5, -2.2, 2.0, -0.35);

    // 6 White Pyramid Shade Gazebos in Little Garden
    const createPyramidGazebo = (x: number, z: number, size = 3.6, roofHex = 0xf8fafc, rotY = 0, zoneId = 'little-garden') => {
      const grp = new THREE.Group();
      grp.position.set(x, 0.15, z);
      grp.rotation.y = rotY;

      const legMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.5, roughness: 0.4 });
      const half = size * 0.44;
      [[-half, -half], [half, -half], [half, half], [-half, half]].forEach(([lx, lz]) => {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.2, 6), legMat);
        pole.position.set(lx, 1.1, lz);
        grp.add(pole);
      });

      const roofGeo = new THREE.ConeGeometry(size * 0.72, 1.45, 4);
      const roofMat = new THREE.MeshStandardMaterial({ color: roofHex, roughness: 0.55 });
      const roof = new THREE.Mesh(roofGeo, roofMat);
      roof.position.y = 2.85;
      roof.rotation.y = Math.PI / 4;
      roof.castShadow = true;
      registerZoneMesh(roof, zoneId);
      grp.add(roof);

      const matMesh = new THREE.Mesh(
        new THREE.BoxGeometry(size * 0.85, 0.08, size * 0.85),
        new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8 })
      );
      matMesh.position.y = 0.05;
      grp.add(matMesh);

      return grp;
    };

    [
      [-40.5, -6.5, 3.5, 0.2],
      [-36.5, -10.5, 3.4, -0.25],
      [-32.0, -12.0, 3.4, -0.25],
      [-27.5, -13.5, 3.4, -0.25],
      [-21.5, -8.0, 4.2, -0.3],
      [-19.5, -1.5, 3.6, 0.05]
    ].forEach(([tx, tz, sz, ry]) => {
      gardenGroup.add(createPyramidGazebo(tx, tz, sz, 0xf8fafc, ry, 'little-garden'));
    });

    // Toddler Rainbow Slide & Circular Playpen
    const toddlerSlideGrp = new THREE.Group();
    toddlerSlideGrp.position.set(-39, 0.2, 3);
    toddlerSlideGrp.rotation.y = 0.25;
    const tsBase = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.6, 3.4), new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.4 }));
    tsBase.position.y = 0.3;
    const tsBack = new THREE.Mesh(new THREE.BoxGeometry(2.0, 2.8, 3.4), new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.4 }));
    tsBack.position.set(-1.5, 1.4, 0);
    const tsRamp = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.5, 2.6), new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.35 }));
    tsRamp.position.set(0.6, 1.3, 0);
    tsRamp.rotation.z = -0.45;
    toddlerSlideGrp.add(tsBase, tsBack, tsRamp);
    registerZoneMesh(tsBack, 'little-garden');
    gardenGroup.add(toddlerSlideGrp);

    const playpenGrp = new THREE.Group();
    playpenGrp.position.set(-29, 0.2, 2.5);
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      const p = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.65, 0.12),
        new THREE.MeshStandardMaterial({ color: i % 2 === 0 ? 0xa16207 : 0xfacc15 })
      );
      p.position.set(Math.cos(a) * 2.5, 0.35, Math.sin(a) * 2.5);
      p.rotation.y = -a + Math.PI / 2;
      playpenGrp.add(p);
    }
    gardenGroup.add(playpenGrp);

    // 28 Soft-Play Blocks
    const softPlayColors = [0xf43f5e, 0x38bdf8, 0xfacc15, 0xa855f7, 0x4ade80, 0xfb923c];
    for (let i = 0; i < 28; i++) {
      const bx = -36 + (i % 7) * 3.2 + (Math.random() - 0.5) * 1.2;
      const bz = -7 + Math.floor(i / 7) * 3.2 + (Math.random() - 0.5) * 1.2;
      const blk = new THREE.Mesh(
        new THREE.BoxGeometry(0.65, 0.45, 0.65),
        new THREE.MeshStandardMaterial({ color: softPlayColors[i % softPlayColors.length], roughness: 0.4 })
      );
      blk.position.set(bx, 0.4, bz);
      blk.rotation.y = Math.random() * Math.PI;
      blk.castShadow = true;
      gardenGroup.add(blk);
    }

    // ZONE 3: Swimming Pool & No-Entry Safety Buffer
    const poolGroup = new THREE.Group();
    poolGroup.position.set(-26, 0, 16.5);
    poolGroup.rotation.y = -0.10;
    worldGroup.add(poolGroup);

    const poolDeck = new THREE.Mesh(new THREE.BoxGeometry(20.5, 0.26, 12.0), new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.8 }));
    poolDeck.position.y = 0.13;
    poolGroup.add(poolDeck);

    poolWaterMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.22,
      roughness: 0.12,
      metalness: 0.25
    });
    const poolWater = new THREE.Mesh(new THREE.BoxGeometry(13.2, 0.35, 6.2), poolWaterMat);
    poolWater.position.set(-1.2, 0.17, 0);
    registerZoneMesh(poolWater, 'swimming-pool');
    registerZoneMesh(poolDeck, 'swimming-pool');

    const wadingRim = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.75, 0.32, 24), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 }));
    wadingRim.position.set(7.4, 0.16, 0);
    const wadingWater = new THREE.Mesh(new THREE.CylinderGeometry(1.45, 1.45, 0.35, 24), poolWaterMat);
    wadingWater.position.set(7.4, 0.18, 0);
    poolGroup.add(wadingRim, wadingWater, poolWater);

    // 4 Poolside Loungers & Umbrellas
    for (let s = 0; s < 4; s++) {
      const lounger = new THREE.Group();
      lounger.position.set(-5.5 + s * 3.5, 0.28, 4.4);
      const baseL = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.2, 0.8), new THREE.MeshStandardMaterial({ color: 0xf8fafc }));
      const cushion = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.1, 0.75), new THREE.MeshStandardMaterial({ color: s % 2 === 0 ? 0x0284c7 : 0x38bdf8 }));
      cushion.position.y = 0.12;
      lounger.add(baseL, cushion);
      poolGroup.add(lounger);
    }
    const createPoolUmbrella = (x: number, z: number) => {
      const ug = new THREE.Group();
      ug.position.set(x, 0.26, z);
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 2.1, 8), new THREE.MeshStandardMaterial({ color: 0xe2e8f0 }));
      pole.position.y = 1.05;
      const top = new THREE.Mesh(new THREE.ConeGeometry(1.35, 0.65, 8), new THREE.MeshStandardMaterial({ color: 0xe0f2fe, roughness: 0.5 }));
      top.position.y = 2.1;
      ug.add(pole, top);
      return ug;
    };
    [[-5.5, -4.4], [-1.5, -4.4], [2.5, -4.4], [-5.5, 4.4], [-1.5, 4.4], [3.5, 4.4]].forEach(([ux, uz]) => {
      poolGroup.add(createPoolUmbrella(ux, uz));
    });

    // 4-Sided Spear Picket Security Fence
    const pfW = 20.2, pfD = 11.7, pfH = 1.75;
    const poolFenceMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.75, roughness: 0.25 });
    [
      [0, pfH / 2, -pfD / 2, pfW, pfH, 0.14],
      [0, pfH / 2,  pfD / 2, pfW, pfH, 0.14],
      [-pfW / 2, pfH / 2, 0, 0.14, pfH, pfD],
      [ pfW / 2, pfH / 2, 0, 0.14, pfH, pfD]
    ].forEach(([x, y, z, w, h, d]) => {
      const topRail = new THREE.Mesh(new THREE.BoxGeometry(w, 0.12, d + 0.08), poolFenceMat);
      topRail.position.set(x, h, z);
      poolGroup.add(topRail);
    });
    poolGroup.add(createLifebuoyRing(-4.5, 1.15, pfD / 2 + 0.14, 0));
    poolGroup.add(createLifebuoyRing(7.2, 1.15, pfD / 2 + 0.14, 0));

    // Red-and-White Hatched No-Entry Safety Buffer
    const hatchCanvas = document.createElement('canvas');
    hatchCanvas.width = 512;
    hatchCanvas.height = 64;
    const hCtx = hatchCanvas.getContext('2d');
    if (hCtx) {
      hCtx.fillStyle = '#ffffff';
      hCtx.fillRect(0, 0, 512, 64);
      hCtx.fillStyle = '#dc2626';
      for (let i = -64; i < 512; i += 32) {
        hCtx.beginPath();
        hCtx.moveTo(i, 0);
        hCtx.lineTo(i + 18, 0);
        hCtx.lineTo(i + 42, 64);
        hCtx.lineTo(i + 24, 64);
        hCtx.closePath();
        hCtx.fill();
      }
    }
    const hatchTex = new THREE.CanvasTexture(hatchCanvas);
    const bufferStrip = new THREE.Mesh(
      new THREE.BoxGeometry(20.2, 0.16, 1.45),
      new THREE.MeshStandardMaterial({ map: hatchTex, roughness: 0.6 })
    );
    bufferStrip.position.set(0, 0.12, pfD / 2 + 0.8);
    poolGroup.add(bufferStrip);

    // ZONE 4: LED Digital Billboard
    const billboardGroup = new THREE.Group();
    billboardGroup.position.set(-39, 0, 24);
    billboardGroup.rotation.y = 0.48;
    const screenHousing = new THREE.Mesh(
      new THREE.BoxGeometry(7.6, 4.8, 0.45),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.5, roughness: 0.4 })
    );
    screenHousing.position.set(0, 5.2, 0);
    const ledScreenMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(7.1, 4.35),
      new THREE.MeshBasicMaterial({ map: billboardTexture })
    );
    ledScreenMesh.position.set(0, 5.2, 0.24);
    registerZoneMesh(screenHousing, 'info-adverts');
    registerZoneMesh(ledScreenMesh, 'info-adverts');
    billboardGroup.add(screenHousing, ledScreenMesh);
    worldGroup.add(billboardGroup);
    createFloralPlanterBox(-39, 24.4, 4.6, 0.48);

    // ZONE 5: Main Entrance Welcome Archway & Creative Skating Pit
    const archGroup = new THREE.Group();
    archGroup.position.set(-37, 0.15, 40.5);
    archGroup.rotation.y = 0.35;
    const archBeam = new THREE.Mesh(
      new THREE.BoxGeometry(8.8, 1.25, 1.05),
      new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.35 })
    );
    archBeam.position.set(0, 4.1, 0);
    registerZoneMesh(archBeam, 'main-entrance');
    archGroup.add(archBeam);
    worldGroup.add(archGroup);

    const skateGroup = new THREE.Group();
    skateGroup.position.set(-35, 0.16, 33);
    skateGroup.rotation.y = 0.35;
    const rinkFloor = new THREE.Mesh(
      new THREE.BoxGeometry(8.6, 0.14, 6.2),
      new THREE.MeshStandardMaterial({ color: 0xe0f2fe, roughness: 0.2, metalness: 0.15 })
    );
    rinkFloor.position.y = 0.07;
    registerZoneMesh(rinkFloor, 'creative-zone');
    skateGroup.add(rinkFloor);
    worldGroup.add(skateGroup);

    // ZONE 6: Parents' Meeting & Lounge (5 Gazebos)
    [
      [-32.5, 28.5], [-28.0, 27.6], [-23.5, 26.8], [-19.2, 31.2], [-15.0, 29.5]
    ].forEach(([lx, lz]) => {
      worldGroup.add(createPyramidGazebo(lx, lz, 3.3, 0xfef3c7, -0.15, 'parents-lounge'));
    });

    // ZONE 7: Adventure Zone (4 Giant Commercial Bouncy Castles + 6 Picnic Tables)
    const bouncyCastles: THREE.Group[] = [];
    const createBouncyCastle = (x: number, z: number, rotY: number, mainHex: number, accentHex: number, slideHex: number) => {
      const bc = new THREE.Group();
      bc.position.set(x, 0.15, z);
      bc.rotation.y = rotY;

      const base = new THREE.Mesh(
        new THREE.BoxGeometry(6.2, 1.1, 5.4),
        new THREE.MeshStandardMaterial({ color: mainHex, roughness: 0.45 })
      );
      base.position.y = 0.55;
      base.castShadow = true;
      registerZoneMesh(base, 'adventure-zone');
      bc.add(base);

      const backWall = new THREE.Mesh(
        new THREE.BoxGeometry(6.2, 3.4, 1.2),
        new THREE.MeshStandardMaterial({ color: accentHex, roughness: 0.45 })
      );
      backWall.position.set(0, 2.1, -2.1);
      backWall.castShadow = true;
      bc.add(backWall);

      [[-2.7, -2.3], [2.7, -2.3], [-2.7, 2.3], [2.7, 2.3]].forEach(([px, pz]) => {
        const pil = new THREE.Mesh(
          new THREE.CylinderGeometry(0.55, 0.55, 4.2, 10),
          new THREE.MeshStandardMaterial({ color: slideHex, roughness: 0.4 })
        );
        pil.position.set(px, 2.1, pz);
        const spire = new THREE.Mesh(
          new THREE.ConeGeometry(0.7, 1.3, 10),
          new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 })
        );
        spire.position.set(px, 4.85, pz);
        bc.add(pil, spire);
      });

      const slide = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 0.45, 3.2),
        new THREE.MeshStandardMaterial({ color: slideHex, roughness: 0.35 })
      );
      slide.position.set(0, 0.85, 3.4);
      slide.rotation.x = 0.42;
      bc.add(slide);

      bouncyCastles.push(bc);
      worldGroup.add(bc);
    };
    createBouncyCastle(9.5, -34.5, 0.18, 0xfacc15, 0x7c3aed, 0x3b82f6);
    createBouncyCastle(18.5, -31.0, -0.25, 0xfacc15, 0xef4444, 0x2563eb);
    createBouncyCastle(0.5, -24.5, 0.12, 0x3b82f6, 0xf97316, 0xfacc15);
    createBouncyCastle(18.0, -21.0, -0.1, 0x22c55e, 0xec4899, 0xfacc15);

    // 6 Wooden Picnic Tables in Adventure Zone
    const createPicnicTable = (x: number, z: number) => {
      const pt = new THREE.Group();
      pt.position.set(x, 0.15, z);
      const woodMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.85 });
      const top = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.12, 1.1), woodMat);
      top.position.y = 0.75;
      const b1 = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.1, 0.35), woodMat);
      b1.position.set(0, 0.45, -0.85);
      const b2 = b1.clone();
      b2.position.z = 0.85;
      pt.add(top, b1, b2);
      return pt;
    };
    [[3.5, -15.5], [7.2, -15.5], [3.5, -12.5], [7.2, -12.5], [17.5, -14.0], [21.0, -14.0]].forEach(([px, pz]) => {
      worldGroup.add(createPicnicTable(px, pz));
    });

    // ZONE 8: Celebration Stage (Covered Truss, Zimbabwean Marimba, Bubbles & 80+ Chairs)
    const stageGroup = new THREE.Group();
    stageGroup.position.set(10, 0.15, -1.5);
    worldGroup.add(stageGroup);

    const stagePlatform = new THREE.Mesh(
      new THREE.BoxGeometry(11.5, 1.1, 6.8),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 })
    );
    stagePlatform.position.y = 0.55;
    stageGroup.add(stagePlatform);
    registerZoneMesh(stagePlatform, 'celebration-stage');

    const stageRoof = new THREE.Mesh(
      new THREE.BoxGeometry(12.2, 0.65, 7.4),
      new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 })
    );
    stageRoof.position.set(0, 6.8, 0);
    stageGroup.add(stageRoof);

    // Marimba Instrument
    const marimbaGroup = new THREE.Group();
    marimbaGroup.position.set(-2.8, 1.25, 0.4);
    const mFrame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.7, 0.75), new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 }));
    marimbaGroup.add(mFrame);
    for (let k = 0; k < 11; k++) {
      const kLen = 0.75 - k * 0.025;
      const key = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.06, kLen), new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.5 }));
      key.position.set(-1.0 + k * 0.2, 0.38, 0);
      marimbaGroup.add(key);
    }
    stageGroup.add(marimbaGroup);

    // Iridescent Floating Soap Bubbles
    const bubbleGeo = new THREE.SphereGeometry(0.24, 10, 10);
    const bubbleMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transmission: 0.95,
      opacity: 0.88,
      transparent: true,
      roughness: 0.04
    });
    for (let i = 0; i < 35; i++) {
      const b = new THREE.Mesh(bubbleGeo, bubbleMat);
      b.position.set((Math.random() - 0.5) * 14, 1.2 + Math.random() * 5.0, (Math.random() - 0.5) * 12);
      b.userData = { speedY: 0.35 + Math.random() * 0.45, phase: Math.random() * Math.PI * 2, baseY: 1.2 };
      stageGroup.add(b);
      floatingBubbles.push(b);
    }

    // 8 Feather Flags flanking stage
    const flagColors = [0xef4444, 0xfacc15, 0x22c55e, 0x3b82f6, 0xa855f7, 0xf97316];
    for (let i = 0; i < 4; i++) {
      [-7.2 - i * 1.4, 7.2 + i * 1.4].forEach((fx, sideIdx) => {
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 3.6, 6), new THREE.MeshStandardMaterial({ color: 0xe2e8f0 }));
        pole.position.set(fx, 1.8, 0.5 + i * 0.6);
        const banner = new THREE.Mesh(
          new THREE.BoxGeometry(0.55, 2.4, 0.05),
          new THREE.MeshStandardMaterial({ color: flagColors[(i + sideIdx) % flagColors.length] })
        );
        banner.position.set(fx + 0.25, 2.3, 0.5 + i * 0.6);
        stageGroup.add(pole, banner);
      });
    }

    // Audience Chairs
    const chairMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
    [-3.2, 3.2].forEach(bx => {
      [5.5, 8.2].forEach(bz => {
        for (let r = 0; r < 3; r++) {
          for (let c = 0; c < 5; c++) {
            const ch = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.65, 0.55), chairMat);
            ch.position.set(bx + (c - 2) * 0.85, 0.32, bz + r * 0.85);
            stageGroup.add(ch);
          }
        }
      });
    });

    gatesAndBarriersGroup.add(createSteelBarricadeLine([[3.5, 2.5], [16.5, 2.5]]));

    // ZONE 9 & 10: Food & Drinks + Discovery World
    worldGroup.add(createPyramidGazebo(25.0, -16.5, 3.8, 0x2563eb, -0.2, 'food-drinks'));
    worldGroup.add(createPyramidGazebo(26.5, -11.0, 3.8, 0x2563eb, -0.2, 'food-drinks'));
    worldGroup.add(createPyramidGazebo(24.5, 1.5, 3.6, 0xef4444, 0.15, 'discovery-world'));

    const stemPavilion = new THREE.Mesh(
      new THREE.BoxGeometry(5.6, 2.6, 3.4),
      new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.5 })
    );
    stemPavilion.position.set(22.0, 1.45, 7.5);
    registerZoneMesh(stemPavilion, 'discovery-world');
    worldGroup.add(stemPavilion);

    // 6x6m Giant Lawn Chess Board with Standing Chess Pieces
    const discoveryChessGroup = new THREE.Group();
    discoveryChessGroup.position.set(25.0, 0.18, 5.0);
    const boardBase = new THREE.Mesh(new THREE.BoxGeometry(6.4, 0.1, 6.4), new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.9 }));
    boardBase.position.y = 0.05;
    discoveryChessGroup.add(boardBase);
    const tileMatDark = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
    const tileMatLight = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
    for (let r = 0; r < 8; r++) {
      for (let cl = 0; cl < 8; cl++) {
        const isDark = (r + cl) % 2 === 1;
        const tile = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.12, 0.74), isDark ? tileMatDark : tileMatLight);
        tile.position.set(-2.59 + cl * 0.74, 0.08, -2.59 + r * 0.74);
        discoveryChessGroup.add(tile);
        if ((r === 0 || r === 1 || r === 6 || r === 7) && (cl % 2 === (r % 2))) {
          const pieceH = (r === 0 || r === 7) ? 0.68 : 0.44;
          const piece = new THREE.Mesh(
            new THREE.CylinderGeometry(0.12, 0.18, pieceH, 8),
            r < 2 ? tileMatDark : tileMatLight
          );
          piece.position.set(-2.59 + cl * 0.74, 0.08 + pieceH / 2, -2.59 + r * 0.74);
          discoveryChessGroup.add(piece);
        }
      }
    }
    worldGroup.add(discoveryChessGroup);

    // Connect-4 & Dinosaur Fossil Dig Pit
    const c4Group = new THREE.Group();
    c4Group.position.set(21.5, 0.2, 11.2);
    const c4Frame = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.8, 0.22), new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.4 }));
    c4Frame.position.y = 1.0;
    c4Group.add(c4Frame);
    worldGroup.add(c4Group);

    // ZONE 11: Staff Parking Basketball Court & Giant Chessboard
    const courtGroup = new THREE.Group();
    courtGroup.position.set(23.5, 0.16, 27.5);
    courtGroup.rotation.y = -0.52;
    worldGroup.add(courtGroup);

    const courtMesh = new THREE.Mesh(new THREE.PlaneGeometry(25.5, 13.8), new THREE.MeshStandardMaterial({ map: courtTexture, roughness: 0.85 }));
    courtMesh.rotation.x = -Math.PI / 2;
    registerZoneMesh(courtMesh, 'staff-parking');
    courtGroup.add(courtMesh);

    // White logistics marquees
    [17.5, 23.0, 29.0].forEach(mz => {
      worldGroup.add(createPyramidGazebo(27.5, mz, 4.4, 0xf8fafc, -0.22, 'food-drinks'));
    });

    // ZONE 12: Vehicular Exit Boom Gate
    const exitGroup = new THREE.Group();
    exitGroup.position.set(14.5, 0.15, 35.5);
    exitGroup.rotation.y = -0.52;
    gatesAndBarriersGroup.add(exitGroup);

    const boomHousing = new THREE.Mesh(new THREE.BoxGeometry(0.65, 1.45, 0.65), new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.4 }));
    boomHousing.position.set(-2.6, 0.72, 0);
    registerZoneMesh(boomHousing, 'vehicular-exit');
    exitGroup.add(boomHousing);

    exitBeaconMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 10, 10),
      new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xf59e0b, emissiveIntensity: 0.9 })
    );
    exitBeaconMesh.position.set(-2.6, 1.58, 0);
    exitGroup.add(exitBeaconMesh);

    exitBoomArmPivot = new THREE.Group();
    exitBoomArmPivot.position.set(-2.4, 1.15, 0);
    const boomArm = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 5.2, 8), new THREE.MeshStandardMaterial({ color: 0xf8fafc }));
    boomArm.rotation.z = -Math.PI / 2;
    boomArm.position.x = 2.6;
    exitBoomArmPivot.add(boomArm);
    exitGroup.add(exitBoomArmPivot);

    gatesAndBarriersGroup.add(createJerseyBarrierLine([[6.5, 31.5], [14.5, 36.8], [21.5, 41.2]]));

    // 5. Pathways, Paver Stones, Solar Bollards & Dotted Flow Spine
    const flowPaths = [
      [[-36, 38], [-28, 25], [-13, 21], [-5, 15], [0, 8], [8, 12], [24, 11], [29, 8]],
      [[-5, 15], [2, 22], [11, 32], [18, 37]],
      [[0, 8], [-4, -3], [-8, -14]]
    ];
    const dotPaverMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
    const stonePaverMat = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.85 });
    flowPaths.forEach(pathPts => {
      const vecs = pathPts.map(([px, pz]) => new THREE.Vector3(px, 0.18, pz));
      const curve = new THREE.CatmullRomCurve3(vecs);
      const totalLen = curve.getLength();
      const steps = Math.floor(totalLen / 1.15);
      for (let i = 0; i <= steps; i++) {
        const pt = curve.getPointAt(i / steps);
        const dot = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.08, 10), dotPaverMat);
        dot.position.set(pt.x, 0.19, pt.z);
        const slab = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.05, 0.85), stonePaverMat);
        slab.position.set(pt.x, 0.16, pt.z);
        pathwaysInfraGroup.add(dot, slab);

        if (i % 6 === 0) {
          const bPost = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.75, 8), new THREE.MeshStandardMaterial({ color: 0x334155 }));
          bPost.position.set(pt.x + 0.95, 0.52, pt.z);
          const bCap = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.18, 8), new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xfacc15, emissiveIntensity: 0.25 }));
          bCap.position.set(pt.x + 0.95, 0.95, pt.z);
          pathwaysInfraGroup.add(bPost, bCap);
        }
      }
    });

    // 6. Complete Demographic Crowd (148 Articulated People)
    const animatedAgents: Array<{
      root: THREE.Group;
      leftArm: THREE.Mesh;
      rightArm: THREE.Mesh;
      leftLeg: THREE.Mesh;
      rightLeg: THREE.Mesh;
      baseX: number;
      baseZ: number;
      role: string;
      behavior: 'walk' | 'bounce' | 'dance' | 'crawl' | 'path';
      radius: number;
      speed: number;
      curve?: THREE.CatmullRomCurve3;
      progress: number;
      phase: number;
    }> = [];
    const personClickMeshes: THREE.Mesh[] = [];

    const createArticulatedPerson = (config: {
      x: number;
      z: number;
      role?: 'adult' | 'kid' | 'baby' | 'staff';
      shirtHex?: number;
      pantsHex?: number;
      behavior?: 'walk' | 'bounce' | 'dance' | 'crawl' | 'path';
      label?: string;
      roleTitle?: string;
      icon?: string;
      pathPts?: number[][] | null;
      speed?: number;
      hasBalloon?: boolean;
      hasHelmet?: boolean;
    }) => {
      const {
        x, z, role = 'adult', shirtHex = 0x3b82f6, pantsHex = 0x1e293b,
        behavior = 'walk', label = 'Exploring Bambino World', roleTitle = 'Parent / Adult',
        icon = '🧑', pathPts = null, speed = 1.0, hasBalloon = false, hasHelmet = false
      } = config;

      const sc = role === 'baby' ? 0.46 : role === 'kid' ? 0.68 : role === 'staff' ? 1.02 : 1.0;
      const root = new THREE.Group();
      root.position.set(x, 0.16, z);
      root.scale.setScalar(sc);

      const skinMat = new THREE.MeshStandardMaterial({ color: 0xd4a373, roughness: 0.6 });
      const shirtMat = new THREE.MeshStandardMaterial({ color: shirtHex, roughness: 0.5 });
      const pantsMat = new THREE.MeshStandardMaterial({ color: pantsHex, roughness: 0.6 });

      const torso = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.62, 0.26), shirtMat);
      torso.position.y = 0.86;
      torso.castShadow = true;
      root.add(torso);

      const head = new THREE.Mesh(new THREE.SphereGeometry(0.21, 10, 10), skinMat);
      head.position.y = 1.38;
      root.add(head);

      if (hasHelmet || role === 'staff') {
        const cap = new THREE.Mesh(
          new THREE.SphereGeometry(0.23, 10, 10, 0, Math.PI * 2, 0, Math.PI / 1.8),
          new THREE.MeshStandardMaterial({ color: role === 'staff' ? 0xfacc15 : 0x38bdf8 })
        );
        cap.position.y = 1.41;
        root.add(cap);
      }

      const leftArm = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.52, 0.14), shirtMat);
      leftArm.position.set(-0.32, 0.85, 0);
      const rightArm = leftArm.clone();
      rightArm.position.x = 0.32;
      const leftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.55, 0.17), pantsMat);
      leftLeg.position.set(-0.13, 0.28, 0);
      const rightLeg = leftLeg.clone();
      rightLeg.position.x = 0.13;
      root.add(leftArm, rightArm, leftLeg, rightLeg);

      if (hasBalloon) {
        const balloon = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 10), new THREE.MeshStandardMaterial({ color: 0xf43f5e }));
        balloon.position.set(0.38, 2.15, 0);
        root.add(balloon);
      }

      torso.userData.personInfo = { roleTitle, label, icon };
      personClickMeshes.push(torso, head);

      let curve: THREE.CatmullRomCurve3 | undefined = undefined;
      if (pathPts && pathPts.length > 1) {
        curve = new THREE.CatmullRomCurve3(pathPts.map(([px, pz]) => new THREE.Vector3(px, 0.16, pz)), true);
      }

      const agent = {
        root, leftArm, rightArm, leftLeg, rightLeg,
        baseX: x, baseZ: z, role, behavior, radius: 1.8, speed,
        curve, progress: Math.random(), phase: Math.random() * Math.PI * 2
      };
      animatedAgents.push(agent);
      crowdGroup.add(root);
      return agent;
    };

    const createStrollerPair = (x: number, z: number, pathPts: number[][], label: string) => {
      const parent = createArticulatedPerson({
        x, z, role: 'adult', shirtHex: 0xec4899, pantsHex: 0x1e293b,
        behavior: 'path', pathPts, speed: 0.75,
        roleTitle: 'Parent with Stroller', label, icon: '🚼'
      });
      const pram = new THREE.Group();
      pram.position.set(0, 0, 0.68);
      const basket = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.36, 0.62), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
      basket.position.y = 0.48;
      const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x38bdf8 }));
      canopy.position.set(0, 0.66, -0.08);
      pram.add(basket, canopy);
      parent.root.add(pram);
    };

    // Populate full 148-person festival crowd across sectors:
    // Babies & Carers
    [
      [-34, -6], [-31, -8], [-27, -5], [-24, -7], [-38, 2.5], [-29, 2.5], [-22, -3], [-35, -10],
      [-33, -4], [-26, -9], [-21, -6], [-37, -3]
    ].forEach(([bx, bz], i) => {
      createArticulatedPerson({
        x: bx, z: bz, role: 'baby', shirtHex: softPlayColors[i % softPlayColors.length],
        behavior: i % 2 === 0 ? 'crawl' : 'bounce', speed: 1.5,
        roleTitle: 'Toddler (6M–2Y)', label: 'Playing on Baby Garden Soft-Play Mats', icon: '👶'
      });
    });
    [[-33, -5], [-25, -6], [-30, 1], [-20, -4], [-28, -2], [-35, -8]].forEach(([ax, az]) => {
      createArticulatedPerson({
        x: ax, z: az, role: 'adult', shirtHex: 0x10b981, behavior: 'walk',
        roleTitle: 'Early-Years Carer', label: 'Supervising Toddlers in The Little Garden', icon: '🧑'
      });
    });

    // Roller Skaters
    const skateLoopPts = [[-37.5, 32], [-33, 30.8], [-32.5, 34], [-37, 35]];
    for (let s = 0; s < 6; s++) {
      createArticulatedPerson({
        x: -35, z: 33, role: 'kid', shirtHex: flagColors[s % flagColors.length],
        behavior: 'path', pathPts: skateLoopPts, speed: 1.8 + (s % 2) * 0.3, hasHelmet: true,
        roleTitle: 'Skater Kid (3–6Y)', label: 'Roller-Skating in Creative Zone Rink', icon: '⛸️'
      });
    }

    // Adventure Zone Bouncing Kids & Picnic Families
    [
      [9.5, -34], [10.2, -35], [18.2, -31], [19.0, -30.5], [0.5, -24.5], [1.2, -24], [18.0, -21], [17.4, -21.5],
      [6.5, -26], [12.5, -25], [14.0, -28], [4.5, -29], [8.0, -31], [16.5, -27], [2.5, -26], [19.5, -24]
    ].forEach(([kx, kz], idx) => {
      createArticulatedPerson({
        x: kx, z: kz, role: 'kid', shirtHex: flagColors[idx % flagColors.length],
        behavior: 'bounce', speed: 2.2, hasBalloon: idx % 3 === 0,
        roleTitle: 'Child (3–6 Yrs)', label: 'Jumping in Adventure Zone Bouncy Castles', icon: '🧒'
      });
    });

    // Stage Performers & Cheering Audience
    [[-2.2, -1.5], [0, -1.2], [2.2, -1.5]].forEach(([px, pz]) => {
      createArticulatedPerson({
        x: 10 + px, z: pz, role: 'adult', shirtHex: 0xa855f7, pantsHex: 0xfacc15,
        behavior: 'dance', speed: 2.5, roleTitle: 'Stage Performer',
        label: 'Performing Live Music & Puppet Show on Stage', icon: '🎸'
      });
    });
    for (let c = 0; c < 16; c++) {
      const cx = 5.5 + (c % 8) * 1.4;
      const cz = 3.8 + Math.floor(c / 8) * 2.2;
      createArticulatedPerson({
        x: cx, z: cz, role: c % 2 === 0 ? 'kid' : 'adult',
        shirtHex: flagColors[c % flagColors.length], behavior: 'dance', speed: 1.9, hasBalloon: c % 4 === 0,
        roleTitle: c % 2 === 0 ? 'Child (3–6Y)' : 'Parent', label: 'Dancing & Cheering at Celebration Stage', icon: '🎶'
      });
    }

    // STEM Kids & Educators
    [[23, 3.5], [25, 4.2], [21.5, 5.5], [24.2, 6.0], [26, 2.5], [27, 4.5]].forEach(([dx, dz], idx) => {
      createArticulatedPerson({
        x: dx, z: dz, role: idx === 0 ? 'staff' : 'kid', shirtHex: idx === 0 ? 0xf8fafc : 0xec4899,
        behavior: 'walk', roleTitle: idx === 0 ? 'STEM Educator' : 'Explorer Kid (3–6Y)',
        label: 'Hands-On Science & Giant Lawn Chess', icon: '🔬'
      });
    });

    // Safety Marshals & Welcome Hosts
    ([
      [-35, 39, 'Welcome Host at Main Entrance Gate'],
      [-26, 23, 'Certified Pool Perimeter Lifeguard'],
      [-31, -19, 'Fish Pond Perimeter Safety Marshal'],
      [12, 34, 'Traffic Marshal at Vehicular Exit Gate'],
      [25, -13, 'Catering & Refreshment Host'],
      [14, -18, 'Inflatables Safety Marshal']
    ] as [number, number, string][]).forEach(([sx, sz, desc]) => {
      createArticulatedPerson({
        x: sx, z: sz, role: 'staff', shirtHex: 0xf97316, behavior: 'walk',
        roleTitle: 'Safety / Event Staff', label: desc, icon: '🦺'
      });
    });

    // Walking Flow Spine Visitors & Strollers
    const mainWalkLoop = [[-36, 38], [-28, 25], [-13, 21], [-5, 15], [0, 8], [8, 12], [22, 10], [0, 8], [-13, 21], [-28, 25]];
    for (let w = 0; w < 12; w++) {
      createArticulatedPerson({
        x: -25, z: 25, role: w % 3 === 0 ? 'kid' : 'adult', shirtHex: flagColors[w % flagColors.length],
        behavior: 'path', pathPts: mainWalkLoop, speed: 0.7 + (w % 3) * 0.15, hasBalloon: w % 3 === 0,
        roleTitle: 'Festival Visitor', label: 'Walking Along Main Dotted Flow Spine', icon: '🚶'
      });
    }
    createStrollerPair(-30, 27, mainWalkLoop, 'Strolling Along Parents Lounge Promenade');
    createStrollerPair(-14, -4, [[-15, -3], [-12, -6], [-16, -8], [-18, -4]], 'Arriving at Little Garden Stroller Bay');

    // 7. SVG Wedges & DOM Callout Badges
    svgLayer.innerHTML = '';
    domLayer.innerHTML = '';
    const calloutRuntimes = CALLOUT_ITEMS.map(item => {
      const poly = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
      const fillMap: Record<string, string> = {
        'theme-white': 'rgba(241, 245, 249, 0.95)',
        'theme-green': 'rgba(209, 250, 215, 0.96)',
        'theme-peach': 'rgba(254, 215, 180, 0.96)',
        'theme-yellow': 'rgba(254, 249, 195, 0.96)'
      };
      poly.setAttribute('fill', fillMap[item.theme] || fillMap['theme-white']);
      poly.setAttribute('stroke', '#1e293b');
      poly.setAttribute('stroke-width', '2');
      svgLayer.appendChild(poly);

      const badge = document.createElement('div');
      badge.className = `map-callout ${item.theme}`;
      badge.dataset.zoneId = item.zoneId;
      badge.innerHTML = `
        <span class="pin-icon">${item.icon}</span>
        <span class="callout-title">${item.shortTitle}</span>
        ${item.lines.map(l => `<div class="callout-sub">${l}</div>`).join('')}
        <div class="pin-tooltip">
          <div class="pin-tooltip-header">
            <span class="pin-tooltip-icon">${item.icon}</span>
            <div class="pin-tooltip-title">${item.title}</div>
            <span class="pin-tooltip-badge">${ZONES_DATA[item.zoneId]?.ageGroup || 'All Ages'}</span>
          </div>
          <div class="pin-tooltip-desc">${item.tooltipDesc}</div>
          <div class="pin-tooltip-meta">
            <span>${ZONES_DATA[item.zoneId]?.status || 'Live Activity'}</span>
            <span class="pin-tooltip-cta">Inspect &rarr;</span>
          </div>
        </div>
      `;
      badge.addEventListener('click', (e) => {
        e.stopPropagation();
        onSelectZone(item.zoneId);
        const z = ZONES_DATA[item.zoneId];
        if (z) animateCameraTo(new THREE.Vector3(z.camPos.x, z.camPos.y, z.camPos.z), new THREE.Vector3(z.camTarget.x, z.camTarget.y, z.camTarget.z), 1000);
      });
      domLayer.appendChild(badge);

      return {
        ...item,
        polyEl: poly,
        badgeEl: badge,
        anchorVec: new THREE.Vector3(...item.anchor3D),
        labelVec: new THREE.Vector3(...item.label3D),
        hiddenByFilter: false
      };
    });

    // 8. Raycasting for Zone & Person Clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const personHits = raycaster.intersectObjects(personClickMeshes);
      if (personHits.length > 0 && personHits[0].object.userData.personInfo) {
        const info = personHits[0].object.userData.personInfo;
        setInspectedPerson(info);
        setPersonScreenPos({ x: e.clientX, y: e.clientY });
        return;
      }

      const zoneHits = raycaster.intersectObjects(clickableMeshes);
      if (zoneHits.length > 0 && zoneHits[0].object.userData.zoneId) {
        const zId = zoneHits[0].object.userData.zoneId;
        onSelectZone(zId);
        const z = ZONES_DATA[zId];
        if (z) animateCameraTo(new THREE.Vector3(z.camPos.x, z.camPos.y, z.camPos.z), new THREE.Vector3(z.camTarget.x, z.camTarget.y, z.camTarget.z), 1000);
      } else {
        setInspectedPerson(null);
      }
    };
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // 9. Close-Up Activity Cams
    const focusActivityCam = (key: string) => {
      const presets: Record<string, { pos: { x: number; y: number; z: number }; look: { x: number; y: number; z: number } }> = {
        'baby-garden':    { pos: { x: -30, y: 12, z: 6 },   look: { x: -30, y: 0.5, z: -6 } },
        'skating-pit':    { pos: { x: -30, y: 10, z: 42 },  look: { x: -35, y: 0.5, z: 33 } },
        'bouncy-castles': { pos: { x: 12,  y: 14, z: -14 }, look: { x: 12,  y: 1.5, z: -28 } },
        'stage-show':     { pos: { x: 10,  y: 11, z: 14 },  look: { x: 10,  y: 2.0, z: -1 } },
        'science-lab':    { pos: { x: 32,  y: 11, z: 14 },  look: { x: 24,  y: 1.0, z: 5 } },
        'stroller-flow':  { pos: { x: -20, y: 11, z: 38 },  look: { x: -25, y: 0.5, z: 27 } },
        'main-gate':      { pos: { x: -41, y: 10, z: 50 },  look: { x: -37, y: 1.8, z: 40 } },
        'garden-pergola': { pos: { x: -4,  y: 9,  z: -2 },  look: { x: -11, y: 1.2, z: -5 } },
        'exit-boom':      { pos: { x: 18,  y: 10, z: 46 },  look: { x: 14,  y: 1.0, z: 35 } },
        'pond-fence':     { pos: { x: -26, y: 12, z: -14 }, look: { x: -31, y: 0.8, z: -26 } }
      };
      const p = presets[key];
      if (p) animateCameraTo(new THREE.Vector3(p.pos.x, p.pos.y, p.pos.z), new THREE.Vector3(p.look.x, p.look.y, p.look.z), 950);
    };

    // 10. Animation Loop
    let animId: number;
    const clock = new THREE.Clock();

    const projectToScreen = (vec3: THREE.Vector3) => {
      const v = vec3.clone().project(camera);
      const rect = renderer.domElement.getBoundingClientRect();
      return {
        x: (v.x * 0.5 + 0.5) * rect.width,
        y: (-(v.y * 0.5) + 0.5) * rect.height,
        visible: v.z < 1
      };
    };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Camera flight smoothing
      if (camAnim) {
        const t = Math.min(1, (performance.now() - camAnim.startTime) / camAnim.duration);
        const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        camera.position.lerpVectors(camAnim.startPos, camAnim.endPos, ease);
        controls.target.lerpVectors(camAnim.startLook, camAnim.endLook, ease);
        if (t >= 1) camAnim = null;
      }
      controls.update();

      // Floating stage bubbles
      floatingBubbles.forEach(b => {
        b.position.y += b.userData.speedY * 0.015;
        b.position.x += Math.sin(elapsed * 1.5 + b.userData.phase) * 0.008;
        b.position.z += Math.cos(elapsed * 1.2 + b.userData.phase) * 0.008;
        if (b.position.y > 7.0) {
          b.position.y = b.userData.baseY;
          b.position.x = (Math.random() - 0.5) * 12;
          b.position.z = (Math.random() - 0.5) * 10;
        }
      });

      if (poolWaterMat) {
        poolWaterMat.emissiveIntensity = 0.20 + Math.sin(elapsed * 2.2) * 0.08;
      }

      // Gentle Tree Sway & Bouncy Castle Pulse
      swayingTrees.forEach(tr => {
        tr.grp.rotation.z = Math.sin(elapsed * tr.speed + tr.phase) * tr.amp;
      });
      bouncyCastles.forEach((bc, idx) => {
        bc.scale.y = 1 + Math.sin(elapsed * 3.2 + idx) * 0.025;
      });

      // Exit Boom Gate & Beacon
      if (exitBoomArmPivot) {
        exitBoomArmPivot.rotation.z = Math.max(0, Math.sin(elapsed * 0.8) * 0.65);
      }
      if (exitBeaconMesh && exitBeaconMesh.material instanceof THREE.MeshStandardMaterial) {
        exitBeaconMesh.material.emissiveIntensity = 0.5 + Math.abs(Math.sin(elapsed * 6)) * 0.9;
      }

      // Animated agents path walking and bounce
      animatedAgents.forEach(ag => {
        if (!ag.root.visible) return;
        const t = elapsed * ag.speed + ag.phase;
        if (ag.behavior === 'path' && ag.curve) {
          ag.progress = (ag.progress + 0.00055 * ag.speed) % 1;
          const pt = ag.curve.getPointAt(ag.progress);
          const lookPt = ag.curve.getPointAt((ag.progress + 0.01) % 1);
          ag.root.position.set(pt.x, 0.16, pt.z);
          ag.root.lookAt(lookPt.x, 0.16, lookPt.z);
          ag.leftLeg.rotation.x = Math.sin(t * 6) * 0.45;
          ag.rightLeg.rotation.x = -Math.sin(t * 6) * 0.45;
          ag.leftArm.rotation.x = -Math.sin(t * 6) * 0.35;
          ag.rightArm.rotation.x = Math.sin(t * 6) * 0.35;
        } else if (ag.behavior === 'bounce') {
          ag.root.position.y = 0.16 + Math.abs(Math.sin(t * 4.2)) * 0.45;
          ag.leftArm.rotation.z = Math.sin(t * 4.2) * 0.6 + 0.5;
          ag.rightArm.rotation.z = -Math.sin(t * 4.2) * 0.6 - 0.5;
        } else if (ag.behavior === 'dance') {
          ag.root.position.y = 0.16 + Math.abs(Math.sin(t * 5)) * 0.18;
          ag.root.rotation.y = Math.sin(t * 2.5) * 0.45;
          ag.leftArm.rotation.x = Math.sin(t * 5) * 0.8;
          ag.rightArm.rotation.x = -Math.sin(t * 5) * 0.8;
        } else if (ag.behavior === 'crawl') {
          ag.root.position.x = ag.baseX + Math.cos(t * 1.2) * 0.85;
          ag.root.position.z = ag.baseZ + Math.sin(t * 1.2) * 0.85;
          ag.root.rotation.y = -t * 1.2;
        } else {
          ag.rightArm.rotation.z = -0.45 + Math.sin(t * 3.5) * 0.35;
        }
      });

      // Update 2D Callouts overlay
      calloutRuntimes.forEach(c => {
        if (c.hiddenByFilter) {
          c.badgeEl.style.display = 'none';
          c.polyEl.style.display = 'none';
          return;
        }
        const aPt = projectToScreen(c.anchorVec);
        const lPt = projectToScreen(c.labelVec);

        if (!aPt.visible || !lPt.visible) {
          c.badgeEl.style.display = 'none';
          c.polyEl.style.display = 'none';
          return;
        }

        c.badgeEl.style.display = 'inline-flex';
        c.polyEl.style.display = 'block';
        c.badgeEl.style.left = `${lPt.x}px`;
        c.badgeEl.style.top = `${lPt.y}px`;

        const dx = aPt.x - lPt.x;
        const dy = aPt.y - lPt.y;
        const len = Math.hypot(dx, dy) || 1;
        const baseWidth = 6.0;
        const nx = (-dy / len) * baseWidth;
        const ny = (dx / len) * baseWidth;
        c.polyEl.setAttribute('points', `${lPt.x + nx},${lPt.y + ny} ${lPt.x - nx},${lPt.y - ny} ${aPt.x},${aPt.y}`);
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Save internals
    internalsRef.current = {
      scene,
      camera,
      renderer,
      controls,
      animateCameraTo,
      calloutRuntimes,
      setLighting: applyLighting,
      focusActivityCam,
      toggleGroup: (layer, visible) => {
        if (layer === 'flow') {
          pathwaysInfraGroup.visible = visible;
          crowdGroup.visible = visible;
        } else if (layer === 'barriers') {
          gatesAndBarriersGroup.visible = visible;
        } else if (layer === 'trees') {
          treesAndFloraGroup.visible = visible;
        }
      },
      setDensity: (lvl) => {
        const factor = lvl === 'quiet' ? 0.45 : lvl === 'normal' ? 0.75 : 1.0;
        animatedAgents.forEach((ag, idx) => {
          ag.root.visible = (idx / animatedAgents.length) <= factor;
        });
        setCrowdStats({
          total: Math.round(148 * factor),
          adults: Math.round(54 * factor),
          kids: Math.round(52 * factor),
          babies: Math.round(22 * factor),
          strollers: Math.round(8 * factor),
          staff: Math.round(12 * factor)
        });
      }
    };

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(bbTimer);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Sync active zone highlights
  useEffect(() => {
    if (internalsRef.current) {
      internalsRef.current.calloutRuntimes.forEach(c => {
        c.badgeEl.classList.toggle('active-callout', c.zoneId === activeZoneId);
      });
    }
  }, [activeZoneId]);

  // Guided Tour
  useEffect(() => {
    if (!isTouring) return;
    const zones = Object.keys(ZONES_DATA);
    let idx = 0;
    const interval = setInterval(() => {
      idx = (idx + 1) % zones.length;
      const zId = zones[idx];
      const z = ZONES_DATA[zId];
      if (z && internalsRef.current) {
        internalsRef.current.animateCameraTo(
          new THREE.Vector3(z.camPos.x, z.camPos.y, z.camPos.z),
          new THREE.Vector3(z.camTarget.x, z.camTarget.y, z.camTarget.z),
          1100
        );
        onSelectZone(zId);
      }
    }, 4500);
    return () => clearInterval(interval);
  }, [isTouring, onSelectZone]);

  const handleFilter = (cat: string) => {
    setFilterCategory(cat);
    if (internalsRef.current) {
      internalsRef.current.calloutRuntimes.forEach(c => {
        const z = ZONES_DATA[c.zoneId];
        c.hiddenByFilter = cat !== 'all' && z?.category !== cat;
      });
    }
  };

  const handleSetLighting = (mode: 'day' | 'sunset' | 'night') => {
    setLightingMode(mode);
    internalsRef.current?.setLighting(mode);
  };

  const handleToggleLayer = (layer: 'labels' | 'flow' | 'barriers' | 'trees') => {
    const next = !layerVisibility[layer];
    setLayerVisibility(prev => ({ ...prev, [layer]: next }));
    if (layer === 'labels') {
      if (svgRef.current) svgRef.current.style.display = next ? 'block' : 'none';
      if (domOverlayRef.current) domOverlayRef.current.style.display = next ? 'block' : 'none';
    } else {
      internalsRef.current?.toggleGroup(layer, next);
    }
  };

  return (
    <div className={`relative overflow-hidden select-none bg-[#141e18] ${className}`}>
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* SVG Layer for Reference-Map Callout Pointer Wedges */}
      <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

      {/* HTML Callout Badges Layer */}
      <div ref={domOverlayRef} className={`absolute inset-0 w-full h-full pointer-events-none z-11 ${expandedCards ? 'expanded-cards' : ''}`} />

      {/* Floating Person / Activity Inspector Pill */}
      {inspectedPerson && personScreenPos && (
        <div
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full pb-3"
          style={{ left: `${personScreenPos.x}px`, top: `${personScreenPos.y}px` }}
        >
          <div className="bg-slate-950/95 text-white px-3.5 py-2 rounded-xl border-2 border-amber-400 shadow-2xl flex items-center gap-2.5 min-w-[200px]">
            <span className="text-xl">{inspectedPerson.icon}</span>
            <div>
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-300">
                {inspectedPerson.roleTitle}
              </div>
              <div className="text-xs font-semibold text-slate-100 mt-0.5">
                {inspectedPerson.label}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Crowd & Close-Up Activity Cams HUD Panel */}
      {showCrowdPanel && (
        <section className="fixed left-4 top-20 z-40 w-76 bg-slate-900/95 backdrop-blur-xl border border-slate-700/90 rounded-2xl shadow-2xl p-3.5 text-slate-100 max-h-[85vh] overflow-y-auto">
          <div className="flex items-center justify-between pb-2 mb-2.5 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-base">🎪</span>
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-300 font-['Outfit']">
                  Live Crowd &amp; Activities
                </h3>
                <p className="text-[10px] text-slate-400">148 animated people, tents &amp; trees</p>
              </div>
            </div>
            <button
              onClick={() => setShowCrowdPanel(false)}
              className="w-6 h-6 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-xs cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Demographic Breakdown */}
          <div className="grid grid-cols-5 gap-1 mb-3 text-center">
            <div className="bg-slate-800/90 rounded-lg p-1.5 border border-slate-700/60">
              <div className="text-xs">🧑</div>
              <div className="text-xs font-black text-white">{crowdStats.adults}</div>
              <div className="text-[9px] text-slate-400 font-semibold">Adults</div>
            </div>
            <div className="bg-slate-800/90 rounded-lg p-1.5 border border-slate-700/60">
              <div className="text-xs">🧒</div>
              <div className="text-xs font-black text-amber-300">{crowdStats.kids}</div>
              <div className="text-[9px] text-slate-400 font-semibold">Kids</div>
            </div>
            <div className="bg-slate-800/90 rounded-lg p-1.5 border border-slate-700/60">
              <div className="text-xs">👶</div>
              <div className="text-xs font-black text-emerald-300">{crowdStats.babies}</div>
              <div className="text-[9px] text-slate-400 font-semibold">Babies</div>
            </div>
            <div className="bg-slate-800/90 rounded-lg p-1.5 border border-slate-700/60">
              <div className="text-xs">🚼</div>
              <div className="text-xs font-black text-sky-300">{crowdStats.strollers}</div>
              <div className="text-[9px] text-slate-400 font-semibold">Prams</div>
            </div>
            <div className="bg-slate-800/90 rounded-lg p-1.5 border border-slate-700/60">
              <div className="text-xs">🦺</div>
              <div className="text-xs font-black text-rose-300">{crowdStats.staff}</div>
              <div className="text-[9px] text-slate-400 font-semibold">Staff</div>
            </div>
          </div>

          {/* Crowd Density Control */}
          <div className="mb-3">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              <span>Festival Crowd Level</span>
              <span className="text-emerald-400 font-bold capitalize">{crowdDensity}</span>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {(['quiet', 'normal', 'peak'] as const).map(lvl => (
                <button
                  key={lvl}
                  onClick={() => {
                    setCrowdDensity(lvl);
                    internalsRef.current?.setDensity(lvl);
                  }}
                  className={`py-1 text-[11px] rounded-lg font-semibold capitalize transition cursor-pointer ${
                    crowdDensity === lvl
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Close-Up Activity Cams */}
          <div className="space-y-2 text-left">
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
              🎥 Close-Up Activity &amp; Infrastructure Cams
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {[
                { key: 'baby-garden', icon: '👶', title: 'Baby Soft-Play', sub: 'Crawling & Slide' },
                { key: 'skating-pit', icon: '⛸️', title: 'Skating Rink', sub: 'Kids Gliding Loop' },
                { key: 'bouncy-castles', icon: '🏰', title: 'Bouncy Castles', sub: 'Inflatables' },
                { key: 'stage-show', icon: '🎸', title: 'Stage Concert', sub: 'Marimba & Show' },
                { key: 'science-lab', icon: '🔬', title: 'Discovery STEM', sub: 'Lawn Chess & Lab' },
                { key: 'stroller-flow', icon: '🚼', title: 'Stroller Walk', sub: 'Parents Lounge' },
                { key: 'main-gate', icon: '⛩️', title: 'Main Entry Gate', sub: 'Welcome Arch' },
                { key: 'garden-pergola', icon: '🌸', title: 'Pergola Gate', sub: 'Bougainvillea' },
                { key: 'exit-boom', icon: '🚧', title: 'Exit Boom Gate', sub: 'Jersey Barriers' },
                { key: 'pond-fence', icon: '🛟', title: 'Pond & Fence', sub: 'Safety Perimeter' }
              ].map(cam => (
                <button
                  key={cam.key}
                  onClick={() => internalsRef.current?.focusActivityCam(cam.key)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-left transition flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="text-base">{cam.icon}</span>
                  <div className="truncate">
                    <div className="text-[10px] font-bold text-white truncate">{cam.title}</div>
                    <div className="text-[9px] text-slate-400 truncate">{cam.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sleek Ergonomic Collapsible Bottom Control Dock */}
      <div className={`fixed bottom-3 left-1/2 -translate-x-1/2 z-40 w-[96%] max-w-6xl transition-transform duration-300 ${isDockCollapsed ? 'translate-y-[calc(100%-26px)]' : 'translate-y-0'}`}>
        <div className="flex justify-center mb-1">
          <button
            onClick={() => setIsDockCollapsed(!isDockCollapsed)}
            className="px-3.5 py-1 rounded-t-xl bg-slate-900/95 text-[11px] font-bold text-amber-300 border-t border-x border-slate-700 hover:bg-slate-800 transition cursor-pointer"
          >
            {isDockCollapsed ? '▴ Show Map Controls' : '▾ Hide Controls'}
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-1.5 bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 px-3 py-2 rounded-2xl shadow-2xl text-xs text-slate-100">
          {/* Camera Presets & Tour */}
          <div className="flex items-center gap-1 pr-2 border-r border-slate-700/80">
            <button
              onClick={() => internalsRef.current?.animateCameraTo(new THREE.Vector3(0, 68, 74), new THREE.Vector3(-2, 0, 2), 1000)}
              className="px-2.5 py-1 rounded-lg font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition cursor-pointer"
              title="Exact Reference Map Angle"
            >
              🖼️ Reference View
            </button>
            <button
              onClick={() => internalsRef.current?.animateCameraTo(new THREE.Vector3(-2, 105, 6), new THREE.Vector3(-2, 0, 2), 1000)}
              className="px-2.5 py-1 rounded-lg text-slate-300 hover:bg-slate-800 transition cursor-pointer"
              title="Overhead 2D/3D Plan"
            >
              📐 Plan
            </button>
            <button
              onClick={() => setIsTouring(!isTouring)}
              className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                isTouring ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              {isTouring ? '⏹ Stop Tour' : '🚁 Guided Tour'}
            </button>
          </div>

          {/* Age Filters */}
          <div className="flex items-center gap-1 pr-2 border-r border-slate-700/80">
            {['all', '6m-2y', '3-6y', 'family', 'safety'].map(cat => (
              <button
                key={cat}
                onClick={() => handleFilter(cat)}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium transition cursor-pointer ${
                  filterCategory === cat
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {cat === 'all' ? 'All' : cat === '6m-2y' ? '👶 6M–2Y' : cat === '3-6y' ? '🧒 3–6Y' : cat === 'family' ? 'Family' : '🛡️ Safety'}
              </button>
            ))}
          </div>

          {/* Lighting Modes */}
          <div className="flex items-center gap-1 pr-2 border-r border-slate-700/80">
            {(['day', 'sunset', 'night'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => handleSetLighting(mode)}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium capitalize transition cursor-pointer ${
                  lightingMode === mode
                    ? 'bg-sky-500/25 text-sky-200 border border-sky-400/40 font-bold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                {mode === 'day' ? '☀️ Day' : mode === 'sunset' ? '🌅 Sunset' : '✨ Showtime'}
              </button>
            ))}
          </div>

          {/* Detailed Layer Toggles */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleToggleLayer('labels')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                layerVisibility.labels ? 'bg-slate-700 text-amber-300' : 'text-slate-400 hover:bg-slate-800'
              }`}
              title="Toggle Callout Labels"
            >
              🏷️ Labels
            </button>
            <button
              onClick={() => handleToggleLayer('flow')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                layerVisibility.flow ? 'bg-slate-700 text-emerald-300' : 'text-slate-400 hover:bg-slate-800'
              }`}
              title="Toggle Paths, Pavers & Walkers"
            >
              🛤️ Flow
            </button>
            <button
              onClick={() => handleToggleLayer('barriers')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                layerVisibility.barriers ? 'bg-slate-700 text-rose-300' : 'text-slate-400 hover:bg-slate-800'
              }`}
              title="Toggle Gates & Fences"
            >
              🚧 Fences
            </button>
            <button
              onClick={() => handleToggleLayer('trees')}
              className={`px-2 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer ${
                layerVisibility.trees ? 'bg-slate-700 text-lime-300' : 'text-slate-400 hover:bg-slate-800'
              }`}
              title="Toggle Multi-Species Trees"
            >
              🌳 Trees
            </button>
            <button
              onClick={() => setShowCrowdPanel(!showCrowdPanel)}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 hover:bg-amber-400/30 transition cursor-pointer flex items-center gap-1"
            >
              <span>👨‍👩‍👧‍👦</span>
              <span>Crowd ({crowdStats.total})</span>
            </button>
            <button
              onClick={() => setExpandedCards(!expandedCards)}
              className="px-2 py-1 rounded-lg text-[11px] text-slate-300 hover:bg-slate-800 transition cursor-pointer"
            >
              {expandedCards ? '📋 Cards' : '📍 Pins'}
            </button>
            {onToggleCinema && (
              <button
                onClick={onToggleCinema}
                className="px-2.5 py-1 rounded-lg text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-200 transition font-bold cursor-pointer"
              >
                {isCinemaMode ? '🗗 Exit' : '⛶ Fullscreen'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
