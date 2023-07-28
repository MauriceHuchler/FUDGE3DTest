namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  export let viewport: ƒ.Viewport = new ƒ.Viewport();
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let mat: ƒ.Material;
  export let graph: ƒ.Graph;


  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    graph = <ƒ.Graph>ƒ.Project.getResourcesByType(ƒ.Graph)[0];


    mat = <ƒ.Material>ƒ.Project.getResourcesByName("ShaderFlat")[0];

    viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER;

    Avatar.init();
    viewport.initialize("MyViewport", graph, Avatar.camera, viewport.canvas);


    // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();
  }

  function update(_event: Event): void {
    ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
    let deltaTime: number = ƒ.Loop.timeFrameGame / 1000;
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
    const loader: ƒ.GLTFLoader = await ƒ.GLTFLoader.LOAD("/Assets/GLTFs/BrickWall.gltf");
    const mesh: ƒ.Node = await loader.getScene();
    mesh.addComponent(new ƒ.ComponentMaterial(mat));
    mesh.addComponent(new ƒ.ComponentTransform());
    // let mesh2: ƒ.Node = ƒ.Project.createGraphInstance(mesh).;
    console.log(<ƒ.Node>ƒ.Serializer.serialize(mesh));
    mesh.mtxLocal.translateZ(-2.5);
    // mesh2.mtxLocal.translateZ(2.5);
    console.log(mesh);
    graph = <ƒ.Graph>ƒ.Project.getResourcesByName("NewGraph")[0];
    graph.addChild(mesh);
  }
  interface Tagable {
    tag: string;
  }

}