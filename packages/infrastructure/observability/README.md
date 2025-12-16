# @example/nestjs-observability

A lightweight, provider-agnostic observability facade for NestJS.

## Purpose

This package provides a **stable application-level API** for metrics, tracing, and
log correlation while keeping monitoring backends (OpenTelemetry, Prometheus, etc.)
as implementation details.

It is inspired by:
- Keyv (pluggable infrastructure abstraction)
- Spring Micrometer (observability facade)

## What this is
- A small NestJS-native abstraction
- Safe for shared libraries
- Supports multiple providers at once

## What this is not
- Not a replacement for OpenTelemetry
- Not an APM or metrics backend
- Not auto-instrumentation

## Design Principles
- Minimal public API
- Provider fan-out
- Async-safe context propagation
- OTEL as an optional backend

See source code for interfaces and module wiring.