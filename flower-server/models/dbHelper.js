import mysql from "mysql2"
import Sequelize from "sequelize"
import UserModel from "./UserModel"
import MemoModel from "./MemoModel"
import ProjectModel from "./ProjectModel"
import ProjectUserModel from "./ProjectUserModel"
import ShareKeyModel from "./ShareKeyModel"

export class DbHelper {
    constructor() {
        this.sequelize;
        this.userDao;
        this.memoDao;
        this.projectDao;
        this.projectUserDao;
        this.shareKeyDao;
    }
    async createDB(config) {
        let connection = await mysql.createConnection({
            host: config.host,
            port: config.port,
            user: config.user,
            password: config.password,
        }).promise();
        await connection.query(`DROP DATABASE IF EXISTS ${config.database};`);
        await connection.query(`CREATE DATABASE IF NOT EXISTS ${config.database};`);
        await connection.close();
    }
    async connect(config) {
        this.sequelize = new Sequelize(config.database, config.user, config.password, {
            host: config.host,
            dialect: config.dialect,
            dialectModule: mysql,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            },
            logging: false,
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
        await this.sequelize.authenticate();
    };

    async disconnect() {
        await this.sequelize.close();
    }

    init() {
        this.userDao = UserModel.init(this.sequelize);
        this.projectDao = ProjectModel.init(this.sequelize);
        this.memoDao = MemoModel.init(this.sequelize);
        this.projectUserDao = ProjectUserModel.init(this.sequelize);
        this.shareKeyDao = ShareKeyModel.init(this.sequelize);

        ProjectModel.hasMany(ProjectUserModel, { foreignKey: "projectId", sourceKey: "projectId" });
        UserModel.hasMany(ProjectUserModel, { foreignKey: "userId", sourceKey: "userId" });
        ProjectUserModel.belongsTo(ProjectModel, { foreignKey: "projectId" });
        ProjectUserModel.belongsTo(UserModel, { foreignKey: "userId" });
        
        ProjectModel.hasMany(MemoModel, { foreignKey: "projectId", sourceKey: "projectId" });
        MemoModel.belongsTo(ProjectModel, { foreignKey: "projectId" });

        ProjectModel.hasMany(ShareKeyModel, { foreignKey: "projectId", sourceKey: "projectId" });
        ShareKeyModel.belongsTo(ProjectModel, { foreignKey: "projectId" });

    }

    async migrate(force) {
        if (force == true) {
            await this.sequelize.sync({ force: true });
        }
        else {
            await this.sequelize.sync();
        }
    }
    getSequelize(){
        return this.sequelize;
    }
    getUserDao() {
        return this.userDao;
    }
    getMemoDao() {
        return this.memoDao;
    }
    getProjectDao(){
        return this.projectDao;
    }
    getProjectUserDao(){
        return this.projectUserDao;
    }
    getShareKeyDao(){
        return this.shareKeyDao;
    }
}