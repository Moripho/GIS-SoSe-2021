"use strict";
class DomesticAnimal {
    name;
    age;
    color;
    owner;
    constructor(_name, _color, _age = 0, _owner = "") {
        console.log("Animal Constructor");
        this.name = _name;
        this.age = _age;
        this.color = _color;
        this.owner = _owner;
    }
    makeSound() {
        console.log("<undefined Animal Sound>");
    }
}
class Dog extends DomesticAnimal {
    goodBoyOrGirl;
    constructor(_name, _color, _age = 0, _goodBoyOrGirl = true, _owner = "") {
        console.log("Dog Constructor");
        super(_name, _color, _age, _owner);
        this.goodBoyOrGirl = _goodBoyOrGirl;
    }
    makeSound() {
        console.log("woof!");
    }
}
class Cat extends DomesticAnimal {
    makeSound() {
        console.log("maunz!");
    }
}
let a = new DomesticAnimal("Anim", "schwarz");
let c = new Cat("Rey", "getiegert", 2);
let d = new Dog("Bello", "weiß", 5, true);
a.makeSound(); // "<undefined Animal Sound>"
c.makeSound(); // "maunz!"
d.makeSound(); // "woof!"
//# sourceMappingURL=clientscript.js.map