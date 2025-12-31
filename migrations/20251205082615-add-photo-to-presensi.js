'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Presensis');

    if (!tableInfo.buktiFoto) {
      await queryInterface.addColumn('Presensis', 'buktiFoto', {
        type: Sequelize.STRING,
        allowNull: true
      });
    }
  },

  async down (queryInterface, Sequelize) {
    const tableInfo = await queryInterface.describeTable('Presensis');

    if (tableInfo.buktiFoto) {
      await queryInterface.removeColumn('Presensis', 'buktiFoto');
    }
  }
};
