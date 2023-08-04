declare namespace Avatar {
    import ƒ = FudgeCore;
    let avatar: ƒ.Node;
    let avatarRB: ƒ.ComponentRigidbody;
    let weapon: ƒ.Node;
    let cameras: ƒ.ComponentCamera[];
    let cameraNode: ƒ.Node;
    function init(): void;
}
declare namespace Script {
    import ƒ = FudgeCore;
    class ComponentBullet extends ƒ.ComponentScript {
        #private;
        static readonly iSubclass: number;
        speed: number;
        lifetime: number;
        constructor();
        hndEvent: (_event: Event) => void;
        update: () => void;
        onCollisionEneter: (_event: ƒ.EventPhysics) => void;
        destroy: () => void;
    }
}
declare namespace Script {
    import ƒ = FudgeCore;
    class ComponentEnemy extends ƒ.ComponentScript {
        static readonly iSubclass: number;
        constructor();
        hndEvent: (_event: Event) => void;
        update: () => void;
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
    class Cooldown {
        hasCooldown: boolean;
        private cooldown;
        get getMaxCoolDown(): number;
        set setMaxCoolDown(_param: number);
        private currentCooldown;
        get getCurrentCooldown(): number;
        onEndCooldown: () => void;
        constructor(_number: number);
        /**
         * starts the cooldown function
         */
        startCooldown(): void;
        /**
         * callback function, is called when cooldown ends
         */
        private endCooldown;
        resetCooldown(): void;
        eventUpdate: (_event: Event) => void;
        updateCooldown(): void;
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
    let gameIsRunning: boolean;
    function getTag(_event: ƒ.EventPhysics): TAG;
}
