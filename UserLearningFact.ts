import sequelize from "./sequelize";
import {Model, DataTypes} from "sequelize";
import LearningFactTable from "./LearningFact";
import UserTable from "./User";


class UserLearningFactTable extends Model{
    public userid!: number;
    public learningpackageid!: number;
    public timesReviewed!: number;
    public confidenceLevel!: number;
    public lastReviewedDate!: Date;
    public startDate!: Date;
    public endDate!: Date;
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
        timesReviewed: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        confidenceLevel: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        lastReviewedDate: {
            type: DataTypes.DATE,
            allowNull:false,

        },
        startDate:{
            type: DataTypes.DATE,
            allowNull:false,
        },
        endDate:{
            type: DataTypes.DATE,
            allowNull:false,
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




