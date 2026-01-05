import User from '../models/User.js';
import Group from '../models/Group.js';
import ParentActivity from '../models/ParentActivity.js';
import ParentMeal from '../models/ParentMeal.js';
import ParentMedia from '../models/ParentMedia.js';
import Child from '../models/Child.js';
import logger from '../utils/logger.js';
import { Op } from 'sequelize';

/**
 * Parent Controller
 * Handles Parent-specific operations:
 * - View own activities, meals, and media
 * - Parents only see data related to their own account
 */

/**
 * Get parent's children
 * GET /api/parent/children
 * 
 * Business Logic:
 * - Parents can view their own children
 */
export const getMyChildren = async (req, res) => {
  try {
    const children = await Child.findAll({
      where: { parentId: req.user.id },
      order: [['firstName', 'ASC']],
    });

    res.json({
      success: true,
      data: children,
    });
  } catch (error) {
    logger.error('Get my children error', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to fetch children' });
  }
};

/**
 * Get parent's own activities
 * GET /api/parent/activities
 * 
 * Business Logic:
 * - Parents can only view their own activities
 * - When viewing parent list, clicking on a parent shows their activities
 */
export const getMyActivities = async (req, res) => {
  try {
    const { limit = 50, offset = 0, activityType, startDate, endDate } = req.query;

    const where = { parentId: req.user.id };
    
    if (activityType) {
      where.activityType = activityType;
    }
    
    if (startDate || endDate) {
      where.activityDate = {};
      if (startDate) where.activityDate[Op.gte] = new Date(startDate);
      if (endDate) where.activityDate[Op.lte] = new Date(endDate);
    }

    const activities = await ParentActivity.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['activityDate', 'DESC']],
    });

    res.json({
      success: true,
      data: activities.rows,
      total: activities.count,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    logger.error('Get my activities error', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
};

/**
 * Get a specific activity
 * GET /api/parent/activities/:id
 */
export const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await ParentActivity.findOne({
      where: { id, parentId: req.user.id },
    });

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    res.json({
      success: true,
      data: activity,
    });
  } catch (error) {
    logger.error('Get activity by id error', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
};

/**
 * Get parent's own meals
 * GET /api/parent/meals
 * 
 * Business Logic:
 * - Parents can only view their own meals
 * - When viewing parent list, clicking on a parent shows their meals
 */
export const getMyMeals = async (req, res) => {
  try {
    const { limit = 50, offset = 0, mealType, startDate, endDate } = req.query;

    const where = { parentId: req.user.id };
    
    if (mealType) {
      where.mealType = mealType;
    }
    
    if (startDate || endDate) {
      where.mealDate = {};
      if (startDate) where.mealDate[Op.gte] = new Date(startDate);
      if (endDate) where.mealDate[Op.lte] = new Date(endDate);
    }

    const meals = await ParentMeal.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['mealDate', 'DESC']],
    });

    res.json({
      success: true,
      data: meals.rows,
      total: meals.count,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    logger.error('Get my meals error', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
};

/**
 * Get a specific meal
 * GET /api/parent/meals/:id
 */
export const getMealById = async (req, res) => {
  try {
    const { id } = req.params;

    const meal = await ParentMeal.findOne({
      where: { id, parentId: req.user.id },
    });

    if (!meal) {
      return res.status(404).json({ error: 'Meal not found' });
    }

    res.json({
      success: true,
      data: meal,
    });
  } catch (error) {
    logger.error('Get meal by id error', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to fetch meal' });
  }
};

/**
 * Get parent's own media
 * GET /api/parent/media
 * 
 * Business Logic:
 * - Parents can only view their own media
 * - When viewing parent list, clicking on a parent shows their media
 */
export const getMyMedia = async (req, res) => {
  try {
    const { limit = 50, offset = 0, fileType } = req.query;

    const where = { parentId: req.user.id };
    
    if (fileType) {
      where.fileType = fileType;
    }

    const media = await ParentMedia.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset: parseInt(offset),
      order: [['uploadDate', 'DESC']],
    });

    res.json({
      success: true,
      data: media.rows,
      total: media.count,
      limit: parseInt(limit),
      offset: parseInt(offset),
    });
  } catch (error) {
    logger.error('Get my media error', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to fetch media' });
  }
};

/**
 * Get a specific media file
 * GET /api/parent/media/:id
 */
export const getMediaById = async (req, res) => {
  try {
    const { id } = req.params;

    const media = await ParentMedia.findOne({
      where: { id, parentId: req.user.id },
    });

    if (!media) {
      return res.status(404).json({ error: 'Media not found' });
    }

    res.json({
      success: true,
      data: media,
    });
  } catch (error) {
    logger.error('Get media by id error', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to fetch media' });
  }
};

/**
 * Get parent profile with summary
 * GET /api/parent/profile
 */
export const getMyProfile = async (req, res) => {
  try {
    // Fetch user with relationships (assigned teacher and group)
    const userWithRelations = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: User,
          as: 'assignedTeacher',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
          required: false,
        },
        {
          model: Group,
          as: 'group',
          attributes: ['id', 'name', 'description'],
          required: false,
        },
      ],
    });

    const activitiesCount = await ParentActivity.count({
      where: { parentId: req.user.id },
    });

    const mealsCount = await ParentMeal.count({
      where: { parentId: req.user.id },
    });

    const mediaCount = await ParentMedia.count({
      where: { parentId: req.user.id },
    });

    res.json({
      success: true,
      data: {
        user: userWithRelations.toJSON(),
        summary: {
          activitiesCount,
          mealsCount,
          mediaCount,
        },
      },
    });
  } catch (error) {
    logger.error('Get my profile error', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

/**
 * Get parent data for viewing (used when clicking on parent in list)
 * GET /api/parent/:parentId/data
 * 
 * Business Logic:
 * - When viewing the list of parents, clicking on a parent should display:
 *   - Activity
 *   - Meals
 *   - Media
 * - This endpoint can be accessed by Admin or Reception to view parent data
 */
export const getParentData = async (req, res) => {
  try {
    const { parentId } = req.params;

    // Verify the user is a parent
    const parent = await User.findOne({
      where: { id: parentId, role: 'parent' },
      attributes: { exclude: ['password'] },
    });

    if (!parent) {
      return res.status(404).json({ error: 'Parent not found' });
    }

    // Get all parent data
    const [activities, meals, media] = await Promise.all([
      ParentActivity.findAll({
        where: { parentId: parentId },
        order: [['activityDate', 'DESC']],
        limit: 10,
      }),
      ParentMeal.findAll({
        where: { parentId: parentId },
        order: [['mealDate', 'DESC']],
        limit: 10,
      }),
      ParentMedia.findAll({
        where: { parentId: parentId },
        order: [['uploadDate', 'DESC']],
        limit: 10,
      }),
    ]);

    res.json({
      success: true,
      data: {
        parent: parent.toJSON(),
        activities,
        meals,
        media,
      },
    });
  } catch (error) {
    logger.error('Get parent data error', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to fetch parent data' });
  }
};

