"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("./sequelize"));
const sequelize_2 = require("sequelize");
class UserTable extends sequelize_2.Model {
}
UserTable.init({
    userid: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true
    },
    name: {
        type: sequelize_2.DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize: sequelize_1.default,
    tableName: 'UserTable',
    timestamps: false
});
UserTable.sync({ alter: true })
    .then(() => console.log('UserTable table is up to date'))
    .catch((error) => console.error('There is an error : ', error));
exports.default = UserTable;
