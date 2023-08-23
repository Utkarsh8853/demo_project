import { Model, DataTypes } from 'sequelize';
import sequelize from '../../postgres.db';

class Seller extends Model {
  public id!: string;
  public name!: string;
  public email?: string;
  public password?: string;
  public admin_approval!: boolean;
  public ph_no?: string;
}

Seller.init(
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
    admin_approval: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
    ph_no: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  },
  {
    timestamps:true,
    sequelize,
    tableName: 'sellers',
  },
);
Seller.sync();
export default Seller;