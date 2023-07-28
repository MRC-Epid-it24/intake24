const { createPermissions } = require('../../utils.js');

/*
 * TODO: import from common-backend extract once migration system supports module system (sequelize v7)
 * import { permissions } from ('../../../../common-backend/acl');
 */
const permissions = [
  { name: 'acl', displayName: 'Access Control List' },
  { name: 'globalsupport', displayName: 'Global Support' },
  { name: 'as-served-sets', displayName: 'As served sets resource access' },
  { name: 'as-served-sets|browse', displayName: 'Browse as served sets' },
  { name: 'as-served-sets|read', displayName: 'Read as served sets' },
  { name: 'as-served-sets|create', displayName: 'Create as served sets' },
  { name: 'as-served-sets|edit', displayName: 'Edit as served sets' },
  { name: 'as-served-sets|delete', displayName: 'Delete as served sets' },
  { name: 'drinkware-sets', displayName: 'Drinkware sets resource access' },
  { name: 'drinkware-sets|browse', displayName: 'Browse drinkware sets' },
  { name: 'drinkware-sets|read', displayName: 'Read drinkware sets' },
  { name: 'drinkware-sets|create', displayName: 'Create drinkware sets' },
  { name: 'drinkware-sets|edit', displayName: 'Edit drinkware sets' },
  { name: 'drinkware-sets|delete', displayName: 'Delete drinkware sets' },
  { name: 'fdbs', displayName: 'Food databases resource access' },
  { name: 'fdbs|browse', displayName: 'Browse food databases' },
  { name: 'fdbs|read', displayName: 'Read food databases' },
  { name: 'fdbs|create', displayName: 'Create food databases' },
  { name: 'fdbs|edit', displayName: 'Edit food databases' },
  { name: 'fdbs|delete', displayName: 'Delete food databases' },
  { name: 'feedback-schemes', displayName: 'Feedback schemes resource access' },
  { name: 'feedback-schemes|browse', displayName: 'Browse feedback schemes' },
  { name: 'feedback-schemes|read', displayName: 'Read feedback schemes' },
  { name: 'feedback-schemes|create', displayName: 'Create feedback schemes' },
  { name: 'feedback-schemes|edit', displayName: 'Edit feedback schemes' },
  { name: 'feedback-schemes|delete', displayName: 'Delete feedback schemes' },
  { name: 'feedback-schemes|cards', displayName: 'Feedback scheme cards' },
  { name: 'feedback-schemes|top-foods', displayName: 'Feedback scheme top foods' },
  { name: 'feedback-schemes|meals', displayName: 'Feedback scheme meals' },
  { name: 'feedback-schemes|copy', displayName: 'Copy feedback schemes' },
  { name: 'feedback-schemes|security', displayName: 'Feedback schemes security' },
  { name: 'food-groups', displayName: 'Food groups resource access' },
  { name: 'food-groups|browse', displayName: 'Browse food groups' },
  { name: 'food-groups|read', displayName: 'Read food groups' },
  { name: 'food-groups|create', displayName: 'Create food groups' },
  { name: 'food-groups|edit', displayName: 'Edit food groups' },
  { name: 'food-groups|delete', displayName: 'Delete food groups' },
  { name: 'guide-images', displayName: 'Guide images resource access' },
  { name: 'guide-images|browse', displayName: 'Browse guide images' },
  { name: 'guide-images|read', displayName: 'Read guide images' },
  { name: 'guide-images|create', displayName: 'Create guide images' },
  { name: 'guide-images|edit', displayName: 'Edit guide images' },
  { name: 'guide-images|delete', displayName: 'Delete guide images' },
  { name: 'image-maps', displayName: 'Image maps resource access' },
  { name: 'image-maps|browse', displayName: 'Browse image maps' },
  { name: 'image-maps|read', displayName: 'Read image maps' },
  { name: 'image-maps|create', displayName: 'Create image maps' },
  { name: 'image-maps|edit', displayName: 'Edit image maps' },
  { name: 'image-maps|delete', displayName: 'Delete image maps' },
  { name: 'jobs', displayName: 'Jobs resource access' },
  { name: 'jobs|browse', displayName: 'Browse jobs' },
  { name: 'jobs|read', displayName: 'Read jobs' },
  { name: 'jobs|create', displayName: 'Create jobs' },
  { name: 'jobs|edit', displayName: 'Edit jobs' },
  { name: 'jobs|delete', displayName: 'Delete jobs' },
  { name: 'languages', displayName: 'Languages resource access' },
  { name: 'languages|browse', displayName: 'Browse languages' },
  { name: 'languages|read', displayName: 'Read languages' },
  { name: 'languages|create', displayName: 'Create languages' },
  { name: 'languages|edit', displayName: 'Edit languages' },
  { name: 'languages|delete', displayName: 'Delete languages' },
  { name: 'languages|security', displayName: 'Languages security' },
  { name: 'languages|translations', displayName: 'Language translations' },
  { name: 'locales', displayName: 'Locales resource access' },
  { name: 'locales|browse', displayName: 'Browse locales' },
  { name: 'locales|read', displayName: 'Read locales' },
  { name: 'locales|create', displayName: 'Create locales' },
  { name: 'locales|edit', displayName: 'Edit locales' },
  { name: 'locales|delete', displayName: 'Delete locales' },
  { name: 'locales|copy', displayName: 'Copy locales' },
  { name: 'locales|food-list', displayName: 'Locale food list' },
  { name: 'locales|security', displayName: 'Locales security' },
  { name: 'locales|split-lists', displayName: 'Locale split lists' },
  { name: 'locales|split-words', displayName: 'Locale split words' },
  { name: 'locales|synonym-sets', displayName: 'Locale synonym sets' },
  { name: 'locales|tasks', displayName: 'Locale tasks' },
  { name: 'nutrient-tables', displayName: 'Nutrient tables resource access' },
  { name: 'nutrient-tables|browse', displayName: 'Browse nutrient tables' },
  { name: 'nutrient-tables|read', displayName: 'Read nutrient tables' },
  { name: 'nutrient-tables|create', displayName: 'Create nutrient tables' },
  { name: 'nutrient-tables|edit', displayName: 'Edit nutrient tables' },
  { name: 'nutrient-tables|delete', displayName: 'Delete nutrient tables' },
  { name: 'nutrient-tables|upload', displayName: 'Nutrient tables upload' },
  { name: 'nutrient-types', displayName: 'Nutrient types resource access' },
  { name: 'nutrient-types|browse', displayName: 'Browse nutrient types' },
  { name: 'nutrient-types|read', displayName: 'Read nutrient types' },
  { name: 'nutrient-types|create', displayName: 'Create nutrient types' },
  { name: 'nutrient-types|edit', displayName: 'Edit nutrient types' },
  { name: 'nutrient-types|delete', displayName: 'Delete nutrient types' },
  { name: 'nutrient-units', displayName: 'Nutrient units resource access' },
  { name: 'nutrient-units|browse', displayName: 'Browse nutrient units' },
  { name: 'nutrient-units|read', displayName: 'Read nutrient units' },
  { name: 'nutrient-units|create', displayName: 'Create nutrient units' },
  { name: 'nutrient-units|edit', displayName: 'Edit nutrient units' },
  { name: 'nutrient-units|delete', displayName: 'Delete nutrient units' },
  { name: 'permissions', displayName: 'Permissions resource access' },
  { name: 'permissions|browse', displayName: 'Browse permissions' },
  { name: 'permissions|read', displayName: 'Read permissions' },
  { name: 'permissions|create', displayName: 'Create permissions' },
  { name: 'permissions|edit', displayName: 'Edit permissions' },
  { name: 'permissions|delete', displayName: 'Delete permissions' },
  { name: 'permissions|roles', displayName: 'Permission roles' },
  { name: 'permissions|users', displayName: 'Permission users' },
  { name: 'roles', displayName: 'Roles resource access' },
  { name: 'roles|browse', displayName: 'Browse roles' },
  { name: 'roles|read', displayName: 'Read roles' },
  { name: 'roles|create', displayName: 'Create roles' },
  { name: 'roles|edit', displayName: 'Edit roles' },
  { name: 'roles|delete', displayName: 'Delete roles' },
  { name: 'roles|permissions', displayName: 'Role permissions' },
  { name: 'roles|users', displayName: 'Role users' },
  { name: 'sign-in-logs', displayName: 'Sign-in logs resource access' },
  { name: 'sign-in-logs|browse', displayName: 'Browse sign-in logs' },
  { name: 'sign-in-logs|read', displayName: 'Read sign-in logs' },
  { name: 'sign-in-logs|delete', displayName: 'Delete sign-in logs' },
  { name: 'standard-units', displayName: 'Standard units resource access' },
  { name: 'standard-units|browse', displayName: 'Browse standard units' },
  { name: 'standard-units|read', displayName: 'Read standard units' },
  { name: 'standard-units|create', displayName: 'Create standard units' },
  { name: 'standard-units|edit', displayName: 'Edit standard units' },
  { name: 'standard-units|delete', displayName: 'Delete standard units' },
  { name: 'standard-units|categories', displayName: 'Standard unit categories' },
  { name: 'standard-units|foods', displayName: 'Standard unit foods' },
  { name: 'survey-schemes', displayName: 'Survey schemes resource access' },
  { name: 'survey-schemes|browse', displayName: 'Browse survey schemes' },
  { name: 'survey-schemes|read', displayName: 'Read survey schemes' },
  { name: 'survey-schemes|create', displayName: 'Create survey schemes' },
  { name: 'survey-schemes|edit', displayName: 'Edit survey schemes' },
  { name: 'survey-schemes|delete', displayName: 'Delete survey schemes' },
  { name: 'survey-schemes|data-export', displayName: 'Survey scheme data export' },
  { name: 'survey-schemes|prompts', displayName: 'Survey scheme prompts' },
  { name: 'survey-schemes|copy', displayName: 'Copy survey schemes' },
  { name: 'survey-schemes|security', displayName: 'Survey schemes security' },
  { name: 'survey-scheme-prompts', displayName: 'Survey scheme prompts resource access' },
  { name: 'survey-scheme-prompts|browse', displayName: 'Browse survey scheme prompts' },
  { name: 'survey-scheme-prompts|read', displayName: 'Read survey scheme prompts' },
  { name: 'survey-scheme-prompts|create', displayName: 'Create survey scheme prompts' },
  { name: 'survey-scheme-prompts|edit', displayName: 'Edit survey scheme prompts' },
  { name: 'survey-scheme-prompts|delete', displayName: 'Delete survey scheme prompts' },
  { name: 'survey-scheme-prompts|sync', displayName: 'Sync survey scheme prompts' },
  { name: 'surveys', displayName: 'Surveys resource access' },
  { name: 'surveys|browse', displayName: 'Browse surveys' },
  { name: 'surveys|read', displayName: 'Read surveys' },
  { name: 'surveys|create', displayName: 'Create surveys' },
  { name: 'surveys|edit', displayName: 'Edit surveys' },
  { name: 'surveys|delete', displayName: 'Delete surveys' },
  { name: 'surveys|data-export', displayName: 'Survey data export' },
  { name: 'surveys|overrides', displayName: 'Survey scheme overrides' },
  { name: 'surveys|respondents', displayName: 'Survey respondents' },
  { name: 'surveys|submissions', displayName: 'Survey submissions' },
  { name: 'surveys|security', displayName: 'Surveys security' },
  { name: 'tasks', displayName: 'Tasks resource access' },
  { name: 'tasks|browse', displayName: 'Browse tasks' },
  { name: 'tasks|read', displayName: 'Read tasks' },
  { name: 'tasks|create', displayName: 'Create tasks' },
  { name: 'tasks|edit', displayName: 'Edit tasks' },
  { name: 'tasks|delete', displayName: 'Delete tasks' },
  { name: 'users', displayName: 'Users resource access' },
  { name: 'users|browse', displayName: 'Browse users' },
  { name: 'users|read', displayName: 'Read users' },
  { name: 'users|create', displayName: 'Create users' },
  { name: 'users|edit', displayName: 'Edit users' },
  { name: 'users|delete', displayName: 'Delete users' },
  { name: 'users|permissions', displayName: 'User permissions' },
  { name: 'users|roles', displayName: 'User roles' },
];

module.exports = {
  up: async (queryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query('TRUNCATE TABLE permissions RESTART IDENTITY CASCADE;', {
        transaction,
      });
      await queryInterface.sequelize.query('TRUNCATE TABLE roles RESTART IDENTITY CASCADE;', {
        transaction,
      });
      await queryInterface.sequelize.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE;', {
        transaction,
      });

      await queryInterface.sequelize.query(
        `INSERT INTO roles ("name", display_name, description, created_at, updated_at) VALUES('superuser', 'superuser', null, NOW(), NOW());`,
        { transaction }
      );
      await createPermissions(
        permissions.map((perm) => ({ name: perm.name, display_name: perm.displayName })),
        { queryInterface, transaction }
      );
      await queryInterface.sequelize.query(
        `INSERT INTO users ("name", "email", verified_at, created_at, updated_at) VALUES('admin', 'admin', NOW(), NOW(), NOW());`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `INSERT INTO user_passwords (user_id, password_hash, password_salt, password_hasher) VALUES(1, '$2a$10$HkO6A98uzGa978ASq391yu3hzL02z9zZxZUsXbgyhbSDcn4FJcE6u', '$2a$10$HkO6A98uzGa978ASq391yu', 'bcrypt');`,
        { transaction }
      );
      await queryInterface.sequelize.query(
        `INSERT INTO role_user (role_id, user_id, created_at, updated_at) VALUES(1, 1, NOW(), NOW());`,
        { transaction }
      );
    }),

  down: async (queryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query('TRUNCATE TABLE permissions RESTART IDENTITY CASCADE;', {
        transaction,
      });
      await queryInterface.sequelize.query('TRUNCATE TABLE roles RESTART IDENTITY CASCADE;', {
        transaction,
      });
      await queryInterface.sequelize.query('TRUNCATE TABLE users RESTART IDENTITY CASCADE;', {
        transaction,
      });
    }),
};
