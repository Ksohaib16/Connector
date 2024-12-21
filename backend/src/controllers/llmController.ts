import { RequestHandler } from "express";
import { translator } from "../llm/llmConfig";


export const inputTranslator: RequestHandler = async(req, res) => {
    const { text, from, to } = req.body;

    try {
        const translation = await translator(text, { from, to });
        res.status(200).json({ translation });
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
}

export const chatTranslator: RequestHandler = async(req, res) => {
    const { text, from, to } = req.body;

    try {
        const translation = await translator(text, { from, to });
        res.status(200).json({ translation });
    } catch (error) {
        res.status(500).json({ error: (error as any).message });
    }
}