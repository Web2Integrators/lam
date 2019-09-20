module.exports = {
  name: 'lam-common',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/lam-common',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
