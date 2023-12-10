import sequelize from "./sequelize";
import {Model, DataTypes} from "sequelize";

class LearningPackageTable extends Model{
    public learningpackageid!: number;
    public title!: string;
    public description!:string;
    public category!: string;
    public targetaudience !: string;
    public difficulty !: number;
}

LearningPackageTable.init(
    {
        learningpackageid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        category:{
            type: DataTypes.STRING,
            allowNull : false,
        },
        targetaudience:{
            type: DataTypes.STRING,
            allowNull : false,
        },
        difficulty:{
            type: DataTypes.INTEGER,
            allowNull : false,
        }

    },
    {
        sequelize,
        tableName: 'LearningPackageTable',
        timestamps: false
    }
);

LearningPackageTable.sync({alter:true})
    .then(()=>console.log('LearningPackage table is up to date'))
    .catch((error : Error)=> console.error('There is an error : ',error))



export default LearningPackageTable




