import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { Week } from './Week';

export interface ResourceAttributes {
  id: number;
  weekId: number;
  url: string;
  title?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ResourceCreationAttributes extends Optional<ResourceAttributes, 'id' | 'createdAt' | 'updatedAt'> {}

export class Resource extends Model<ResourceAttributes, ResourceCreationAttributes> implements ResourceAttributes {
  public id!: number;
  public weekId!: number;
  public url!: string;
  public title?: string;
  public description?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Resource.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    weekId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Week,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    tableName: 'resources',
    timestamps: true,
  }
);

// Define associations
Week.hasMany(Resource, { foreignKey: 'weekId', as: 'resources' });
Resource.belongsTo(Week, { foreignKey: 'weekId', as: 'week' });
