import categoryModel from "../database/models/mongoDB/category.model";
import sellersModel from "../database/models/mongoDB/sellers.model";
import Buyer from "../database/models/postgresSQL/buyer.model";
import Seller from "../database/models/postgresSQL/seller.model";

class AdminService {

  async findCategory (id:string) {
    const result = await categoryModel.findOne({_id:id})
    return result;
  }

  async findCategoryByName (name:string) {
      const result = await categoryModel.findOne({name:name})
      return result;
  }

  async createCategory (name: string) {
    const addCategory:any = await categoryModel.create({name: name});
    console.log(addCategory);
  }

  async updateCategory (name:string,id: string) {
    await categoryModel.updateOne({ _id: id }, { $set: { name: name } });
  }

  async deleteCategory (id: string) {
      await categoryModel.deleteOne({_id:id});
  }

  async getSeller (id:string) {
    const result = await sellersModel.findOne({_id:id})
    return result;
  }

  async updateSellerStatus (id:string) {
    await sellersModel.updateOne({ _id: id }, { $set: { admin_approval: true } });
  }

  async findAllSellers () {
    const sellers = await Seller.findAll();
    return sellers;
  }

  async findAllBuyers () {
      const buyers = await Buyer.findAll();
      return buyers;
  }

  async removeAccount (user_id: string) {
    await sellersModel.deleteOne({_id:user_id})
  }
}
export const adminService = new AdminService()