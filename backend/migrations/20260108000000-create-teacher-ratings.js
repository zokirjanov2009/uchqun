export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('teacher_ratings', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('gen_random_uuid()'),
      primaryKey: true,
      allowNull: false,
    },
    teacherId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    parentId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' },
      onDelete: 'CASCADE',
    },
    stars: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    comment: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
  });

  await queryInterface.addIndex('teacher_ratings', ['teacherId']);
  await queryInterface.addConstraint('teacher_ratings', {
    fields: ['teacherId', 'parentId'],
    type: 'unique',
    name: 'teacher_ratings_teacher_parent_unique',
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('teacher_ratings');
}

