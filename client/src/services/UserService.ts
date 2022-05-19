import { AxiosResponse } from "axios";
import $api from "../http";
import { IUser } from "../models/IUser";
export default class UserService{

    static featchUsers():Promise<AxiosResponse<IUser[]>>{
        return $api.get<IUser[]>('/api/users')
    }
}