import {Router} from 'express';
import {shortenUrl} from '../controllers/urls.controller.js';
import { urlSchemaValidation } from '../middlewares/urls.middleware.js';

const urlRouter = Router()


urlRouter.post("/urls/shorten", urlSchemaValidation, shortenUrl)
//urlRouter.get("/urls/:id", )
//urlRouter.get("/urls/open/:shortUrl", )
//urlRouter.delete("/urls/:id", )


export default urlRouter;