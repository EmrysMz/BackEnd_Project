"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = __importDefault(require("./sequelize"));
const sequelize_2 = require("sequelize");
const LearningFact_1 = __importDefault(require("./LearningFact"));
const User_1 = __importDefault(require("./User"));
class UserLearningFactTable extends sequelize_2.Model {
}
UserLearningFactTable.init({
    userid: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true
    },
    learningfactid: {
        type: sequelize_2.DataTypes.INTEGER,
        primaryKey: true,
    },
    timesreviewed: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false,
    },
    confidencelevel: {
        type: sequelize_2.DataTypes.INTEGER,
        allowNull: false,
    },
    lastrevieweddate: {
        type: sequelize_2.DataTypes.DATE,
        allowNull: false,
    },
    startdate: {
        type: sequelize_2.DataTypes.DATE,
        allowNull: false,
    },
    enddate: {
        type: sequelize_2.DataTypes.DATE,
        allowNull: false,
    },
    finished: {
        type: sequelize_2.DataTypes.BOOLEAN,
        allowNull: false,
    }
}, {
    sequelize: sequelize_1.default,
    tableName: 'UserLearningFactTable',
    timestamps: false
});
UserLearningFactTable.belongsTo(LearningFact_1.default, {
    foreignKey: "learningfactid",
});
UserLearningFactTable.belongsTo(User_1.default, {
    foreignKey: "userid",
});
UserLearningFactTable.sync({ alter: true })
    .then(() => console.log('UserLearningFactTable table is up to date'))
    .catch((error) => console.error('There is an error : ', error));
exports.default = UserLearningFactTable;
