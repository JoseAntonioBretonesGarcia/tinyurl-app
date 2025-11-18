import { Request, Response, NextFunction } from "express";
import { isValidUrl } from "../utils/urlValidator";
import { createShortUrl, getByShortCode, registerHit, getStats } from "../services/url.service";

export async function createUrlHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { originalUrl, customAlias, expiresAt, allowDuplicates } = req.body;

    if (!originalUrl || !isValidUrl(originalUrl)) {
      return res.status(400).json({ message: "URL inválida" });
    }

    const created = await createShortUrl(
      originalUrl,
      customAlias,
      expiresAt || null,
      allowDuplicates ?? false
    );

    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
    res.status(201).json({
      shortCode: created.short_code,
      shortUrl: `${baseUrl}/${created.short_code}`,
      originalUrl: created.original_url,
      expiresAt: created.expires_at,
    });
  } catch (err) {
    next(err);
  }
}

export async function redirectHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { shortCode } = req.params;
    const url = await getByShortCode(shortCode);

    if (!url) {
      return res.status(404).send("URL no encontrada o expirada");
    }

    registerHit(url.id, {
      referrer: req.get("referer") || undefined,
      userAgent: req.get("user-agent") || undefined,
      ip: req.ip,
    }).catch(console.error);

    res.redirect(302, url.original_url);
  } catch (err) {
    next(err);
  }
}

export async function statsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { shortCode } = req.params;
    const stats = await getStats(shortCode);
    if (!stats) return res.status(404).json({ message: "No encontrado" });
    res.json(stats);
  } catch (err) {
    next(err);
  }
}
