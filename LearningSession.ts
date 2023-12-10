import sequelize from "./sequelize";
import {Model, DataTypes} from "sequelize";
import LearningFactTable from "./LearningFact";
import UserTable from "./User";
import UserLearningFactTable from "./UserLearningFact";



class LearningSessionTable extends Model{
    public userid!: number;
    public learningfactid!: number;
    public startdate!: Date;
    public enddate!: Date;
    public finished!: Boolean;

}

LearningSessionTable.init(
    {
        userid: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        learningfactid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        startdate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        enddate: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        finished: {
            type: DataTypes.BOOLEAN,
            allowNull:false

        }



    },
    {
        sequelize,
        tableName: 'LearningSessionTable',
        timestamps: false
    }
);


UserLearningFactTable.belongsTo(LearningFactTable, {
    foreignKey: "learningfactid",
});

UserLearningFactTable.belongsTo(UserTable,{
    foreignKey:"userid",
})



LearningSessionTable.sync({alter:true})
    .then(()=>console.log('LearningSessionTable table is up to date'))
    .catch((error : Error)=> console.error('There is an error : ',error))



export default LearningSessionTable




