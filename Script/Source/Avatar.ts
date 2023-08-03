namespace Avatar {
    import ƒ = FudgeCore;

    export let avatar: ƒ.Node;
    export let avatarRB: ƒ.ComponentRigidbody;
    export let weapon: ƒ.Node;
    export let camera: ƒ.ComponentCamera;
    export let cameraNode: ƒ.Node;

    let bullet: ƒ.Graph;

    let isGrounded: boolean = false;
    let jumpForce: number = 3.5;
    let jumps: number = 1;
    let jumpsLeft: number = jumps;
    let velocity: number = 0;

    let stepWidth: number = 3;
    let maxCameraAngle: number = 45;
    let moveVector: ƒ.Vector3;
    let yCameraRotation: number = 0;


    export function init(): void {
        avatar = Script.graph.getChildrenByName("Avatar")[0];
        avatarRB = avatar.getComponent(ƒ.ComponentRigidbody);
        avatarRB.dampRotation = 100;

        bullet = <ƒ.Graph>ƒ.Project.getResourcesByName("Bullet")[0];

        cameraNode = avatar.getChildrenByName("Camera")[0];
        camera = cameraNode.getComponent(ƒ.ComponentCamera);

        cameraNode.addChild(weapon);

        Script.canvas.addEventListener("pointermove", mouseMove);
        Script.canvas.addEventListener("mousedown", shoot);

        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        avatar.getComponent(ƒ.ComponentRigidbody).addEventListener(ƒ.EVENT_PHYSICS.TRIGGER_ENTER, onCollisionEnter);


    }

    function movement(_deltaTime: number): void {
        let horizontal: number = 0;
        let vertical: number = 0;
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
        avatar.mtxLocal.translate(moveVector, true);

        if (!isGrounded) {
            // avatar.mtxLocal.translateY(gravity * _deltaTime);
            velocity -= 0.05 * _deltaTime;
        }

    }

    async function shoot(_event: MouseEvent): Promise<void> {
        if (_event.button == 0) {
            let instance = await ƒ.Project.createGraphInstance(bullet);
            instance.mtxLocal.translation = ƒ.Vector3.SUM(weapon.mtxWorld.translation);
            instance.mtxLocal.rotation = camera.mtxWorld.rotation;
            instance.mtxLocal.rotateY(-90);
            instance.mtxLocal.translate(new ƒ.Vector3(0, 10, 0), true);
            Script.graph.addChild(instance);
        }


        if (Script.canvas.requestPointerLock) {
            Script.canvas.requestPointerLock();
        }


    }

    function update(): void {
        if (Script.gameIsRunning) {
            let deltaTime: number = ƒ.Loop.timeFrameGame / 1000;

            groundCheck();
            movement(deltaTime);
            rayCast();
        }
    }

    function mouseMove(_event: PointerEvent) {
        if (Script.gameIsRunning) {
            let x: number = _event.movementX * -0.2;
            let y: number = _event.movementY * 0.2;

            avatar.mtxLocal.rotateY(x);
            // cameraNode.mtxLocal.rotateX(y);

            yCameraRotation += y;
            // yCameraRotation = ƒ.Calc.clamp(yCameraRotation, -maxCameraAngle, maxCameraAngle);
            cameraNode.mtxLocal.rotation = new ƒ.Vector3(yCameraRotation, 0, 0);
        }
    }

    function groundCheck() {
        let down: ƒ.Vector3 = ƒ.Vector3.SCALE(ƒ.Vector3.Y(), -1);
        let floorCheck = ƒ.Physics.raycast(avatar.mtxLocal.translation, down, 0.5, true);

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
    function ANGLE(_from: ƒ.Vector3, _to: ƒ.Vector3): number {
        let angle: number = Math.acos(ƒ.Vector3.DOT(_from, _to) / (_from.magnitude * _to.magnitude));
        return angle * ƒ.Calc.rad2deg;
    }



    function rayCast(): void {
        // let camera:
        let forward: ƒ.Vector3 = ƒ.Vector3.Z();
        forward.transform(camera.mtxWorld, false);
        let hitInfo = ƒ.Physics.raycast(camera.mtxWorld.translation, forward, 80, true);
    }

    function onCollisionEnter(_event: ƒ.EventPhysics) {
        let cmpTag: Script.TAG = Script.getTag(_event);
        if (cmpTag == null) {
            return;
        }
        switch (cmpTag) {
            case Script.TAG.WALL:
                console.log(_event);
                avatar.mtxLocal.translate(ƒ.Vector3.ZERO(), true);
                break;
            case Script.TAG.FLOOR:
                isGrounded = true;

        }
    }


}

