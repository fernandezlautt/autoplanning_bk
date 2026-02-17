import { Request, Response } from 'express';
import { WeekService } from './service';
import { UpdateWeekRequest, CreateResourceRequest, UpdateResourceRequest } from './types';

export class WeekController {
  private weekService: WeekService;

  constructor() {
    this.weekService = new WeekService();
  }

  getWeekById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid week ID' });
        return;
      }

      const week = await this.weekService.getWeekById(id);
      if (!week) {
        res.status(404).json({ error: 'Week not found' });
        return;
      }

      res.json(week);
    } catch (error) {
      console.error('Error fetching week:', error);
      res.status(500).json({ error: 'Failed to fetch week' });
    }
  };

  updateWeek = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid week ID' });
        return;
      }

      const data: UpdateWeekRequest = req.body;
      if (data.content === undefined) {
        res.status(400).json({ error: 'Content is required' });
        return;
      }

      const week = await this.weekService.updateWeek(id, data);
      if (!week) {
        res.status(404).json({ error: 'Week not found' });
        return;
      }

      res.json(week);
    } catch (error) {
      console.error('Error updating week:', error);
      res.status(500).json({ error: 'Failed to update week' });
    }
  };

  createResource = async (req: Request, res: Response): Promise<void> => {
    try {
      const weekId = parseInt(req.params.weekId);
      if (isNaN(weekId)) {
        res.status(400).json({ error: 'Invalid week ID' });
        return;
      }

      const data: CreateResourceRequest = req.body;
      if (!data.url) {
        res.status(400).json({ error: 'URL is required' });
        return;
      }

      const resource = await this.weekService.createResource(weekId, data);
      if (!resource) {
        res.status(404).json({ error: 'Week not found' });
        return;
      }

      res.status(201).json(resource);
    } catch (error) {
      console.error('Error creating resource:', error);
      res.status(500).json({ error: 'Failed to create resource' });
    }
  };

  updateResource = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid resource ID' });
        return;
      }

      const data: UpdateResourceRequest = req.body;
      const resource = await this.weekService.updateResource(id, data);
      if (!resource) {
        res.status(404).json({ error: 'Resource not found' });
        return;
      }

      res.json(resource);
    } catch (error) {
      console.error('Error updating resource:', error);
      res.status(500).json({ error: 'Failed to update resource' });
    }
  };

  deleteResource = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid resource ID' });
        return;
      }

      const deleted = await this.weekService.deleteResource(id);
      if (!deleted) {
        res.status(404).json({ error: 'Resource not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting resource:', error);
      res.status(500).json({ error: 'Failed to delete resource' });
    }
  };
}
