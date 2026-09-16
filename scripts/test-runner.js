const fs = require('fs');
const path = require('path');
const ts = require('typescript');

// Register TypeScript on-the-fly transpiler for .ts and .tsx files
require.extensions['.ts'] = function (module, filename) {
  const content = fs.readFileSync(filename, 'utf8');
  const compiled = ts.transpileModule(content, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
    },
    fileName: filename,
  });
  module._compile(compiled.outputText, filename);
};

require.extensions['.tsx'] = require.extensions['.ts'];

// Discover and execute all test files
const testDir = path.resolve(__dirname, '../src/components/daily/__tests__');
if (fs.existsSync(testDir)) {
  const testFiles = fs
    .readdirSync(testDir)
    .filter((f) => f.endsWith('.test.ts') || f.endsWith('.test.tsx'));

  console.log(`\n🚀 Running ${testFiles.length} Stage 1 Daily Test Suite(s)...`);

  testFiles.forEach((file) => {
    require(path.join(testDir, file));
  });
} else {
  console.error('No tests directory found at:', testDir);
  process.exit(1);
}
