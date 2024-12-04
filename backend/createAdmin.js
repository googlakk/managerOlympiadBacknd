const strapi = require('strapi');

async function createAdmin() {
  try {
    // Запускаем Strapi
    await strapi().load();

    // Проверяем, есть ли уже администратор с указанным email
    const existingAdmin = await strapi.query('admin::user').findOne({
      where: { email: 'admin@mail.ru' },
    });

    if (existingAdmin) {
      console.log('Администратор с таким email уже существует');
      return;
    }

    // Создаём нового администратора
    const newAdmin = await strapi.query('admin::user').create({
      data: {
        email: 'admin@mail.ru',
        password: '0700799410Evbh',
        firstname: 'Admin',
        lastname: 'User',
        isActive: true,
        roles: await strapi.query('admin::role').findOne({
          where: { code: 'strapi-super-admin' },
        }),
      },
    });

    console.log('Новый администратор успешно создан:', newAdmin);
  } catch (error) {
    console.error('Ошибка при создании администратора:', error);
  }
}

createAdmin();
