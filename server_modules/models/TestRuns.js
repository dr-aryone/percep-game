module.exports = function(sequelize, DataTypes) {
    var TestRuns = sequelize.define('TestRuns', {
        backgroundSpeed: DataTypes.STRING,
        sameAsForeground: DataTypes.BOOLEAN,
        noticedObject: DataTypes.BOOLEAN,
        ipAddress: {type: DataTypes.STRING, unique: true}
    }, {});

    return TestRuns;
};