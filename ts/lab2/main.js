"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Application = exports.MailSystem = void 0;
const fs_1 = __importDefault(require("fs"));
const util_1 = __importDefault(require("util"));
const readFile = util_1.default.promisify(fs_1.default.readFile);
class MailSystem {
    write(name) {
        console.log('--write mail for ' + name + '--');
        const context = 'Congrats, ' + name + '!';
        return context;
    }
    send(name, context) {
        console.log('--send mail to ' + name + '--');
        // Interact with mail system and send mail
        // random success or failure
        const success = Math.random() > 0.5;
        if (success) {
            console.log('mail sent');
        }
        else {
            console.log('mail failed');
        }
        return success;
    }
}
exports.MailSystem = MailSystem;
class Application {
    constructor() {
        this.people = [];
        this.selected = [];
        this.mailSystem = new MailSystem();
        this.getNames().then(([people, selected]) => {
            this.people = people;
            this.selected = selected;
        });
    }
    getNames() {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield readFile('name_list.txt', 'utf8');
            const people = data.split('\n');
            const selected = [];
            return [people, selected];
        });
    }
    getRandomPerson() {
        const i = Math.floor(Math.random() * this.people.length);
        return this.people[i];
    }
    selectNextPerson() {
        console.log('--select next person--');
        if (this.people.length === this.selected.length) {
            console.log('all selected');
            return null;
        }
        let person = this.getRandomPerson();
        while (this.selected.includes(person)) {
            person = this.getRandomPerson();
        }
        this.selected.push(person);
        return person;
    }
    notifySelected() {
        console.log('--notify selected--');
        for (const x of this.selected) {
            const context = this.mailSystem.write(x);
            this.mailSystem.send(x, context);
        }
    }
}
exports.Application = Application;
// const app = new Application();
// app.selectNextPerson();
// app.selectNextPerson();
// app.selectNextPerson();
// app.notifySelected();
