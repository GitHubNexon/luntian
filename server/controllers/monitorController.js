const Monitoring = require("../models/monitoringModel");

const createMonitoring = async (req, res) => {
  try {
    const newMonitoring = await Monitoring.create(req.body);
    res.status(201).json({
      message: "Monitoring details added successfully",
      data: newMonitoring,
    });
  } catch (error) {
    console.error("Error creating monitoring details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const updateMonitoring = async (req, res) => {
  try {
    const updatedMonitoring = await Monitoring.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    res.status(200).json({
      message: "Monitoring details updated successfully",
      data: updatedMonitoring,
    });
  } catch (error) {
    console.error("Error updating monitoring details:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllMonitorings = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const keyword = req.query.keyword || "";
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder = req.query.sortOrder === "asc" ? -1 : 1;
    const date = req.query.date;
    const status = req.query.status;

    const query = {
      ...(keyword && {
        $or: [{ "$plantInfo.commonName": { $regex: keyword, $options: "i" } }],
      }),
      ...(date && {
        createdAt: {
          $gte: new Date(`${date}T00:00:00.000Z`),
          $lt: new Date(`${date}T23:59:59.999Z`),
        },
      }),
      ...(status &&
        status === "isDeleted" && {
          "Status.isDeleted": true, // Filter for deleted items
        }),
      ...(status &&
        status === "isArchived" && {
          "Status.isArchived": true, // Filter for archived items
        }),
    };

    // const sortCriteria = sortBy ? { [sortBy]: sortOrder } : {};
    const sortCriteria = {
      "Status.isDeleted": 1, // Ensure deleted items come last
      "Status.isArchived": 1, // Ensure archived items come second
      [sortBy]: sortOrder, // Sort by user-provided field and order
    };
    const totalItems = await Monitoring.countDocuments(query);
    const MonitoringData = await Monitoring.find(query)
      .sort(sortCriteria)
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
      monitoring: MonitoringData,
    });
  } catch (error) {
    console.error("Error fetching monitoring details:", error);
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

const deleteMonitorings = async (req, res) => {
  try {
    const { id } = req.params;

    const MonitoringRecords = await Monitoring.findById(id);
    if (!MonitoringRecords || !MonitoringRecords.Status) {
      return res
        .status(404)
        .json({ message: "Monitoring record or status not found" });
    }

    if (MonitoringRecords.Status.isArchived) {
      return res
        .status(400)
        .json({ message: "Cannot delete an archived Monitoring record." });
    }

    if (MonitoringRecords.Status.isDeleted) {
      return res
        .status(400)
        .json({ message: "Monitoring record is already deleted." });
    }

    const updatedMonitoring = await Monitoring.findByIdAndUpdate(
      id,
      { "Status.isDeleted": true },
      { new: true }
    );

    if (!updatedMonitoring) {
      return res.status(404).json({ message: "Monitoring record not found" });
    }

    res.status(200).json(updatedMonitoring);
  } catch (error) {
    console.error(
      "Error deleting Monitoring record:",
      error.message,
      error.stack
    );
    res.status(500).json({ message: "Error processing request" });
  }
};

const archiveMonitorings = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the Monitoring record
    const monitoringRecord = await Monitoring.findById(id);
    if (!monitoringRecord || !monitoringRecord.Status) {
      return res
        .status(404)
        .json({ message: "Monitoring record or status not found" });
    }

    // Check if already archived
    if (monitoringRecord.Status.isArchived) {
      return res
        .status(400)
        .json({ message: "Monitoring record is already archived." });
    }

    // Check if the record is deleted
    if (monitoringRecord.Status.isDeleted) {
      return res
        .status(400)
        .json({ message: "Cannot archive a deleted monitoring record." });
    }

    // Update isArchived field to true within Status
    const updatedMonitoring = await Monitoring.findByIdAndUpdate(
      id,
      { "Status.isArchived": true }, // Correct nested path
      { new: true }
    );

    if (!updatedMonitoring) {
      return res.status(404).json({ message: "Monitoring record not found" });
    }

    res.status(200).json(updatedMonitoring);
  } catch (error) {
    console.error(
      "Error archiving Monitoring record:",
      error.message,
      error.stack
    );
    res.status(500).json({ message: "Error processing request" });
  }
};
const undoDeleteMonitorings = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the monitoring record
    const monitoringRecord = await Monitoring.findById(id);
    if (!monitoringRecord || !monitoringRecord.Status) {
      return res
        .status(404)
        .json({ message: "Monitoring record or status not found" });
    }

    // Check if already not deleted
    if (!monitoringRecord.Status.isDeleted) {
      return res
        .status(400)
        .json({ message: "Monitoring record is not deleted." });
    }

    // Update isDeleted field to false within Status
    const updatedMonitoring = await Monitoring.findByIdAndUpdate(
      id,
      { "Status.isDeleted": false }, // Correct nested path
      { new: true }
    );

    if (!updatedMonitoring) {
      return res.status(404).json({ message: "Monitoring record not found" });
    }

    res.status(200).json(updatedMonitoring);
  } catch (error) {
    console.error(
      "Error undoing delete of monitoring record:",
      error.message,
      error.stack
    );
    res.status(500).json({ message: "Error processing request" });
  }
};

const undoArchiveMonitorings = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the monitoring record
    const monitoringRecord = await Monitoring.findById(id);
    if (!monitoringRecord || !monitoringRecord.Status) {
      return res
        .status(404)
        .json({ message: "Monitoring record or status not found" });
    }

    // Check if already not archived
    if (!monitoringRecord.Status.isArchived) {
      return res
        .status(400)
        .json({ message: "Monitoring record is not archived." });
    }

    // Check if the record is deleted
    if (monitoringRecord.Status.isDeleted) {
      return res.status(400).json({
        message: "Cannot undo archive for a deleted monitoring record.",
      });
    }

    // Update isArchived field to false within Status
    const updatedMonitoring = await Monitoring.findByIdAndUpdate(
      id,
      { "Status.isArchived": false }, // Correct nested path
      { new: true }
    );

    if (!updatedMonitoring) {
      return res.status(404).json({ message: "Monitoring record not found" });
    }

    res.status(200).json(updatedMonitoring);
  } catch (error) {
    console.error(
      "Error undoing archive of monitoring record:",
      error.message,
      error.stack
    );
    res.status(500).json({ message: "Error processing request" });
  }
};

module.exports = {
  createMonitoring,
  updateMonitoring,
  getAllMonitorings,
  deleteMonitorings,
  archiveMonitorings,
  undoDeleteMonitorings,
  undoArchiveMonitorings,
};
