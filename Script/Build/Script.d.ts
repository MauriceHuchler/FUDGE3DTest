declare namespace Avatar {
    import ƒ = FudgeCore;
    let avatar: ƒ.Node;
    let avatarRB: ƒ.ComponentRigidbody;
    let weapon: ƒ.Node;
    let camera: ƒ.ComponentCamera;
    function init(): void;
}
declare namespace Script {
    import ƒ = FudgeCore;
    class ComponentBullet extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        speed: number;
        constructor();
        hndEvent: (_event: Event) => void;
        update: () => void;
        onCollisionEneter: (_event: ƒ.EventPhysics) => void;
        destroy: () => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    enum TAG {
        FLOOR = 0,
        WALL = 1,
        ENEMY = 2
    }
    class ComponentTag extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        tag: TAG;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class CustomComponentScript extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        message: string;
        constructor();
        hndEvent: (_event: Event) => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    let viewport: ƒ.Viewport;
    let graph: ƒ.Graph;
    let canvas: HTMLCanvasElement;
    function getTag(_event: ƒ.EventPhysics): TAG;
}
