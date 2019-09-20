module.exports = {
  name: 'lam-common-eager',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/lam-common-eager',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
