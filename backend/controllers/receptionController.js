import User from '../models/User.js';
import Child from '../models/Child.js';
import Group from '../models/Group.js';
import Document from '../models/Document.js';
import logger from '../utils/logger.js';
import bcrypt from 'bcryptjs';
import { Op } from 'sequelize';

/**
 * Reception Controller
 * Handles Reception-specific operations:
 * - Upload required documents for verification
 * - View own documents and verification status
 * - Create login credentials for Teachers and Parents
 * - Manage Teacher and Parent accounts
 */

/**
 * Upload a document for verification
 * POST /api/reception/documents
 * 
 * Business Logic:
 * - Reception must upload required documents after installation
 * - Documents are visible to Admin for review
 * - Reception cannot log in until documents are approved
 */
export const uploadDocument = async (req, res) => {
  try {
    const { documentType } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'File is required' });
    }

    if (!documentType) {
      return res.status(400).json({ error: 'Document type is required' });
    }

    const document = await Document.create({
      userId: req.user.id,
      documentType,
      fileName: file.originalname,
      filePath: file.path,
      fileSize: file.size,
      mimeType: file.mimetype,
      status: 'pending',
    });

    // Mark user as having uploaded documents
    await req.user.update({ isVerified: true });

    logger.info('Document uploaded by Reception', {
      documentId: document.id,
      userId: req.user.id,
      documentType,
    });

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: document,
    });
  } catch (error) {
    logger.error('Upload document error', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to upload document' });
  }
};

/**
 * Get own documents
 * GET /api/reception/documents
 */
export const getMyDocuments = async (req, res) => {
  try {
    const documents = await Document.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: documents,
    });
  } catch (error) {
    logger.error('Get my documents error', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to fetch documents' });
  }
};

/**
 * Get verification status
 * GET /api/reception/verification-status
 */
export const getVerificationStatus = async (req, res) => {
  try {
    const documents = await Document.findAll({
      where: { userId: req.user.id },
    });

    const status = {
      isVerified: req.user.isVerified,
      documentsApproved: req.user.documentsApproved,
      isActive: req.user.isActive,
      documentsCount: documents.length,
      pendingCount: documents.filter(d => d.status === 'pending').length,
      approvedCount: documents.filter(d => d.status === 'approved').length,
      rejectedCount: documents.filter(d => d.status === 'rejected').length,
    };

    res.json({
      success: true,
      data: status,
    });
  } catch (error) {
    logger.error('Get verification status error', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to fetch verification status' });
  }
};

/**
 * Create a Teacher account with credentials
 * POST /api/reception/teachers
 * 
 * Business Logic:
 * - Reception provides login credentials (email & password) to Teachers
 * - Reception cannot access Activity, Meals, Media, News, or Children modules
 */
export const createTeacher = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        error: 'Email, password, first name, and last name are required' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    const teacher = await User.create({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      phone,
      role: 'teacher',
      isActive: true, // Teachers are active immediately
      createdBy: req.user.id, // Track which reception user created this teacher
    });

    logger.info('Teacher created by Reception', {
      teacherId: teacher.id,
      email: teacher.email,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Teacher account created successfully',
      data: teacher.toJSON(),
    });
  } catch (error) {
    logger.error('Create teacher error', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to create teacher account' });
  }
};

/**
 * Create a Parent account with credentials
 * POST /api/reception/parents
 * 
 * Business Logic:
 * - Reception provides login credentials (email & password) to Parents
 * - Parents only see data related to their own account
 */
export const createParent = async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, teacherId, groupId, child } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({ 
        error: 'Email, password, first name, and last name are required' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Validate teacher exists and was created by this reception user if teacherId is provided
    if (teacherId) {
      const teacher = await User.findOne({ 
        where: { id: teacherId, role: 'teacher', createdBy: req.user.id } 
      });
      if (!teacher) {
        return res.status(400).json({ error: 'Invalid teacher selected or you do not have permission to assign this teacher' });
      }
    }

    // Validate group exists and belongs to teacher if both are provided
    if (groupId) {
      const group = await Group.findByPk(groupId);
      if (!group) {
        return res.status(400).json({ error: 'Invalid group selected' });
      }
      if (teacherId && group.teacherId !== teacherId) {
        return res.status(400).json({ error: 'Group does not belong to the selected teacher' });
      }
      // If groupId is provided but no teacherId, use the group's teacherId
      if (!teacherId) {
        req.body.teacherId = group.teacherId;
      }
    }

    const parent = await User.create({
      email: email.toLowerCase(),
      password,
      firstName,
      lastName,
      phone,
      role: 'parent',
      isActive: true, // Parents are active immediately
      teacherId: teacherId || (groupId ? (await Group.findByPk(groupId)).teacherId : null),
      groupId: groupId || null,
      createdBy: req.user.id, // Track which reception user created this parent
    });

    // Create child if child data is provided
    if (child && child.firstName && child.lastName) {
      let childClassName = '';
      let childTeacherName = '';
      
      // If groupId is provided, get class and teacher from group
      if (child.groupId) {
        const selectedGroup = await Group.findByPk(child.groupId, {
          include: [
            {
              model: User,
              as: 'teacher',
              attributes: ['id', 'firstName', 'lastName'],
            },
          ],
        });
        
        if (selectedGroup) {
          // Use group name as class
          childClassName = selectedGroup.name;
          // Use teacher's name
          if (selectedGroup.teacher) {
            childTeacherName = `${selectedGroup.teacher.firstName} ${selectedGroup.teacher.lastName}`;
          }
        }
      }
      
      await Child.create({
        parentId: parent.id,
        firstName: child.firstName,
        lastName: child.lastName,
        dateOfBirth: child.dateOfBirth,
        gender: child.gender,
        disabilityType: child.disabilityType,
        specialNeeds: child.specialNeeds || null,
        photo: child.photo || null,
        school: child.school,
        class: childClassName || child.class || '',
        teacher: childTeacherName || child.teacher || '',
        groupId: child.groupId || null,
        emergencyContact: child.emergencyContact || {},
      });
    }

    // Fetch parent with relationships to return complete data
    const parentWithRelations = await User.findByPk(parent.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: User,
          as: 'assignedTeacher',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          required: false,
        },
        {
          model: Group,
          as: 'group',
          attributes: ['id', 'name', 'description'],
          required: false,
        },
        {
          model: Child,
          as: 'children',
          attributes: ['id', 'firstName', 'lastName', 'dateOfBirth', 'gender', 'disabilityType', 'school', 'class', 'teacher'],
          required: false,
        },
      ],
    });

    logger.info('Parent created by Reception', {
      parentId: parent.id,
      email: parent.email,
      teacherId: parent.teacherId,
      groupId: parent.groupId,
      createdBy: req.user.id,
    });

    res.status(201).json({
      success: true,
      message: 'Parent account created successfully',
      data: parentWithRelations.toJSON(),
    });
  } catch (error) {
    logger.error('Create parent error', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to create parent account' });
  }
};

/**
 * Get all Teachers
 * GET /api/reception/teachers
 */
export const getTeachers = async (req, res) => {
  try {
    // Reception users can only see teachers they created
    const teachers = await User.findAll({
      where: { 
        role: 'teacher',
        createdBy: req.user.id, // Only show teachers created by this reception user
      },
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: teachers,
    });
  } catch (error) {
    logger.error('Get teachers error', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to fetch teachers' });
  }
};

/**
 * Get all Parents
 * GET /api/reception/parents
 */
export const getParents = async (req, res) => {
  try {
    // Reception users can only see parents they created
    const parents = await User.findAll({
      where: { 
        role: 'parent',
        createdBy: req.user.id, // Only show parents created by this reception user
      },
      attributes: { exclude: ['password'] },
      include: [
        {
          model: User,
          as: 'assignedTeacher',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          required: false,
        },
        {
          model: Group,
          as: 'group',
          attributes: ['id', 'name', 'description'],
          required: false,
        },
        {
          model: Child,
          as: 'children',
          attributes: ['id', 'firstName', 'lastName', 'dateOfBirth', 'gender', 'disabilityType', 'school', 'class', 'teacher'],
          required: false,
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      data: parents,
    });
  } catch (error) {
    logger.error('Get parents error', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to fetch parents' });
  }
};

/**
 * Update Teacher credentials
 * PUT /api/reception/teachers/:id
 */
export const updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, password, firstName, lastName, phone } = req.body;

    const teacher = await User.findOne({
      where: { id, role: 'teacher', createdBy: req.user.id }, // Only allow updating teachers created by this reception user
    });

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    const updateData = {};
    if (email) updateData.email = email.toLowerCase();
    if (password) updateData.password = password;
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone === '' ? null : phone;

    await teacher.update(updateData);

    // Reload teacher to get updated data
    await teacher.reload();

    logger.info('Teacher updated by Reception', {
      teacherId: teacher.id,
      updatedBy: req.user.id,
    });

    res.json({
      success: true,
      message: 'Teacher updated successfully',
      data: teacher.toJSON(),
    });
  } catch (error) {
    logger.error('Update teacher error', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to update teacher' });
  }
};

/**
 * Update Parent credentials
 * PUT /api/reception/parents/:id
 */
export const updateParent = async (req, res) => {
  try {
    const { id } = req.params;
    let { email, password, firstName, lastName, phone, teacherId, groupId } = req.body;

    // Normalize empty strings to null (only if the field was provided)
    const teacherIdProvided = teacherId !== undefined;
    const groupIdProvided = groupId !== undefined;
    teacherId = (teacherId === '') ? null : teacherId;
    groupId = (groupId === '') ? null : groupId;
    phone = (phone === '') ? null : phone;

    const parent = await User.findOne({
      where: { id, role: 'parent', createdBy: req.user.id }, // Only allow updating parents created by this reception user
    });

    if (!parent) {
      return res.status(404).json({ error: 'Parent not found' });
    }

    // Validate teacher exists and was created by this reception user if teacherId is provided
    if (teacherId) {
      const teacher = await User.findOne({ 
        where: { id: teacherId, role: 'teacher', createdBy: req.user.id } 
      });
      if (!teacher) {
        return res.status(400).json({ error: 'Invalid teacher selected or you do not have permission to assign this teacher' });
      }
    }

    // Validate group exists and belongs to teacher if both are provided
    if (groupId) {
      const group = await Group.findByPk(groupId);
      if (!group) {
        return res.status(400).json({ error: 'Invalid group selected' });
      }
      const finalTeacherId = teacherIdProvided && teacherId !== null ? teacherId : parent.teacherId;
      if (finalTeacherId && group.teacherId !== finalTeacherId) {
        return res.status(400).json({ error: 'Group does not belong to the selected teacher' });
      }
    }

    const updateData = {};
    if (email) updateData.email = email.toLowerCase();
    if (password) updateData.password = password;
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone !== undefined) updateData.phone = phone;
    // Include teacherId and groupId only if explicitly provided (to allow clearing assignments)
    if (teacherIdProvided) updateData.teacherId = teacherId;
    if (groupIdProvided) updateData.groupId = groupId;

    await parent.update(updateData);

    // Fetch parent with relationships to return complete data
    const parentWithRelations = await User.findByPk(parent.id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: User,
          as: 'assignedTeacher',
          attributes: ['id', 'firstName', 'lastName', 'email'],
          required: false,
        },
        {
          model: Group,
          as: 'group',
          attributes: ['id', 'name', 'description'],
          required: false,
        },
        {
          model: Child,
          as: 'children',
          attributes: ['id', 'firstName', 'lastName', 'dateOfBirth', 'gender', 'disabilityType', 'school', 'class', 'teacher'],
          required: false,
        },
      ],
    });

    logger.info('Parent updated by Reception', {
      parentId: parent.id,
      updatedBy: req.user.id,
    });

    res.json({
      success: true,
      message: 'Parent updated successfully',
      data: parentWithRelations.toJSON(),
    });
  } catch (error) {
    logger.error('Update parent error', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to update parent' });
  }
};

/**
 * Delete Teacher account
 * DELETE /api/reception/teachers/:id
 */
export const deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;

    const teacher = await User.findOne({
      where: { id, role: 'teacher', createdBy: req.user.id }, // Only allow deleting teachers created by this reception user
    });

    if (!teacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    await teacher.destroy();

    logger.info('Teacher deleted by Reception', {
      teacherId: id,
      deletedBy: req.user.id,
    });

    res.json({
      success: true,
      message: 'Teacher deleted successfully',
    });
  } catch (error) {
    logger.error('Delete teacher error', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to delete teacher' });
  }
};

/**
 * Delete Parent account
 * DELETE /api/reception/parents/:id
 */
export const deleteParent = async (req, res) => {
  try {
    const { id } = req.params;

    const parent = await User.findOne({
      where: { id, role: 'parent', createdBy: req.user.id }, // Only allow deleting parents created by this reception user
    });

    if (!parent) {
      return res.status(404).json({ error: 'Parent not found' });
    }

    // Delete children first (cascade delete)
    await Child.destroy({
      where: { parentId: id },
    });

    await parent.destroy();

    logger.info('Parent deleted by Reception', {
      parentId: id,
      deletedBy: req.user.id,
    });

    res.json({
      success: true,
      message: 'Parent deleted successfully',
    });
  } catch (error) {
    logger.error('Delete parent error', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Failed to delete parent' });
  }
};


