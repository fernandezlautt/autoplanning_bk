import { Request, Response } from 'express';
import { SubjectService } from './service';
import { CreateSubjectRequest, UpdateSubjectRequest } from './types';

export class SubjectController {
  private subjectService: SubjectService;

  constructor() {
    this.subjectService = new SubjectService();
  }

  createSubject = async (req: Request, res: Response): Promise<void> => {
    try {
      const data: CreateSubjectRequest = req.body;
      
      if (!data.name || !data.semester) {
        res.status(400).json({ error: 'Name and semester are required' });
        return;
      }

      if (!['1st', '2nd', 'yearly'].includes(data.semester)) {
        res.status(400).json({ error: 'Semester must be "1st", "2nd", or "yearly"' });
        return;
      }

      const subject = await this.subjectService.createSubject(data);
      res.status(201).json(subject);
    } catch (error) {
      console.error('Error creating subject:', error);
      res.status(500).json({ error: 'Failed to create subject' });
    }
  };

  getAllSubjects = async (req: Request, res: Response): Promise<void> => {
    try {
      const subjects = await this.subjectService.getAllSubjects();
      res.json(subjects);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      res.status(500).json({ error: 'Failed to fetch subjects' });
    }
  };

  getSubjectById = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid subject ID' });
        return;
      }

      const subject = await this.subjectService.getSubjectById(id);
      if (!subject) {
        res.status(404).json({ error: 'Subject not found' });
        return;
      }

      res.json(subject);
    } catch (error) {
      console.error('Error fetching subject:', error);
      res.status(500).json({ error: 'Failed to fetch subject' });
    }
  };

  updateSubject = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid subject ID' });
        return;
      }

      const data: UpdateSubjectRequest = req.body;
      if (data.semester && !['1st', '2nd', 'yearly'].includes(data.semester)) {
        res.status(400).json({ error: 'Semester must be "1st", "2nd", or "yearly"' });
        return;
      }

      const subject = await this.subjectService.updateSubject(id, data);
      if (!subject) {
        res.status(404).json({ error: 'Subject not found' });
        return;
      }

      res.json(subject);
    } catch (error) {
      console.error('Error updating subject:', error);
      res.status(500).json({ error: 'Failed to update subject' });
    }
  };

  deleteSubject = async (req: Request, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'Invalid subject ID' });
        return;
      }

      const deleted = await this.subjectService.deleteSubject(id);
      if (!deleted) {
        res.status(404).json({ error: 'Subject not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting subject:', error);
      res.status(500).json({ error: 'Failed to delete subject' });
    }
  };
}
