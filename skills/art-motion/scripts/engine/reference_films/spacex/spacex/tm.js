// Voiceover alignment: TM.cue('s03', '2007') = the moment the words "2007" start being spoken (local seconds for this segment, lt).
// TM.end('s03', '2007') = the moment those words finish being spoken. TM.dur('s03') = segment length; TM.vo('s03') = [vo start, vo end] (local seconds).
// The key must be a verbatim substring of that segment's subtitle text (first occurrence); a typo triggers console.error and fails the render.
window.TM = (() => {
  const seg = id => { const s = TIMING.seg[id]; if (!s) throw new Error('TIMING has no segment ' + id); return s; };
  function find(id, key, which) {
    const s = seg(id), i = s.text.indexOf(key);
    if (i < 0) { console.error(`TM: segment ${id} has no "${key}" in its subtitles`); return 0; }
    const j = which === 'end' ? i + key.length - 1 : i;
    return which === 'end' ? s.charEnd[j] : s.charStart[j];
  }
  return {
    cue: (id, key) => find(id, key, 'start'),
    end: (id, key) => find(id, key, 'end'),
    dur: id => seg(id).dur,
    vo: id => [seg(id).voStart, seg(id).voEnd],
    text: id => seg(id).text,
  };
})();
