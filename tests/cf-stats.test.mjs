import test from 'node:test';
import assert from 'node:assert/strict';
import {parseStats} from '../lib/cf-stats.ts';

const day = (date, requests, pageViews, uniques) => ({dimensions: {date}, sum: {requests, pageViews}, uniq: {uniques}});
test('sums the last seven days', () => {
  const groups = Array.from({length: 9}, (_, i) => day('2026-10-0' + (i + 1), 100, 40, 10));
  const r = parseStats({data: {viewer: {zones: [{httpRequests1dGroups: groups}]}}});
  assert.equal(r.days.length, 9);
  assert.deepEqual(r.totals, {requests: 700, pageViews: 280, visitors: 70});
});
test('survives empty, odd and error answers', () => {
  assert.deepEqual(parseStats({}).totals, {requests: 0, pageViews: 0, visitors: 0});
  assert.equal(parseStats({data: {viewer: {zones: []}}}).days.length, 0);
  assert.equal(parseStats({errors: [{message: 'authentication error'}]}).error, 'authentication error');
  assert.equal(parseStats({data: {viewer: {zones: [{httpRequests1dGroups: [{dimensions: {date: 'x'}, sum: {requests: 'a'}}]}]}}}).totals.requests, 0);
});
