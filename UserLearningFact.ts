import sequelize from "./sequelize";
import {Model, DataTypes} from "sequelize";
import LearningFactTable from "./LearningFact";
import UserTable from "./User";


class UserLearningFactTable extends Model{
    public userid!: number;
    public learningfactid!: number;
    public timesreviewed!: number;
    public confidencelevel!: number;
    public lastrevieweddate!: Date;
    public startdate!: Date;
    public enddate!: Date;
    public finished!: boolean;



}

UserLearningFactTable.init(
    {
        userid: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        learningfactid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        timesreviewed: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        confidencelevel: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        lastrevieweddate: {
            type: DataTypes.DATE,
            allowNull:false,

        },
        startdate:{
            type: DataTypes.DATE,
            allowNull:false,
        },
        enddate:{
            type: DataTypes.DATE,
            allowNull:true,
        },
        finished:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
        }




    },
    {
        sequelize,
        tableName: 'UserLearningFactTable',
        timestamps: false
    }
);


UserLearningFactTable.belongsTo(LearningFactTable, {
    foreignKey: "learningfactid",
});

UserLearningFactTable.belongsTo(UserTable,{
    foreignKey:"userid",
})




UserLearningFactTable.sync({alter:true})
    .then(()=>console.log('UserLearningFactTable table is up to date'))
    .catch((error : Error)=> console.error('There is an error : ',error))



export default UserLearningFactTable




