namespace Script {
    import ƒ = FudgeCore;

    export class Cooldown {
        public hasCooldown: boolean;
        private cooldown: number; get getMaxCoolDown(): number { return this.cooldown }; set setMaxCoolDown(_param: number) { this.cooldown = _param; }
        private currentCooldown: number; get getCurrentCooldown(): number { return this.currentCooldown };
        public onEndCooldown: () => void;
        constructor(_number: number) {
            this.cooldown = _number;
            this.currentCooldown = _number;
            this.hasCooldown = false;
        }
        /**
         * starts the cooldown function
         */
        public startCooldown() {
            this.hasCooldown = true
            ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, this.eventUpdate);

        }
        /**
         * callback function, is called when cooldown ends
         */
        private endCooldown() {
            if (this.onEndCooldown != undefined) {
                this.onEndCooldown();
            }
            this.hasCooldown = false;
            this.currentCooldown = this.cooldown;
            ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, this.eventUpdate);
        }

        public resetCooldown() {
            this.hasCooldown = false;
            this.currentCooldown = this.cooldown;
            ƒ.Loop.removeEventListener(ƒ.EVENT.LOOP_FRAME, this.eventUpdate);
        }

        public eventUpdate = (_event: Event): void => {
            this.updateCooldown();
        }

        public updateCooldown(): void {
            if (this.hasCooldown && this.currentCooldown > 0) {
                this.currentCooldown--;
            }
            if (this.currentCooldown <= 0 && this.hasCooldown) {
                this.endCooldown();
            }
        }
    }
}