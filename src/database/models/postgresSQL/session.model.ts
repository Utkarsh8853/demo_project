import { Model, DataTypes } from 'sequelize';
import sequelize from '../../postgres.db';

class Session extends Model {
  public id!: number;
  public user_id!: string;
  public device_id!: string;
  public device_type!: string;
  public isActive!: boolean;
}

Session.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    device_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    device_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    }
  },
  {
    timestamps:true,
    sequelize,
    tableName: 'session',
  },
);
Session.sync();
export default Session;




// import { Schema, model, Document, Types } from 'mongoose';
// import user from './user.model';

// // post schema
// interface Session extends Document {
//   user_id: Types.ObjectId;
//   device_type: string;
//   device_id: string;
// }

// const sessionSchema = new Schema<Session>({
//   user_id: {
//     type: Schema.Types.ObjectId,
//     ref: user,
//     required: true
//   },
//   device_type: {
//     type: String,
//     required: true
//   },
//   device_id: {
//     type: String,
//     required: true
//   }
// },{timestamps: { createdAt: 'created_at'}});
// export default model<Session>('Session', sessionSchema);
