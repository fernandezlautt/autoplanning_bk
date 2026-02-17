import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Subject } from './Subject';

export interface WeekAttributes {
  id: number;
  subjectId: number;
  weekNumber: number;
  content: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WeekCreationAttributes extends Optional<WeekAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Week extends Model<WeekAttributes, WeekCreationAttributes> implements WeekAttributes {
  public id!: number;
  public subjectId!: number;
  public weekNumber!: number;
  public content!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Week.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    subjectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Subject,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    weekNumber: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '',
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: 'weeks',
    timestamps: true,
  }
);

// Define associations
Subject.hasMany(Week, { foreignKey: 'subjectId', as: 'weeks' });
Week.belongsTo(Subject, { foreignKey: 'subjectId', as: 'subject' });
