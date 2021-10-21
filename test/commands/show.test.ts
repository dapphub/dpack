import { expect, test } from '@oclif/test'

describe('show', () => {
  test
    .stdout()
    .command(['show'])
    .it('runs show', ctx => {
      expect(ctx.stdout.length).to.equal(0)
    })

  test
    .stdout()
    .command(['show', 'test/sample-pack.json'])
    .it('runs show test/sample-pack.json', ctx => {
      expect(ctx.stdout).to.contain('QmS258HYWaBy2zWZpRyUE6xLQZT7KAkTFcMSwn2QHyknWH')
    })
})
