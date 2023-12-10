import {Sequelize} from "sequelize";

const sequelize = new Sequelize({
    database : 'LearningFactDb',
    username : 'learningDbUser',
    password : 'learningDbUser',
    host : 'localhost',
    dialect : 'postgres',
})


export default sequelize