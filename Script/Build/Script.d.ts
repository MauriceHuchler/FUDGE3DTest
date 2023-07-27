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
}
