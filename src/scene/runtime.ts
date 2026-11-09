import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createModel } from './model.ts';
import { applyEngine } from './rig.ts';
import { sampleEngine } from '../simulation/engine.ts';
import { directionForView, fit, keepOrbit, orbitDirection } from './camera.ts';
import { defaultDirection, viewBounds, type ViewMode } from './views.ts';
import { isTap } from './gesture.ts';
import { saveSceneImage } from './capture.ts';
import type { SceneHandle, ViewState } from './types.ts';

export function createScene(host: HTMLElement, onSelect: (id: string) => void, onError: (text: string) => void): SceneHandle {
  const renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));renderer.localClippingEnabled = true;
  renderer.toneMapping = T.ACESFilmicToneMapping;renderer.toneMappingExposure = 1;renderer.shadowMap.enabled = true;renderer.shadowMap.type = T.PCFShadowMap;
  const canvas = renderer.domElement;
  canvas.setAttribute('aria-label', 'Motor marítimo de dois tempos em 3D. Arraste para girar ou selecione um conjunto na lista.');
  host.append(canvas);
  // Plain wheel scrolls the page; Ctrl/⌘ + wheel (and trackpad pinch) zooms. Registered before the controls so it runs first.
  const wheel = (e: WheelEvent) => {if (!e.ctrlKey && !e.metaKey) e.stopImmediatePropagation();};
  canvas.addEventListener('wheel', wheel, { capture: true });
  const scene = new T.Scene(), camera = new T.PerspectiveCamera(38, 1, .1, 400);
  const controls = new OrbitControls(camera, canvas);controls.enableDamping = false;controls.minDistance = 1;controls.maxDistance = 180;
  // One finger sideways orbits; one finger up/down scrolls the page; two fingers zoom and pan.
  canvas.style.touchAction = 'pan-y';
  const room = new RoomEnvironment(), pmrem = new T.PMREMGenerator(renderer), env = pmrem.fromScene(room, .04);scene.environment = env.texture;scene.environmentIntensity = .5;room.dispose();pmrem.dispose();
  scene.add(new T.HemisphereLight('#dbe8ff', '#483d30', 1.15));
  const key = new T.DirectionalLight('#fff1d2', 2.5);key.position.set(8, 26, 16);key.castShadow = true;key.shadow.mapSize.set(1024, 1024);key.shadow.camera.left = -22;key.shadow.camera.right = 22;key.shadow.camera.top = 20;key.shadow.camera.bottom = -20;key.shadow.camera.far = 90;key.shadow.bias = -.0005;scene.add(key);
  const rim = new T.DirectionalLight('#b4d3ff', 1.9);rim.position.set(-6, 5, -5);scene.add(rim);
  const model = createModel();scene.add(model.root);
  const highlight = new T.BoxHelper(new T.Object3D(), '#ffd21f');highlight.visible = false;scene.add(highlight);
  let state: ViewState = { angle: 45, reverse: false, scaleView: false, cut: false, selected: null, isolated: false, wireframe: false };
  let disposed = false, active = false, contextLost = false, last = -Infinity;
  let previousPose: {position: T.Vector3; target: T.Vector3} | null = null;
  const mode = (): ViewMode => state.scaleView ? 'scale' : state.cut ? 'cut' : 'whole';
  const selectedPart = () => model.parts.find(p => p.id === state.selected);
  const bounds = () => state.isolated && selectedPart() ? new T.Box3().setFromObject(selectedPart()!.group) : viewBounds(mode());
  const invalidate = () => {if (disposed || active || document.hidden || contextLost) return;active = true;renderer.setAnimationLoop(frame);};
  function frame(time: number) {
    if (time - last < 1000 / 30) return;last = time;
    renderer.render(scene, camera);
    const data = canvas.dataset;data.renderCount = String(Number(data.renderCount ?? 0) + 1);
    data.drawCalls = String(renderer.info.render.calls);data.triangles = String(renderer.info.render.triangles);
    data.cameraPose = JSON.stringify([...camera.position.toArray(), ...controls.target.toArray()]);
    renderer.setAnimationLoop(null);active = false;
  }
  const frameWith = (limits: T.Box3, direction: T.Vector3) => {controls.target.copy(fit(camera, limits, direction));controls.update();invalidate();};
  /** Frame the current view from where the user is already looking. */
  const reframe = (limits = bounds()) => frameWith(limits, directionForView(orbitDirection(camera.position, controls.target, defaultDirection(mode())), state.cut || state.scaleView));
  const home = () => frameWith(bounds(), defaultDirection(mode()));
  let size = new T.Vector2();
  const resize = () => {
    const { width, height } = host.getBoundingClientRect();if (width < 1 || height < 1) return;
    if (width === size.x && height === size.y) return;
    const fromAspect = size.x / size.y;size = new T.Vector2(width, height);
    renderer.setSize(width, height);camera.aspect = width / height;camera.updateProjectionMatrix();
    camera.position.copy(keepOrbit(camera.position, controls.target, bounds(), fromAspect, camera.aspect, camera.fov));controls.update();invalidate();
  };
  const observer = new ResizeObserver(resize);observer.observe(host);controls.addEventListener('change', invalidate);
  const pointers = new Set<number>();
  let gesture = { x: 0, y: 0, time: 0, pointers: 0 };
  const pointerDown = (e: PointerEvent) => {
    pointers.add(e.pointerId);
    if (pointers.size === 1) gesture = { x: e.clientX, y: e.clientY, time: e.timeStamp, pointers: 1 };
    else gesture.pointers = Math.max(gesture.pointers, pointers.size);
  };
  const pointerEnd = (e: PointerEvent) => {pointers.delete(e.pointerId);};
  const pointerUp = (e: PointerEvent) => {
    pointers.delete(e.pointerId);
    if (e.button > 0 || !isTap({ dx: e.clientX - gesture.x, dy: e.clientY - gesture.y, ms: e.timeStamp - gesture.time, pointers: gesture.pointers })) return;
    const rect = canvas.getBoundingClientRect(), ray = new T.Raycaster(), candidates: T.Mesh[] = [];
    ray.setFromCamera(new T.Vector2((e.clientX - rect.left) / rect.width * 2 - 1, -(e.clientY - rect.top) / rect.height * 2 + 1), camera);
    for (const part of model.parts) part.group.traverseVisible(o => {if (o instanceof T.Mesh) candidates.push(o);});
    const hits = ray.intersectObjects(candidates, false).filter(hit => {
      const materials = Array.isArray((hit.object as T.Mesh).material) ? (hit.object as T.Mesh).material as T.Material[] : [(hit.object as T.Mesh).material as T.Material];
      return !materials.some(m => m.clippingPlanes?.some(p => p.distanceToPoint(hit.point) < 0));
    });
    let current: T.Object3D | undefined = hits[0]?.object;
    while (current && !current.userData.partId) current = current.parent ?? undefined;
    // A tap on empty space keeps the current selection: closing is an explicit action.
    if (current) onSelect(current.userData.partId);
  };
  canvas.addEventListener('pointerdown', pointerDown);canvas.addEventListener('pointerup', pointerUp);canvas.addEventListener('pointercancel', pointerEnd);
  const visibility = () => {if (document.hidden) {renderer.setAnimationLoop(null);active = false;} else {last = -Infinity;invalidate();}};
  document.addEventListener('visibilitychange', visibility);
  const lost = (e: Event) => {e.preventDefault();contextLost = true;renderer.setAnimationLoop(null);active = false;onError('A cena 3D foi interrompida. Recarregue para restaurá-la. As explicações e fontes continuam disponíveis.');};
  canvas.addEventListener('webglcontextlost', lost);
  applyEngine(model, sampleEngine(45), false);model.helpers.visible = false;
  {const { width, height } = host.getBoundingClientRect();size = new T.Vector2(Math.max(1, width), Math.max(1, height));renderer.setSize(size.x, size.y);camera.aspect = size.x / size.y;}
  home();
  return {
    parts: model.parts,
    update(next) {
      const wasIsolated = state.isolated, changedView = state.cut !== next.cut || state.scaleView !== next.scaleView;state = next;
      applyEngine(model, sampleEngine(state.angle, state.reverse), state.cut && !state.isolated);
      model.dimensions.visible = state.scaleView && !state.isolated;model.helpers.visible = state.cut && !state.isolated;model.floor.visible = !state.isolated;
      for (const part of model.parts) part.group.visible = !state.isolated || part.id === state.selected;
      model.root.traverse(o => {if (o instanceof T.Mesh) for (const m of Array.isArray(o.material) ? o.material : [o.material]) if (m instanceof T.MeshStandardMaterial) m.wireframe = state.wireframe;});
      const selected = selectedPart();highlight.visible = Boolean(selected) && !state.isolated;
      if (selected) highlight.setFromObject(selected.group);
      if (!wasIsolated && state.isolated) {previousPose = {position: camera.position.clone(), target: controls.target.clone()};reframe();}
      if (wasIsolated && !state.isolated && previousPose) {camera.position.copy(previousPose.position);controls.target.copy(previousPose.target);controls.update();previousPose = null;}
      // Opening the cylinder always starts from the front: from the side or behind the cutaway would hide the open liner.
      if (changedView && !state.isolated) {if (state.cut && !state.scaleView) home();else reframe();}
      canvas.dataset.angle = state.angle.toFixed(2);canvas.dataset.scaleView = String(state.scaleView);canvas.dataset.cut = String(state.cut);invalidate();
    },
    home,
    focus(id) {const part = model.parts.find(p => p.id === id);if (part) reframe(new T.Box3().setFromObject(part.group));},
    zoom(factor) {camera.position.sub(controls.target).multiplyScalar(factor).add(controls.target);controls.update();invalidate();},
    capture(portrait = false) {saveSceneImage(renderer, scene, camera, bounds(), {portrait, scaleView: state.scaleView, hidden: [highlight]});invalidate();},
    dispose() {
      disposed = true;renderer.setAnimationLoop(null);observer.disconnect();controls.removeEventListener('change', invalidate);controls.dispose();
      canvas.removeEventListener('wheel', wheel, { capture: true });canvas.removeEventListener('pointerdown', pointerDown);canvas.removeEventListener('pointerup', pointerUp);canvas.removeEventListener('pointercancel', pointerEnd);canvas.removeEventListener('webglcontextlost', lost);document.removeEventListener('visibilitychange', visibility);
      model.dispose();env.dispose();highlight.geometry.dispose();(highlight.material as T.Material).dispose();renderer.dispose();canvas.remove();
    },
  };
}
