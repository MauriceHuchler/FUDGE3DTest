namespace Avatar {
    import ƒ = FudgeCore;

    export let avatar: ƒ.Node;
    export let avatarRB: ƒ.ComponentRigidbody;
    export let weapon: ƒ.Node;
    export let camera: ƒ.ComponentCamera;
    export let cameraNode: ƒ.Node;

    let bullet: ƒ.Graph;

    let stepWidth: number = 2;
    let moveVector: ƒ.Vector3;


    export function init(): void {
        avatar = Script.graph.getChildrenByName("Avatar")[0];
        avatarRB = avatar.getComponent(ƒ.ComponentRigidbody);
        avatarRB.dampRotation = 100;

        bullet = <ƒ.Graph>ƒ.Project.getResourcesByName("Bullet")[0];

        cameraNode = avatar.getChildrenByName("Camera")[0];
        camera = cameraNode.getComponent(ƒ.ComponentCamera);

        Script.canvas.addEventListener("pointermove", mouseMove);
        Script.canvas.addEventListener("mousedown", shoot);

        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
        avatar.getComponent(ƒ.ComponentRigidbody).addEventListener(ƒ.EVENT_PHYSICS.TRIGGER_ENTER, onCollisionEnter);


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
        moveVector = new ƒ.Vector3(horizontal, 0, vertical);

        // avatarRB.mtxPivot.lookAt()
        // avatarRB.mtxPivot.lookAt()
        avatar.mtxLocal.translate(moveVector, true);
    }

    async function shoot(_event: MouseEvent): Promise<void> {
        if (_event.button == 0) {
            let instance = await ƒ.Project.createGraphInstance(bullet);
            instance.mtxLocal.translation = ƒ.Vector3.SUM(weapon.mtxWorld.translation);
            instance.mtxLocal.rotation = camera.mtxWorld.rotation;
            instance.mtxLocal.rotateY(-90);
            instance.mtxLocal.translate(new ƒ.Vector3(0,10,0),true);
            Script.graph.addChild(instance);
        }


        if (Script.canvas.requestPointerLock) {
            Script.canvas.requestPointerLock();
        }


    }

    function update(): void {
        let deltaTime: number = ƒ.Loop.timeFrameGame / 1000;

        movement(deltaTime);
        rayCast();
    }

    function mouseMove(_event: PointerEvent) {
        // console.log(_event.movementX);
        let x: number = _event.movementX * -0.2;
        let y: number = _event.movementY * 0.2;
        avatar.mtxLocal.rotateY(x);
        cameraNode.mtxLocal.rotateX(y);
        // camera.mtxPivot.rotateX(y);

        // moveWeapon(y);

    }

    function moveWeapon(_number: number): void {
        // weapon.mtxLocal.rotation = camera.mtxPivot.rotation;
        weapon.mtxLocal.rotateX(_number);
    }

    function rayCast(): void {
        // let camera:
        let forward: ƒ.Vector3 = ƒ.Vector3.Z();
        forward.transform(camera.mtxWorld, false);
        let hitInfo = ƒ.Physics.raycast(camera.mtxWorld.translation, forward, 80, true);

        // ƒ.Debug.log("hit", hitInfo.hit);
    }

    function onCollisionEnter(_event: ƒ.EventPhysics) {
        console.log(_event);
        let cmpTag: Script.TAG = Script.getTag(_event);
        if (cmpTag == null) {
            return;
        }
        switch (cmpTag) {
            case Script.TAG.WALL:
                console.log(_event.collisionNormal);
                avatar.mtxLocal.translate(ƒ.Vector3.ZERO(), true);


        }
    }


}

