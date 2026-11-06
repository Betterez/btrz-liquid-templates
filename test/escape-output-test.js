const assert = require("node:assert/strict");
const {describe, it} = require("node:test");
const tpl = require("../src/index");

describe("processToString escapeOutput option", () => {
  const data = {
    date: "03/11/2026",
    route: "Toronto / North Bay",
    quoted: "\"Union\"",
    back: "a\\b",
    multi: "a\nb\tc"
  };
  const template = "{{ date }}|{{ route }}|{{ quoted }}|{{ back }}|{{ multi }}";

  it("escapes values as JSON by default (unchanged behavior)", async () => {
    const out = await tpl.processToString(template, data);
    assert.equal(out, "03\\/11\\/2026|Toronto \\/ North Bay|\\\"Union\\\"|a\\\\b|a\\nb\\tc");
  });

  it("escapes values when the options object is empty or escapeOutput is true", async () => {
    const expected = await tpl.processToString(template, data);
    assert.equal(await tpl.processToString(template, data, {}), expected);
    assert.equal(await tpl.processToString(template, data, {escapeOutput: true}), expected);
    assert.equal(await tpl.processToString(template, data, undefined), expected);
  });

  it("renders values as written when escapeOutput is false", async () => {
    const out = await tpl.processToString(template, data, {escapeOutput: false});
    assert.equal(out, "03/11/2026|Toronto / North Bay|\"Union\"|a\\b|a\nb\tc");
  });

  it("keeps non-string values untouched with escapeOutput false", async () => {
    const out = await tpl.processToString("{{ n }}|{{ b }}", {n: 5, b: true}, {escapeOutput: false});
    assert.equal(out, "5|true");
  });

  it("does not leak the option to later renders", async () => {
    await tpl.processToString(template, data, {escapeOutput: false});
    const out = await tpl.processToString("{{ date }}", data);
    assert.equal(out, "03\\/11\\/2026");
  });

  it("only changes processToString: processToObj output is unchanged", async () => {
    const obj = await tpl.processToObj("{\"v\": \"{{ date }}\"}", data);
    assert.deepStrictEqual(obj, {v: "03/11/2026"});
  });
});
