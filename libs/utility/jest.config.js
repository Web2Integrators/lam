module.exports = {
  name: 'utility',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/utility',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
