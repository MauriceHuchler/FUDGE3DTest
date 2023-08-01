"use strict";
var Avatar;
(function (Avatar) {
    var ƒ = FudgeCore;
    let bullet;
    let stepWidth = 2;
    let moveVector;
    function init() {
        Avatar.avatar = Script.graph.getChildrenByName("Avatar")[0];
        Avatar.avatarRB = Avatar.avatar.getComponent(ƒ.ComponentRigidbody);
        Avatar.avatarRB.dampRotation = 100;
        bullet = ƒ.Project.getResourcesByName("Bullet")[0];
        Avatar.cameraNode = Avatar.avatar.getChildrenByName("Camera")[0];
        Avatar.camera = Avatar.cameraNode.getComponent(ƒ.ComponentCamera);
        Script.canvas.addEventListener("pointermove", mouseMove);
        Script.canvas.addEventListener("mousedown", shoot);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        Avatar.avatar.getComponent(ƒ.ComponentRigidbody).addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, onCollisionEnter);
    }
    Avatar.init = init;
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
        moveVector = new ƒ.Vector3(horizontal, 0, vertical);
        // avatarRB.mtxPivot.lookAt()
        // avatarRB.mtxPivot.lookAt()
        Avatar.avatar.mtxLocal.translate(moveVector, true);
    }
    async function shoot(_event) {
        if (_event.button == 0) {
            let instance = await ƒ.Project.createGraphInstance(bullet);
            instance.mtxLocal.translation = ƒ.Vector3.SUM(Avatar.weapon.mtxWorld.translation);
            instance.mtxLocal.rotation = Avatar.camera.mtxWorld.rotation;
            instance.mtxLocal.rotateY(-90);
            instance.mtxLocal.translate(new ƒ.Vector3(0, 10, 0), true);
            Script.graph.addChild(instance);
        }
        if (Script.canvas.requestPointerLock) {
            Script.canvas.requestPointerLock();
        }
    }
    function update() {
        let deltaTime = ƒ.Loop.timeFrameGame / 1000;
        movement(deltaTime);
        rayCast();
    }
    function mouseMove(_event) {
        // console.log(_event.movementX);
        let x = _event.movementX * -0.2;
        let y = _event.movementY * 0.2;
        Avatar.avatar.mtxLocal.rotateY(x);
        Avatar.cameraNode.mtxLocal.rotateX(y);
        // camera.mtxPivot.rotateX(y);
        // moveWeapon(y);
    }
    function moveWeapon(_number) {
        // weapon.mtxLocal.rotation = camera.mtxPivot.rotation;
        Avatar.weapon.mtxLocal.rotateX(_number);
    }
    function rayCast() {
        // let camera:
        let forward = ƒ.Vector3.Z();
        forward.transform(Avatar.camera.mtxWorld, false);
        let hitInfo = ƒ.Physics.raycast(Avatar.camera.mtxWorld.translation, forward, 80, true);
        // ƒ.Debug.log("hit", hitInfo.hit);
    }
    function onCollisionEnter(_event) {
        console.log(_event);
        let cmpTag = Script.getTag(_event);
        if (cmpTag == null) {
            return;
        }
        switch (cmpTag) {
            case Script.TAG.WALL:
                console.log("hi");
                Avatar.avatar.mtxLocal.translate(ƒ.Vector3.ZERO(), true);
        }
    }
})(Avatar || (Avatar = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);
    class ComponentBullet extends ƒ.ComponentScript {
        constructor() {
            super();
            this.speed = 1;
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* COMPONENT_ADD */:
                        break;
                    case "componentRemove" /* COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                        break;
                    case "nodeDeserialized" /* NODE_DESERIALIZED */:
                        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                        this.node.getComponent(ƒ.ComponentRigidbody).addEventListener("ColliderEnteredCollision" /* COLLISION_ENTER */, this.onCollisionEneter);
                        // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                        break;
                }
            };
            this.update = () => {
                let deltaTime = ƒ.Loop.timeFrameGame / 1000;
                this.node.mtxLocal.translateX(this.speed * deltaTime, true);
            };
            this.onCollisionEneter = (_event) => {
                let cmpTag = Script.getTag(_event);
                if (cmpTag == null) {
                    return;
                }
                switch (cmpTag) {
                    case Script.TAG.WALL:
                        this.destroy();
                        break;
                    case Script.TAG.ENEMY:
                        break;
                    case Script.TAG.FLOOR:
                        this.destroy();
                        break;
                }
            };
            this.destroy = () => {
                ƒ.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.update);
                Script.graph.removeChild(this.node);
            };
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
    }
    ComponentBullet.iSubclass = ƒ.Component.registerSubclass(ComponentBullet);
    Script.ComponentBullet = ComponentBullet;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    let TAG;
    (function (TAG) {
        TAG[TAG["FLOOR"] = 0] = "FLOOR";
        TAG[TAG["WALL"] = 1] = "WALL";
        TAG[TAG["ENEMY"] = 2] = "ENEMY";
    })(TAG = Script.TAG || (Script.TAG = {}));
    ƒ.Project.registerScriptNamespace(Script);
    class ComponentTag extends ƒ.ComponentScript {
        constructor() {
            super();
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
                switch (_event.type) {
                    case "componentAdd" /* COMPONENT_ADD */:
                        break;
                    case "componentRemove" /* COMPONENT_REMOVE */:
                        this.removeEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
                        this.removeEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
                        break;
                    case "nodeDeserialized" /* NODE_DESERIALIZED */:
                        if (this.node.name.includes("Wall")) {
                            this.tag = TAG.WALL;
                        }
                        // ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
                        // this.node.getComponent(ƒ.ComponentRigidbody).addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, this.onCollisionEneter);
                        // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                        break;
                }
            };
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
    }
    ComponentTag.iSubclass = ƒ.Component.registerSubclass(ComponentTag);
    Script.ComponentTag = ComponentTag;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script); // Register the namespace to FUDGE for serialization
    class CustomComponentScript extends ƒ.ComponentScript {
        constructor() {
            super();
            // Properties may be mutated by users in the editor via the automatically created user interface
            this.message = "CustomComponentScript added to ";
            // Activate the functions of this component as response to events
            this.hndEvent = (_event) => {
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
            // Don't start when running in editor
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
    }
    // Register the script as component for use in the editor via drag&drop
    CustomComponentScript.iSubclass = ƒ.Component.registerSubclass(CustomComponentScript);
    Script.CustomComponentScript = CustomComponentScript;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Debug.info("Main Program Template running!");
    Script.viewport = new ƒ.Viewport();
    window.addEventListener("load", start);
    let isLocked;
    let mat;
    async function start(_event) {
        await ƒ.Project.loadResourcesFromHTML();
        Script.canvas = document.querySelector("canvas");
        Script.graph = ƒ.Project.getResourcesByType(ƒ.Graph)[0];
        mat = ƒ.Project.getResourcesByName("ShaderFlat")[0];
        Script.viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER;
        Script.canvas.requestPointerLock();
        loadModels();
        Avatar.init();
        Script.viewport.initialize("MyViewport", Script.graph, Avatar.camera, Script.canvas);
        // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start();
    }
    function update(_event) {
        ƒ.Physics.simulate(); // if physics is included and used
        Script.viewport.draw();
        // ƒ.AudioManager.default.update();
        let deltaTime = ƒ.Loop.timeFrameGame / 1000;
    }
    function getTag(_event) {
        let myTag = null;
        let cmpTag = _event.cmpRigidbody.node.getComponent(Script.ComponentTag);
        if (cmpTag == null) {
            return myTag;
        }
        else {
            return cmpTag.tag;
        }
    }
    Script.getTag = getTag;
    async function loadModels() {
        const loader = await ƒ.GLTFLoader.LOAD("/Assets/GLTFs/Weapon.gltf");
        const mesh = await loader.getScene();
        mesh.name = "Gun";
        mesh.addComponent(new ƒ.ComponentMaterial(mat));
        mesh.addComponent(new ƒ.ComponentTransform());
        // let mesh2: ƒ.Node = ƒ.Project.createGraphInstance(mesh).;
        // mesh.mtxLocal.translateZ(1);
        // let cmpMesh = mesh.getComponent(ƒ.ComponentMesh);
        // cmpMesh.mtxPivot.translateY(0);
        mesh.mtxLocal.translateZ(1.25);
        mesh.mtxLocal.translateY(.6);
        // mesh2.mtxLocal.translateZ(2.5);
        console.log(mesh);
        Script.graph = ƒ.Project.getResourcesByName("NewGraph")[0];
        // graph.addChild(mesh);
        Avatar.cameraNode.addChild(mesh);
        console.log(Avatar.avatar);
        Avatar.weapon = mesh;
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map