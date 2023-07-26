"use strict";
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        // Register the script as component for use in the editor via drag&drop
        static iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
        // Properties may be mutated by users in the editor via the automatically created user interface
        message = "CustomComponentScript added to ";
        constructor() {
            super();
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        // Activate the functions of this component as response to events
        hndEvent = (_event) => {
            switch (_event.type) {
                case "componentAdd" /* COMPONENT_ADD */:
                    ƒ.Debug.log(this.message, this.node);
                    break;
                case "componentRemove" /* COMPONENT_REMOVE */:
                    this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                    this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                    break;
                case "nodeDeserialized" /* NODE_DESERIALIZED */:
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        };
    }
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    let viewport = new ƒ.Viewport();
    document.addEventListener("interactiveViewportStarted", start);
    let mat;
    let graph;
    let camera;
    let stepWidth = 2;
    let avatar;
    let avatarRB;
    function start(_event) {
        viewport = _event.detail;
        let graph = ƒ.Project.getResourcesByType(ƒ.Graph)[0];
        viewport.canvas.addEventListener("pointermove", mouseMove);
        mat = ƒ.Project.getResourcesByName("ShaderFlat")[0];
        avatar = graph.getChildrenByName("Avatar")[0];
        avatarRB = avatar.getComponent(ƒ.ComponentRigidbody);
        avatarRB.dampRotation = 100;
        camera = avatar.getComponent(ƒ.ComponentCamera);
        viewport.initialize("MyViewport", graph, camera, viewport.canvas);
        viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER;
        // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start();
    }
    function update(_event) {
        rayCast();
        ƒ.Physics.simulate(); // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
        let deltaTime = ƒ.Loop.timeFrameGame / 1000;
        movement(deltaTime);
    }
    async function init() {
        // viewport.getBranch().addChild(graph);
    }
    async function loadModels() {
        const loader = await ƒ.GLTFLoader.LOAD("/Assets/GLTFs/BrickWall.gltf");
        const mesh = await loader.getScene();
        mesh.addComponent(new ƒ.ComponentMaterial(mat));
        mesh.addComponent(new ƒ.ComponentTransform());
        // let mesh2: ƒ.Node = ƒ.Project.createGraphInstance(mesh).;
        console.log(ƒ.Serializer.serialize(mesh));
        mesh.mtxLocal.translateZ(-2.5);
        // mesh2.mtxLocal.translateZ(2.5);
        console.log(mesh);
        graph = ƒ.Project.getResourcesByName("NewGraph")[0];
        graph.addChild(mesh);
    }
    function movement(_deltaTime) {
        let horizontal = 0;
        let vertical = 0;
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
        let pos = new ƒ.Vector3(horizontal, 0, vertical);
        // avatarRB.mtxPivot.lookAt()
        // avatarRB.mtxPivot.lookAt()
        avatar.mtxLocal.translate(pos, true);
    }
    function mouseMove(_event) {
        // console.log(_event.movementX);
        avatar.mtxLocal.rotateY(_event.movementX * -0.2);
        camera.mtxPivot.rotateX(_event.movementY * 0.2);
    }
    function rayCast() {
        // let camera:
        let forward = ƒ.Vector3.Z();
        forward.transform(camera.mtxWorld, false);
        let hitInfo = ƒ.Physics.raycast(camera.mtxWorld.translation, forward, 80, true);
        ƒ.Debug.log("hit", hitInfo.hit);
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map