import Member from "./member_model.js";

class MemberController {
  static addMember = async (req, res) => {
    if (!req.body.firstName || !req.params.branchId) {
      return res.status(400).send({
        status: "failed",
        message: "Required fields missing",
      });
    }

    try {
      var data = req.body;
      data.branch = req.params.branchId;
      const member = await Member.create(data);

      return res.status(200).send({
        status: "success",
        data: member,
        message: "Member added successfully",
      });
    } catch (e) {
      return res.status(500).send({ status: "failed", message: e.message });
    }
  };

  static getAllMembers = async (req, res) => {
    try {
      const members = await Member.find();
      return res.status(200).send({
        status: "success",
        data: members,
        message: "Members fetched successfully",
      });
    } catch (e) {
      return res.status(500).send({
        status: "failed",
        message: "Internal server error",
      });
    }
  };

  static getMembers = async (req, res) => {
    try {
      if (!req.params.branchId)
        return res.status(400).send({
          status: "failed",
          message: "Required fields missing",
        });

      const members = await Member.find({ branch: req.params.branchId });
      return res.status(200).send({
        status: "success",
        data: members,
        message: "Members fetched successfully",
      });
    } catch (e) {
      return res
        .status(500)
        .send({ status: "failed", message: "Internal server error" });
    }
  };

  static getMember = async (req, res) => {
    if (!req.params.memberId) {
      return res.status(400).send({
        status: "failed",
        message: "Required fields missing",
      });
    }
    try {
      const member = await Member.findById(req.params.memberId);
      return res.status(200).send({
        status: "success",
        data: member,
        message: "Member fetched successfully",
      });
    } catch (e) {
      return res
        .status(500)
        .send({ status: "failed", message: "Internal server error" });
    }
  };

  static updateMember = async (req, res) => {
    if (!req.params.memberId) {
      return res.status(400).send({
        status: "failed",
        message: "Required fields missing",
      });
    }
    try {
      const member = await Member.findOneAndUpdate(
        { _id: req.params.memberId },
        req.body,
        { new: true }
      );
      return res.status(200).send({
        status: "success",
        data: member,
        message: "Member updated successfully",
      });
    } catch (e) {
      return res
        .status(500)
        .send({ status: "failed", message: "Internal server error" });
    }
  };

  static deleteMember = async (req, res) => {
    if (!req.params.memberId) {
      return res.status(400).send({
        status: "failed",
        message: "Required fields missing",
      });
    }
    try {
      await Member.findOneAndDelete({
        _id: req.params.memberId,
      });
      return res.status(200).send({
        status: "success",

        message: "Member deleted successfully",
      });
    } catch (e) {
      return res
        .status(500)
        .send({ status: "failed", message: "Internal server error" });
    }
  };
}

export default MemberController;
