module.exports = {
  name: 'expresswaferflow',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/apps/expresswaferflow',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
