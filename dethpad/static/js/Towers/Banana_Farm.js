class Banana_Farm extends Tower {

    constructor() {

        super('banana_farm', 750, 325);

        this.display_name = 'Banana Farm';
        this.description = 'Banana Farms grow bananas that you can collect for cash by clicking on them';
        this.cost = 800;
        this.max_charge = 300;
        this.charge = this.max_charge;
        this.range = 50;
        this.next_path1_price = 300;
        this.next_path2_price = 500;
        this.domain = LAND;
        this.splash = 'banana_splash'
        this.setScale(.8)
    }

    fire() {
        if (this.charge >= this.max_charge && this.path2 < 3) {
            this.charge = 0;
            //change to boxes later
            let value;
            if (this.path1 == 4) {
                value = 200;
                if (this.path2 >= 1) value *= 1.25;
                if (this.path2 == 2) value *= 1.2;
            } else {
                value = 25;
                if (this.path2 >= 1) value += 7;
                if (this.path2 == 2) value += 6;
            }
            new Banana(this.x, this.y, value);
        }
    }

    create_tower() {
        new Banana_Farm();
    }

    buy_path_1(tower) {
        if (scene.money >= tower.next_path1_price) {
            super.buy_path_1(tower);
            switch (this.path1) {
                case 1:
                    this.max_charge -= 100;
                    scene.money -= 300;
                    this.next_path1_price = 1400;
                    break;
                case 2:
                    this.max_charge -= 50;
                    scene.money -= 1400;
                    this.next_path1_price = 3200;
                    break;
                case 3:
                    this.max_charge -= 50;
                    scene.money -= 3200;
                    this.next_path1_price = 14000;
                    break;
                case 4:
                    //boxes of bananas
                    this.max_charge += 100;
                    scene.money -= 14000;
            }
        }
    }

    buy_path_2(tower) {
        if (scene.money >= tower.next_path1_price) {
            super.buy_path_2(tower);
            switch (this.path2) {
                case 1:
                    scene.money -= 500;
                    this.next_path2_price = 4000;
                    break;
                case 2:
                    scene.money -= 4000;
                    this.next_path2_price = 4200;
                    break;
                case 3:
                    //monkey bank
                    scene.money -= 4200;
                    this.next_path2_price = 5500;
                    break;
                case 4:
                    //bannna investments advisory
                    scene.money -= 5500;
            }
        }
    }
}
