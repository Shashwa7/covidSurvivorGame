const app = new Vue({

    el: "#app",
    //created() is keyword and case sensitive
    created() {
        window.addEventListener('keydown', (e) => {

            let btn = e.key;
            if (btn === "Enter")
                this.startGame();

            console.log(btn);

            if (this.startGame && !this.difficulty) {
                switch (btn.toUpperCase()) {

                    case "N": this.setDifficulty(1); break;
                    case "P": this.setDifficulty(2); break;
                    case "I": this.setDifficulty(3); break;
                }
            }

            if (this.startGame && this.difficulty) {
                console.log('missed')
                switch (btn.toUpperCase()) {
                    case "A": this.attack(); break;
                    case "S": this.specialAttack(); break;
                    case "H": this.heal(); break;
                    case "Q": this.restartGame(); break;
                }
            }
        })
    },
    data: {
        gameStarted: false,
        heroHealth: 100,
        monsterHealth: 100,
        performAttacks: [{ name: 'special', status: true, max: 8 }, { name: 'regular', status: true, max: 30 }],
        freezeAttack: false,
        freezeSpcAttack: false,
        winner: 0,
        difficulty: 0, //0- easy, 1- hard, 2-pro
        level: 1200, //monster healing time
        infection: false
    },

    methods: {
        startGame() {
            this.gameStarted = true,
                this.infection = true
        },
        setDifficulty(x) {
            this.difficulty = x;
            switch (this.difficulty) {
                case 1: this.level = 1500; break;
                case 2: this.level = 850; break;
                case 3: this.level = 550; break;
            }
        },
        generateDamage(min, max) {
            return Math.max(Math.floor(Math.random() * max + 1, min));
        },
        restartGame() {
            this.gameStarted = false;
            this.heroHealth = 100;
            this.monsterHealth = 100;
            this.difficulty = 0;
            this.level = 1200;
            this.infection = false;
        },
        attack() {
            this.performAttacks[1].max--;

            if (this.performAttacks[1].max === 0) {
                this.performAttacks[1].status = false;
                this.freezeAttack = true;
            }

            if (this.performAttacks[1].status) {
                //damage to monster
                this.monsterHealth -= this.generateDamage(5, 15);

                //in-return damage to human
                this.heroHealth -= this.generateDamage(3, 8);
            }
        },
        specialAttack() {
            this.performAttacks[0].max--;

            if (this.performAttacks[0].max === 0) {
                this.performAttacks[0].status = false;
                this.freezeSpcAttack = true;
            }

            if (this.performAttacks[0].status) {
                //damage to monster
                this.monsterHealth -= this.generateDamage(12, 30);

                //in-return damage to human
                this.heroHealth -= this.generateDamage(4, 10);
            }
        },
        heal() {
            //healt to human
            if (this.heroHealth < 100) {
                let health = this.generateDamage(7, 20);
                this.heroHealth += health

                //recheking if health is exceeded 100
                if (this.heroHealth > 100)
                    this.heroHealth = 100
            }
        }
    },

    watch: {

        freezeAttack() {
            //reset normal attack after 2s
            if (this.performAttacks[1].max === 0) {
                setTimeout(() => {
                    this.performAttacks[1].max = 30;
                    this.performAttacks[1].status = true;
                    this.freezeAttack = false;
                }, 1500);
            }
        },

        freezeSpcAttack() {
            //reset Special Attack afte 3s
            if (this.performAttacks[0].max === 0) {
                setTimeout(() => {
                    this.performAttacks[0].max = 8;
                    this.performAttacks[0].status = true;
                    this.freezeSpcAttack = false;
                }, 3000);
            }

        },
        monsterHealth() {

            //once monster's health drops less than 50%
            //it wil heal ever second
            if (this.monsterHealth < 100) {
                setTimeout(() => {
                    console.log('Monster healing!');
                    let health = this.generateDamage(2, 10);
                    this.monsterHealth += health

                    //recheking if health is exceeded 100
                    if (this.monsterHealth > 100)
                        this.monsterHealth = 100

                }, this.level);
            }

            if (this.monsterHealth < 5)
                this.winner = 1; // 1-hero
        },

        infection() {

            const infectHuman = setInterval(() => {

                if (this.infection === false)
                    clearInterval(infectHuman);
                else {
                    let damage = this.generateDamage(1, 3);
                    this.heroHealth -= damage
                }
            }, 2000);
        },

        heroHealth() {
            if (this.heroHealth < 5)
                this.winner = 2;  //2-monster
        },

        winner() {
            if (this.winner != 0) {
                this.restartGame();
                setTimeout(() => {
                    this.winner = 0;
                }, 3000);
            }
        }
    },

})