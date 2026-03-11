// TODO: define URL routes here
import { Router } from "express"
import {
  createShortUrl,
  getMyUrls,
  updateUrl,
  deleteUrl
} from "./url.controller"

import {authenticate} from "../../middleware/authenticate"
import { validateUrl } from "../../middleware/validateUrl"

const router = Router()

// Create short URL
router.post(
    "/",
    authenticate,
    validateUrl,
    createShortUrl
  )

// Get all URLs created by logged-in user
router.get("/my", authenticate, getMyUrls)


// Delete a URL
router.delete("/:id", authenticate, deleteUrl)

// Update a URL
router.put("/:id", authenticate, updateUrl)
export default router