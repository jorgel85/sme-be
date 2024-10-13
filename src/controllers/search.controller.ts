import { Request, Response } from "express";
import { google } from "googleapis";

const customSearch = google.customsearch('v1');

// Path: controller/search.controller.js
// Desc: Get results from custom search engine
// Route: GET /api/search/?q=search-query
export const search = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    const response = await customSearch.cse.list({  
        cx: "46eee257220344169",  
        q: q as string,  
        auth: "AIzaSyAaXsFvKmyvWlLgr3sQJAzRIRbJwJlWrr0",  
      });

    res.status(200).json({ 
        message: "Product search done successfully!",
        result: response
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};
