#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const postsDirectory = 'src/content/post';

function git(args) {
  return execFileSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

function isHidden(filePath) {
  const basename = path.posix.basename(filePath);
  return basename.startsWith('.') || basename.startsWith('_');
}

function inferUnhideCommit(filePath) {
  let history;
  try {
    history = git([
      'log',
      '--follow',
      '--find-renames',
      '--format=COMMIT%x09%H%x09%cI',
      '--name-status',
      '--',
      filePath,
    ]);
  } catch (error) {
    return { error: error.stderr?.toString().trim() || error.message };
  }

  let currentCommit;
  for (const line of history.split(/\r?\n/)) {
    if (!line) continue;

    if (line.startsWith('COMMIT\t')) {
      const [, hash, date] = line.split('\t');
      currentCommit = { hash, date };
      continue;
    }

    const status = line.split('\t');
    if (!status[0]?.startsWith('R') || status.length < 3 || !currentCommit) continue;

    const [, oldPath, newPath] = status;
    if (isHidden(oldPath) && !isHidden(newPath)) {
      return { ...currentCommit, oldPath, newPath };
    }
  }

  return null;
}

const filenames = await readdir(path.join(repoRoot, postsDirectory));
const publishedArticles = filenames
  .filter((name) => !name.startsWith('.') && !name.startsWith('_'))
  .filter((name) => /\.mdx?$/.test(name))
  .sort((a, b) => a.localeCompare(b));

if (publishedArticles.length === 0) {
  console.log('No currently unhidden Markdown articles found.');
  process.exit(0);
}

console.log('Inferred dates use the local committer timestamp of the latest hidden-to-unhidden rename.');
console.log('These are commit dates, not confirmed remote push timestamps.\n');

for (const filename of publishedArticles) {
  const filePath = path.posix.join(postsDirectory, filename);
  const inferred = inferUnhideCommit(filePath);

  if (!inferred) {
    console.log(`UNRESOLVED\t${filePath}\tNo hidden-to-unhidden rename found in Git history`);
  } else if (inferred.error) {
    console.log(`ERROR\t${filePath}\t${inferred.error}`);
  } else {
    console.log(`${inferred.date}\t${filePath}\t${inferred.hash.slice(0, 12)}\t${inferred.oldPath} -> ${inferred.newPath}`);
  }
}
