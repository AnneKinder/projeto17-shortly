import {Router} from 'express';
import {deleteUrlById, getUrlById, openUrl, shortenUrl} from '../controllers/urls.controller.js';
import { urlSchemaValidation } from '../middlewares/urls.middleware.js';

const urlRouter = Router()


urlRouter.post("/urls/shorten", urlSchemaValidation, shortenUrl)
urlRouter.get("/urls/:id", getUrlById)
urlRouter.get("/urls/open/:shortUrl", openUrl)
urlRouter.delete("/urls/:id", deleteUrlById )


export default urlRouter;