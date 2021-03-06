class Super_Monkey extends Tower {

    constructor() {

        super('super_monkey', 875, 315);

        this.display_name = 'Super Monkey';
        this.description = '	Super Monkeys shoot a continuous stream of darts, and can mow down even the fastest and most stubborn bloons.';
        this.cost = 3500;
        this.max_charge = 3;
        this.charge = this.max_charge;
        this.range = 300;
        this.pierce = 1;
        this.next_path1_price = 3500;
        this.next_path2_price = 1000;
        this.domain = LAND;
        this.splash = 'super_splash'
        this.dart_type = 'dart'

        this.ability_status = 0; //0 for no ability, 1 for charging
        this.ability_charge = 0;
        this.ability_max_charge = 8000;

        this.path1_def_icon = "sm_1_1_icon";
        this.path2_def_icon = "sm_2_1_icon";
    }

    fire() {
        this.targets = this.return_valid_targets();
        // if there are no valid targets, stop fire function
        if (!this.targets.length) return;
        this.target = this.return_best_target();

        if (this.ability_charge >= this.ability_max_charge) {
            this.ability_charge = 0;
            let circle = new Phaser.Geom.Circle(this.x, this.y, 200);
            bloons.children.iterate((bloon) => {
                if (bloon != undefined && Phaser.Geom.Circle.Contains(circle, bloon.x, bloon.y)) {
                    if (bloon.isMOAB) {
                        bloon.health -= 1000;
                    } else {
                        bloon.destroy();
                    }
                }
            });
        }
        if (this.charge >= this.max_charge) {
            this.charge = 0;
            this.rotation = Phaser.Math.Angle.Between(this.x, this.y, this.target.x, this.target.y) + Math.PI / 2;
            switch (this.path2) {
                case 4:
                    new TechBlast(this.x, this.y, this.target, 1000, this.pierce);
                    new TechBlast(this.x, this.y, this.return_worst_target(), 1000, this.pierce);
                    break;
                case 3:
                    switch (this.path1) {
                        case 0:
                            new Super_Dart(this.x, this.y, this.return_worst_target(), 1000, this.pierce);
                            break;
                        case 1:
                            new SMLaser(this.x, this.y, this.return_worst_target(), 1000);
                            break;
                        case 2:
                            new Plasma(this.x, this.y, this.return_worst_target(), 1000);
                    }
                default:
                    switch (this.path1) {
                        case 0:
                            new Super_Dart(this.x, this.y, this.target, 1000, this.pierce);
                            break;
                        case 1:
                            new SMLaser(this.x, this.y, this.target, 1000);
                            break;
                        case 2:
                            new Plasma(this.x, this.y, this.target, 1000);
                            break;
                        case 3:
                            let x = this.target.x - this.x;
                            let y = this.target.y - this.y;
                            let split1 = this.rotate(x, y, Math.PI / 12);
                            let split2 = this.rotate(x, y, -Math.PI / 12);
                            new SGBlast(this.x, this.y, this.target, 1000);
                            new SGBlast(this.x, this.y, {x: split1[0], y: split1[1]}, this.range);
                            new SGBlast(this.x, this.y, {x: split2[0], y: split2[1]}, this.range);
                            break;
                        case 4:
                            new TempleBlast(this.x, this.y, this.target, 1000);
                    }
            }
        }
    }

    create_tower() {
        new Super_Monkey();
    }

    buy_path_1(tower) {
        if (scene.money >= tower.next_path1_price) {
            super.buy_path_1(tower);
            switch (this.path1) {
                case 1:
                    this.pierce++;
                    if (this.path2 < 3) {
                        this.setTexture('sm_1_1');
                        this.input.hitArea.setSize(this.width, this.height);
                    }
                    scene.money -= 3500;
                    this.next_path1_price = 5000;
                    this.path1_price.setText("$" + this.next_path1_price);
                    this.path1_next_icon.destroy();
                    this.path1_last_icon = scene.add.image(280,550, "sm_1_1_icon").setDepth(5).setDisplaySize(80,60).setAlpha(.7);
                    this.path1_next_icon = scene.add.image(380,540, "sm_1_2_icon").setDepth(5).setDisplaySize(80,60).setAlpha(.7);
                    break;
                case 2:
                    this.max_charge--;
                    this.pierce += 2;
                    this.max_charge--;
                    scene.money -= 5000;
                    this.next_path1_price = 16500;
                    if (this.path2 < 3) {
                        this.setTexture('sm_1_2');
                        this.input.hitArea.setSize(this.width, this.height);
                        this.path1_price.setText("$" + this.next_path1_price);
                        this.path1_last_icon.destroy();
                        this.path1_last_icon = scene.add.image(280,540, "sm_1_2_icon").setDepth(5).setDisplaySize(80,60).setAlpha(.7);
                    } else {
                        this.path1_price.destroy();
                    }
                    this.path1_next_icon.destroy();
                    this.path1_next_icon = scene.add.image(380,550, "sm_1_3_icon").setDepth(5).setDisplaySize(80,60).setAlpha(.7);
                    break;
                case 3:
                    this.max_charge++;
                    this.setTexture('sm_1_3').setScale(0.5);
                    this.input.hitArea.setSize(this.width, this.height);
                    scene.money -= 16500;
                    this.next_path1_price = 100000;
                    this.path1_price.setText("$" + this.next_path1_price);
                    if (this.path2 == 2) {
                        this.path2_price.destroy();
                    }
                    this.path1_last_icon.destroy();
                    this.path1_next_icon.destroy();
                    this.path1_next_icon = scene.add.image(380,550, "sm_1_4_icon").setDepth(5).setDisplaySize(80,60).setAlpha(.7);
                    this.path1_last_icon = scene.add.image(280,550, "sm_1_3_icon").setDepth(5).setDisplaySize(80,60).setAlpha(.7);
                    break;
                case 4:
                    this.max_charge--;
                    this.setTexture('sm_1_4');
                    this.input.hitArea.setSize(this.width, this.height);
                    scene.money -= 100000;
                    this.path1_price.destroy();
                    this.path1_last_icon.destroy();
                    this.path1_last_icon = scene.add.image(280,550, "sm_1_4_icon").setDepth(5).setDisplaySize(80,60).setAlpha(.7);
                    this.path1_next_icon.destroy();
            }
        }
    }

    buy_path_2(tower) {
        if (scene.money >= tower.next_path2_price) {
            super.buy_path_2(tower);
            switch (this.path2) {
                case 1:
                    this.range += 100;
                    this.updateGraphics();
                    scene.money -= 1000;
                    this.next_path2_price = 1500;
                    this.path2_price.setText("$" + this.next_path2_price);
                    this.path2_next_icon.destroy();
                    this.path2_last_icon = scene.add.image(520,550, "sm_2_1_icon").setDepth(5).setDisplaySize(80,60).setAlpha(.7);
                    this.path2_next_icon = scene.add.image(620,550, "sm_2_2_icon").setDepth(5).setDisplaySize(80,60).setAlpha(.7);
                    break;
                case 2:
                    this.pierce++;
                    this.range += 100;
                    this.updateGraphics();
                    this.camo_detection = true;
                    scene.money -= 1500;
                    this.next_path2_price = 9000;
                    if (this.path1 < 2) {
                        this.setTexture('sm_2_2');
                        this.input.hitArea.setSize(this.width, this.height);
                    }
                    if (this.path1 < 3) {
                        this.path2_price.setText("$" + this.next_path2_price);
                        this.path2_last_icon.destroy();
                        this.path2_last_icon = scene.add.image(520,550, "sm_2_2_icon").setDepth(5).setDisplaySize(80,60).setAlpha(.7);
                    } else {
                        this.path2_price.destroy();
                    }
                    this.path2_next_icon.destroy();
                    this.path2_next_icon = scene.add.image(620,550, "sm_2_3_icon").setDepth(5).setDisplaySize(80,60).setAlpha(.7);
                    break;
                case 3:
                    this.setTexture('sm_2_3').setScale(0.5);
                    this.input.hitArea.setSize(this.width, this.height);
                    scene.money -= 9000;
                    this.next_path2_price = 25000;
                    this.path2_price.setText("$" + this.next_path2_price);
                    if (this.path1 == 2) {
                        this.path1_price.destroy();
                    }
                    this.path2_last_icon.destroy();
                    this.path2_next_icon.destroy();
                    this.path2_next_icon = scene.add.image(620,550, "sm_2_4_icon").setDepth(5).setDisplaySize(80,60).setAlpha(.7);
                    this.path2_last_icon = scene.add.image(520,550, "sm_2_3_icon").setDepth(5).setDisplaySize(80,60).setAlpha(.7);
                    break;
                case 4:
                    switch (this.path1) {
                        case 0:
                            this.pierce = 5;
                            break;
                        case 1:
                            this.pierce = 6;
                            break;
                        case 2:
                            this.pierce = 8;
                    }
                    this.max_charge--;
                    this.ability_status = 1;
                    this.setTexture('sm_2_4');
                    this.input.hitArea.setSize(this.width, this.height);
                    this.path1_price.setText("$" + this.next_path1_price);
                    scene.money -= 25000;
                    this.path2_price.destroy();
                    this.path2_last_icon.destroy();
                    this.path2_last_icon = scene.add.image(520,550, "sm_2_4_icon").setDepth(5).setDisplaySize(80,60).setAlpha(.7);
                    this.path2_next_icon.destroy();
            }
        }
    }
}
