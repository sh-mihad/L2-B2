import { Router } from "express";
import authMiddleware from "../../middleware/auth";
import { userRoleMiddleware } from "../../middleware/userRole";
import { issueController } from "./issue.controller";

const router = Router()

router.post('/',authMiddleware,userRoleMiddleware,issueController.createIssue)


export const issueRoute = router