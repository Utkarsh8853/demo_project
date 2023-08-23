import { Model, DataTypes } from 'sequelize';
import sequelize from '../../postgres.db';

class Buyer extends Model {
  public id!: string;
  public name!: string;
  public email?: string;
  public password?: string;
  public ph_no?: string;
}

 Buyer.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ph_no: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    timestamps:true,
    sequelize,
    tableName: 'buyers',
  },
);
Buyer.sync();
export default Buyer;