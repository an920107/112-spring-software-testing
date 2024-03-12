import fs from 'fs';
import util from 'util';
const readFile = util.promisify(fs.readFile);

export class MailSystem {
    write(name: string): string {
        console.log('--write mail for ' + name + '--');
        const context = 'Congrats, ' + name + '!';
        return context;
    }

    send(name: string, context: string): boolean {
        console.log('--send mail to ' + name + '--');
        // Interact with mail system and send mail
        // random success or failure
        const success = Math.random() > 0.5;
        if (success) {
            console.log('mail sent');
        } else {
            console.log('mail failed');
        }
        return success;
    }
}

export class Application {
    people: string[];
    selected: string[];
    mailSystem: MailSystem;

    constructor() {
        this.people = [];
        this.selected = [];
        this.mailSystem = new MailSystem();
        this.getNames().then(([people, selected]) => {
            this.people = people;
            this.selected = selected;
        });
    }

    async getNames() {
        const data = await readFile('name_list.txt', 'utf8');
        const people = data.split('\n');
        const selected: string[] = [];
        return [people, selected];
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

// const app = new Application();
// app.selectNextPerson();
// app.selectNextPerson();
// app.selectNextPerson();
// app.notifySelected();