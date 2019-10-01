module.exports = {
  name: 'express-wafer-flow-editor',
  preset: '../../jest.config.js',
  coverageDirectory: '../../coverage/libs/express-wafer-flow-editor',
  snapshotSerializers: [
    'jest-preset-angular/AngularSnapshotSerializer.js',
    'jest-preset-angular/HTMLCommentSerializer.js'
  ]
};
