import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface SubjectAttributes {
  id: number;
  name: string;
  semester: '1st' | '2nd' | 'yearly';
  startWeek: number;
  endWeek: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SubjectCreationAttributes extends Optional<SubjectAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Subject extends Model<SubjectAttributes, SubjectCreationAttributes> implements SubjectAttributes {
  public id!: number;
  public name!: string;
  public semester!: '1st' | '2nd' | 'yearly';
  public startWeek!: number;
  public endWeek!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Subject.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    semester: {
      type: DataTypes.ENUM('1st', '2nd', 'yearly'),
      allowNull: false,
    },
    startWeek: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    endWeek: {
      type: DataTypes.INTEGER,
      allowNull: false,
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
    tableName: 'subjects',
    timestamps: true,
  }
);
