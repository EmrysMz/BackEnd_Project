import sequelize from "./sequelize";
import {Model, DataTypes} from "sequelize";

class UserTable extends Model{
    public userid!: number;
    public name!: string;
}

UserTable.init(
    {
        userid: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: 'UserTable',
        timestamps: false
    }
);



UserTable.sync({alter:true})
    .then(()=>console.log('UserTable table is up to date'))
    .catch((error : Error)=> console.error('There is an error : ',error))



export default UserTable




