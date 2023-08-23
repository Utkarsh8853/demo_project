import { Model, DataTypes } from 'sequelize';
import sequelize from '../../postgres.db';
import User from './seller.model';

class Address extends Model {
  public id!: string;
  public house_no!: string;
  public street_no!: string;
  public area!: string;
  public city!: string;
  public state!: string;
  public country!: string;
  public zip_code!: string;
  public user_type!: string;
  public user_id!: string;
}
Address.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    house_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    street_no: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    area: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zip_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_type: {
      type: DataTypes.ENUM,
      values: ['buyer', 'seller'],
      allowNull: false,
    },
    user_id: {
        type: DataTypes.STRING,
        allowNull: false,
        references: { 
            model: User,
            key: 'id'
        }
      }
  },
  {
    timestamps:true,
    sequelize,
    tableName: 'address',
  },
);
User.hasMany(Address);
Address.belongsTo(User, {foreignKey: 'user_id'})
Address.sync();
export default Address;