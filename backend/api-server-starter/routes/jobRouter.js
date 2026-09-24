const express = require("express");
const router = express.Router();
const {
  getAllJobs,
  createJob,
  getJobById,
  updateJob,
  deleteJob,
} = require("../controllers/jobControllers");

router.get("/", getAllJobs);
router.post("/", createJob);
router.get("/:jobId", getJobById);
router.put("/:jobId", updateJob);
router.delete("/:jobId", deleteJob);

module.exports = router;