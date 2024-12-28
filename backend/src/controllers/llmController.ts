import { RequestHandler } from "express";
import { translator } from "../llm/llmConfig";
import { WrapAsync } from "../utility/wrapAsync";
import { stat } from "fs";

export const inputTranslator: RequestHandler = WrapAsync(async (req, res) => {
  const { text, from, to } = req.body;

  const translation = await translator(text, { from, to });
  res.status(200).json({
    status: "success",
    message: "Translation successful",
    data: {
      translation,
    },
  });
});

export const chatTranslator: RequestHandler = WrapAsync(async (req, res) => {
  const { text, from, to } = req.body;

  const translation = await translator(text, { from, to });
  res.status(200).json({
    status: "success",
    message: "Translation successful",
    data: {
      translation,
    },
  });
});
