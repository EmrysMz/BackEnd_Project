"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("./sequelize"));
const sequelize_2 = require("sequelize");
class TestTable extends sequelize_2.Model {
}
TestTable.init({
    testid: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true
    }
}, {
    sequelize: sequelize_1.default,
    tableName: 'TestTable',
    timestamps: false
});
TestTable.sync({ alter: true })
    .then(() => console.log('TestTable table is up to date'))
    .catch((error) => console.error('There is an error : ', error));
exports.default = TestTable;
