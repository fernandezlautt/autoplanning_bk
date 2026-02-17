import { Week, Resource } from '../../models';
import { UpdateWeekRequest, CreateResourceRequest, UpdateResourceRequest, WeekResponse } from './types';

export class WeekService {
  async getWeekById(id: number): Promise<WeekResponse | null> {
    const week = await Week.findByPk(id, {
      include: [
        {
          model: Resource,
          as: 'resources',
        },
      ],
    });

    if (!week) {
      return null;
    }

    return this.formatWeekResponse(week);
  }

  async updateWeek(id: number, data: UpdateWeekRequest): Promise<WeekResponse | null> {
    const week = await Week.findByPk(id);
    if (!week) {
      return null;
    }

    await week.update({ content: data.content });
    return this.getWeekById(id);
  }

  async createResource(weekId: number, data: CreateResourceRequest): Promise<Resource | null> {
    const week = await Week.findByPk(weekId);
    if (!week) {
      return null;
    }

    const resource = await Resource.create({
      weekId,
      url: data.url,
      title: data.title,
      description: data.description,
    });

    return resource;
  }

  async updateResource(id: number, data: UpdateResourceRequest): Promise<Resource | null> {
    const resource = await Resource.findByPk(id);
    if (!resource) {
      return null;
    }

    await resource.update(data);
    return resource;
  }

  async deleteResource(id: number): Promise<boolean> {
    const resource = await Resource.findByPk(id);
    if (!resource) {
      return false;
    }

    await resource.destroy();
    return true;
  }

  private formatWeekResponse(week: Week): WeekResponse {
    return {
      id: week.id,
      subjectId: week.subjectId,
      weekNumber: week.weekNumber,
      content: week.content,
      createdAt: week.createdAt,
      updatedAt: week.updatedAt,
      resources: (week.resources || []).map((resource) => ({
        id: resource.id,
        weekId: resource.weekId,
        url: resource.url,
        title: resource.title,
        description: resource.description,
        createdAt: resource.createdAt,
        updatedAt: resource.updatedAt,
      })),
    };
  }
}
