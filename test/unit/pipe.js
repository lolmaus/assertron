import pipe from '../../src/utils/pipe'

describe("pipe", () => {
  it("implementation test", () => {
    const spy1 = stub().returns('foo')
    const spy2 = stub().returns('bar')
    const spy3 = stub().returns('baz')

    const result = pipe(1, 2, 3)(spy1, spy2, spy3)

    expect(spy1)
      .calledOnce
      .calledWithExactly(1, 2, 3)
      .calledBefore(spy2)
      .calledBefore(spy3)

    expect(spy2)
      .calledOnce
      .calledWithExactly('foo')
      .calledAfter(spy1)
      .calledBefore(spy3)

    expect(spy3)
      .calledOnce
      .calledWithExactly('bar')
      .calledAfter(spy1)
      .calledAfter(spy2)

    expect(result).equal('baz')
  })

  it("acceptance test", () => {
    const result = pipe([1], [2, 3])(
      (a1, a2) => a1.concat(a2),
      array    => array.map(n => n * n),
      array    => array.filter(n => n > 3),
      array    => array.reduce((a, b) => a + b, 0),
      num      => `${num}`
    )

    expect(result).equal("13")
  })
})
