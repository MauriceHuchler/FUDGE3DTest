namespace Avatar {
    import ƒ = FudgeCore;

    export let avatar: ƒ.Node;
    export let avatarRB: ƒ.ComponentRigidbody;
    export let weapon: ƒ.Node;
    let camera: ƒ.ComponentCamera;
    let cameraThird: ƒ.ComponentCamera;
    let cameraCounter: number = 0;
    export let cameras: ƒ.ComponentCamera[] = [];
    export let cameraNode: ƒ.Node;

    let bullet: ƒ.Graph;

    let isGrounded: boolean = false;
    let canMoveX: boolean = true;
    let canMoveY: boolean = true;
    let jumpForce: number = 3;
    let jumps: number = 1;
    let jumpsLeft: number = jumps;
    let velocity: number = 0;
    let gravity: number = 0.1;
    let maxGravity: number = 0.3;

    let stepWidth: number = 4;
    let maxCameraAngle: number = 80;
    let moveVector: ƒ.Vector3;
    let yCameraRotation: number = 0;


    export function init(): void {
        avatar = Script.graph.getChildrenByName("Avatar")[0];
        avatarRB = avatar.getComponent(ƒ.ComponentRigidbody);
        avatarRB.dampRotation = 100;


        bullet = <ƒ.Graph>ƒ.Project.getResourcesByName("Bullet")[0];

        cameraNode = avatar.getChildrenByName("Camera")[0];
        let cameraNodeThird = avatar.getChildrenByName("CameraThird")[0];
        camera = cameraNode.getComponent(ƒ.ComponentCamera);
        cameraThird = cameraNodeThird.getComponent(ƒ.ComponentCamera);

        cameras.push(camera, cameraThird);

        cameraNode.addChild(weapon);

        Script.canvas.addEventListener("pointermove", mouseMove);
        Script.canvas.addEventListener("mousedown", shoot);

        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        avatar.getComponent(ƒ.ComponentRigidbody).addEventListener(ƒ.EVENT_PHYSICS.TRIGGER_ENTER, onCollisionEnter);
        avatar.getComponent(ƒ.ComponentRigidbody).addEventListener(ƒ.EVENT_PHYSICS.TRIGGER_EXIT, onCollisionExit);


    }

    function update(): void {
        if (Script.gameIsRunning) {
            let deltaTime: number = ƒ.Loop.timeFrameGame / 1000;
            movement(deltaTime);
            groundCheck();
            resetPosition();
            rayCast();


            if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.V])) {
                cameraCounter++;
                Script.viewport.camera = cameras[cameraCounter % cameras.length]
            }


        }

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

        if (!canMoveY) {
            horizontal = 0;
        }
        if (!canMoveX) {
            vertical = 0;
        }
        moveVector = new ƒ.Vector3(horizontal, velocity, vertical);

        avatar.mtxLocal.translate(moveVector, true);

        if (!isGrounded) {
            velocity -= gravity * _deltaTime;
            velocity = ƒ.Calc.clamp(velocity, -maxGravity, maxGravity);
            console.log(velocity);
        }
        else if (isGrounded) {
            jumpsLeft = jumps;
        }

    }

    function resetPosition(): void {
        if (ƒ.Keyboard.isPressedOne([ƒ.KEYBOARD_CODE.G])) {
            avatar.mtxLocal.translation = ƒ.Vector3.SCALE(ƒ.Vector3.Y(), 5);

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



    function mouseMove(_event: PointerEvent) {
        if (Script.gameIsRunning) {
            let x: number = _event.movementX * -0.2;
            let y: number = _event.movementY * 0.2;

            avatar.mtxLocal.rotateY(x);
            // cameraNode.mtxLocal.rotateX(y);

            yCameraRotation += y;
            yCameraRotation = ƒ.Calc.clamp(yCameraRotation, -maxCameraAngle, maxCameraAngle);
            cameraNode.mtxLocal.rotation = new ƒ.Vector3(yCameraRotation, 0, 0);
        }
    }

    function groundCheck() {
        let rayLength: number = 0.7;
        let tolerance: number = 0.1;
        let down: ƒ.Vector3 = ƒ.Vector3.SCALE(ƒ.Vector3.Y(), -1);
        let floorCheck = ƒ.Physics.raycast(avatar.mtxLocal.translation, down, rayLength, true);
        // if fall from high height
        if (floorCheck.hit && Math.abs(velocity) >= maxGravity) {
            velocity = 0;
            isGrounded = true;
        }

        // jump mechanic
        if (floorCheck.hit && floorCheck.rigidbodyComponent != null && floorCheck.rigidbodyComponent.node.getComponent(Script.ComponentTag) != null) {
            if (floorCheck.hitDistance >= rayLength - tolerance && ƒ.Vector3.DIFFERENCE(floorCheck.hitNormal, ƒ.Vector3.Y()).equals(ƒ.Vector3.ZERO())) {
                isGrounded = true;
                if (floorCheck.hitDistance < rayLength) {
                    avatar.mtxLocal.translateY(rayLength - floorCheck.hitDistance);
                }
                if (velocity < 0) {
                    velocity = 0;
                }
            }
        }
        else {
            isGrounded = false;

        }
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
                let normal = _event.collisionNormal;
                console.log(normal.toString());
                avatar.mtxWorld.translate(normal);
                break;
            case Script.TAG.FLOOR:

        }


    }

    function onCollisionExit(_event: ƒ.EventPhysics) {
        canMoveX = true;
        canMoveY = true;
    }

