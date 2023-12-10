import sequelize from "./sequelize";
import {Model, DataTypes} from "sequelize";
import LearningPackageTable from "./LearningPackage";


class LearningFactTable extends Model{
    public learningfactid!: number;
    public title!: string;
    public description!:string;
    public content!: string;
    public learningpackageid!: number;
    public disable!: boolean;

}

LearningFactTable.init(
    {
        learningfactid: {
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
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        learningpackageid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        disable: {
            type: DataTypes.BOOLEAN,
            primaryKey: false,
        }


    },
    {
        sequelize,
        tableName: 'LearningFactTable',
        timestamps: false
    }
);

LearningFactTable.belongsTo(LearningPackageTable, {
    foreignKey: "learningpackageid",
});

LearningFactTable.sync({alter:true})
    .then(()=>console.log('LearningFact table is up to date'))
    .catch((error : Error)=> console.error('There is an error : ',error))



export default LearningFactTable




