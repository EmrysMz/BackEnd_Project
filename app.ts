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
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, GET, POST, OPTIONS, DELETE, PUT');
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

    const { id, title, description, category, targetaudience, difficulty } = req.body;

    if (!id || !title || !description || !category || !targetaudience || !difficulty) {
        res.status(400).json({ error: `Some fields are not provided ${req.body}` });
    } else {
        const learningPackage = await LearningPackageTable.findByPk(id)

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

// post : to create a fact with the package id parameter in the URL
app.post('/api/package/:id/fact', async (req: Request, res: Response) => {
    const { title, description} = req.body;
    const packageId = parseInt(req.params.id)

    if (!title || !description ) {
        res.status(400).json({ error: 'Some fields are not provided' });
    } else {
        try {
            const rowsNb = await LearningFactTable.count();
            const factId = rowsNb + 1;

            const learningFact = await LearningFactTable.create({
                id: factId,
                title,
                description,
                packageid: Number(packageId),
            });


            res.status(200).json(learningFact);
        } catch (error) {

            res.status(500).json({ error: error });
        }
    }
});

// update an existing fact with the id in body and package id in url parameter
app.put('/api/package/:id/fact', async (req: Request, res: Response) => {
    const { title, description, id} = req.body;
    const packageId = parseInt(req.params.id);

    if (!title || !description) {
        res.status(400).json({ error: 'Some fields are not provided' });
    } else {
        try {
            const learningFact = await LearningFactTable.findOne({
                where: { packageid: packageId, id: id },
            });

            if (learningFact) {
                await learningFact.update({
                    title,
                    description,
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

// delete an existing fact by disabling it with a boolean
app.delete('/api/package/:id/fact', async (req: Request, res: Response) => {
    const {id} = req.body;
    const packageId = parseInt(req.params.id);

    if (!id) {
        res.status(400).json({ error: 'Some fields are not provided' });
    } else {
        try {
            const learningFact = await LearningFactTable.findOne({
                where: { packageid: packageId, id: id },
            });

            if (learningFact) {
                await learningFact.update({
                    disable : true
                });

                res.status(200).json({message: `The fact ${id} has been disabled`});
            } else {
                res.status(404).json({message : 'No fact with this package id was found'});
            }
        } catch (error) {
            console.error('An error occurred while deleting the fact:', error);
            res.status(500).json({ error: error });
        }
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
                    {packageid : learningFactPackage?.learningfactid}});




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




