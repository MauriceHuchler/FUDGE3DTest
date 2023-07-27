namespace Avatar {
    import ƒ = FudgeCore;

    export let avatar: ƒ.Node;
    export let avatarRB: ƒ.ComponentRigidbody;
    export let weapon: ƒ.Node;
    export let camera: ƒ.ComponentCamera;

    let bullet: ƒ.Graph;

    let stepWidth: number = 2;


    export function init(): void {
        avatar = Script.graph.getChildrenByName("Avatar")[0];
        weapon = avatar.getChildrenByName("Weapon")[0];
        avatarRB = avatar.getComponent(ƒ.ComponentRigidbody);
        avatarRB.dampRotation = 100;

        bullet = <ƒ.Graph>ƒ.Project.getResourcesByName("Bullet")[0];

        camera = avatar.getComponent(ƒ.ComponentCamera);

        Script.viewport.canvas.addEventListener("pointermove", mouseMove);
        Script.viewport.canvas.addEventListener("mousedown", shoot);

        ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);

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

    async function shoot(_event: MouseEvent): Promise<void> {
        let instance = await ƒ.Project.createGraphInstance(bullet);
        instance.mtxLocal.translation = weapon.mtxWorld.translation;
        instance.mtxLocal.rotation = camera.mtxWorld.rotation;
        instance.mtxLocal.rotateY(-90);
        console.log(camera.mtxWorld.rotation);
        console.log(instance.mtxLocal.rotation);
        Script.graph.addChild(instance);

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