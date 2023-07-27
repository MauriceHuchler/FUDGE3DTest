namespace Script {
    import ƒ = FudgeCore;
    export enum TAG {
        WALL,
        ENEMY
    }


    ƒ.Project.registerScriptNamespace(Script);
    export class ComponentTag extends ƒ.ComponentScript {
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(ComponentTag);
        public tag: TAG;

        constructor() {
            super();
           
            // Listen to this component being added to or removed from a node
            this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
            this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
            this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);
        }


        // Activate the functions of this component as response to events
        public hndEvent = (_event: Event): void => {
            switch (_event.type) {
                case ƒ.EVENT.COMPONENT_ADD:
                    break;
                case ƒ.EVENT.COMPONENT_REMOVE:
                    this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
                    this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
                    break;
                case ƒ.EVENT.NODE_DESERIALIZED:
                    if (this.node.name.includes("Wall")) {
                        this.tag = TAG.WALL;
                    }
                    // ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);
                    // this.node.getComponent(ƒ.ComponentRigidbody).addEventListener(ƒ.EVENT_PHYSICS.COLLISION_ENTER, this.onCollisionEneter);
                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        }
    }
}