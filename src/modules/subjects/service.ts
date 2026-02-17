import { Subject, Week, Resource } from '../../models';
import { getSemesterConfig } from '../../config/semester';
import { CreateSubjectRequest, UpdateSubjectRequest, SubjectResponse } from './types';

export class SubjectService {
  async createSubject(data: CreateSubjectRequest): Promise<SubjectResponse> {
    const config = getSemesterConfig(data.semester);
    
    const subject = await Subject.create({
      name: data.name,
      semester: data.semester,
      startWeek: config.startWeek,
      endWeek: config.endWeek,
    });

    // Create empty weeks for the semester
    const weeks = [];
    for (let weekNum = config.startWeek; weekNum <= config.endWeek; weekNum++) {
      const week = await Week.create({
        subjectId: subject.id,
        weekNumber: weekNum,
        content: '',
      });
      weeks.push(week);
    }

    return this.formatSubjectResponse(subject, weeks);
  }

  async getAllSubjects(): Promise<SubjectResponse[]> {
    const subjects = await Subject.findAll({
      include: [
        {
          model: Week,
          as: 'weeks',
          include: [
            {
              model: Resource,
              as: 'resources',
            },
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    return subjects.map((subject) => this.formatSubjectResponse(subject, subject.weeks || []));
  }

  async getSubjectById(id: number): Promise<SubjectResponse | null> {
    const subject = await Subject.findByPk(id, {
      include: [
        {
          model: Week,
          as: 'weeks',
          include: [
            {
              model: Resource,
              as: 'resources',
            },
          ],
          order: [['weekNumber', 'ASC']],
        },
      ],
    });

    if (!subject) {
      return null;
    }

    return this.formatSubjectResponse(subject, subject.weeks || []);
  }

  async updateSubject(id: number, data: UpdateSubjectRequest): Promise<SubjectResponse | null> {
    const subject = await Subject.findByPk(id);
    if (!subject) {
      return null;
    }

    const updateData: Partial<Subject> = {};
    if (data.name) updateData.name = data.name;
    if (data.semester) {
      const config = getSemesterConfig(data.semester);
      updateData.semester = data.semester;
      updateData.startWeek = config.startWeek;
      updateData.endWeek = config.endWeek;
    }

    await subject.update(updateData);

    // If semester changed, recreate weeks
    if (data.semester && data.semester !== subject.semester) {
      await Week.destroy({ where: { subjectId: id } });
      const config = getSemesterConfig(data.semester);
      for (let weekNum = config.startWeek; weekNum <= config.endWeek; weekNum++) {
        await Week.create({
          subjectId: id,
          weekNumber: weekNum,
          content: '',
        });
      }
    }

    return this.getSubjectById(id);
  }

  async deleteSubject(id: number): Promise<boolean> {
    const subject = await Subject.findByPk(id);
    if (!subject) {
      return false;
    }

    await subject.destroy();
    return true;
  }

  private formatSubjectResponse(subject: Subject, weeks: Week[]): SubjectResponse {
    const semesterConfig = getSemesterConfig(subject.semester);
    return {
      id: subject.id,
      name: subject.name,
      semester: subject.semester,
      startWeek: subject.startWeek,
      endWeek: subject.endWeek,
      createdAt: subject.createdAt,
      updatedAt: subject.updatedAt,
      semesterStartDate: semesterConfig.startDate.toISOString(),
      weeks: weeks.map((week) => ({
        id: week.id,
        weekNumber: week.weekNumber,
        content: week.content,
        resources: (week.resources || []).map((resource) => ({
          id: resource.id,
          url: resource.url,
          title: resource.title,
          description: resource.description,
        })),
      })),
    };
  }
}
