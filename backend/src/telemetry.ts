// Minimal telemetry stub: does not require OpenTelemetry packages.
// If you want full OTEL instrumentation, install the OTEL SDK packages
// and replace this file with the bootstrap implementation.
if (!process.env.OTEL_EXPORTER_OTLP_ENDPOINT && !process.env.OTEL_EXPORTER_OTLP_GRPC) {
  // eslint-disable-next-line no-console
  console.log('OpenTelemetry not configured (no OTEL_EXPORTER_* env var)');
} else {
  // eslint-disable-next-line no-console
  console.log('OpenTelemetry configured but OTEL SDK not installed; traces will not be exported.');
}
