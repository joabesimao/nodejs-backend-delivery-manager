import { RegisterModel } from "../../../../domain/models/register/register-model";
import { AddProduct,AddProductModel } from "../../../../domain/usescases/product/add-product/add-product";
import { Product} from "../../../usescases/product-usecases/add-product-usecase/db-add-product-protocols";


export interface AddProductRepository {
  add(dataInfo: AddProductModel): Promise<Product>;
}
