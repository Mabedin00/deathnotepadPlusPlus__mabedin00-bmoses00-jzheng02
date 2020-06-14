class Tack_Shooter extends Tower {

    constructor() {

        super('tack_shooter', 875, 50);

        this.display_name = 'Tack Shooter';
        this.description = 'Shoots a short range volley of sharp tacks in 8 directions.';
        this.cost = 550;
        this.max_charge = 85;
        this.charge = this.max_charge;
        this.range = 75;
        this.next_path1_price = 210;
        this.next_path2_price = 100;
        this.domain = LAND;
        this.splash = 'tack_splash'
        this.dart_type = 'dart'
    }

    fire() {
        this.targets = this.return_valid_targets();
        // if there are no valid targets, stop fire function
        if (!this.targets.length) return;

        if (this.charge >= this.max_charge) {
            this.charge = 0;
            for (let angle = 0; angle < 2*Math.PI; angle += this.path1 >= 3? Math.PI/8:Math.PI/4) {
                new Tack(this.x, this.y, angle, this.range);
            }
        }
    }

    create_tower() {
        new Tack_Shooter();
    }

    buy_path_1(tower) {
        if (scene.money >= tower.next_path1_price) {
            super.buy_path_1(tower);
            switch (this.path1) {
                case 1:
                    this.max_charge -= 15;
                    scene.money -= 210;
                    this.next_path1_price = 300;
                    break;
                case 2:
                    this.max_charge -= 20;
                    scene.money -= 300;
                    this.next_path1_price = 500;
                    break;
                case 3:
                    scene.money -= 500;
                    this.next_path1_price = 2500;
                    break;
                case 4:
                    //become ring of fire
                    scene.money -= 2500;
            }
        }
    }

    buy_path_2(tower) {
        if (scene.money >= tower.next_path2_price) {
            super.buy_path_2(tower);
            switch (this.path2) {
                case 1:
                    this.range += 11;
                    this.updateGraphics();
                    scene.money -= 100;
                    this.next_path2_price = 225;
                    break;
                case 2:
                    this.range += 13;
                    this.updateGraphics();
                    scene.money -= 225;
                    this.next_path2_price = 680;
                    break;
                case 3:
                    //razor blades
                    scene.money -= 680;
                    this.next_path2_price = 2700;
                    break;
                case 4:
                    //blade maelstrom ability
                    scene.money -= 2700;
            }
        }
    }
}
