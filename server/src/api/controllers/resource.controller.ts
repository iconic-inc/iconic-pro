import { Request, Response } from 'express';
import * as ResourceService from '../services/resource.service';
import { OK } from '../core/success.response';
import { BadRequestError } from '../core/errors';

export class ResourceController {
  static async getResources(req: Request, res: Response) {
    const { search } = req.query;

    // Tạo query object
    const query: any = {};

    // Filter theo search term nếu có
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const resources = await ResourceService.getResources(query);

    return OK({
      res,
      message: 'Resources retrieved successfully',
      metadata: resources,
    });
  }

  static async createResource(req: Request, res: Response) {
    // Validate input
    const { name, slug, description } = req.body;
    if (!name || !slug || !description) {
      throw new BadRequestError('Name, slug and description are required');
    }

    const resource = await ResourceService.createResource(req.body);

    return OK({
      res,
      message: 'Resource created successfully',
      metadata: resource,
    });
  }

  static async getResourceById(req: Request, res: Response) {
    const { resourceId } = req.params;
    const resource = await ResourceService.getResourceById(resourceId);

    return OK({
      res,
      message: 'Resource retrieved successfully',
      metadata: resource,
    });
  }

  static async updateResource(req: Request, res: Response) {
    const { resourceId } = req.params;
    const resource = await ResourceService.updateResource(resourceId, req.body);

    return OK({
      res,
      message: 'Resource updated successfully',
      metadata: resource,
    });
  }

  static async deleteResource(req: Request, res: Response) {
    const { resourceId } = req.params;
    const resource = await ResourceService.deleteResource(resourceId);

    return OK({
      res,
      message: 'Resource deleted successfully',
      metadata: resource,
    });
  }
}
