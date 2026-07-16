import { type Request, type Response } from "express";
import storeService from "../services/store.service.js";

class StoreController {
  async getStores(req: Request, res: Response) {
    const result = await storeService.getStores(req.query);
    res.json({
      success: true,
      ...result
    });
  }

  async getStoreById(req: Request, res: Response) {
    const store = await storeService.getStoreById(req.params.id as string);
    res.json({
      success: true,
      data: store
    });
  }

  async getMyStore(req: Request, res: Response) {
    const userId = req.user!.userId;
    const store = await storeService.getStoreByOwnerId(userId);
    res.json({
      success: true,
      data: store
    });
  }

  async createStore(req: Request, res: Response) {
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    const store = await storeService.createStore(userId, userRole, req.body);
    res.status(201).json({
      success: true,
      data: store
    });
  }

  async updateStore(req: Request, res: Response) {
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    const store = await storeService.updateStore(userId, userRole, req.params.id as string, req.body);
    res.json({
      success: true,
      data: store
    });
  }

  async deleteStore(req: Request, res: Response) {
    const userId = req.user!.userId;
    const userRole = req.user!.role;
    const result = await storeService.deleteStore(userId, userRole, req.params.id as string);
    res.json({
      success: true,
      ...result
    });
  }

  async followStore(req: Request, res: Response) {
    const userId = req.user!.userId;
    const storeId = req.params.id as string;
    const result = await storeService.followStore(userId, storeId);
    res.json({
      success: true,
      ...result
    });
  }

  async unfollowStore(req: Request, res: Response) {
    const userId = req.user!.userId;
    const storeId = req.params.id as string;
    const result = await storeService.unfollowStore(userId, storeId);
    res.json({
      success: true,
      ...result
    });
  }

  async checkFollowStatus(req: Request, res: Response) {
    const userId = req.user!.userId;
    const storeId = req.params.id as string;
    const result = await storeService.checkFollowStatus(userId, storeId);
    res.json({
      success: true,
      ...result
    });
  }

  async getFollowedStores(req: Request, res: Response) {
    const userId = req.user!.userId;
    const result = await storeService.getFollowedStores(userId, req.query);
    res.json({
      success: true,
      ...result
    });
  }

  async getStoreFollowers(req: Request, res: Response) {
    const storeId = req.params.id as string;
    const result = await storeService.getStoreFollowers(storeId, req.query);
    res.json({
      success: true,
      ...result
    });
  }
}

export default new StoreController();

