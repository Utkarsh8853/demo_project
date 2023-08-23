import { Sequelize } from "sequelize";
import { databaseConfig } from "../../envConfig";

const sequelize = new Sequelize(databaseConfig.DATABASE, databaseConfig.USERNAME, databaseConfig.PASSWORD, {
    host: databaseConfig.HOST,
    dialect: 'postgres'
  });

  export default sequelize;