import { Model, DataTypes } from 'sequelize';
import sequelize from '../../postgres.db';

class Admin extends Model {
  public id!: string;
  public name!: string;
  public email!: string;
  public password!: string;
  public ph_no!: string;
}
Admin.init(
  {
    id: {
      type: DataTypes.STRING,
      autoIncrement:true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    ph_no: {
      type: DataTypes.STRING,
      allowNull: false
    },
  },
  {
    sequelize,
    tableName: 'admin',
  },
);
Admin.sync();
export default Admin;