module.exports = {
  name: 'session-manager',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/session-manager',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
