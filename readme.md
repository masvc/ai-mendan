mas@masatonoMacBook-Air ai-mendan % npm run dev

> app@0.1.0 dev
> next dev

▲ Next.js 16.2.2 (Turbopack)

- Local: http://localhost:3000
- Network: http://192.168.40.32:3000
- Environments: .env.local
  ✓ Ready in 464ms
  ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy

GET / 200 in 1377ms (next.js: 935ms, proxy.ts: 166ms, application-code: 276ms)
✓ Compiled in 999ms
GET / 200 in 52ms (next.js: 16ms, proxy.ts: 8ms, application-code: 28ms)
^C
mas@masatonoMacBook-Air ai-mendan % npm run dev

> app@0.1.0 dev
> next dev

▲ Next.js 16.2.2 (Turbopack)

- Local: http://localhost:3000
- Network: http://192.168.40.32:3000
- Environments: .env.local
  ✓ Ready in 460ms
  ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy

GET / 200 in 513ms (next.js: 219ms, proxy.ts: 68ms, application-code: 227ms)
Persisting failed: Unable to write SST file 00001028.sst

Caused by:
No such file or directory (os error 2)
Compaction failed: Another write batch or compaction is already active (Only a single write operations is allowed at a time)

thread 'tokio-runtime-worker' (1081202) panicked at turbopack/crates/turbo-tasks-backend/src/backend/operation/mod.rs:224:17:
Failed to restore task data (corrupted database or bug): Data for batch of 14 tasks

Caused by:
0: Looking up typed data for 14 tasks from database failed
1: Unable to open static sorted file referenced from 00001020.meta
2: Unable to open static sorted file 00001016.sst
3: Failed to open SST file /Users/mas/Desktop/ai-mendan/.next/dev/cache/turbopack/8d0f77bfa/00001016.sst
4: No such file or directory (os error 2)
note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace

thread 'tokio-runtime-worker' (1078630) panicked at turbopack/crates/turbo-tasks-backend/src/backend/operation/mod.rs:224:17:
Failed to restore task data (corrupted database or bug): Data for batch of 4 tasks

Caused by:
0: Looking up typed data for 4 tasks from database failed
1: Unable to open static sorted file referenced from 00001020.meta
2: Unable to open static sorted file 00001016.sst
3: Failed to open SST file /Users/mas/Desktop/ai-mendan/.next/dev/cache/turbopack/8d0f77bfa/00001016.sst
4: No such file or directory (os error 2)

thread 'tokio-runtime-worker' (1078630) panicked at turbopack/crates/turbo-tasks-backend/src/backend/operation/mod.rs:224:17:
Failed to restore task data (corrupted database or bug): Data for batch of 3 tasks

Caused by:
0: Looking up typed data for 3 tasks from database failed
1: Unable to open static sorted file referenced from 00001020.meta
2: Unable to open static sorted file 00001016.sst
3: Failed to open SST file /Users/mas/Desktop/ai-mendan/.next/dev/cache/turbopack/8d0f77bfa/00001016.sst
4: No such file or directory (os error 2)

thread 'tokio-runtime-worker' (1081202) panicked at turbopack/crates/turbo-tasks-backend/src/backend/operation/mod.rs:224:17:
Failed to restore task data (corrupted database or bug): Data for batch of 14 tasks

Caused by:
0: Looking up typed data for 14 tasks from database failed
1: Unable to open static sorted file referenced from 00001020.meta
2: Unable to open static sorted file 00001016.sst
3: Failed to open SST file /Users/mas/Desktop/ai-mendan/.next/dev/cache/turbopack/8d0f77bfa/00001016.sst
4: No such file or directory (os error 2)
Persisting failed: Another write batch or compaction is already active (Only a single write operations is allowed at a time)
Compaction failed: Another write batch or compaction is already active (Only a single write operations is allowed at a time)
