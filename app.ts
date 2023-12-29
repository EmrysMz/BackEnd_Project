//Modules and sequelize tables importation
import express, { Request, Response } from 'express';
import sequelize from "./sequelize";
import LearningPackageTable from "./LearningPackage";
import LearningFactTable from "./LearningFact";
import UserPackageLearningTable from "./UserPackageLearning";
import LearningSessionTable from "./LearningSession";
import UserLearningFactTable from "./UserLearningFact";
import UserTable from "./User";




//express configuration
const app = express();
const port = 3000;




app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Methods", "GET , PUT , POST , DELETE");
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, GET, POST, OPTIONS, DELETE, PUT,UPDATE,DELETE');
    next();
});

const currentDate = new Date();



app.use(express.json());

// tables interfaces
interface LearningPackage {
    id : number,
    title : string,
    description : string,
    category : string,
    targetaudience : string,
    difficulty : number
}

interface LearningFact {
    id : number,
    title : string,
    description : string,
    packageid : number,
}

interface UserPackageLearning{
    id : number,
    startDate: Date,
    expectedEndDate : Date,
    minutesPerDayObjective : number
}

interface UserLearningFact{
    id : number,
    nbTimesReviewed : number,
    confidenceLevel:number,
    lastReviewedDate : Date
}

interface User{
    id : number,
    name : string
}



// Example of learning packages
const arrayLearningPackage: LearningPackage[] =[
    {
        id : 1,
        title : "Learn TypeScript",
        description : "Package 1",
        category : "TS",
        targetaudience : "Web Dev Back",
        difficulty : 3
    },
    {
        id : 2,
        title : "Learn NodeJs",
        description : "Package 2",
        category : "NodeJS",
        targetaudience : "Web Dev Back",
        difficulty : 3
    },
    {
        id : 3,
        title : "Learn HTML",
        description : "Package 3",
        category : "HTML",
        targetaudience : "Web Dev Front",
        difficulty : 2
    },
    {
        id : 4,
        title : "Learn Angular",
        description : "Package 4",
        category : "Angular",
        targetaudience : "Web Dev",
        difficulty : 4
    }

]


// LearningPackage management

// get api status
app.get('/api/liveness', (req: Request, res: Response) => {
    res.status(200).send('OK');
});

// get all learning packages
app.get('/api/package',async(req: Request, res: Response)=> {
    try{
        const learningPackages =  await LearningPackageTable.findAll()
        res.json(learningPackages)
    }
    catch (error){
        res.json({error : 'Database connection error'})
    }

});

//get all users
app.get('/api/users',async (Request,res:Response)=>{
    try{
        const usersList =  await UserTable.findAll()
        res.json(usersList)
    }
    catch (error){
        res.json({error : 'Database connection error'})
    }
});

app.delete('/api/users/:userid', async (req, res) => {
    const userid = req.params.userid;

    try {
        // Trouver l'utilisateur par ID et le supprimer
        const userToDelete = await UserTable.findByPk(userid);

        if (userToDelete) {
            await userToDelete.destroy();
            res.json({ message: 'Utilisateur supprimé avec succès.' });
        } else {
            res.status(404).json({ error: 'Utilisateur non trouvé.' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Erreur lors de la suppression de l\'utilisateur.' });
    }
});

app.post('/api/users', async (req, res) => {
    const { name } = req.body;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    try {
        const count = await UserTable.count();
        const newUser = await UserTable.create({
            userid: count + 1,
            name,
        });

        res.status(201).json(newUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error adding user' });
    }
});


// get all learning packages summaries by filtering to only keep id and title

app.get('/api/package-summaries',async(req: Request, res: Response)=> {
    const learningPackages =  await LearningPackageTable.findAll()
    let summariesInfos = learningPackages.map(learningPackage => ({id : learningPackage.learningpackageid, title : learningPackage.title}) )
    res.json(summariesInfos)
});

// get the package with the same id in the URL
app.get('/api/package/:id', async(req: Request, res: Response)=> {
    const learningPackages =  await LearningPackageTable.findAll()
    const id = parseInt(req.params.id)
    const learningPack = learningPackages.find(learningPack => learningPack.learningpackageid == id)

    if (learningPack != null){
        res.status(404).send('Body is the object in json')

    }
    else{
        res.status(404).send(`Entity not found for id ${id}`)
    }

});

//Post : add a new package with the attributes in the request body, the id isn't requested because it's put automatically
app.post('/api/package', async(req: Request, res: Response) => {
    const { title, description, category, targetaudience, difficulty } = req.body;

    if (!title || !description || !category || !targetaudience || !difficulty) {
        res.status(400).json({ error: `Some fields are not provided ${req.body}` });
    } else {
        const rowsNb = await LearningPackageTable.count()

        const learningPackage = await LearningPackageTable.create( {
            learningpackageid :  rowsNb+ 1,
            title,
            description,
            category,
            targetaudience,
            difficulty : Number(difficulty)
        });

        try{
            res.status(200).json(learningPackage);
        }
        catch(error){
            res.status(500).json({error: "Database connection error"})
        }


    }
});

// Put : to update an existing package by changing the row found with the id in the request body
app.put('/api/package',async (req: Request, res: Response) =>{

    const { learningpackageid, title, description, category, targetaudience, difficulty } = req.body;

    if (!learningpackageid || !title || !description || !category || !targetaudience || !difficulty) {
        res.status(400).json({ error: `Some fields are not provided ${req.body}` });
    } else {
        const learningPackage = await LearningPackageTable.findByPk(learningpackageid)

        if (learningPackage){
            await learningPackage.update({
                title,
                description,
                category,
                targetaudience,
                difficulty : Number(difficulty)
            })

            res.status(200).json(learningPackage)
        }

        else{
            res.status(404).send(`No package with this id was found`)
        }
    }
});

// Suppression d'un package par ID
app.delete('/api/package/:id', async (req, res) => {
    const packageId = parseInt(req.params.id);

    try {
        // Supprimer le package avec learningpackageid égal à :id
        const deletedPackage = await LearningPackageTable.destroy({
            where: { learningpackageid: packageId }
        });

        if (deletedPackage > 0) {
            res.status(200).json({ message: `Package with ID ${packageId} deleted successfully` });
        } else {
            res.status(404).json({ message: `Package with ID ${packageId} not found` });
        }
    } catch (error) {
        console.error('An error occurred while deleting the package:', error);
        res.status(500).json({ error: packageId});
    }
});





// LearningFact management

// get : to get all facts with the package id parameter in the URL by filtering facts with the package id
app.get('/api/package/:id/fact',async(req: Request, res: Response)=> {
    try{

        const learningFacts =  await LearningFactTable.findAll()
        const id = parseInt(req.params.id)
        const learningPackageFacts = learningFacts.filter(learningFact => learningFact.learningpackageid === id);

        res.json(learningPackageFacts)
    }
    catch (error){
        res.json({error : 'Database connection error'})
    }

});

app.get('/api/fact/:id',async(req: Request, res: Response)=> {
    try{

        const learningFacts =  await LearningFactTable.findAll()
        const id = parseInt(req.params.id)
        const learningPackageFacts = learningFacts.filter(learningFact => learningFact.learningfactid === id);

        res.json(learningPackageFacts)
    }
    catch (error){
        res.json({error : 'Database connection error'})
    }

});

// post : to create a fact with the package id parameter in the URL
app.post('/api/package/:id/fact', async (req: Request, res: Response) => {
    const { title, description, content,question,answer} = req.body;
    const packageId = parseInt(req.params.id)

    if (!title || !description || !content || !question || !answer ) {
        res.status(400).json({ error: 'Some fields are not provided' });
    } else {
        try {
            const rowsNb = await LearningFactTable.count();
            const factId = rowsNb + 1;

            const learningFact = await LearningFactTable.create({
                learningfactid: factId,
                title,
                description,
                content,
                question,
                answer,
                learningpackageid: Number(packageId),
                disable : false
            });


            res.status(200).json(learningFact);
        } catch (error) {

            res.status(500).json({ error: error });
        }
    }
});

// update an existing fact with the id in body and package id in url parameter
app.put('/api/package/:id/fact', async (req: Request, res: Response) => {
    const { title, description, learningfactid,content} = req.body;
    const packageId = parseInt(req.params.id);

    if (!title || !description || !content) {
        res.status(400).json({ error: 'Some fields are not provided' });
    } else {
        try {
            const learningFact = await LearningFactTable.findOne({
                where: { learningpackageid: packageId, learningfactid: learningfactid },
            });

            if (learningFact) {
                await learningFact.update({

                    title,
                    description,
                    content
                });

                res.status(200).json(learningFact);
            } else {
                res.status(404).send('No fact with this package id was found');
            }
        } catch (error) {
            console.error('An error occurred while updating the fact:', error);
            res.status(500).json({ error: error });
        }
    }
});


// delete an existing fact by disabling it with a boolean, learningfactid in the url parameter and learningpackageid in the url :id
app.delete('/api/package/:id/fact/:factId', async (req: Request, res: Response) => {
    const { factId } = req.params;
    const packageId = parseInt(req.params.id);

    if (!factId) {
        res.status(400).json({ error: 'Some fields are not provided' });
    } else {
        try {
            const learningFact = await LearningFactTable.findOne({
                where: { learningfactid: factId, learningpackageid: packageId },
            });

            if (learningFact) {
                await learningFact.update({
                    disable: true
                });

                res.status(200).json({ message: `The fact ${factId} has been disabled` });
            } else {
                res.status(404).json({ message: 'No fact with this package id was found' });
            }
        } catch (error) {
            console.error('An error occurred while deleting the fact:', error);
            res.status(500).json({ error: error });
        }
    }
});

// Managment users progress


app.get('/api/user-packages/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const userPackages = await UserPackageLearningTable.findAll({
            where: { userid: userId },
            include: [LearningPackageTable],
        });

        res.json(userPackages);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database connection error' });
    }
});





app.get('/api/learning-facts/:userId/:learningPackageId', async (req, res) => {
    const userId = req.params.userId;
    const learningPackageId = req.params.learningPackageId;

    try {
        const learningFacts = await UserLearningFactTable.findAll({
            where: {
                userid: userId,
            },
            include: [{
                model: LearningFactTable,
                where: {
                    learningpackageid: learningPackageId,
                },
            }],
        });

        res.json(learningFacts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// Api to add a learning fact to user's deck




app.post('/api/user-learning-fact/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        // Extract data from the request body
        const {
            learningfactid,
            timesreviewed,
            confidencelevel,
            lastrevieweddate,
            startdate,
            enddate,
            finished
        } = req.body;

        // Check if a user learning fact with the same learningfactid already exists
        const existingUserLearningFact = await UserLearningFactTable.findOne({
            where: {
                userid: userId,
                learningfactid: learningfactid
            }
        });

        if (existingUserLearningFact) {

            return res.status(400).json({ error: 'User learning fact already exists for this learning fact' });
        }

        // If it doesn't exist, create a new UserLearningFact
        const newUserLearningFact = await UserLearningFactTable.create({
            userid: userId,
            learningfactid: learningfactid,
            timesreviewed: timesreviewed,
            confidencelevel: confidencelevel,
            lastrevieweddate: lastrevieweddate,
            startdate: startdate,
            enddate: enddate,
            finished: finished
        });

        res.json(newUserLearningFact);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});





app.post('/api/user-learning-package/:userId/:learningPackageId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const learningPackageId = req.params.learningPackageId;

        // Check if the entry already exists in UserPackageLearningTable
        const existingEntry = await UserPackageLearningTable.findOne({
            where: {
                userid: userId,
                learningpackageid: learningPackageId
            }
        });

        if (!existingEntry) {
            const currentDate = new Date();
            const endDate = new Date(currentDate);
            endDate.setDate(currentDate.getDate() + 15); // Actual date + 15 days

            // Add entry to UserPackageLearningTable
            await UserPackageLearningTable.create({
                userid: userId,
                learningpackageid: learningPackageId,
                startdate: currentDate,
                exceptedenddate: endDate,
                minutesperdayobjective: 10,
                finished: false
            });

            res.status(200).json({ message: 'User learning package added successfully.' });
        } else {
            res.status(400).json({ message: 'User learning package already exists.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// api put finish learning
app.put('/api/user-learning-fact/finish/:userId/:lessonId', async (req, res) => {
    const userId = req.params.userId;
    const lessonId = req.params.lessonId;

    try {
        // Mets à jour l'attribut "finished" à true dans UserLearningFactTable
        const result = await UserLearningFactTable.update(
            { finished: true },
            {
                where: {
                    userid: userId,
                    learningfactid: lessonId
                }
            }
        );

        if (result[0] === 1) {
            res.json({ success: true, message: 'Learning completed successfully.' });
        } else {
            res.status(404).json({ success: false, message: 'Learning not found.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});


//api confidence level update


app.put('/api/user-learning-fact/confidence/:userId/:lessonId', async (req, res) => {
    const userId = req.params.userId;
    const lessonId = req.params.lessonId;

    try {
        // Mets à jour l'attribut "confidencelevel" dans UserLearningFactTable
        const result = await UserLearningFactTable.update(
            { confidencelevel: req.body.confidencelevel },
            {
                where: {
                    userid: userId,
                    learningfactid: lessonId
                }
            }
        );



        if (result[0] === 1) {
            res.json({ success: true, message: 'Confidence level updated successfully.' });
        } else {
            res.status(404).json({ success: false, message: result });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

app.put('/api/user-learning-fact/update-date/:userId/:lessonId', async (req, res) => {
    const { userId, lessonId } = req.params;
    const { lastrevieweddate } = req.body;

    try {
        await UserLearningFactTable.update(
            { lastrevieweddate: lastrevieweddate, timesreviewed: sequelize.literal('timesreviewed + 1') },
            {
                where: {
                    userid: userId,
                    learningfactid: lessonId,
                }
            }
        );

        res.json({ success: true, message: 'Lastrevieweddate updated successfully.' });
    } catch (error) {
        console.error('Error updating lastrevieweddate:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
});

// Others API's

const futureDate = new Date(currentDate.getTime() + (7*24*60*60*1000));

// An API to choose which learning package we want to start with an excepted completion time of 7 days
app.post('/api/learning_package/choice',async (req : Request, res: Response) =>{
    const{userid,learningpackageid} = req.body;

    if(!userid || !learningpackageid){
        res.status(400).json({ error: 'Some fields are not provided' });
    }
    else{
        try{


            const userPackageLearning = await UserPackageLearningTable.create({
                userid: Number(userid),
                learningpackageid : Number(learningpackageid),
                startdate : currentDate,
                exceptedenddate : futureDate,
                minutesperdayobjective: 20,
            });

            const learningFact = await LearningFactTable.findOne({
                where: { packageid: learningpackageid},
            });

            if (learningFact){
                const response = {message : `The learning to begin with is ${learningFact.title}`}
                res.status(200).json(response);

            }
            else{
                const response = {message : `There is no learning fact in this package`}
                res.status(200).json(response);
            }


        }
        catch(error){
            res.status(500).json({ error: error });
        }

    }

});

// An API to start a learning session. It saves in the database the date when the fact is used for the first time and returns the next fact to train
app.post('/api/learning_session/start',async (req : Request, res: Response) =>{
    const{userid,learningfactid} = req.body;

    if(!userid || !learningfactid){
        res.status(400).json({ error: 'Some fields are not provided' });
    }
    else{
        try{


            const learningSession = await LearningSessionTable.create({
                userid: Number(userid),
                learningfactid : Number(learningfactid),
                startdate : currentDate,
                enddate: null,
                finished : false
            });

            const learningFactPackage = await LearningFactTable.findOne({where:{
                id: Number(learningfactid)}});


            const nextLearningFact = await LearningFactTable.findOne({
                where: sequelize.literal(`"LearningFactTable"."packageid" = ${Number(learningFactPackage?.learningfactid)} AND "LearningFactTable"."id" > ${Number(learningfactid)}`),
            });


            if (nextLearningFact){
                const response = {message : `The next learning fact is ${nextLearningFact.title}`}
                res.status(200).json(response);

            }
            else{
                const response = {message : `There is no next learning fact`}
                res.status(200).json(response);
            }




        }
        catch(error){
            res.status(500).json({ error: error });
        }

    }

});

//An API to end a learning session by saving the end date and turning the boolean finished on true, I tried to do a Join query to get remaining and done facts but I had several problems

app.put('/api/learning_session/end',async (req : Request, res: Response) =>{
    const{userid,learningfactid} = req.body;

    if(!userid || !learningfactid){
        res.status(400).json({ error: 'Some fields are not provided' });
    }

    try{
        const learningSession = await LearningSessionTable.findOne({
            where: { userid: userid, learningfactid : learningfactid},
        });

        if (learningSession) {
            await learningSession.update({
                finished : true,
                enddate : currentDate
            });

            const learningFactPackage = await LearningFactTable.findOne({where:{
                    id: Number(learningfactid)}});

            const allFactsForPackage = await LearningFactTable.findAll({where:
                    {learningpackageid : learningFactPackage?.learningfactid}});




            const nbFacts = allFactsForPackage.length

            if (learningFactPackage){
                const packageId = learningFactPackage.learningfactid;





                res.status(200).json({message : `User n° ${userid} finished learning fact n°${learningfactid}`});

            }else{
                const response = {message : `There is no more facts for this package`}
                res.status(200).json(response);


            }





        }
        else {
            res.status(404).json({message : 'No session with this learning fact was found for this user'});
        }


    }
    catch(error){
        res.status(500).json({ error: error });
    }





});



// Start the app server listening on port 3000
app.listen(port, () => {
    console.log(`Server is running on port ${port} sur l'URL : http://localhost:3000/api/liveness`);
});




