import { Request, Response } from "express"
import { UsersService } from "../services/user.service"


const getUsers = (req: Request, res: Response) => {
    res.json( UsersService.users )
}

const getUserById = (req: Request, res: Response) => {

    const { id } = req.params;

    const user = UsersService.getUserById(id);

    if (!user) {
        return res.status(404).json({
            msg: 'User not found'
        })
    }

    res.json(user);

}

export const UsersController = {
    getUsers, 
    getUserById

}