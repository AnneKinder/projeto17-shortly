import { Router } from "express";
import { myProfile } from "../controllers/user.controller.js";

const userRouter = Router()

userRouter.get("/users/me", myProfile)


export default userRouter;