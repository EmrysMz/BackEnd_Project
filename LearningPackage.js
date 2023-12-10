"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("./sequelize"));
const sequelize_2 = require("sequelize");
class LearningPackageTable extends sequelize_2.Model {
}
LearningPackageTable.init({
    learningpackageid: {
        type: sequelize_2.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    title: {
        type: sequelize_2.DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: sequelize_2.DataTypes.STRING,
        allowNull: false,
    },
    category: {
        type: sequelize_2.DataTypes.STRING,
        allowNull: false,
    },
    targetaudience: {
        type: sequelize_2.DataTypes.STRING,
        allowNull: false,
    },
    difficulty: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    sequelize: sequelize_1.default,
    tableName: 'LearningPackageTable',
    timestamps: false
});
LearningPackageTable.sync({ alter: true })
    .then(() => console.log('LearningPackage table is up to date'))
    .catch((error) => console.error('There is an error : ', error));
exports.default = LearningPackageTable;
