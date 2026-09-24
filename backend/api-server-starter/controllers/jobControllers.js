const mongoose = require("mongoose");
const Job = require("../models/jobModel");

const getAllJobs = async (req, res) => {
  try {
    const limit = parseInt(req.query._limit);
    const jobs = limit
      ? (await Job.find({})).sort({ createdAt: -1 }).limit(limit)
      : (await Job.find({})).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Failed to get jobs" });
  }
};

const createJob = async (req, res) => {
  try {
    const newJob = await Job.create({...req.body});
    res.status(201).json(newJob);
  } catch (error) {
    res.status(400).json({ message: "Failed to create job",error });
  }
};

const getJobById = async (req, res) => {
    const {jobId} = req.params;
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ message: "Invalid job id" });
    }
  try {
    const newJob = await Job.findById(jobId);
    if (!job )res.status(200).json(job);
  } catch (error) {
    res.status(500).json({ message: "Failed to get job by id" });
  }
};

const updateJob = async (req, res) => {
    const {jobId} = req.params;
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ message: "Invalid job id" });
    }
    try {
    const updatedJob = await Job.findByIdAndUpdate(jobId, req.body, {new: true, runValidators: true});
    if (!updatedJob) return res.status(404).json({ message: "Job not found" });
    res.status(200).json(updatedJob);
  } catch (error) {
    res.status(500).json({ message: "Failed to update job" });
  }
};

const deleteJob = async (req, res) => {
    const {jobId} = req.params;
    if (!mongoose.Types.ObjectId.isValid(jobId)) {
        return res.status(400).json({ message: "Invalid job id" });
    }
    try {
    const deleteJob = await Job.findOneByIdAndDelete(jobId);
    if (!deletejob) return res.status(404).json({ message: "Job not found" });
    res.status(204).json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete job" });
  }
};

module.exports = {
  getAllJobs,
  createJob,
  getJobById,
  updateJob,
  deleteJob,
};