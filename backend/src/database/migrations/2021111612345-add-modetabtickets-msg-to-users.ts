import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.addColumn("Users", "modeTabTickets", {
      type: DataTypes.STRING(10),
      allowNull: false,
	  defaultValue: "oneTab"
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.removeColumn("Users", "modeTabTickets");
  }
};
