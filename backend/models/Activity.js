import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Child from './Child.js';

const Activity = sequelize.define('Activity', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  childId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'children',
      key: 'id',
    },
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  title: {
    type: DataTypes.STRING(500),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.ENUM('Learning', 'Therapy', 'Social', 'Physical', 'Other'),
    allowNull: false,
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 0,
    },
  },
  teacher: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  studentEngagement: {
    type: DataTypes.ENUM('High', 'Medium', 'Low'),
    defaultValue: 'Medium',
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'activities',
  timestamps: true,
  indexes: [
    {
      fields: ['childId', 'date'],
    },
  ],
});

// Define associations
Activity.belongsTo(Child, { foreignKey: 'childId', as: 'child' });
Child.hasMany(Activity, { foreignKey: 'childId', as: 'activities' });

export default Activity;

