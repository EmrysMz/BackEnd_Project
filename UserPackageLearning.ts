import sequelize from "./sequelize";
import {Model, DataTypes} from "sequelize";
import LearningPackageTable from "./LearningPackage";
import UserTable from "./User";


class UserPackageLearningTable extends Model{
    public userid!: number;
    public learningpackageid!: number;
    public startdate!: Date;
    public exceptedenddate!: Date;
    public minutesperdayobjective!: number;
    public finished!: boolean;

}

UserPackageLearningTable.init(
    {
        userid: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        learningpackageid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        startdate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        exceptedenddate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        minutesperdayobjective: {
            type: DataTypes.INTEGER,
            allowNull:false

        },
        finished:{
            type:DataTypes.BOOLEAN,
            allowNull:false,
        }



    },
    {
        sequelize,
        tableName: 'UserPackageLearningTable',
        timestamps: false
    }
);


UserPackageLearningTable.belongsTo(LearningPackageTable, {
    foreignKey: "learningpackageid",
});

UserPackageLearningTable.belongsTo(UserTable,{
    foreignKey:"userid",
})




UserPackageLearningTable.sync({alter:true})
    .then(()=>console.log('UserPackageLearningTable table is up to date'))
    .catch((error : Error)=> console.error('There is an error : ',error))



export default UserPackageLearningTable




