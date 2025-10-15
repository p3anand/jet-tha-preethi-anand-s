module.exports = {
  default: {
    format: [
      'json:reports/cucumber_report.json',
      'summary'
    ],
    paths: [
      'src/features/**/*.feature'
    ],
    require: [
      'src/support/world.ts',
      'src/support/hooks.ts',
      'src/step-definitions/**/*.ts'
    ],
    timeout: 60000
  }
};
