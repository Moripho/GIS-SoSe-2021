class DomesticAnimal {
    name: string;
    age: number;
    color: string;
    owner?: string;
    constructor(_name: string, _color: string, _age: number = 0, _owner: string = ""){
        console.log("Animal Constructor")
        this.name = _name;
        this.age = _age;
        this.color = _color;
        this.owner = _owner;
    }
    makeSound() {
        console.log("<undefined Animal Sound>")
    }
}

class Dog extends DomesticAnimal {
    goodBoyOrGirl: boolean;
    constructor(_name: string, _color: string, _age: number = 0, _goodBoyOrGirl: boolean = true, _owner: string = "") {
        console.log("Dog Constructor")
        super(_name, _color, _age, _owner);
        this.goodBoyOrGirl = _goodBoyOrGirl;
    }
    makeSound(){
        console.log("woof!");
    }
}

class Cat extends DomesticAnimal {
    makeSound() {
        console.log("maunz!");
    }
}

let a: DomesticAnimal = new DomesticAnimal("Anim", "schwarz");
let c: Cat = new Cat("Rey", "getiegert", 2);
let d: Dog = new Dog("Bello", "weiß", 5, true);

a.makeSound(); // "<undefined Animal Sound>"
c.makeSound(); // "maunz!"
d.makeSound(); // "woof!"



