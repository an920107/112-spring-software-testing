import test, { mock } from 'node:test';
import assert from 'assert';
import { Application, MailSystem } from './main';

test("MailSystem's write", () => {
    const mailSystem = new MailSystem();
    const name = "Squid";
    assert.strictEqual(mailSystem.write(name), `Congrats, ${name}!`);
});

test("MailSystem's send", (t) => {
    const mailSystem = new MailSystem();
    t.mock.method(Math, "random").mock.mockImplementationOnce(() => 0.6);
    assert.strictEqual(mailSystem.send("Squid", "Hello!"), true);
    t.mock.method(Math, "random").mock.mockImplementationOnce(() => 0.4);
    assert.strictEqual(mailSystem.send("Squid", "Hello!"), false);
});


import fs from 'fs';
import util from 'util';
const writeFile = util.promisify(fs.writeFile);

test("Application's getNames and constructor", async () => {
    const filename = "name_list.txt";
    const fileContext = "Quan\nSquid\nZoe";
    await writeFile(filename, fileContext, "utf8");
    const app = new Application();
    assert.deepStrictEqual(await app.getNames(), [["Quan", "Squid", "Zoe"], []]);
});

const people = ["Quan", "Squid", "Zoe"];
const getNamesToMock = async () => [people, []];

test("Application's getRandomPerson", async (t) => {
    t.mock.method(Application.prototype, "getNames").mock.mockImplementation(getNamesToMock);
    const app = new Application();
    await app.getNames();
    assert.ok(people.includes(app.getRandomPerson()));
});

test("Application's selectNextPerson", async (t) => {
    t.mock.method(Application.prototype, "getNames").mock.mockImplementation(getNamesToMock);
    const app = new Application();
    await app.getNames();
    var calledCount = 0;
    t.mock.method(app, "getRandomPerson").mock.mockImplementation(() => {
        calledCount++;
        var accumulated = 0;
        for (var i = 1; true; i++) {
            for (var j = 1; j <= i; j++) {
                accumulated++;
                if (accumulated == calledCount)
                    return app.people[j - 1];
            }
        }
    });
    for (var i = 0; i < app.people.length; i++)
        assert.ok(app.people.includes(app.selectNextPerson()!));
    assert.strictEqual(app.selectNextPerson(), null);
});

test("Application's notifySelected", async (t) => {
    t.mock.method(Application.prototype, "getNames").mock.mockImplementation(getNamesToMock);
    const app = new Application();
    await app.getNames();
    app.selected = Array.from(app.people);
    app.selected.splice(0, 1);

    const writeMock = t.mock.method(app.mailSystem, "write").mock;
    writeMock.mockImplementation((name: string) => `Hello ${name}!`);
    const sendMock = t.mock.method(app.mailSystem, "send").mock;
    sendMock.mockImplementation((name: string, context: string) => true);

    app.notifySelected();
    assert.strictEqual(writeMock.callCount(), app.selected.length);
    assert.strictEqual(sendMock.callCount(), app.selected.length);
});
