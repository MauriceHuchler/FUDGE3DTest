namespace Script {
    import ƒ = FudgeCore;

    ƒ.Project.registerScriptNamespace(Script);
    export class ComponentEnemy extends ƒ.ComponentScript {
        public static readonly iSubclass: number = ƒ.Component.registerSubclass(ComponentEnemy);

        constructor() {
            super();

            if (ƒ.Project.mode == ƒ.MODE.EDITOR)
                return;

            this.addEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
            this.addEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
            this.addEventListener(ƒ.EVENT.NODE_DESERIALIZED, this.hndEvent);
        }

        public hndEvent = (_event: Event): void => {
            switch (_event.type) {
                case ƒ.EVENT.COMPONENT_ADD:
                    break;
                case ƒ.EVENT.COMPONENT_REMOVE:
                    this.removeEventListener(ƒ.EVENT.COMPONENT_ADD, this.hndEvent);
                    this.removeEventListener(ƒ.EVENT.COMPONENT_REMOVE, this.hndEvent);
                    break;
                case ƒ.EVENT.NODE_DESERIALIZED:
                    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.update);

                    // if deserialized the node is now fully reconstructed and access to all its components and children is possible
                    break;
            }
        }

        public update = () => {
            let deltaTime: number = ƒ.Loop.timeFrameGame / 1000;
            ƒ.Vector3.
        }


    }
}