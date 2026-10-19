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
  animateCameraForTab: (tab: string) => void;
}

interface SiteMap3DProps {
  onSelectZone: (zoneId: string) => void;
  onDeselectZone?: () => void;
  activeZoneId?: string | null;
  className?: string;
  isCinemaMode?: boolean;
  onToggleCinema?: () => void;
}

export const SiteMap3D = forwardRef<SiteMap3DHandle, SiteMap3DProps>(({
  onSelectZone,
  onDeselectZone,
  activeZoneId,
  className = '',
  isCinemaMode = false,
  onToggleCinema
}, ref) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const domOverlayRef = useRef<HTMLDivElement>(null);

  // UI state
  const [inspectedPerson, setInspectedPerson] = useState<{ icon: string; roleTitle: string; label: string } | null>(null);
  const [personScreenPos, setPersonScreenPos] = useState<{ x: number; y: number } | null>(null);

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
      }
    },
    focusActivityCam: (key: string) => {
      if (internalsRef.current) {
        internalsRef.current.focusActivityCam(key);
      }
    },
    animateCameraForTab: (tab: string) => {
      if (!internalsRef.current) return;
      if (tab === 'home') {
        internalsRef.current.animateCameraTo(
          new THREE.Vector3(0, 68, 74),
          new THREE.Vector3(-2, 0, 2),
          1200
        );
      } else if (tab === 'zones') {
        internalsRef.current.animateCameraTo(
          new THREE.Vector3(-12, 28, 38),
          new THREE.Vector3(-10, 2, 8),
          1200
        );
      } else if (tab === 'farm') {
        internalsRef.current.animateCameraTo(
          new THREE.Vector3(26, 26, 32),
          new THREE.Vector3(14, 2, 8),
          1200
        );
      } else if (tab === 'december-5') {
        internalsRef.current.animateCameraTo(
          new THREE.Vector3(-24, 28, 48),
          new THREE.Vector3(-18, 2, 18),
          1200
        );
      } else if (tab === '3d-map') {
        internalsRef.current.animateCameraTo(
          new THREE.Vector3(-8, 48, 58),
          new THREE.Vector3(-4, 0, 4),
          1000
        );
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
    const camera = new THREE.PerspectiveCamera(36, width / height, 1.2, 450);
    const POSTER_CAM_POS = new THREE.Vector3(0, 68, 74);
    const POSTER_CAM_TARGET = new THREE.Vector3(-2, 0, 2);
    camera.position.copy(POSTER_CAM_POS);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      logarithmicDepthBuffer: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    container.appendChild(renderer.domElement);

    // Studio Environment Reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(POSTER_CAM_TARGET);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxPolarAngle = Math.PI / 2 - 0.04;
    controls.minDistance = 6;
    controls.maxDistance = 180;
    controls.addEventListener('start', () => {
      camAnim = null;
      setInspectedPerson(null);
    });
    controls.update();

    // Lighting Setup - Calibrated for high clarity, warm richness, and zero glare
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.42);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x3f6212, 0.35);
    hemiLight.position.set(0, 80, 0);
    scene.add(hemiLight);

    const sunLight = new THREE.DirectionalLight(0xfffbeb, 0.95);
    sunLight.position.set(-45, 78, 42);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 1024;
    sunLight.shadow.mapSize.height = 1024;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 200;
    const d = 68;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0004;
    sunLight.shadow.normalBias = 0.035;
    scene.add(sunLight);

    const stageSpot1 = new THREE.PointLight(0xa855f7, 0, 28);
    stageSpot1.position.set(7, 8, 0);
    const stageSpot2 = new THREE.PointLight(0x38bdf8, 0, 28);
    stageSpot2.position.set(13, 8, 0);
    const poolGlowLight = new THREE.PointLight(0x38bdf8, 0, 25);
    poolGlowLight.position.set(-26, 3, 15);
    const ledGlowLight = new THREE.PointLight(0x60a5fa, 0, 18);
    ledGlowLight.position.set(-39, 5, 25);
    
    // Soft atmospheric rim light for subtle diorama highlights
    const rimLight = new THREE.DirectionalLight(0xffedd5, 0.25);
    rimLight.position.set(38, 48, -42);
    scene.add(stageSpot1, stageSpot2, poolGlowLight, ledGlowLight, rimLight);

    const applyLighting = (mode: 'day' | 'sunset' | 'night') => {
      if (mode === 'day') {
        scene.background = new THREE.Color(0x1a261e);
        if (scene.fog) scene.fog.color.setHex(0x1a261e);
        ambientLight.intensity = 0.42;
        sunLight.intensity = 0.95;
        sunLight.color.setHex(0xfffbeb);
        rimLight.intensity = 0.25;
        rimLight.color.setHex(0xffedd5);
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
        rimLight.intensity = 0.70;
        rimLight.color.setHex(0xfdba74);
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
        rimLight.intensity = 0.18;
        rimLight.color.setHex(0xa5b4fc);
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
    const dirtRoadMat = new THREE.MeshStandardMaterial({
      color: 0x7c5846,
      roughness: 0.92,
      polygonOffset: true,
      polygonOffsetFactor: -1.0,
      polygonOffsetUnits: -1.0
    });
    const westRoad = new THREE.Mesh(westRoadGeo, dirtRoadMat);
    westRoad.rotation.x = -Math.PI / 2;
    westRoad.position.set(-55, 0.04, 0);
    westRoad.receiveShadow = true;
    worldGroup.add(westRoad);

    const southExitRoadGeo = new THREE.PlaneGeometry(45, 14);
    const southExitRoad = new THREE.Mesh(southExitRoadGeo, dirtRoadMat);
    southExitRoad.rotation.x = -Math.PI / 2;
    southExitRoad.rotation.z = -0.35;
    southExitRoad.position.set(16, 0.05, 41);
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
    parkGround.position.set(-4, 0.02, 0);
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

    // ZONE 5: Main Entrance Welcome Archway & Creative Art Rink
    const archGroup = new THREE.Group();
    archGroup.position.set(-37, 0.15, 40.5);
    archGroup.rotation.y = 0.35;

    const towerMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, metalness: 0.25, roughness: 0.4 });
    [-3.8, 3.8].forEach(tx => {
      const tower = new THREE.Mesh(new THREE.BoxGeometry(1.0, 4.3, 1.0), towerMat);
      tower.position.set(tx, 2.15, 0);
      tower.castShadow = true;
      registerZoneMesh(tower, 'main-entrance');
      archGroup.add(tower);
    });

    const archBeam = new THREE.Mesh(
      new THREE.BoxGeometry(8.8, 1.25, 1.05),
      new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.35 })
    );
    archBeam.position.set(0, 4.1, 0);
    archBeam.castShadow = true;
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

      // 1. Inflatable Bounce Mattress Bed (top surface at y = 1.10)
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(6.6, 1.1, 5.8),
        new THREE.MeshStandardMaterial({ color: mainHex, roughness: 0.35, side: THREE.DoubleSide })
      );
      base.position.y = 0.55;
      base.castShadow = true;
      base.receiveShadow = true;
      registerZoneMesh(base, 'adventure-zone');
      bc.add(base);

      // Inflatable Entrance Step / Apron Pad (connects ground to mattress smoothly)
      const entryStep = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 0.45, 1.5),
        new THREE.MeshStandardMaterial({ color: accentHex, roughness: 0.35, side: THREE.DoubleSide })
      );
      entryStep.position.set(0, 0.22, 3.2);
      entryStep.castShadow = true;
      entryStep.receiveShadow = true;
      bc.add(entryStep);

      // 2. Full Inflatable Back Wall (Flush height from y = 0.55 to y = 3.95, height 3.4m)
      const backWall = new THREE.Mesh(
        new THREE.BoxGeometry(6.6, 3.4, 0.85),
        new THREE.MeshStandardMaterial({ color: accentHex, roughness: 0.35, side: THREE.DoubleSide })
      );
      backWall.position.set(0, 2.25, -2.4);
      backWall.castShadow = true;
      bc.add(backWall);

      // 3. Left Inflatable Side Wall (Flush height from y = 0.55 to y = 3.95, height 3.4m)
      const leftWall = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 3.4, 5.6),
        new THREE.MeshStandardMaterial({ color: accentHex, roughness: 0.35, side: THREE.DoubleSide })
      );
      leftWall.position.set(-2.85, 2.25, 0);
      leftWall.castShadow = true;
      bc.add(leftWall);

      // 4. Right Inflatable Side Wall (Flush height from y = 0.55 to y = 3.95, height 3.4m)
      const rightWall = new THREE.Mesh(
        new THREE.BoxGeometry(0.85, 3.4, 5.6),
        new THREE.MeshStandardMaterial({ color: accentHex, roughness: 0.35, side: THREE.DoubleSide })
      );
      rightWall.position.set(2.85, 2.25, 0);
      rightWall.castShadow = true;
      bc.add(rightWall);

      // 5. Front Left Safety Bumper Wall (Flush height from y = 0.55 to y = 3.95)
      const frontLeft = new THREE.Mesh(
        new THREE.BoxGeometry(2.0, 3.4, 0.85),
        new THREE.MeshStandardMaterial({ color: mainHex, roughness: 0.35, side: THREE.DoubleSide })
      );
      frontLeft.position.set(-2.25, 2.25, 2.4);
      frontLeft.castShadow = true;
      bc.add(frontLeft);

      // 6. Front Right Safety Bumper Wall (Flush height from y = 0.55 to y = 3.95)
      const frontRight = new THREE.Mesh(
        new THREE.BoxGeometry(2.0, 3.4, 0.85),
        new THREE.MeshStandardMaterial({ color: mainHex, roughness: 0.35, side: THREE.DoubleSide })
      );
      frontRight.position.set(2.25, 2.25, 2.4);
      frontRight.castShadow = true;
      bc.add(frontRight);

      // 7. Front Entrance Overhead Arch Beam (Flush connection between front bumpers)
      const frontArch = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 0.9, 0.85),
        new THREE.MeshStandardMaterial({ color: slideHex, roughness: 0.35, side: THREE.DoubleSide })
      );
      frontArch.position.set(0, 3.5, 2.4);
      frontArch.castShadow = true;
      bc.add(frontArch);

      // Castle Battlements / Parapet Crenels along wall tops
      [-2.2, -1.1, 0, 1.1, 2.2].forEach(bx => {
        const crenel = new THREE.Mesh(
          new THREE.BoxGeometry(0.65, 0.45, 0.85),
          new THREE.MeshStandardMaterial({ color: mainHex, roughness: 0.35, side: THREE.DoubleSide })
        );
        crenel.position.set(bx, 4.15, -2.4);
        crenel.castShadow = true;
        bc.add(crenel);
      });
      [-1.5, -0.5, 0.5, 1.5].forEach(bz => {
        [-2.85, 2.85].forEach(sx => {
          const crenel = new THREE.Mesh(
            new THREE.BoxGeometry(0.85, 0.45, 0.65),
            new THREE.MeshStandardMaterial({ color: mainHex, roughness: 0.35, side: THREE.DoubleSide })
          );
          crenel.position.set(sx, 4.15, bz);
          crenel.castShadow = true;
          bc.add(crenel);
        });
      });

      // 8. 4 Corner Inflatable Spire Towers with Festival Flags
      [[-2.85, -2.4], [2.85, -2.4], [-2.85, 2.4], [2.85, 2.4]].forEach(([px, pz], tIdx) => {
        const pil = new THREE.Mesh(
          new THREE.CylinderGeometry(0.7, 0.7, 4.6, 16),
          new THREE.MeshStandardMaterial({ color: slideHex, roughness: 0.35, side: THREE.DoubleSide })
        );
        pil.position.set(px, 2.3, pz);
        pil.castShadow = true;
        const spire = new THREE.Mesh(
          new THREE.ConeGeometry(0.95, 1.6, 16),
          new THREE.MeshStandardMaterial({ color: accentHex, roughness: 0.35, side: THREE.DoubleSide })
        );
        spire.position.set(px, 5.4, pz);
        spire.castShadow = true;

        // Small decorative flagpole on top of spire
        const pole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.04, 0.04, 0.8, 6),
          new THREE.MeshStandardMaterial({ color: 0xffffff })
        );
        pole.position.set(px, 6.4, pz);
        const pennant = new THREE.Mesh(
          new THREE.BoxGeometry(0.4, 0.25, 0.03),
          new THREE.MeshStandardMaterial({ color: [0xef4444, 0xfacc15, 0x22c55e, 0x3b82f6][tIdx % 4] })
        );
        pennant.position.set(px + 0.2, 6.55, pz);

        bc.add(pil, spire, pole, pennant);
      });

      // 9. Inflatable Slide - flush slope anchored cleanly to front opening
      const slide = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 0.35, 3.8),
        new THREE.MeshStandardMaterial({ color: slideHex, roughness: 0.3, side: THREE.DoubleSide })
      );
      slide.position.set(0, 0.62, 3.9);
      slide.rotation.x = 0.38;
      slide.castShadow = true;
      bc.add(slide);

      // 10. Slide Safety Handrail Walls - flush and parallel to slide slope
      [-1.25, 1.25].forEach(rx => {
        const rail = new THREE.Mesh(
          new THREE.BoxGeometry(0.3, 0.65, 3.8),
          new THREE.MeshStandardMaterial({ color: accentHex, roughness: 0.35, side: THREE.DoubleSide })
        );
        rail.position.set(rx, 0.95, 3.9);
        rail.rotation.x = 0.38;
        rail.castShadow = true;
        bc.add(rail);
      });

      // 11. Protective Safety Netting Panels (no visual holes)
      [-2.42, 2.42].forEach(nx => {
        const net = new THREE.Mesh(
          new THREE.PlaneGeometry(3.6, 2.2),
          new THREE.MeshStandardMaterial({
            color: 0x1e293b,
            transparent: true,
            opacity: 0.35,
            side: THREE.DoubleSide
          })
        );
        net.position.set(nx, 2.2, 0);
        net.rotation.y = Math.PI / 2;
        bc.add(net);
      });

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

    // ZONE 8: Celebration Stage (Complete Structural Truss Rig, Back Wall, Side Scrims, Stairs & Performers)
    const stageGroup = new THREE.Group();
    stageGroup.position.set(10, 0.15, -1.5);
    worldGroup.add(stageGroup);

    // 1. Stage Elevated Deck / Platform Base
    const stagePlatform = new THREE.Mesh(
      new THREE.BoxGeometry(12.8, 1.1, 7.8),
      new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.65, side: THREE.DoubleSide })
    );
    stagePlatform.position.y = 0.55;
    stagePlatform.receiveShadow = true;
    stagePlatform.castShadow = true;
    stageGroup.add(stagePlatform);
    registerZoneMesh(stagePlatform, 'celebration-stage');

    // Stage Perimeter Black Pleated Skirting (covers under-stage framing cleanly)
    const skirtMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.85, side: THREE.DoubleSide });
    const frontSkirt = new THREE.Mesh(new THREE.BoxGeometry(12.8, 1.1, 0.08), skirtMat);
    frontSkirt.position.set(0, 0.55, 3.9);
    const leftSkirt = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.1, 7.8), skirtMat);
    leftSkirt.position.set(-6.4, 0.55, 0);
    const rightSkirt = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.1, 7.8), skirtMat);
    rightSkirt.position.set(6.4, 0.55, 0);
    stageGroup.add(frontSkirt, leftSkirt, rightSkirt);

    // 2. Stage Wooden Floor Finish (Top surface at y = 1.18; world space y = 1.33)
    const stageFloor = new THREE.Mesh(
      new THREE.BoxGeometry(12.8, 0.08, 7.8),
      new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.45, side: THREE.DoubleSide })
    );
    stageFloor.position.y = 1.14;
    stageFloor.receiveShadow = true;
    stageGroup.add(stageFloor);

    // Stage Front Safety Kickboard / Lip
    const kickboard = new THREE.Mesh(
      new THREE.BoxGeometry(12.8, 0.08, 0.08),
      new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.4 })
    );
    kickboard.position.set(0, 1.20, 3.86);
    stageGroup.add(kickboard);

    // 3. Stage Solid Rear Acoustic Wall Enclosure (Zero see-through holes from rear/sides)
    const stageBackdrop = new THREE.Mesh(
      new THREE.BoxGeometry(12.8, 5.6, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.6, side: THREE.DoubleSide })
    );
    stageBackdrop.position.set(0, 3.8, -3.7);
    stageBackdrop.castShadow = true;
    stageGroup.add(stageBackdrop);

    // Dynamic Festive Backdrop LED Screen Panel
    const backdropScreen = new THREE.Mesh(
      new THREE.BoxGeometry(11.2, 4.6, 0.1),
      new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.3, emissive: 0x1e3a8a, emissiveIntensity: 0.35, side: THREE.DoubleSide })
    );
    backdropScreen.position.set(0, 3.8, -3.45);
    stageGroup.add(backdropScreen);

    // 4. Left and Right Stage Solid Acoustic Wing Panels
    [-6.3, 6.3].forEach(wx => {
      const wing = new THREE.Mesh(
        new THREE.BoxGeometry(0.35, 5.4, 4.4),
        new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6, side: THREE.DoubleSide })
      );
      wing.position.set(wx, 3.7, -1.6);
      wing.castShadow = true;
      stageGroup.add(wing);
    });

    // 5. Heavy Aluminum Box Truss Rig (Columns + 4 Top Crossmembers)
    const trussMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.25, side: THREE.DoubleSide });
    [[-6.2, -3.6], [6.2, -3.6], [-6.2, 3.6], [6.2, 3.6]].forEach(([tx, tz]) => {
      const column = new THREE.Mesh(new THREE.BoxGeometry(0.55, 6.2, 0.55), trussMat);
      column.position.set(tx, 3.65, tz);
      column.castShadow = true;
      stageGroup.add(column);
    });
    // Top horizontal cross trusses connecting all 4 pillars
    const frontTruss = new THREE.Mesh(new THREE.BoxGeometry(12.4, 0.45, 0.45), trussMat);
    frontTruss.position.set(0, 6.45, 3.6);
    const rearTruss = new THREE.Mesh(new THREE.BoxGeometry(12.4, 0.45, 0.45), trussMat);
    rearTruss.position.set(0, 6.45, -3.6);
    const leftTruss = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 7.2), trussMat);
    leftTruss.position.set(-6.2, 6.45, 0);
    const rightTruss = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.45, 7.2), trussMat);
    rightTruss.position.set(6.2, 6.45, 0);
    stageGroup.add(frontTruss, rearTruss, leftTruss, rightTruss);

    // 6. Stage Overhead Roof Canopy & Side/Rear Fascia Trim
    const stageRoof = new THREE.Mesh(
      new THREE.BoxGeometry(13.6, 0.65, 8.8),
      new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.5, side: THREE.DoubleSide })
    );
    stageRoof.position.set(0, 6.8, 0);
    stageRoof.castShadow = true;
    stageGroup.add(stageRoof);

    // Roof Side & Rear Fascias (No open gaps)
    const rearFascia = new THREE.Mesh(new THREE.BoxGeometry(13.6, 0.8, 0.15), new THREE.MeshStandardMaterial({ color: 0x090d16 }));
    rearFascia.position.set(0, 6.4, -4.35);
    const leftFascia = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.8, 8.8), new THREE.MeshStandardMaterial({ color: 0x090d16 }));
    leftFascia.position.set(-6.75, 6.4, 0);
    const rightFascia = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.8, 8.8), new THREE.MeshStandardMaterial({ color: 0x090d16 }));
    rightFascia.position.set(6.75, 6.4, 0);
    stageGroup.add(rearFascia, leftFascia, rightFascia);

    // Roof Front Gold Valance / Overhead Banner
    const roofBanner = new THREE.Mesh(
      new THREE.BoxGeometry(13.2, 0.9, 0.15),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4, side: THREE.DoubleSide })
    );
    roofBanner.position.set(0, 6.35, 4.35);
    stageGroup.add(roofBanner);

    // 7. Realistic 3-Step Front Access Stairs (True graduated steps + side stringers)
    const stairMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6, side: THREE.DoubleSide });
    const woodTreadMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.5, side: THREE.DoubleSide });
    const step1 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.28, 0.65), stairMat);
    step1.position.set(0, 0.14, 5.1);
    const tread1 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.04, 0.65), woodTreadMat);
    tread1.position.set(0, 0.29, 5.1);

    const step2 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.56, 0.65), stairMat);
    step2.position.set(0, 0.28, 4.5);
    const tread2 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.04, 0.65), woodTreadMat);
    tread2.position.set(0, 0.57, 4.5);

    const step3 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.84, 0.65), stairMat);
    step3.position.set(0, 0.42, 3.9);
    const tread3 = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.04, 0.65), woodTreadMat);
    tread3.position.set(0, 0.85, 3.9);

    const stairRailMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7 });
    [-1.85, 1.85].forEach(sx => {
      const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 2.2, 8), stairRailMat);
      rail.position.set(sx, 0.9, 4.5);
      rail.rotation.x = -0.58;
      stageGroup.add(rail);
    });
    stageGroup.add(step1, tread1, step2, tread2, step3, tread3);

    // Stage Front Floor Wedges (Foldback Monitors for Performers)
    const monitorMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.3 });
    [-1.8, 1.8].forEach(mx => {
      const mon = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.32, 0.5), monitorMat);
      mon.position.set(mx, 1.30, 2.4);
      mon.rotation.x = -0.35;
      stageGroup.add(mon);
    });

    // Center Vocal Microphone Stand on Stage
    const micPole = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 1.2, 8), stairRailMat);
    micPole.position.set(0, 1.74, 1.5);
    const micHead = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), stairRailMat);
    micHead.position.set(0, 2.34, 1.5);
    stageGroup.add(micPole, micHead);

    // 8. Line Array Subwoofers / Speaker Stacks Flanking Stage
    const speakerMat = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.3 });
    [-7.2, 7.2].forEach(sx => {
      const stack = new THREE.Mesh(new THREE.BoxGeometry(1.2, 3.2, 1.2), speakerMat);
      stack.position.set(sx, 1.6, 1.0);
      stack.castShadow = true;
      stageGroup.add(stack);
    });

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

    // 6. Complete Demographic Crowd (148 Articulated People with Multi-Racial Diversity & Varied Silhouettes)
    const animatedAgents: Array<{
      root: THREE.Group;
      leftArm: THREE.Mesh;
      rightArm: THREE.Mesh;
      leftLeg: THREE.Mesh;
      rightLeg: THREE.Mesh;
      baseX: number;
      baseY: number;
      baseZ: number;
      role: string;
      gender: 'male' | 'female';
      behavior: 'walk' | 'bounce' | 'dance' | 'crawl' | 'path';
      radius: number;
      speed: number;
      curve?: THREE.CatmullRomCurve3;
      progress: number;
      phase: number;
      accessories?: THREE.Group;
    }> = [];
    const personClickMeshes: THREE.Mesh[] = [];

    // Shared Skin Tones across the Demographic Matrix
    const SKIN_TONES = [
      0x341d14, // Deep Espresso / Rich Umber
      0x553018, // Rich Mahogany
      0x7f4c28, // Warm Bronze
      0xa66f44, // Golden Honey Caramel
      0xcfa173, // Warm Olive Tan
      0xecd0b4  // Warm Fair Beige
    ];
    const sharedSkinMats = SKIN_TONES.map(color => new THREE.MeshStandardMaterial({ color, roughness: 0.65 }));

    const HAIR_COLORS = [
      0x111111, // Jet Black
      0x1f1610, // Dark Brown
      0x3e2415, // Auburn Brown
      0x5a3118, // Chestnut
      0x945124, // Warm Bronze
      0xd97706  // Golden Highlights
    ];
    const sharedHairMats = HAIR_COLORS.map(color => new THREE.MeshStandardMaterial({ color, roughness: 0.85 }));

    const sharedSoleMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 });
    const sharedWoodMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.7 });
    const sharedChromeMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.25, metalness: 0.8 });
    const sharedGoldMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3, metalness: 0.4 });
    const sharedBeadMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.4 });

    // Shared Geometries to eliminate GPU buffer allocations & memory fragmentation
    const sharedHeadGeo = new THREE.SphereGeometry(0.21, 10, 10);
    const sharedTorsoGeo = new THREE.BoxGeometry(0.46, 0.62, 0.26);
    const sharedDressGeo = new THREE.CylinderGeometry(0.22, 0.36, 0.62, 10);
    const sharedArmGeo = new THREE.BoxGeometry(0.13, 0.52, 0.13);
    const sharedLegGeo = new THREE.BoxGeometry(0.16, 0.44, 0.16);
    const sharedShoeGeo = new THREE.BoxGeometry(0.17, 0.11, 0.23);
    const sharedSoleGeo = new THREE.BoxGeometry(0.18, 0.04, 0.24);
    const sharedPuffGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const sharedFadeGeo = new THREE.CylinderGeometry(0.22, 0.23, 0.14, 10);
    const sharedDreadBunGeo = new THREE.CylinderGeometry(0.15, 0.17, 0.18, 8);
    const sharedHeadwrapGeo = new THREE.TorusGeometry(0.22, 0.08, 8, 14);
    const sharedCapDomeGeo = new THREE.SphereGeometry(0.23, 10, 10, 0, Math.PI * 2, 0, Math.PI / 1.7);
    const sharedCapVisorGeo = new THREE.BoxGeometry(0.22, 0.025, 0.16);
    const sharedSunhatBrimGeo = new THREE.CylinderGeometry(0.38, 0.38, 0.02, 12);
    const sharedSunhatCrownGeo = new THREE.CylinderGeometry(0.21, 0.22, 0.18, 10);

    interface PersonConfig {
      x: number;
      z: number;
      y?: number;
      role?: 'adult' | 'kid' | 'baby' | 'staff';
      gender?: 'male' | 'female';
      skinToneIdx?: number;
      bodyType?: 'sturdy' | 'slender' | 'petite' | 'curvy' | 'athletic';
      hairStyle?: 'afro_puffs' | 'braids' | 'fade' | 'dreadlocks' | 'headwrap' | 'curls' | 'cap' | 'sunhat';
      hairColorIdx?: number;
      shirtHex?: number;
      pantsHex?: number;
      shoeHex?: number;
      behavior?: 'walk' | 'bounce' | 'dance' | 'crawl' | 'path';
      label?: string;
      roleTitle?: string;
      icon?: string;
      pathPts?: number[][] | null;
      speed?: number;
      hasBalloon?: boolean;
      balloonColorHex?: number;
      hasHelmet?: boolean;
      prop?: 'marimba_mallets' | 'microphone' | 'guitar' | 'puppet' | 'palette' | 'clipboard';
    }

    const createArticulatedPerson = (config: PersonConfig) => {
      const {
        x, z, y = 0.16, role = 'adult', gender = 'female',
        skinToneIdx = 0, bodyType = 'athletic',
        hairStyle = gender === 'female' ? 'afro_puffs' : 'fade',
        hairColorIdx = 0,
        shirtHex = 0x3b82f6, pantsHex = 0x1e293b, shoeHex = 0x0f172a,
        behavior = 'walk', label = 'Exploring Bambino World', roleTitle = 'Festival Attendee',
        icon = '🧑', pathPts = null, speed = 1.0, hasBalloon = false, balloonColorHex = 0xf43f5e,
        hasHelmet = false, prop
      } = config;

      const baseSc = role === 'baby' ? 0.46 : role === 'kid' ? 0.68 : role === 'staff' ? 1.02 : 1.0;
      const root = new THREE.Group();
      root.position.set(x, y, z);

      // Body Type Scale Modifiers
      let sx = baseSc;
      let sy = baseSc;
      let sz = baseSc;
      if (bodyType === 'sturdy') {
        sx *= 1.22;
        sy *= 0.98;
        sz *= 1.15;
      } else if (bodyType === 'slender') {
        sx *= 0.88;
        sy *= 1.08;
        sz *= 0.88;
      } else if (bodyType === 'petite') {
        sx *= 0.92;
        sy *= 0.92;
        sz *= 0.92;
      } else if (bodyType === 'curvy') {
        sx *= 1.12;
        sy *= 0.98;
        sz *= 1.10;
      } else if (bodyType === 'athletic') {
        sx *= 1.04;
        sy *= 1.02;
        sz *= 1.0;
      }
      root.scale.set(sx, sy, sz);

      const skinMat = sharedSkinMats[skinToneIdx % sharedSkinMats.length];
      const hairMat = sharedHairMats[hairColorIdx % sharedHairMats.length];
      const shirtMat = new THREE.MeshStandardMaterial({ color: shirtHex, roughness: 0.5 });
      const pantsMat = new THREE.MeshStandardMaterial({ color: pantsHex, roughness: 0.6 });
      const shoeMat = new THREE.MeshStandardMaterial({ color: shoeHex, roughness: 0.5 });

      // Torso: Male shirt / Female sundress or tee
      const isSundress = gender === 'female' && (role === 'adult' || role === 'kid') && bodyType !== 'sturdy';
      const torso = new THREE.Mesh(isSundress ? sharedDressGeo : sharedTorsoGeo, shirtMat);
      torso.position.y = 0.86;
      torso.castShadow = true;
      root.add(torso);

      // Head with realistic skin tone
      const head = new THREE.Mesh(sharedHeadGeo, skinMat);
      head.position.y = 1.38;
      root.add(head);

      // Accessory sub-node for dynamic LOD optimization (culled during fast drag/orbit)
      const accessoryGroup = new THREE.Group();

      // Diverse Hairstyles & Headwear
      if (hasHelmet || role === 'staff') {
        const cap = new THREE.Mesh(
          sharedCapDomeGeo,
          new THREE.MeshStandardMaterial({ color: role === 'staff' ? 0xfacc15 : 0x38bdf8 })
        );
        cap.position.y = 1.41;
        accessoryGroup.add(cap);
        const visor = new THREE.Mesh(sharedCapVisorGeo, new THREE.MeshStandardMaterial({ color: role === 'staff' ? 0xeab308 : 0x0284c7 }));
        visor.position.set(0, 1.36, 0.22);
        accessoryGroup.add(visor);
      } else if (hairStyle === 'afro_puffs') {
        // Iconic double afro puffs with hair band ties
        const leftPuff = new THREE.Mesh(sharedPuffGeo, hairMat);
        leftPuff.position.set(-0.16, 1.55, -0.02);
        const rightPuff = new THREE.Mesh(sharedPuffGeo, hairMat);
        rightPuff.position.set(0.16, 1.55, -0.02);
        const tieMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e });
        const leftTie = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.03, 8), tieMat);
        leftTie.position.set(-0.14, 1.48, -0.02);
        const rightTie = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.03, 8), tieMat);
        rightTie.position.set(0.14, 1.48, -0.02);
        accessoryGroup.add(leftPuff, rightPuff, leftTie, rightTie);
      } else if (hairStyle === 'braids') {
        // Braided crown and hanging ponytail with bead accents
        const crownBraids = new THREE.Mesh(sharedCapDomeGeo, hairMat);
        crownBraids.position.y = 1.40;
        const pony = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.08, 0.42, 6), hairMat);
        pony.position.set(0, 1.25, -0.22);
        pony.rotation.x = 0.35;
        const bead = new THREE.Mesh(new THREE.SphereGeometry(0.04, 6, 6), sharedBeadMat);
        bead.position.set(0, 1.06, -0.28);
        accessoryGroup.add(crownBraids, pony, bead);
      } else if (hairStyle === 'fade') {
        // Clean geometric side fade crop
        const fade = new THREE.Mesh(sharedFadeGeo, hairMat);
        fade.position.set(0, 1.46, -0.02);
        accessoryGroup.add(fade);
      } else if (hairStyle === 'dreadlocks') {
        // Dreadlock top bun with metallic brass ring
        const bun = new THREE.Mesh(sharedDreadBunGeo, hairMat);
        bun.position.set(0, 1.56, -0.04);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.02, 6, 12), sharedGoldMat);
        ring.position.set(0, 1.50, -0.04);
        ring.rotation.x = Math.PI / 2;
        accessoryGroup.add(bun, ring);
      } else if (hairStyle === 'headwrap') {
        // African headscarf (dhuku)
        const wrapMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6 });
        const wrap = new THREE.Mesh(sharedHeadwrapGeo, wrapMat);
        wrap.position.set(0, 1.44, 0);
        wrap.rotation.x = Math.PI / 2;
        const crownWrap = new THREE.Mesh(new THREE.SphereGeometry(0.18, 8, 8), wrapMat);
        crownWrap.position.set(0, 1.52, -0.02);
        accessoryGroup.add(wrap, crownWrap);
      } else if (hairStyle === 'sunhat') {
        // Wide-brim floppy safari sunhat
        const hatMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, roughness: 0.8 });
        const brim = new THREE.Mesh(sharedSunhatBrimGeo, hatMat);
        brim.position.set(0, 1.45, 0);
        const crown = new THREE.Mesh(sharedSunhatCrownGeo, hatMat);
        crown.position.set(0, 1.53, 0);
        const band = new THREE.Mesh(new THREE.CylinderGeometry(0.215, 0.225, 0.04, 10), new THREE.MeshStandardMaterial({ color: 0x0284c7 }));
        band.position.set(0, 1.46, 0);
        accessoryGroup.add(brim, crown, band);
      } else if (hairStyle === 'cap') {
        // Baseball cap (facing backwards or forwards)
        const capColorMat = new THREE.MeshStandardMaterial({ color: pantsHex });
        const dome = new THREE.Mesh(sharedCapDomeGeo, capColorMat);
        dome.position.y = 1.41;
        const visor = new THREE.Mesh(sharedCapVisorGeo, capColorMat);
        visor.position.set(0, 1.37, gender === 'male' ? -0.22 : 0.22);
        accessoryGroup.add(dome, visor);
      } else {
        // Voluminous textured curls
        const curls = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), hairMat);
        curls.position.set(0, 1.42, -0.04);
        accessoryGroup.add(curls);
      }

      // Limbs: Arms & Legs
      const leftArm = new THREE.Mesh(sharedArmGeo, shirtMat);
      leftArm.position.set(-0.32, 0.85, 0);
      const rightArm = leftArm.clone();
      rightArm.position.x = 0.32;

      const leftLeg = new THREE.Mesh(sharedLegGeo, pantsMat);
      leftLeg.position.set(-0.13, 0.32, 0);
      const rightLeg = leftLeg.clone();
      rightLeg.position.x = 0.13;
      root.add(leftArm, rightArm, leftLeg, rightLeg);

      // Two-Tone Footwear with contrasting soles
      const leftShoe = new THREE.Mesh(sharedShoeGeo, shoeMat);
      leftShoe.position.set(-0.13, 0.08, 0.04);
      const leftSole = new THREE.Mesh(sharedSoleGeo, sharedSoleMat);
      leftSole.position.set(-0.13, 0.02, 0.04);

      const rightShoe = new THREE.Mesh(sharedShoeGeo, shoeMat);
      rightShoe.position.set(0.13, 0.08, 0.04);
      const rightSole = new THREE.Mesh(sharedSoleGeo, sharedSoleMat);
      rightSole.position.set(0.13, 0.02, 0.04);
      root.add(leftShoe, leftSole, rightShoe, rightSole);

      // Handheld Props
      if (prop === 'marimba_mallets') {
        // Two mallets held in hands
        const stickGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.45, 6);
        const malletHeadGeo = new THREE.SphereGeometry(0.06, 8, 8);
        const stickLeft = new THREE.Mesh(stickGeo, sharedWoodMat);
        stickLeft.rotation.x = Math.PI / 3;
        stickLeft.position.set(-0.25, 0.72, 0.28);
        const ballLeft = new THREE.Mesh(malletHeadGeo, sharedGoldMat);
        ballLeft.position.set(-0.25, 0.82, 0.44);
        const stickRight = stickLeft.clone();
        stickRight.position.x = 0.25;
        const ballRight = ballLeft.clone();
        ballRight.position.x = 0.25;
        accessoryGroup.add(stickLeft, ballLeft, stickRight, ballRight);
      } else if (prop === 'microphone') {
        // Vintage chrome microphone on stand
        const micStand = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.35, 6), sharedChromeMat);
        micStand.position.set(0, 0.68, 0.32);
        const micHead = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), sharedChromeMat);
        micHead.position.set(0, 1.38, 0.32);
        accessoryGroup.add(micStand, micHead);
      } else if (prop === 'guitar') {
        // Strapped acoustic guitar
        const guitarBody = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.52, 0.14), sharedWoodMat);
        guitarBody.position.set(0.08, 0.84, 0.22);
        guitarBody.rotation.z = -0.35;
        const guitarNeck = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.45, 0.06), sharedWoodMat);
        guitarNeck.position.set(-0.16, 1.15, 0.22);
        guitarNeck.rotation.z = -0.35;
        accessoryGroup.add(guitarBody, guitarNeck);
      } else if (prop === 'puppet') {
        // Lion puppet on left hand
        const puppetHead = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), new THREE.MeshStandardMaterial({ color: 0xf59e0b }));
        puppetHead.position.set(-0.35, 1.05, 0.15);
        const puppetMane = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.04, 6, 10), new THREE.MeshStandardMaterial({ color: 0xb45309 }));
        puppetMane.position.set(-0.35, 1.05, 0.15);
        accessoryGroup.add(puppetHead, puppetMane);
      } else if (prop === 'palette') {
        // Artist palette and paintbrush
        const palette = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.02, 10), sharedWoodMat);
        palette.position.set(-0.34, 0.75, 0.18);
        palette.rotation.x = Math.PI / 4;
        const pRed = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
        pRed.position.set(-0.38, 0.78, 0.19);
        const pBlue = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), new THREE.MeshStandardMaterial({ color: 0x3b82f6 }));
        pBlue.position.set(-0.32, 0.77, 0.21);
        accessoryGroup.add(palette, pRed, pBlue);
      } else if (prop === 'clipboard') {
        // Science lab clipboard
        const clip = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.34, 0.02), new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 }));
        clip.position.set(0, 0.85, 0.24);
        accessoryGroup.add(clip);
      }

      if (hasBalloon) {
        const balloon = new THREE.Mesh(new THREE.SphereGeometry(0.28, 10, 10), new THREE.MeshStandardMaterial({ color: balloonColorHex }));
        balloon.position.set(0.38, 2.15, 0);
        const string = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 1.25, 4), new THREE.MeshStandardMaterial({ color: 0xf8fafc }));
        string.position.set(0.35, 1.50, 0);
        accessoryGroup.add(balloon, string);
      }

      root.add(accessoryGroup);

      torso.userData.personInfo = { roleTitle, label, icon };
      personClickMeshes.push(torso);

      let curve: THREE.CatmullRomCurve3 | undefined = undefined;
      if (pathPts && pathPts.length > 1) {
        curve = new THREE.CatmullRomCurve3(pathPts.map(([px, pz]) => new THREE.Vector3(px, y, pz)), true);
      }

      const agent = {
        root, leftArm, rightArm, leftLeg, rightLeg,
        baseX: x, baseY: y, baseZ: z, role, gender, behavior, radius: 1.8, speed,
        curve, progress: Math.random(), phase: Math.random() * Math.PI * 2,
        accessories: accessoryGroup
      };
      animatedAgents.push(agent);
      crowdGroup.add(root);
      return agent;
    };

    const createStrollerPair = (
      x: number, z: number, pathPts: number[][], label: string,
      parentGender: 'female' | 'male' = 'female', skinToneIdx: number = 1
    ) => {
      const parent = createArticulatedPerson({
        x, z, role: 'adult', gender: parentGender, skinToneIdx,
        bodyType: parentGender === 'female' ? 'curvy' : 'athletic',
        shirtHex: parentGender === 'female' ? 0xec4899 : 0x0284c7,
        pantsHex: 0x1e293b, shoeHex: 0xf8fafc,
        behavior: 'path', pathPts, speed: 0.75,
        roleTitle: parentGender === 'female' ? 'Mother with Stroller' : 'Father with Stroller',
        label, icon: '🚼'
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

    // =========================================================================
    // POPULATE 148 ATTENDEES WITH MULTI-RACIAL DIVERSITY, GENDER & BODY VARIETY
    // =========================================================================

    // Sector 1: The Little Garden Babies & Early-Years Carers (12 Toddlers + 6 Carers)
    const babyCoords = [
      [-34, -6], [-31, -8], [-27, -5], [-24, -7], [-38, 2.5], [-29, 2.5],
      [-22, -3], [-35, -10], [-33, -4], [-26, -9], [-21, -6], [-37, -3]
    ];
    babyCoords.forEach(([bx, bz], i) => {
      const isGirl = i % 2 === 0;
      createArticulatedPerson({
        x: bx, z: bz, role: 'baby', gender: isGirl ? 'female' : 'male',
        skinToneIdx: i % 6,
        bodyType: 'petite',
        hairStyle: isGirl ? 'afro_puffs' : 'fade',
        hairColorIdx: i % 4,
        shirtHex: softPlayColors[i % softPlayColors.length],
        pantsHex: softPlayColors[(i + 2) % softPlayColors.length],
        shoeHex: 0xf8fafc,
        behavior: i % 2 === 0 ? 'crawl' : 'bounce', speed: 1.5,
        roleTitle: isGirl ? 'Toddler Girl (6M–2Y)' : 'Toddler Boy (6M–2Y)',
        label: 'Playing on Baby Garden Soft-Play Mats', icon: '👶'
      });
    });

    // 6 Adult Early-Years Carers (3 Female, 3 Male, Diverse Skin Tones)
    [
      { x: -33, z: -5, gender: 'female', skin: 0, hair: 'braids', body: 'curvy' },
      { x: -25, z: -6, gender: 'male',   skin: 2, hair: 'fade',   body: 'sturdy' },
      { x: -30, z:  1, gender: 'female', skin: 3, hair: 'headwrap', body: 'slender' },
      { x: -20, z: -4, gender: 'male',   skin: 1, hair: 'dreadlocks', body: 'athletic' },
      { x: -28, z: -2, gender: 'female', skin: 4, hair: 'curls',   body: 'petite' },
      { x: -35, z: -8, gender: 'male',   skin: 5, hair: 'cap',     body: 'athletic' }
    ].forEach((c, idx) => {
      createArticulatedPerson({
        x: c.x, z: c.z, role: 'adult', gender: c.gender as 'female' | 'male',
        skinToneIdx: c.skin, bodyType: c.body as any,
        hairStyle: c.hair as any,
        shirtHex: 0x10b981, pantsHex: 0x1e293b, shoeHex: 0xf8fafc,
        behavior: 'walk',
        roleTitle: c.gender === 'female' ? 'Early-Years Carer (Female)' : 'Early-Years Carer (Male)',
        label: 'Supervising Toddlers in The Little Garden', icon: '🧑'
      });
    });

    // Sector 2: Creative Zone Roller Skaters & Craft Artists (6 Skaters + 6 Painters)
    const skateLoopPts = [[-37.5, 32], [-33, 30.8], [-32.5, 34], [-37, 35]];
    for (let s = 0; s < 6; s++) {
      const isGirl = s % 2 === 0;
      createArticulatedPerson({
        x: -35, z: 33, role: 'kid', gender: isGirl ? 'female' : 'male',
        skinToneIdx: (s * 2) % 6, bodyType: isGirl ? 'slender' : 'athletic',
        hairStyle: isGirl ? 'braids' : 'fade',
        shirtHex: flagColors[s % flagColors.length], pantsHex: 0x1e293b, shoeHex: 0x38bdf8,
        behavior: 'path', pathPts: skateLoopPts, speed: 1.8 + (s % 2) * 0.3, hasHelmet: true,
        roleTitle: isGirl ? 'Junior Roller Skater (Girl)' : 'Junior Roller Skater (Boy)',
        label: 'Roller Skating on Smooth Asphalt Track', icon: '🛼'
      });
    }

    // Creative Craft Young Artists with palettes & brushes
    [
      [-31, 37], [-29, 39], [-34, 41], [-28, 36], [-30, 42], [-33, 38]
    ].forEach(([cx, cz], idx) => {
      const isFemale = idx % 2 === 0;
      createArticulatedPerson({
        x: cx, z: cz, role: 'kid', gender: isFemale ? 'female' : 'male',
        skinToneIdx: (idx + 1) % 6, bodyType: 'petite',
        hairStyle: isFemale ? 'afro_puffs' : 'cap',
        shirtHex: flagColors[(idx + 3) % flagColors.length], pantsHex: 0x334155,
        behavior: 'walk', prop: 'palette',
        roleTitle: isFemale ? 'Young Artist (Girl)' : 'Young Artist (Boy)',
        label: 'Painting & Craft Workshop in Creative Zone', icon: '🎨'
      });
    });

    // Sector 3: Adventure Zone Bouncing Kids & Picnic Families
    // 8 Kids actively bouncing inside the 4 bouncy castles (on mattress at y = 1.26)
    [
      { x:  9.5, z: -34.5, y: 1.26, gender: 'female', skin: 0, hair: 'afro_puffs' },
      { x: 10.2, z: -34.0, y: 1.26, gender: 'male',   skin: 1, hair: 'fade' },
      { x: 18.5, z: -31.0, y: 1.26, gender: 'female', skin: 2, hair: 'curls' },
      { x: 19.0, z: -30.5, y: 1.26, gender: 'male',   skin: 3, hair: 'cap' },
      { x:  0.5, z: -24.5, y: 1.26, gender: 'female', skin: 4, hair: 'braids' },
      { x:  1.2, z: -24.0, y: 1.26, gender: 'male',   skin: 5, hair: 'fade' },
      { x: 18.0, z: -21.0, y: 1.26, gender: 'female', skin: 1, hair: 'afro_puffs' },
      { x: 17.4, z: -20.5, y: 1.26, gender: 'male',   skin: 2, hair: 'short_locs' }
    ].forEach((k, idx) => {
      createArticulatedPerson({
        x: k.x, z: k.z, y: k.y, role: 'kid', gender: k.gender as 'female' | 'male',
        skinToneIdx: k.skin, bodyType: 'athletic',
        hairStyle: k.hair as any,
        shirtHex: flagColors[idx % flagColors.length], pantsHex: 0x0f172a, shoeHex: 0xfacc15,
        behavior: 'bounce', speed: 2.2, hasBalloon: idx % 2 === 0,
        balloonColorHex: flagColors[(idx + 2) % flagColors.length],
        roleTitle: k.gender === 'female' ? 'Child (Girl 3–6Y)' : 'Child (Boy 3–6Y)',
        label: 'Jumping on Adventure Zone Inflatable Mattress', icon: '🧒'
      });
    });

    // 8 Picnic families and lawn attendees around bouncy castle grounds (y = 0.16)
    [
      { x:  6.5, z: -26, gender: 'female', skin: 0, body: 'curvy',   shirt: 0xec4899 },
      { x: 12.5, z: -25, gender: 'male',   skin: 1, body: 'sturdy',  shirt: 0x3b82f6 },
      { x: 14.0, z: -28, gender: 'female', skin: 2, body: 'slender', shirt: 0xf59e0b },
      { x:  4.5, z: -29, gender: 'male',   skin: 3, body: 'athletic',shirt: 0x10b981 },
      { x:  8.0, z: -31, gender: 'female', skin: 4, body: 'petite',  shirt: 0x8b5cf6 },
      { x: 16.5, z: -27, gender: 'male',   skin: 5, body: 'slender', shirt: 0x06b6d4 },
      { x:  2.5, z: -26, gender: 'female', skin: 1, body: 'athletic',shirt: 0xf43f5e },
      { x: 19.5, z: -24, gender: 'male',   skin: 0, body: 'curvy',   shirt: 0x14b8a6 }
    ].forEach((p, idx) => {
      createArticulatedPerson({
        x: p.x, z: p.z, y: 0.16, role: 'adult', gender: p.gender as 'female' | 'male',
        skinToneIdx: p.skin, bodyType: p.body as any,
        hairStyle: p.gender === 'female' ? 'headwrap' : 'fade',
        shirtHex: p.shirt, pantsHex: 0x1e293b, shoeHex: 0xf8fafc,
        behavior: 'bounce', speed: 1.8,
        roleTitle: p.gender === 'female' ? 'Parent / Carer (Female)' : 'Parent / Carer (Male)',
        label: 'Relaxing on Adventure Lawn Picnic Area', icon: '🧑'
      });
    });

    // Sector 4: Celebration Stage Live Performers (Standing ON Stage Platform Deck at y = 1.33)
    [
      {
        x: 7.2, z: -1.1, role: 'adult', gender: 'male', skin: 0, body: 'athletic',
        hair: 'dreadlocks', shirt: 0x10b981, prop: 'marimba_mallets',
        title: 'Marimba Maestro (Male)', label: 'Playing Acoustic Zimbabwean Marimba on Stage', icon: '🎵'
      },
      {
        x: 10.0, z: -0.3, role: 'adult', gender: 'female', skin: 1, body: 'curvy',
        hair: 'braids', shirt: 0xa855f7, prop: 'microphone',
        title: 'Lead Vocalist (Female)', label: 'Singing & Welcoming Families at Stage Center Mic', icon: '🎤'
      },
      {
        x: 12.2, z: -1.2, role: 'adult', gender: 'male', skin: 2, body: 'slender',
        hair: 'fade', shirt: 0xf59e0b, prop: 'guitar',
        title: 'Acoustic Guitarist (Male)', label: 'Playing Live Acoustic Guitar on Stage', icon: '🎸'
      },
      {
        x: 8.8, z: -1.0, role: 'adult', gender: 'female', skin: 3, body: 'petite',
        hair: 'afro_puffs', shirt: 0xec4899, prop: 'puppet',
        title: 'Puppet Theater Animator (Female)', label: 'Performing Gentle Magic & Storytelling on Stage', icon: '🎪'
      }
    ].forEach(p => {
      createArticulatedPerson({
        x: p.x, z: p.z, y: 1.33, role: p.role as any, gender: p.gender as 'female' | 'male',
        skinToneIdx: p.skin, bodyType: p.body as any, hairStyle: p.hair as any,
        shirtHex: p.shirt, pantsHex: 0x0f172a, shoeHex: 0xf8fafc,
        behavior: 'dance', speed: 2.4, prop: p.prop as any,
        roleTitle: p.title, label: p.label, icon: p.icon
      });
    });

    // Audience Cheering & Dancing in front of Stage (y = 0.16) - 16 balanced men, women, and kids
    for (let c = 0; c < 16; c++) {
      const cx = 5.5 + (c % 8) * 1.4;
      const cz = 3.8 + Math.floor(c / 8) * 2.2;
      const isFemale = c % 2 === 0;
      const isKid = c % 3 === 0;
      createArticulatedPerson({
        x: cx, z: cz, y: 0.16,
        role: isKid ? 'kid' : 'adult',
        gender: isFemale ? 'female' : 'male',
        skinToneIdx: c % 6,
        bodyType: isKid ? 'petite' : (c % 4 === 0 ? 'sturdy' : c % 4 === 1 ? 'slender' : 'curvy'),
        hairStyle: isFemale ? (c % 3 === 0 ? 'afro_puffs' : 'braids') : (c % 2 === 0 ? 'fade' : 'cap'),
        shirtHex: flagColors[c % flagColors.length], pantsHex: 0x1e293b, shoeHex: 0xf8fafc,
        behavior: 'dance', speed: 1.9, hasBalloon: c % 4 === 0,
        balloonColorHex: flagColors[(c + 1) % flagColors.length],
        roleTitle: isKid ? (isFemale ? 'Dancing Girl (Kid)' : 'Dancing Boy (Kid)') : (isFemale ? 'Audience (Female)' : 'Audience (Male)'),
        label: 'Dancing & Cheering at Celebration Stage', icon: '🎶'
      });
    }

    // Sector 5: Discovery World STEM Pavilion & Giant Chess
    // 2 STEM Educators (1 Female Lead, 1 Male Assistant) + 6 Explorer Kids
    createArticulatedPerson({
      x: 23.0, z: 3.5, role: 'staff', gender: 'female', skinToneIdx: 1, bodyType: 'slender',
      hairStyle: 'braids', shirtHex: 0xf8fafc, pantsHex: 0x1e293b, shoeHex: 0x0284c7,
      behavior: 'walk', prop: 'clipboard',
      roleTitle: 'STEM Lead Educator (Female)',
      label: 'Guiding Hands-On Robotics & Science Experiments', icon: '🔬'
    });
    createArticulatedPerson({
      x: 25.0, z: 4.2, role: 'staff', gender: 'male', skinToneIdx: 3, bodyType: 'athletic',
      hairStyle: 'fade', shirtHex: 0xf8fafc, pantsHex: 0x334155, shoeHex: 0x0f172a,
      behavior: 'walk', prop: 'clipboard',
      roleTitle: 'STEM Lab Assistant (Male)',
      label: 'Demonstrating Giant Lawn Chess Tactics', icon: '♟️'
    });
    // 6 Explorer Kids (3 Girls, 3 Boys)
    [[21.5, 5.5], [24.2, 6.0], [26.0, 2.5], [27.0, 4.5], [22.8, 7.0], [25.5, 6.8]].forEach(([dx, dz], idx) => {
      const isGirl = idx % 2 === 0;
      createArticulatedPerson({
        x: dx, z: dz, role: 'kid', gender: isGirl ? 'female' : 'male',
        skinToneIdx: (idx + 2) % 6, bodyType: 'athletic',
        hairStyle: isGirl ? 'afro_puffs' : 'cap',
        shirtHex: flagColors[(idx + 4) % flagColors.length], pantsHex: 0x1e293b,
        behavior: 'walk',
        roleTitle: isGirl ? 'Explorer Girl (3–6Y)' : 'Explorer Boy (3–6Y)',
        label: 'Discovering Giant Lawn Chess & Fossil Digs', icon: '🔍'
      });
    });

    // Sector 6: Safety Marshals & Welcome Hosts (3 Female, 3 Male)
    ([
      [-35, 39, 'female', 'Welcome Host at Main Entrance Gate (Female)', 0, 'braids'],
      [-26, 23, 'male',   'Certified Pool Perimeter Lifeguard (Male)', 2, 'fade'],
      [-31, -19, 'female', 'Fish Pond Safety Marshal (Female)', 1, 'headwrap'],
      [ 12, 34, 'male',   'Traffic Marshal at Vehicular Exit Gate (Male)', 3, 'cap'],
      [ 25, -13, 'female', 'Catering & Refreshment Host (Female)', 4, 'sunhat'],
      [ 14, -18, 'male',   'Inflatables Safety Marshal (Male)', 5, 'fade']
    ] as [number, number, 'female' | 'male', string, number, any][]).forEach(([sx, sz, gender, desc, skin, hair]) => {
      createArticulatedPerson({
        x: sx, z: sz, role: 'staff', gender, skinToneIdx: skin, bodyType: 'athletic',
        hairStyle: hair, shirtHex: 0xf97316, pantsHex: 0x1e293b, shoeHex: 0x0f172a,
        behavior: 'walk',
        roleTitle: `Safety Marshal (${gender === 'female' ? 'Female' : 'Male'})`,
        label: desc, icon: '🦺'
      });
    });

    // Sector 7: Walking Flow Spine Visitors & Strollers (12 Walkers + 2 Stroller Pairs)
    const mainWalkLoop = [[-36, 38], [-28, 25], [-13, 21], [-5, 15], [0, 8], [8, 12], [22, 10], [0, 8], [-13, 21], [-28, 25]];
    for (let w = 0; w < 12; w++) {
      const isFemale = w % 2 === 0;
      const isKid = w % 4 === 0;
      createArticulatedPerson({
        x: -25, z: 25,
        role: isKid ? 'kid' : 'adult',
        gender: isFemale ? 'female' : 'male',
        skinToneIdx: w % 6,
        bodyType: isKid ? 'petite' : (w % 3 === 0 ? 'slender' : w % 3 === 1 ? 'curvy' : 'sturdy'),
        hairStyle: isFemale ? (w % 2 === 0 ? 'afro_puffs' : 'sunhat') : (w % 2 === 0 ? 'fade' : 'cap'),
        shirtHex: flagColors[w % flagColors.length], pantsHex: 0x1e293b, shoeHex: 0xf8fafc,
        behavior: 'path', pathPts: mainWalkLoop, speed: 0.7 + (w % 3) * 0.15, hasBalloon: w % 3 === 0,
        balloonColorHex: flagColors[(w + 3) % flagColors.length],
        roleTitle: isKid ? (isFemale ? 'Festival Girl Visitor' : 'Festival Boy Visitor') : (isFemale ? 'Festival Attendee (Female)' : 'Festival Attendee (Male)'),
        label: 'Walking Along Main Dotted Flow Spine', icon: '🚶'
      });
    }

    // Two Stroller Pairs: Mother pushing pram & Father pushing pram
    createStrollerPair(-30, 27, mainWalkLoop, 'Mother Strolling Along Parents Lounge Promenade', 'female', 1);
    createStrollerPair(-14, -4, [[-15, -3], [-12, -6], [-16, -8], [-18, -4]], 'Father Arriving at Little Garden Stroller Bay', 'male', 3);

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

    // 8. Raycasting for Zone & Person Clicks (Click vs Orbit Drag disambiguation)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    let pointerDownX = 0;
    let pointerDownY = 0;
    let pointerDownTime = 0;

    const handlePointerDown = (e: PointerEvent) => {
      pointerDownX = e.clientX;
      pointerDownY = e.clientY;
      pointerDownTime = performance.now();
    };

    const handlePointerUp = (e: PointerEvent) => {
      const dist = Math.hypot(e.clientX - pointerDownX, e.clientY - pointerDownY);
      const duration = performance.now() - pointerDownTime;

      // Ignore drags/orbits (> 6px movement or held longer than 450ms) so orbit controls never stutter
      if (dist > 6 || duration > 450) {
        return;
      }

      // Stop any scripted camera flight when tapping
      camAnim = null;

      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const personHits = raycaster.intersectObjects(personClickMeshes, false);
      if (personHits.length > 0 && personHits[0].object.userData.personInfo) {
        const info = personHits[0].object.userData.personInfo;
        setInspectedPerson(info);
        const clampedX = Math.max(140, Math.min(window.innerWidth - 140, e.clientX));
        const clampedY = Math.max(110, Math.min(window.innerHeight - 80, e.clientY));
        setPersonScreenPos({ x: clampedX, y: clampedY });
        return;
      }

      const zoneHits = raycaster.intersectObjects(clickableMeshes, false);
      if (zoneHits.length > 0 && zoneHits[0].object.userData.zoneId) {
        const zId = zoneHits[0].object.userData.zoneId;
        onSelectZone(zId);
        const z = ZONES_DATA[zId];
        if (z) animateCameraTo(new THREE.Vector3(z.camPos.x, z.camPos.y, z.camPos.z), new THREE.Vector3(z.camTarget.x, z.camTarget.y, z.camTarget.z), 800);
      } else {
        setInspectedPerson(null);
        onDeselectZone?.();
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointerup', handlePointerUp);

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

    // 10. Animation Loop (Cached dimensions & zero layout-thrashing reflows)
    let animId: number;
    const clock = new THREE.Clock();

    let cachedW = container.clientWidth || window.innerWidth;
    let cachedH = container.clientHeight || window.innerHeight;
    const tempProjVec = new THREE.Vector3();

    const projectToScreen = (vec3: THREE.Vector3) => {
      tempProjVec.copy(vec3).project(camera);
      return {
        x: (tempProjVec.x * 0.5 + 0.5) * cachedW,
        y: (-(tempProjVec.y * 0.5) + 0.5) * cachedH,
        visible: tempProjVec.z < 1
      };
    };

    const lastCamPos = new THREE.Vector3(0, 0, 0);
    const lastTarget = new THREE.Vector3(0, 0, 0);

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

      // Dynamic Detail Scaling (LOD Engine):
      // When camera is actively navigating (dragging, panning, orbiting) or for distant spectators,
      // dynamically hide accessory sub-nodes to guarantee a locked 60 FPS without lag.
      const isActivelyNavigating = (controls as any).state !== -1 || camAnim !== null;
      const camPos = camera.position;

      // Animated agents path walking and bounce with Dynamic LOD
      animatedAgents.forEach(ag => {
        if (!ag.root.visible) return;
        if (ag.accessories) {
          const distSq = ag.root.position.distanceToSquared(camPos);
          const maxDistSq = isActivelyNavigating ? 1444 : 4225; // 38^2 and 65^2
          ag.accessories.visible = distSq < maxDistSq;
        }
        const t = elapsed * ag.speed + ag.phase;
        if (ag.behavior === 'path' && ag.curve) {
          ag.progress = (ag.progress + 0.00055 * ag.speed) % 1;
          const pt = ag.curve.getPointAt(ag.progress);
          const lookPt = ag.curve.getPointAt((ag.progress + 0.01) % 1);
          ag.root.position.set(pt.x, ag.baseY, pt.z);
          ag.root.lookAt(lookPt.x, ag.baseY, lookPt.z);
          ag.leftLeg.rotation.x = Math.sin(t * 6) * 0.45;
          ag.rightLeg.rotation.x = -Math.sin(t * 6) * 0.45;
          ag.leftArm.rotation.x = -Math.sin(t * 6) * 0.35;
          ag.rightArm.rotation.x = Math.sin(t * 6) * 0.35;
        } else if (ag.behavior === 'bounce') {
          ag.root.position.y = ag.baseY + Math.abs(Math.sin(t * 4.2)) * 0.45;
          ag.leftArm.rotation.z = Math.sin(t * 4.2) * 0.6 + 0.5;
          ag.rightArm.rotation.z = -Math.sin(t * 4.2) * 0.6 - 0.5;
        } else if (ag.behavior === 'dance') {
          ag.root.position.y = ag.baseY + Math.abs(Math.sin(t * 5)) * 0.18;
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

      // Update 2D Callouts overlay only when camera or target has moved (avoids 100% idle DOM thrashing)
      const camMoved =
        Math.abs(camera.position.x - lastCamPos.x) > 0.005 ||
        Math.abs(camera.position.y - lastCamPos.y) > 0.005 ||
        Math.abs(camera.position.z - lastCamPos.z) > 0.005 ||
        Math.abs(controls.target.x - lastTarget.x) > 0.005 ||
        Math.abs(controls.target.y - lastTarget.y) > 0.005 ||
        Math.abs(controls.target.z - lastTarget.z) > 0.005;

      if (camMoved) {
        lastCamPos.copy(camera.position);
        lastTarget.copy(controls.target);

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
          c.badgeEl.style.left = `${Math.round(lPt.x)}px`;
          c.badgeEl.style.top = `${Math.round(lPt.y)}px`;

          const dx = aPt.x - lPt.x;
          const dy = aPt.y - lPt.y;
          const len = Math.hypot(dx, dy) || 1;
          const baseWidth = 6.0;
          const nx = (-dy / len) * baseWidth;
          const ny = (dx / len) * baseWidth;
          c.polyEl.setAttribute(
            'points',
            `${Math.round(lPt.x + nx)},${Math.round(lPt.y + ny)} ${Math.round(lPt.x - nx)},${Math.round(lPt.y - ny)} ${Math.round(aPt.x)},${Math.round(aPt.y)}`
          );
        });
      }

      // Clean, crystal-clear direct 3D rendering with true colors and no glare
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      cachedW = container.clientWidth;
      cachedH = container.clientHeight;
      camera.aspect = cachedW / cachedH;
      camera.updateProjectionMatrix();
      renderer.setSize(cachedW, cachedH);
      lastCamPos.set(0, 0, 0); // Force callouts refresh on resize
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
      }
    };

    return () => {
      cancelAnimationFrame(animId);
      clearInterval(bbTimer);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointerup', handlePointerUp);
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

  // Auto-dismiss inspected person popup after 4 seconds
  useEffect(() => {
    if (!inspectedPerson) return;
    const timer = setTimeout(() => {
      setInspectedPerson(null);
    }, 4000);
    return () => clearTimeout(timer);
  }, [inspectedPerson]);

  // When Cinema Mode (3D Map View) is entered, force viewport dimension recalculation and redraw
  useEffect(() => {
    if (isCinemaMode) {
      const timer = setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isCinemaMode]);

  return (
    <div className={`relative overflow-hidden select-none bg-[#141e18] ${className}`}>
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full" />

      {/* SVG Layer for Reference-Map Callout Pointer Wedges */}
      <svg ref={svgRef} className="absolute inset-0 w-full h-full pointer-events-none z-10" />

      {/* HTML Callout Badges Layer */}
      <div ref={domOverlayRef} className="absolute inset-0 w-full h-full pointer-events-none z-11" />

      {/* Subtle depth vignette (clear, airy, zero glare) */}
      <div
        className="absolute inset-0 pointer-events-none z-12"
        style={{
          background: `
            linear-gradient(to bottom,
              rgba(10, 15, 20, 0.05) 0%,
              transparent 12%,
              transparent 88%,
              rgba(10, 15, 20, 0.06) 100%
            )
          `
        }}
      />
      {/* Soft atmospheric tilt-shift perimeter blur bars */}
      <div
        className="absolute top-0 left-0 right-0 h-14 pointer-events-none z-12 backdrop-blur-[1px] [mask-image:linear-gradient(to_bottom,black,transparent)]"
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-12 pointer-events-none z-12 backdrop-blur-[1px] [mask-image:linear-gradient(to_top,black,transparent)]"
      />

      {/* Floating Person / Activity Inspector Pill with translucent glass */}
      {inspectedPerson && personScreenPos && (
        <div
          className="fixed z-[65] pointer-events-auto transform -translate-x-1/2 -translate-y-full pb-3 animate-in fade-in zoom-in-95 duration-150"
          style={{ left: `${personScreenPos.x}px`, top: `${personScreenPos.y}px` }}
        >
          <div className="bg-slate-950/75 backdrop-blur-md text-white pl-3.5 pr-2 py-2 rounded-2xl border-2 border-amber-400/85 shadow-2xl flex items-center gap-2.5 max-w-[280px] sm:max-w-xs">
            <span className="text-xl shrink-0">{inspectedPerson.icon}</span>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-amber-300 truncate">
                {inspectedPerson.roleTitle}
              </div>
              <div className="text-xs font-semibold text-slate-100 mt-0.5 line-clamp-2">
                {inspectedPerson.label}
              </div>
            </div>
            <button
              onClick={() => setInspectedPerson(null)}
              className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 active:scale-95 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer shrink-0 ml-1"
              aria-label="Dismiss person details"
            >
              <span className="text-xs font-bold leading-none">&times;</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
});
