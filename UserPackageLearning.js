"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("./sequelize"));
const sequelize_2 = require("sequelize");
const LearningPackage_1 = __importDefault(require("./LearningPackage"));
const User_1 = __importDefault(require("./User"));
class UserPackageLearningTable extends sequelize_2.Model {
}
UserPackageLearningTable.init({
    userid: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true
    },
    learningpackageid: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true,
    },
    startDate: {
        type: sequelize_2.DataTypes.DATE,
        allowNull: false,
    },
    exceptedEndDate: {
        type: sequelize_2.DataTypes.DATE,
        allowNull: false,
    },
    minutesPerDayObjective: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false
    },
    finished: {
        type: sequelize_2.DataTypes.BOOLEAN,
        allowNull: false,
    }
}, {
    sequelize: sequelize_1.default,
    tableName: 'UserPackageLearningTable',
    timestamps: false
});
UserPackageLearningTable.belongsTo(LearningPackage_1.default, {
    foreignKey: "learningpackageid",
});
UserPackageLearningTable.belongsTo(User_1.default, {
    foreignKey: "userid",
});
UserPackageLearningTable.sync({ alter: true })
    .then(() => console.log('UserPackageLearningTable table is up to date'))
    .catch((error) => console.error('There is an error : ', error));
exports.default = UserPackageLearningTable;
