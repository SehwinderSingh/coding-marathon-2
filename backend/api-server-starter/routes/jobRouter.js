const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const {
  getAllJobs,
  createJob,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobControllers");

router.get("/", getAllJobs);
router.get("/:jobId", getJobById);

router.use(requireAuth);
router.post("/", createJob);
router.put("/:jobId", updateJob);
router.delete("/:jobId", deleteJob);

module.exports = router;