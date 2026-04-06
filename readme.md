✓ Compiled in 42ms
✓ Compiled in 317ms
GET / 200 in 119ms (next.js: 21ms, proxy.ts: 18ms, application-code: 80ms)
✓ Compiled in 136ms
✓ Compiled in 80ms
✓ Compiled in 117ms
✓ Compiled in 151ms
✓ Compiled in 100ms
✓ Compiled in 229ms
✓ Compiled in 192ms
✓ Compiled in 97ms
GET / 200 in 284ms (next.js: 67ms, proxy.ts: 72ms, application-code: 144ms)
GET / 200 in 67ms (next.js: 7ms, proxy.ts: 11ms, application-code: 49ms)
GET / 200 in 70ms (next.js: 9ms, proxy.ts: 6ms, application-code: 54ms)
GET / 200 in 60ms (next.js: 5ms, proxy.ts: 6ms, application-code: 49ms)
Persisting failed: Unable to open static sorted file referenced from 00001577.meta

Caused by:
0: Unable to open static sorted file 00001576.sst
1: Failed to open SST file /Users/mas/Desktop/ai-mendan/.next/dev/cache/turbopack/8d0f77bfa/00001576.sst
2: No such file or directory (os error 2)
Compaction failed: Another write batch or compaction is already active (Only a single write operations is allowed at a time)
^C
mas@masatonoMacBook-Air ai-mendan %
mas@masatonoMacBook-Air ai-mendan % clear
mas@masatonoMacBook-Air ai-mendan % npm run dev

> app@0.1.0 dev
> next dev

▲ Next.js 16.2.2 (Turbopack)

- Local: http://localhost:3000
- Network: http://172.16.0.47:3000
- Environments: .env.local
  ✓ Ready in 403ms
  ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy

GET / 200 in 2.8s (next.js: 2.5s, proxy.ts: 60ms, application-code: 234ms)
GET / 200 in 93ms (next.js: 24ms, proxy.ts: 10ms, application-code: 59ms)
✓ Compiled in 179ms
GET / 200 in 281ms (next.js: 117ms, proxy.ts: 68ms, application-code: 96ms)
✓ Compiled in 828ms
mas@masatonoMacBook-Air ai-mendan % npm run dev

> app@0.1.0 dev
> next dev

▲ Next.js 16.2.2 (Turbopack)

- Local: http://localhost:3000
- Network: http://172.16.0.47:3000
- Environments: .env.local
  ✓ Ready in 847ms
  ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy

GET / 200 in 2.2s (next.js: 1991ms, proxy.ts: 73ms, application-code: 173ms)
✓ Compiled in 223ms

thread 'tokio-runtime-worker' (846225) panicked at turbopack/crates/turbo-tasks-backend/src/backend/operation/mod.rs:196:17:
Failed to restore task data (corrupted database or bug): Data for TaskId 95457)

Caused by:
0: Looking up task storage for TaskId 95457 from database failed
1: Failed to deserialize AMQF from 00000031.meta for 00000027.sst
2: ArrayLengthMismatch { required: 102, found: 175 }
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace

---

FATAL: An unexpected Turbopack error occurred. A panic log has been written to /var/folders/m\_/7742hwqj5nz9zdd6ryz5wcwm0000gn/T/next-panic-7a2dbf8048239c1962a105c3c2ca8fae.log.

## To help make Turbopack better, report this error by clicking here.

GET / 200 in 206ms (next.js: 46ms, proxy.ts: 21ms, application-code: 139ms)

thread 'tokio-runtime-worker' (845859) panicked at turbopack/crates/turbo-tasks-backend/src/backend/operation/mod.rs:196:17:
Failed to restore task data (corrupted database or bug): Data for TaskId 95457)

Caused by:
0: Looking up task storage for TaskId 95457 from database failed
1: Failed to deserialize AMQF from 00000031.meta for 00000027.sst
2: ArrayLengthMismatch { required: 102, found: 175 }

thread 'tokio-runtime-worker' (847718) panicked at turbopack/crates/turbo-tasks-backend/src/backend/operation/mod.rs:196:17:
Failed to restore task data (corrupted database or bug): Data for TaskId 95458)

Caused by:
0: Looking up task storage for TaskId 95458 from database failed
1: Failed to deserialize AMQF from 00000031.meta for 00000027.sst
2: ArrayLengthMismatch { required: 102, found: 175 }

---

FATAL: An unexpected Turbopack error occurred. A panic log has been written to /var/folders/m\_/7742hwqj5nz9zdd6ryz5wcwm0000gn/T/next-panic-7a2dbf8048239c1962a105c3c2ca8fae.log.

## To help make Turbopack better, report this error by clicking here.

GET / 200 in 214ms (next.js: 9ms, proxy.ts: 13ms, application-code: 193ms)

thread 'tokio-runtime-worker' (846228) panicked at turbopack/crates/turbo-tasks-backend/src/backend/operation/mod.rs:196:17:
Failed to restore task data (corrupted database or bug): Data for TaskId 95457)

Caused by:
0: Looking up task storage for TaskId 95457 from database failed
1: Failed to deserialize AMQF from 00000031.meta for 00000027.sst
2: ArrayLengthMismatch { required: 102, found: 175 }

thread 'tokio-runtime-worker' (847718) panicked at turbopack/crates/turbo-tasks-backend/src/backend/operation/mod.rs:196:17:
Failed to restore task data (corrupted database or bug): Data for TaskId 95458)

Caused by:
0: Looking up task storage for TaskId 95458 from database failed
1: Failed to deserialize AMQF from 00000031.meta for 00000027.sst
2: ArrayLengthMismatch { required: 102, found: 175 }

---

FATAL: An unexpected Turbopack error occurred. A panic log has been written to /var/folders/m\_/7742hwqj5nz9zdd6ryz5wcwm0000gn/T/next-panic-7a2dbf8048239c1962a105c3c2ca8fae.log.

## To help make Turbopack better, report this error by clicking here.

GET / 200 in 634ms (next.js: 187ms, proxy.ts: 336ms, application-code: 111ms)
mas@masatonoMacBook-Air ai-mendan %
