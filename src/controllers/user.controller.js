import {
    getAllUserService,
    getUserByIdService,
    getUserByEmailService,
    createUserService,
    updateUserService,
    deleteUserService,
} from "../services/user.service.js";

export async function getAllUsersController(req, res, next) {
    try {
        const users = await getAllUserService();
        res.status(200).json({
            success: true,
            data: users,
        });
    } catch (err) {
        next(err);
    }
}

export async function getUserByIdController(req, res, next) {
    try {
        const user = await getUserByIdService(req.params.id);
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        next(err);
    }
}

export async function getUserByEmailController(req, res, next) {
    try {
        const user = await getUserByEmailService(req.params.email);
        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        next(err);
    }
}

export async function createUserController(req, res, next) {
    try {
        const user = await createUserService(req.body);
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: user,
        });
    } catch (err) {
        next(err);
    }
}

export async function updateUserController(req, res, next) {
    try {
        const user = await updateUserService(req.params.id, req.body);
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: user,
        });
    } catch (err) {
        next(err);
    }
}

export async function deleteUserController(req, res, next) {
    try {
        const user = await deleteUserService(req.params.id);
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: user,
        });
    } catch (err) {
        next(err);
    }
}
