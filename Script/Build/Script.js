"use strict";
var Avatar;
(function (Avatar) {
    var ƒ = FudgeCore;
    let bullet;
    let isGrounded = false;
    let jumpForce = 3.5;
    let jumps = 1;
    let jumpsLeft = jumps;
    let velocity = 0;
    let stepWidth = 3;
    let maxCameraAngle = 45;
    let moveVector;
    let yCameraRotation = 0;
    function init() {
        Avatar.avatar = Script.graph.getChildrenByName("Avatar")[0];
        Avatar.avatarRB = Avatar.avatar.getComponent(ƒ.ComponentRigidbody);
        Avatar.avatarRB.dampRotation = 100;
        bullet = ƒ.Project.getResourcesByName("Bullet")[0];
        Avatar.cameraNode = Avatar.avatar.getChildrenByName("Camera")[0];
        Avatar.camera = Avatar.cameraNode.getComponent(ƒ.ComponentCamera);
        Avatar.cameraNode.addChild(Avatar.weapon);
        Script.canvas.addEventListener("pointermove", mouseMove);
        Script.canvas.addEventListener("mousedown", shoot);
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        Avatar.avatar.getComponent(ƒ.ComponentRigidbody).addEventListener("TriggerEnteredCollision" /* TRIGGER_ENTER */, onCollisionEnter);
    }
    Avatar.init = init;
    function resetPosition() {
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.G])) {
            Avatar.avatar.mtxLocal.translation = ƒ.Vector3.Y();
        }
    }
    function movement(_deltaTime) {
        let horizontal = 0;
        let vertical = 0;
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
        if (jumpsLeft > 0 && ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.SPACE])) {
            velocity = jumpForce * _deltaTime;
            jumpsLeft--;
        }
        moveVector = new ƒ.Vector3(horizontal, velocity, vertical);
        // avatarRB.mtxPivot.lookAt()
        // avatarRB.mtxPivot.lookAt()
        Avatar.avatar.mtxLocal.translate(moveVector, true);
        if (!isGrounded) {
            // avatar.mtxLocal.translateY(gravity * _deltaTime);
            velocity -= 0.05 * _deltaTime;
        }
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
        if (Script.gameIsRunning) {
            let deltaTime = ƒ.Loop.timeFrameGame / 1000;
            groundCheck();
            movement(deltaTime);
            resetPosition();
            rayCast();
        }
    }
    function mouseMove(_event) {
        if (Script.gameIsRunning) {
            let x = _event.movementX * -0.2;
            let y = _event.movementY * 0.2;
            Avatar.avatar.mtxLocal.rotateY(x);
            // cameraNode.mtxLocal.rotateX(y);
            yCameraRotation += y;
            yCameraRotation = ƒ.Calc.clamp(yCameraRotation, -maxCameraAngle, maxCameraAngle);
            Avatar.cameraNode.mtxLocal.rotation = new ƒ.Vector3(yCameraRotation, 0, 0);
        }
    }
    function groundCheck() {
        let down = ƒ.Vector3.SCALE(ƒ.Vector3.Y(), -1);
        let floorCheck = ƒ.Physics.raycast(Avatar.avatar.mtxLocal.translation, down, 0.5, true);
        if (floorCheck.rigidbodyComponent != null && floorCheck.rigidbodyComponent.node.getComponent(Script.ComponentTag) != null) {
            jumpsLeft = jumps;
            if (ƒ.Vector3.DIFFERENCE(floorCheck.hitNormal, ƒ.Vector3.Y()) == ƒ.Vector3.ZERO()) {
                isGrounded = true;
            }
            if (velocity < 0) {
                velocity = 0;
            }
        }
        else {
            isGrounded = false;
        }
    }
    /**
 * Return the angle in degrees between the two given vectors
 */
    function ANGLE(_from, _to) {
        let angle = Math.acos(ƒ.Vector3.DOT(_from, _to) / (_from.magnitude * _to.magnitude));
        return angle * ƒ.Calc.rad2deg;
    }
    function rayCast() {
        // let camera:
        let forward = ƒ.Vector3.Z();
        forward.transform(Avatar.camera.mtxWorld, false);
        let hitInfo = ƒ.Physics.raycast(Avatar.camera.mtxWorld.translation, forward, 80, true);
    }
    function onCollisionEnter(_event) {
        let cmpTag = Script.getTag(_event);
        if (cmpTag == null) {
            return;
        }
        switch (cmpTag) {
            case Script.TAG.WALL:
                console.log(_event);
                Avatar.avatar.mtxLocal.translate(ƒ.Vector3.ZERO(), true);
                break;
            case Script.TAG.FLOOR:
                isGrounded = true;
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
            this.lifetime = 5 * 60;
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
                        this.#lifeTimeCD.startCooldown();
                        this.#lifeTimeCD.onEndCooldown = this.destroy;
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
            this.#lifeTimeCD = new Script.Cooldown(this.lifetime);
            // Listen to this component being added to or removed from a node
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
        #lifeTimeCD;
    }
    ComponentBullet.iSubclass = ƒ.Component.registerSubclass(ComponentBullet);
    Script.ComponentBullet = ComponentBullet;
})(Script || (Script = {}));
var Script;
(function (Script) {
    var ƒ = FudgeCore;
    ƒ.Project.registerScriptNamespace(Script);
    class ComponentEnemy extends ƒ.ComponentScript {
        constructor() {
            super();
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
                        // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                        break;
                }
            };
            this.update = () => {
                let deltaTime = ƒ.Loop.timeFrameGame / 1000;
                ƒ.Vector3.
                ;
            };
            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;
            this.addEventListener("componentAdd" /* COMPONENT_ADD */, this.hndEvent);
            this.addEventListener("componentRemove" /* COMPONENT_REMOVE */, this.hndEvent);
            this.addEventListener("nodeDeserialized" /* NODE_DESERIALIZED */, this.hndEvent);
        }
    }
    ComponentEnemy.iSubclass = ƒ.Component.registerSubclass(ComponentEnemy);
    Script.ComponentEnemy = ComponentEnemy;
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
    class Cooldown {
        constructor(_number) {
            this.eventUpdate = (_event) => {
                this.updateCooldown();
            };
            this.cooldown = _number;
            this.currentCooldown = _number;
            this.hasCooldown = false;
        }
        get getMaxCoolDown() { return this.cooldown; }
        ;
        set setMaxCoolDown(_param) { this.cooldown = _param; }
        get getCurrentCooldown() { return this.currentCooldown; }
        ;
        /**
         * starts the cooldown function
         */
        startCooldown() {
            this.hasCooldown = true;
            ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, this.eventUpdate);
        }
        /**
         * callback function, is called when cooldown ends
         */
        endCooldown() {
            if (this.onEndCooldown != undefined) {
                this.onEndCooldown();
            }
            this.hasCooldown = false;
            this.currentCooldown = this.cooldown;
            ƒ.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.eventUpdate);
        }
        resetCooldown() {
            this.hasCooldown = false;
            this.currentCooldown = this.cooldown;
            ƒ.Loop.removeEventListener("loopFrame" /* LOOP_FRAME */, this.eventUpdate);
        }
        updateCooldown() {
            if (this.hasCooldown && this.currentCooldown > 0) {
                this.currentCooldown--;
            }
            if (this.currentCooldown <= 0 && this.hasCooldown) {
                this.endCooldown();
            }
        }
    }
    Script.Cooldown = Cooldown;
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
    let fps;
    Script.viewport = new ƒ.Viewport();
    window.addEventListener("load", start);
    let mat;
    Script.gameIsRunning = false;
    async function start(_event) {
        await ƒ.Project.loadResourcesFromHTML();
        fps = document.getElementById("fps");
        Script.canvas = document.querySelector("canvas");
        Script.graph = ƒ.Project.getResourcesByName("NewGraph")[0];
        mat = ƒ.Project.getResourcesByName("SmoothShader")[0];
        Script.viewport.physicsDebugMode = ƒ.PHYSICS_DEBUGMODE.JOINTS_AND_COLLIDER;
        Script.canvas.requestPointerLock();
        await loadModels();
        Avatar.init();
        Script.viewport.initialize("MyViewport", Script.graph, Avatar.camera, Script.canvas);
        // start the game loop to continously draw the viewport, update the audiosystem and drive the physics i/a
        ƒ.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ƒ.Loop.start();
        Script.gameIsRunning = true;
    }
    function update(_event) {
        ƒ.Physics.simulate(); // if physics is included and used
        Script.viewport.draw();
        // ƒ.AudioManager.default.update();
        let deltaTime = ƒ.Loop.timeFrameGame / 1000;
        fps.innerText = "FPS: " + ƒ.Loop.fpsRealAverage.toFixed(1);
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
        console.log("LOADING RESOURCES 0%");
        const loader = await ƒ.GLTFLoader.LOAD("/Assets/GLTFs/Weapon.gltf");
        console.log("LOADING RESOURCES 50%");
        const mesh = await loader.getScene();
        mesh.name = "Gun";
        // mesh.addComponent(new ƒ.ComponentMaterial(mat));
        mesh.addComponent(new ƒ.ComponentTransform());
        // let cmpAnimator: ƒ.ComponentAnimator = mesh.getComponent(ƒ.ComponentAnimator);
        // cmpAnimator.playmode = ƒ.ANIMATION_PLAYMODE.PLAY_ONCE;
        // cmpAnimator.quantization = ƒ.ANIMATION_QUANTIZATION.CONTINOUS;
        mesh.mtxLocal.translateZ(1.25);
        mesh.mtxLocal.translateY(-.5);
        console.log(mesh);
        console.log(Script.graph);
        Avatar.weapon = mesh;
        console.log("LOADING RESOURCES 100%");
    }
})(Script || (Script = {}));
//# sourceMappingURL=Script.js.map