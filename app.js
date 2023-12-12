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
//Modules and sequelize tables importation
const express_1 = __importDefault(require("express"));
const sequelize_1 = __importDefault(require("./sequelize"));
const LearningPackage_1 = __importDefault(require("./LearningPackage"));
const LearningFact_1 = __importDefault(require("./LearningFact"));
const UserPackageLearning_1 = __importDefault(require("./UserPackageLearning"));
const LearningSession_1 = __importDefault(require("./LearningSession"));
const User_1 = __importDefault(require("./User"));
//express configuration
const app = (0, express_1.default)();
const port = 3000;
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET , PUT , POST , DELETE");
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, GET, POST, OPTIONS, DELETE, PUT,UPDATE,DELETE');
    next();
});
const currentDate = new Date();
app.use(express_1.default.json());
// Example of learning packages
const arrayLearningPackage = [
    {
        id: 1,
        title: "Learn TypeScript",
        description: "Package 1",
        category: "TS",
        targetaudience: "Web Dev Back",
        difficulty: 3
    },
    {
        id: 2,
        title: "Learn NodeJs",
        description: "Package 2",
        category: "NodeJS",
        targetaudience: "Web Dev Back",
        difficulty: 3
    },
    {
        id: 3,
        title: "Learn HTML",
        description: "Package 3",
        category: "HTML",
        targetaudience: "Web Dev Front",
        difficulty: 2
    },
    {
        id: 4,
        title: "Learn Angular",
        description: "Package 4",
        category: "Angular",
        targetaudience: "Web Dev",
        difficulty: 4
    }
];
// LearningPackage management
// get api status
app.get('/api/liveness', (req, res) => {
    res.status(200).send('OK');
});
// get all learning packages
app.get('/api/package', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const learningPackages = yield LearningPackage_1.default.findAll();
        res.json(learningPackages);
    }
    catch (error) {
        res.json({ error: 'Database connection error' });
    }
}));
//get all users
app.get('/api/users', (Request, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersList = yield User_1.default.findAll();
        res.json(usersList);
    }
    catch (error) {
        res.json({ error: 'Database connection error' });
    }
}));
app.post('/api/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    try {
        const count = yield User_1.default.count();
        const newUser = yield User_1.default.create({
            userid: count + 1,
            name,
        });
        res.status(201).json(newUser);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding user' });
    }
}));
// get all learning packages summaries by filtering to only keep id and title
app.get('/api/package-summaries', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const learningPackages = yield LearningPackage_1.default.findAll();
    let summariesInfos = learningPackages.map(learningPackage => ({ id: learningPackage.learningpackageid, title: learningPackage.title }));
    res.json(summariesInfos);
}));
// get the package with the same id in the URL
app.get('/api/package/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const learningPackages = yield LearningPackage_1.default.findAll();
    const id = parseInt(req.params.id);
    const learningPack = learningPackages.find(learningPack => learningPack.learningpackageid == id);
    if (learningPack != null) {
        res.status(404).send('Body is the object in json');
    }
    else {
        res.status(404).send(`Entity not found for id ${id}`);
    }
}));
//Post : add a new package with the attributes in the request body, the id isn't requested because it's put automatically
app.post('/api/package', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, category, targetaudience, difficulty } = req.body;
    if (!title || !description || !category || !targetaudience || !difficulty) {
        res.status(400).json({ error: `Some fields are not provided ${req.body}` });
    }
    else {
        const rowsNb = yield LearningPackage_1.default.count();
        const learningPackage = yield LearningPackage_1.default.create({
            learningpackageid: rowsNb + 1,
            title,
            description,
            category,
            targetaudience,
            difficulty: Number(difficulty)
        });
        try {
            res.status(200).json(learningPackage);
        }
        catch (error) {
            res.status(500).json({ error: "Database connection error" });
        }
    }
}));
// Put : to update an existing package by changing the row found with the id in the request body
app.put('/api/package', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { learningpackageid, title, description, category, targetaudience, difficulty } = req.body;
    if (!learningpackageid || !title || !description || !category || !targetaudience || !difficulty) {
        res.status(400).json({ error: `Some fields are not provided ${req.body}` });
    }
    else {
        const learningPackage = yield LearningPackage_1.default.findByPk(learningpackageid);
        if (learningPackage) {
            yield learningPackage.update({
                title,
                description,
                category,
                targetaudience,
                difficulty: Number(difficulty)
            });
            res.status(200).json(learningPackage);
        }
        else {
            res.status(404).send(`No package with this id was found`);
        }
    }
}));
// LearningFact management
// get : to get all facts with the package id parameter in the URL by filtering facts with the package id
app.get('/api/package/:id/fact', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const learningFacts = yield LearningFact_1.default.findAll();
        const id = parseInt(req.params.id);
        const learningPackageFacts = learningFacts.filter(learningFact => learningFact.learningpackageid === id);
        res.json(learningPackageFacts);
    }
    catch (error) {
        res.json({ error: 'Database connection error' });
    }
}));
// post : to create a fact with the package id parameter in the URL
app.post('/api/package/:id/fact', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, content } = req.body;
    const packageId = parseInt(req.params.id);
    if (!title || !description || !content) {
        res.status(400).json({ error: 'Some fields are not provided' });
    }
    else {
        try {
            const rowsNb = yield LearningFact_1.default.count();
            const factId = rowsNb + 1;
            const learningFact = yield LearningFact_1.default.create({
                learningfactid: factId,
                title,
                description,
                content,
                learningpackageid: Number(packageId),
                disable: false
            });
            res.status(200).json(learningFact);
        }
        catch (error) {
            res.status(500).json({ error: error });
        }
    }
}));
// update an existing fact with the id in body and package id in url parameter
app.put('/api/package/:id/fact', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, learningfactid, content } = req.body;
    const packageId = parseInt(req.params.id);
    if (!title || !description || !content) {
        res.status(400).json({ error: 'Some fields are not provided' });
    }
    else {
        try {
            const learningFact = yield LearningFact_1.default.findOne({
                where: { learningpackageid: packageId, learningfactid: learningfactid },
            });
            if (learningFact) {
                yield learningFact.update({
                    title,
                    description,
                    content
                });
                res.status(200).json(learningFact);
            }
            else {
                res.status(404).send('No fact with this package id was found');
            }
        }
        catch (error) {
            console.error('An error occurred while updating the fact:', error);
            res.status(500).json({ error: error });
        }
    }
}));
// delete an existing fact by disabling it with a boolean
app.delete('/api/package/:id/fact', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const packageId = parseInt(req.params.id);
    if (!id) {
        res.status(400).json({ error: 'Some fields are not provided' });
    }
    else {
        try {
            const learningFact = yield LearningFact_1.default.findOne({
                where: { packageid: packageId, id: id },
            });
            if (learningFact) {
                yield learningFact.update({
                    disable: true
                });
                res.status(200).json({ message: `The fact ${id} has been disabled` });
            }
            else {
                res.status(404).json({ message: 'No fact with this package id was found' });
            }
        }
        catch (error) {
            console.error('An error occurred while deleting the fact:', error);
            res.status(500).json({ error: error });
        }
    }
}));
// Others API's
const futureDate = new Date(currentDate.getTime() + (7 * 24 * 60 * 60 * 1000));
// An API to choose which learning package we want to start with an excepted completion time of 7 days
app.post('/api/learning_package/choice', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userid, learningpackageid } = req.body;
    if (!userid || !learningpackageid) {
        res.status(400).json({ error: 'Some fields are not provided' });
    }
    else {
        try {
            const userPackageLearning = yield UserPackageLearning_1.default.create({
                userid: Number(userid),
                learningpackageid: Number(learningpackageid),
                startdate: currentDate,
                exceptedenddate: futureDate,
                minutesperdayobjective: 20,
            });
            const learningFact = yield LearningFact_1.default.findOne({
                where: { packageid: learningpackageid },
            });
            if (learningFact) {
                const response = { message: `The learning to begin with is ${learningFact.title}` };
                res.status(200).json(response);
            }
            else {
                const response = { message: `There is no learning fact in this package` };
                res.status(200).json(response);
            }
        }
        catch (error) {
            res.status(500).json({ error: error });
        }
    }
}));
// An API to start a learning session. It saves in the database the date when the fact is used for the first time and returns the next fact to train
app.post('/api/learning_session/start', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userid, learningfactid } = req.body;
    if (!userid || !learningfactid) {
        res.status(400).json({ error: 'Some fields are not provided' });
    }
    else {
        try {
            const learningSession = yield LearningSession_1.default.create({
                userid: Number(userid),
                learningfactid: Number(learningfactid),
                startdate: currentDate,
                enddate: null,
                finished: false
            });
            const learningFactPackage = yield LearningFact_1.default.findOne({ where: {
                    id: Number(learningfactid)
                } });
            const nextLearningFact = yield LearningFact_1.default.findOne({
                where: sequelize_1.default.literal(`"LearningFactTable"."packageid" = ${Number(learningFactPackage === null || learningFactPackage === void 0 ? void 0 : learningFactPackage.learningfactid)} AND "LearningFactTable"."id" > ${Number(learningfactid)}`),
            });
            if (nextLearningFact) {
                const response = { message: `The next learning fact is ${nextLearningFact.title}` };
                res.status(200).json(response);
            }
            else {
                const response = { message: `There is no next learning fact` };
                res.status(200).json(response);
            }
        }
        catch (error) {
            res.status(500).json({ error: error });
        }
    }
}));
//An API to end a learning session by saving the end date and turning the boolean finished on true, I tried to do a Join query to get remaining and done facts but I had several problems
app.put('/api/learning_session/end', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userid, learningfactid } = req.body;
    if (!userid || !learningfactid) {
        res.status(400).json({ error: 'Some fields are not provided' });
    }
    try {
        const learningSession = yield LearningSession_1.default.findOne({
            where: { userid: userid, learningfactid: learningfactid },
        });
        if (learningSession) {
            yield learningSession.update({
                finished: true,
                enddate: currentDate
            });
            const learningFactPackage = yield LearningFact_1.default.findOne({ where: {
                    id: Number(learningfactid)
                } });
            const allFactsForPackage = yield LearningFact_1.default.findAll({ where: { packageid: learningFactPackage === null || learningFactPackage === void 0 ? void 0 : learningFactPackage.learningfactid } });
            const nbFacts = allFactsForPackage.length;
            if (learningFactPackage) {
                const packageId = learningFactPackage.learningfactid;
                res.status(200).json({ message: `User n° ${userid} finished learning fact n°${learningfactid}` });
            }
            else {
                const response = { message: `There is no more facts for this package` };
                res.status(200).json(response);
            }
        }
        else {
            res.status(404).json({ message: 'No session with this learning fact was found for this user' });
        }
    }
    catch (error) {
        res.status(500).json({ error: error });
    }
}));
// Start the app server listening on port 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port} sur l'URL : http://localhost:3000/api/liveness`);
});
