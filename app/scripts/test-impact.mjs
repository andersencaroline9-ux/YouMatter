// Run with: node scripts/test-impact.mjs
// Compile the real pure helpers to a disposable directory, then test their contract.
import ts from 'typescript';
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const app = fileURLToPath(new URL('../', import.meta.url));
const dir = mkdtempSync(join(tmpdir(), 'youmatter-impact-'));
try {
  for (const name of ['character-strengths', 'gratitude-eligibility', 'impact']) {
    const source = readFileSync(join(app, 'lib', `${name}.ts`), 'utf8')
      .replace('"./character-strengths"', '"./character-strengths.mjs"')
      .replace('"./gratitude-eligibility"', '"./gratitude-eligibility.mjs"');
    writeFileSync(join(dir, `${name}.mjs`), ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
    }).outputText);
  }
  const { calculateImpact, countEligibleGratitudeGroups, countEligibleStrengthsGroups, isTreeAccounting } =
    await import(pathToFileURL(join(dir, 'impact.mjs')));
  for (const [total, earned, remaining] of [[0,0,50],[1,0,49],[49,0,1],[50,1,50],[51,1,49],[99,1,1],[100,2,50],[73,1,27]]) {
    const result = calculateImpact(total,0,0,0,0,0);
    assert.equal(result.treesEarned, earned);
    assert.equal(result.towardNextTree, total % 50);
    assert.equal(result.contributionsUntilNextTree, remaining);
  }
  assert.equal(countEligibleGratitudeGroups([
    {submissionId:'complete',status:'approved',count:3,validMessageCount:3},
    {submissionId:'mixed',status:'approved',count:2,validMessageCount:2},
    {submissionId:'mixed',status:'pending',count:1,validMessageCount:0},
    {submissionId:'rejected',status:'rejected',count:3,validMessageCount:0},
    {submissionId:'oversized',status:'approved',count:4,validMessageCount:4},
    {submissionId:'incomplete',status:'approved',count:2,validMessageCount:2},
    {submissionId:null,status:'approved',count:10,validMessageCount:10},
  ]), 1);
  assert.equal(countEligibleStrengthsGroups([
    {strength:'["Creativity","Curiosity","Judgment"]',count:5},
    {strength:'["Creativity","Creativity","Judgment"]',count:2},
    {strength:'Curiosity',count:3},
    {strength:'["Curiosity","Judgment"]',count:2},
    {strength:'["Curiosity","Judgment","invented"]',count:2},
    {strength:'broken JSON',count:4},
  ]),5);
  const summary = calculateImpact(4,6,5,2,1,0);
  assert.equal(summary.gratitudesShared,4);
  assert.equal(summary.kindnessesNoticed,6);
  assert.equal(summary.strengthsRecognised,5);
  assert.equal(summary.dreamsShared,2);
  assert.equal(summary.totalApprovedContributions,17);
  // Each approved form counts once, even when it contains three items.
  const onePerForm = calculateImpact(2,1,1,1,0,0,1);
  assert.equal(onePerForm.gratitudesShared,2);
  assert.equal(onePerForm.kindnessesNoticed,1);
  assert.equal(onePerForm.strengthsRecognised,1);
  assert.equal(onePerForm.dreamsShared,1);
  assert.equal(onePerForm.checkinsShared,1);
  assert.equal(onePerForm.totalApprovedContributions,6);
  assert.equal(onePerForm.towardNextTree,6);
  assert.equal(onePerForm.contributionsUntilNextTree,44);
  assert.equal(summary.gratitudesShared + summary.kindnessesNoticed + summary.strengthsRecognised + summary.dreamsShared,
    summary.totalApprovedContributions);
  assert.equal(onePerForm.gratitudesShared + onePerForm.kindnessesNoticed + onePerForm.strengthsRecognised
    + onePerForm.dreamsShared + onePerForm.checkinsShared, onePerForm.totalApprovedContributions);
  assert.equal(calculateImpact(150,0,0,0,2,2).treesEarned,3);
  assert.equal(calculateImpact(150,0,0,0,2,2).treesActuallyPlanted,2);
  const checkinThreshold = calculateImpact(49,0,0,0,0,0,1);
  assert.equal(checkinThreshold.totalApprovedContributions,50);
  assert.equal(checkinThreshold.treesEarned,1);
  assert.equal(checkinThreshold.towardNextTree,0);
  for (const invalid of [null,{}, {treesFunded:-1,treesPlanted:0},{treesFunded:1.5,treesPlanted:0},
    {treesFunded:1,treesPlanted:2},{treesFunded:'2',treesPlanted:1},{treesFunded:Number.MAX_SAFE_INTEGER+1,treesPlanted:0}]) {
    assert.equal(isTreeAccounting(invalid),false);
  }
  assert(isTreeAccounting({treesFunded:2,treesPlanted:1}));
  assert(isTreeAccounting({treesFunded:0,treesPlanted:0}));
  console.log('Impact tests passed: thresholds, next-tree boundaries, grouped/legacy/mixed validation, display totals, separate tree accounting.');
} finally { rmSync(dir,{recursive:true,force:true}); }
