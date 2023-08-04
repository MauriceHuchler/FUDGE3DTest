namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let fps: HTMLSpanElement;


  export let viewport: ƒ.Viewport = new ƒ.Viewport();
  window.addEventListener("load", <EventListener>start);
  let mat: ƒ.Material;
  export let graph: ƒ.Graph;
  export let canvas: HTMLCanvasElement;
  export let gameIsRunning: boolean = false;
  

  async function start(_event: Event): Promise<void> {
    await ƒ.Project.loadResourcesFromHTML();
    fps = document.getElementById("fps") as HTMLElement;
    canvas = document.querySelector("canvas");
    graph = <ƒ.Graph>ƒ.Project.getResourcesByName("NewGraph")[0];

    mat = <ƒ.Material>ƒ.Project.getResourcesByName("SmoothShader")[0];

    viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER;
    canvas.requestPointerLock()
    await loadModels();
    Avatar.init();
    viewport.initialize("MyViewport", graph, Avatar.camera, canvas);

    // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();
    gameIsRunning = true;
  }

  function update(_event: Event): void {
    ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    // ƒ.AudioManager.default.update();
    
    let deltaTime: number = ƒ.Loop.timeFrameGame / 1000;

    fps.innerText = "FPS: " + ƒ.Loop.fpsRealAverage.toFixed(1);
  }

  export function getTag(_event: ƒ.EventPhysics): TAG {
    let myTag: TAG = null;
    let cmpTag: ComponentTag = _event.cmpRigidbody.node.getComponent(ComponentTag);
    if (cmpTag == null) {
      return myTag;
    }
    else {
      return cmpTag.tag;
    }
  }


  async function loadModels(): Promise<void> {
    console.log("LOADING RESOURCES 0%");
    const loader: ƒ.GLTFLoader = await ƒ.GLTFLoader.LOAD("/Assets/GLTFs/Weapon.gltf");
    console.log("LOADING RESOURCES 50%");
    const mesh: ƒ.Node = await loader.getScene();
    mesh.name = "Gun";
    // mesh.addComponent(new ƒ.ComponentMaterial(mat));
    mesh.addComponent(new ƒ.ComponentTransform());
    // let cmpAnimator: ƒ.ComponentAnimator = mesh.getComponent(ƒ.ComponentAnimator);
    // cmpAnimator.playmode = ƒ.ANIMATION_PLAYMODE.PLAY_ONCE;
    // cmpAnimator.quantization = ƒ.ANIMATION_QUANTIZATION.CONTINOUS;
    mesh.mtxLocal.translateZ(1.25);
    mesh.mtxLocal.translateY(-.5);

    console.log(mesh);
    console.log(graph);
    Avatar.weapon = mesh;
    console.log("LOADING RESOURCES 100%");


  }
}