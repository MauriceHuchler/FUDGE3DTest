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
    let viewport;
    document.addEventListener("interactiveViewportStarted", start);
    let mat;
    let graph;
    let stepWidth = 500;
    let avatar;
    let avatarRB;
    function start(_event) {
        viewport = _event.detail;
        // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        mat = ƒ.Project.getResourcesByName("ShaderFlat")[0];
        init();
    }
    function update(_event) {
        ƒ.Physics.simulate(); // if physics is included and used
        viewport.draw();
        ƒ.AudioManager.default.update();
        let deltaTime = ƒ.Loop.timeFrameGame / 1000;
        movement(deltaTime);
    }
    async function init() {
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
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start();
        avatar = graph.getChildrenByName("Avatar")[0];
        avatarRB = avatar.getComponent(ƒ.ComponentRigidbody);
        avatarRB.dampRotation = 100;
        // viewport.getBranch().addChild(graph);
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
        let pos = new ƒ.Vector3(horizontal, -gravity * _deltaTime, vertical);
        avatarRB.applyForce(pos);
        // avatar.mtxLocal.translate(pos, true);
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map