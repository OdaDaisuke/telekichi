class MseStream {
  run() {
    const mseStreamSource = new MseStreamSource();
    mseStreamSource
    mseStreamSource.Opened += (_, __) =>
    {
        _mseSourceBuffer = _mseStreamSource.AddSourceBuffer("video/mp2t");
        _mseSourceBuffer.Mode = MseAppendMode.Sequence;
    };
    _mediaPlayerElement.MediaSource = MediaSource.CreateFromMseStreamSource(_mseStreamSource);
  }
}