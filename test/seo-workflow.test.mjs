import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import test from 'node:test';

function statusShell(workflow) {
  const stegstart = workflow.indexOf('      - name: Lagre driftsstatus');
  const blokkstart = workflow.indexOf('        run: |\n', stegstart) + '        run: |\n'.length;
  const blokkslutt = workflow.indexOf('\n      - name:', blokkstart);
  return workflow.slice(blokkstart, blokkslutt)
    .split('\n')
    .map((linje) => linje.slice(10))
    .join('\n');
}

test('workflow samler og statuscommitter uten artikkelbygging eller PR', () => {
  const workflow = readFileSync(new URL('../.github/workflows/seo-autopilot.yml', import.meta.url), 'utf8');

  assert.match(workflow, /cron:\s*'0 3 \* \* \*'/u);
  assert.match(workflow, /workflow_dispatch:/u);
  assert.match(workflow, /concurrency:\s*seo-autopilot/u);
  assert.match(workflow, /permissions:\n\s+contents: write\n\s+issues: write/u);
  assert.doesNotMatch(workflow, /pull-requests:/u);
  assert.match(workflow, /SEO_AUTOPILOT:\s*\$\{\{ vars\.SEO_AUTOPILOT \}\}/u);
  assert.match(workflow, /GSC_SERVICE_ACCOUNT_JSON:\s*\$\{\{ secrets\.GSC_SERVICE_ACCOUNT_JSON \}\}/u);
  assert.match(workflow, /SEO_DATA_NOKKEL:\s*\$\{\{ secrets\.SEO_DATA_NOKKEL \}\}/u);
  assert.doesNotMatch(workflow, /Bygg nettstedet|Kjør testene|gh pr create|git switch -c|blogg-kilde\/auto/u);
  assert.equal(workflow.match(/git pull --rebase origin main/gu)?.length, 1);
  assert.equal(workflow.match(/git push origin HEAD:main/gu)?.length, 1);
  assert.match(workflow, /git add seo-data/u);
  assert.match(workflow, /node seo-motor\/rapport\.mjs/u);
});

test('workflowens statussteg er gyldig shell uten retry-løkke', () => {
  const workflow = readFileSync(new URL('../.github/workflows/seo-autopilot.yml', import.meta.url), 'utf8');
  const shell = statusShell(workflow);

  execFileSync('bash', ['-n'], { input: shell, stdio: ['pipe', 'pipe', 'pipe'] });
  assert.doesNotMatch(shell, /\b(?:for|while|until)\b/u);
});
