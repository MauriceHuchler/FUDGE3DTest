namespace Script {
  import ƒ = FudgeCore;
  ƒ.Debug.info("Main Program Template running!");

  let viewport: ƒ.Viewport = new ƒ.Viewport();
  document.addEventListener("interactiveViewportStarted", <EventListener>start);

  let mat: ƒ.Material;
  let graph: ƒ.Graph;
  let camera: ƒ.ComponentCamera;

  let stepWidth: number = 2;

  let avatar: ƒ.Node;
  let avatarRB: ƒ.ComponentRigidbody;
  let weapon: ƒ.Node;


  function start(_event: CustomEvent): void {
    viewport = _event.detail;
    let graph: ƒ.Graph = <ƒ.Graph>ƒ.Project.getResourcesByType(ƒ.Graph)[0];
    viewport.canvas.addEventListener("pointermove", mouseMove);

    mat = <ƒ.Material>ƒ.Project.getResourcesByName("ShaderFlat")[0];
    avatar = graph.getChildrenByName("Avatar")[0];
    weapon = avatar.getChildrenByName("Weapon")[0];
    avatarRB = avatar.getComponent(ƒ.ComponentRigidbody);
    avatarRB.dampRotation = 100;

    camera = avatar.getComponent(ƒ.ComponentCamera);

    viewport.initialize("MyViewport", graph, camera, viewport.canvas);
    viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER;

    // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start();
  }

  function update(_event: Event): void {
    rayCast();
    ƒ.Physics.simulate();  // if physics is included and used
    viewport.draw();
    ƒ.AudioManager.default.update();
    let deltaTime: number = ƒ.Loop.timeFrameGame / 1000;
    movement(deltaTime);
  }

  async function init(): Promise<void> {

    // viewport.getBranch().addChild(graph);
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
    let pos: ƒ.Vector3 = new ƒ.Vector3(horizontal, 0, vertical);

    // avatarRB.mtxPivot.lookAt()
    // avatarRB.mtxPivot.lookAt()
    avatar.mtxLocal.translate(pos, true);

  }

  function mouseMove(_event: PointerEvent) {
    // console.log(_event.movementX);
    let x: number = _event.movementX * -0.2;
    let y: number = _event.movementY * 0.2;
    avatar.mtxLocal.rotateY(x);
    camera.mtxPivot.rotateX(y);

    moveWeapon(y);

  }

  function moveWeapon(_number: number): void {
    weapon.mtxLocal.rotateX(_number);
  }

  function rayCast(): void {
    // let camera:
    let forward: ƒ.Vector3 = ƒ.Vector3.Z();
    forward.transform(camera.mtxWorld, false);
    let hitInfo = ƒ.Physics.raycast(camera.mtxWorld.translation, forward, 80, true);

    ƒ.Debug.log("hit", hitInfo.hit);
  }
}