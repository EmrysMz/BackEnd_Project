"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("./sequelize"));
const sequelize_2 = require("sequelize");
const LearningPackage_1 = __importDefault(require("./LearningPackage"));
class LearningFactTable extends sequelize_2.Model {
}
LearningFactTable.init({
    learningfactid: {
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
    content: {
        type: sequelize_2.DataTypes.STRING,
        allowNull: false,
    },
    question: {
        type: sequelize_2.DataTypes.STRING,
        allowNull: true,
    },
    answer: {
        type: sequelize_2.DataTypes.STRING,
        allowNull: true,
    },
    learningpackageid: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true,
    },
    disable: {
        type: sequelize_2.DataTypes.BOOLEAN,
        primaryKey: false,
    }
}, {
    sequelize: sequelize_1.default,
    tableName: 'LearningFactTable',
    timestamps: false
});
LearningFactTable.belongsTo(LearningPackage_1.default, {
    foreignKey: "learningpackageid",
});
LearningFactTable.sync({ alter: true })
    .then(() => console.log('LearningFact table is up to date'))
    .catch((error) => console.error('There is an error : ', error));
exports.default = LearningFactTable;
