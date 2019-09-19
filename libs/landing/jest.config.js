module.exports = {
  name: 'landing',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/landing',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
