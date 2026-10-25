## Table 20: Performance Comparison (PQC vs Classical Baseline)

| Metric | Unit | PQC path (mean ± SD) | Classical path (mean ± SD) |
|---|---|---|---|
| Key establishment (keygen) | ms | 0.106 ± 0.015 ms | 0.090 ± 0.028 ms |
| Key establishment (encap / agree) | ms | 0.060 ± 0.007 ms | 0.085 ± 0.025 ms |
| Key establishment (decap) | ms | 0.045 ± 0.009 ms | N/A (X25519 symmetric) |
| Signature generation (1 KiB) | ms | 0.109 ± 0.067 ms | 0.080 ± 0.039 ms |
| Signature verification (1 KiB) | ms | 0.102 ± 0.101 ms | 0.250 ± 0.105 ms |
| AES-GCM encrypt + decrypt (1 KiB) | µs | 3.10 ± 1.15 µs + 2.59 ± 0.55 µs | Identical (shared symmetric AES-256-GCM) |
| End-to-end session + message (128 B) | ms | 16.636 ± 2.066 ms + 14.171 ± 2.528 ms | 1.089 ± 0.255 ms + 0.049 ± 0.029 ms |
| Total handshake bytes | bytes | 10420 bytes | 304 bytes |
| Peak resident memory (server) | MiB | 188.86 MiB | 188.86 MiB |
