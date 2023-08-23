import bcrypt from 'bcrypt';
import client from "../database/redis.db";
import Session from "../database/models/postgresSQL/session.model";

class UserDashboardService {

    async updateUserProfile (model:any,field:any,user_id: string) {
        const userDetail = await model.updateOne({_id:user_id},{$set: {name:field.name,email:field.email,ph_no:field.ph_no}});
        return userDetail
    }

    async addressEntry (model:any,field:any,user_id: string) {
        const addAddress = await model.updateOne({_id:user_id},{$push: {address: {house_no: field.house_no,street_no:field.street_no, area:field.area,city:field.city,state:field.state,zip_code:field.zip_code}}});return addAddress;
    }

    async updatePwd (model:any,user_id: string, password: string) {
        const hashPwd = await bcrypt.hash(password,3);
        await model.updateOne({_id:user_id},{$set: {password:hashPwd}});
    }

    async findAddress (model:any,user_id: string, address_id: string) {
        const address = await model.findOne({_id:user_id,'address._id':address_id})
        return address;
    }

    async updateUserAddress (model:any,field:any,user_id: string) {
        await model.updateOne({_id:user_id,'address._id':field._id},{$set:{'address.$.house_no': field.house_no,"address.$.street_no":field.street_no, "address.$.area":field.area,"address.$.city":field.city,"address.$.state":field.state,"address.$.zip_code":field.zip_code}},{new:true});
    }

    async deleteUserAddress (model:any,address_id: string,user_id: string) {
        await model.updateOne({_id:user_id},{$pull: {address: {_id:address_id}}})
    }

    async userAllAddress (model:any,user_id: string) {
        const result = await model.find({_id: user_id},{address:1,_id: 0});
        return result;
    }

    async viewUserProfile (model:any,user_id: string) {
        const result = await model.findOne({_id:user_id})
        return result
    }

    async removeAccount (model:any,user_id: string, session_id: number) {
        await model.deleteOne({_id:user_id})
        await Session.update({isActive: false,},{where: {id:session_id}});
        await client.del(`${user_id}_${session_id}`)
        // try {
        //     await Promise.all([
        //         Address.destroy({ where: { user_id: user_id } }),
        //         Product.destroy({ where: { user_id: user_id } }),
        //         Image.destroy({ where: { user_id: user_id } })
        //     ]);
        // } catch (error) {}
    }
}
export const userDashboardervice = new UserDashboardService()