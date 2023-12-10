import sequelize from "./sequelize";
import {Model, DataTypes} from "sequelize";

class TestTable extends Model{
    public testid!: number;


}

TestTable.init(
    {
        testid: {
            type: DataTypes.INTEGER,
            primaryKey: true
        }



    },
    {
        sequelize,
        tableName: 'TestTable',
        timestamps: false
    }
);

TestTable.sync({alter:true})
    .then(()=>console.log('TestTable table is up to date'))
    .catch((error : Error)=> console.error('There is an error : ',error))



export default TestTable




