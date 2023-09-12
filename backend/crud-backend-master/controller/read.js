import { List } from "../model/List.js";

export const read = async (req, res) => {
  //get all lists
  try {
    const page = parseInt(req.query.page) || 1; // Current page number
    const pageSize = parseInt(req.query.pageSize) || 10; // Items per page
    const userId = req.params.userId;
    const totalItems = await List.countDocuments({ UserId: userId }); // Total number of items
    console.log(req.params);
    const data = await List.find({ UserId: userId })
      .skip((page - 1) * pageSize)
      .limit(pageSize);
    return res.status(200).json({
      success: true,
      data,
      page,
      totalPages: Math.ceil(totalItems / pageSize),
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Something went wrong " });
  }
};
