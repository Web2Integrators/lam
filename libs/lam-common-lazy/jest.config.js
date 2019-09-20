module.exports = {
  name: 'lam-common-lazy',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/lam-common-lazy',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
