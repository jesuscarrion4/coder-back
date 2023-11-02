export const productValidator = (req, res, next) => {
    const {
      title,
      description,
      price,
      code,
      category,
      stock,
      status,
      thumbnails,
    } = req.body;

    if (
      typeof title !== "string" ||
      typeof description !== "string" ||
      typeof price !== "number" ||
      typeof code !== "string" ||
      typeof category !== "string" ||
      typeof stock !== "number"
    ) {
      return res.status(400).json({ success: false, response: "Invalid body" });
    }
 
    if (status === null || status === undefined) {
      req.body.status = true;
    }
  
    if (thumbnails === null || thumbnails === undefined) {
      req.body.thumbnails = [];
    }
  
    next();
  };
  