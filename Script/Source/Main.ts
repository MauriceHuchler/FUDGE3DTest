namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport;
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let mat: ƒ.Material;
  let graph: ƒ.Graph;

  let stepWidth: number = 500;

  let avatar: ƒ.Node;
  let avatarRB: ƒ.ComponentRigidbody;



  function start(_event: CustomEvent): void {
    viewport = _event.detail;

    // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    mat = <ƒ.Material>ƒ.Project.getResourcesByName("ShaderFlat")[0];
    init();
  }

  function update(_event: Event): void {
    ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
    let deltaTime: number = ƒ.Loop.timeFrameGame / 1000;
    movement(deltaTime);
  }

  async function init(): Promise<void> {
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

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();
    avatar = graph.getChildrenByName("Avatar")[0];
    avatarRB = avatar.getComponent(ƒ.ComponentRigidbody);
    avatarRB.dampRotation = 100;
    // viewport.getBranch().addChild(graph);
  }


  function movement(_deltaTime: number): void {
    let horizontal: number = 0;
    let vertical: number = 0;
    let gravity = 1;
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.A])) {
      horizontal += 1 * stepWidth * _deltaTime;
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.D])) {
      horizontal -= 1 * stepWidth * _deltaTime;
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.W])) {
      vertical += 1 * stepWidth * _deltaTime;
    }
    if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.S])) {
      vertical -= 1 * stepWidth * _deltaTime;
    }
    let pos: ƒ.Vector3 = new ƒ.Vector3(horizontal, -gravity * _deltaTime, vertical);
   
    avatarRB.applyForce(pos);
    // avatar.mtxLocal.translate(pos, true);

  }
}