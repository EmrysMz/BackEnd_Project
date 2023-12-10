"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("./sequelize"));
const sequelize_2 = require("sequelize");
const LearningFact_1 = __importDefault(require("./LearningFact"));
const User_1 = __importDefault(require("./User"));
const UserLearningFact_1 = __importDefault(require("./UserLearningFact"));
class LearningSessionTable extends sequelize_2.Model {
}
LearningSessionTable.init({
    userid: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true
    },
    learningfactid: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true,
    },
    startdate: {
        type: sequelize_2.DataTypes.DATE,
        allowNull: false,
    },
    enddate: {
        type: sequelize_2.DataTypes.DATE,
        allowNull: true,
    },
    finished: {
        type: sequelize_2.DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    sequelize: sequelize_1.default,
    tableName: 'LearningSessionTable',
    timestamps: false
});
UserLearningFact_1.default.belongsTo(LearningFact_1.default, {
    foreignKey: "learningfactid",
});
UserLearningFact_1.default.belongsTo(User_1.default, {
    foreignKey: "userid",
});
LearningSessionTable.sync({ alter: true })
    .then(() => console.log('LearningSessionTable table is up to date'))
    .catch((error) => console.error('There is an error : ', error));
exports.default = LearningSessionTable;
