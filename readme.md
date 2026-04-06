Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

...
<LoadingBoundary name="/" loading={null}>
<HTTPAccessFallbackBoundary notFound={{...}} forbidden={undefined} unauthorized={undefined}>
<HTTPAccessFallbackErrorBoundary pathname="/" notFound={{...}} forbidden={undefined} unauthorized={undefined} ...>
<RedirectBoundary>
<RedirectErrorBoundary router={{...}}>
<InnerLayoutRouter url="/" tree={[...]} params={{}} cacheNode={{rsc:{...}, ...}} segmentPath={[...]} ...>
<SegmentViewNode type="page" pagePath="page.tsx">
<SegmentTrieNode>
<Home>
<Interview>
<div className="mx-auto h-...">
<Toaster>
<motion.div>
<motion.div>
<motion.div>
<motion.div initial={{opacity:0, ...}} animate={{opacity:1,scale:1}} transition={{delay:0.45}} ...>
<div className="flex flex-..." style={{opacity:0, ...}} ref={function useMotionRef.useCallback}>
<button
onClick={function resumeInterview}

-                             className="w-[140px] h-[140px] flex flex-col items-center justify-center rounded-3xl fon..."

*                             className="w-[140px] h-[140px] flex items-center justify-center rounded-3xl font-bold te..."
                            >
                              <Play size={28}>

-                               <svg
-                                 ref={null}
-                                 xmlns="http://www.w3.org/2000/svg"
-                                 width={28}
-                                 height={28}
-                                 viewBox="0 0 24 24"
-                                 fill="none"
-                                 stroke="currentColor"
-                                 strokeWidth={2}
-                                 strokeLinecap="round"
-                                 strokeLinejoin="round"
-                                 className="lucide lucide-play"
-                                 aria-hidden="true"
-                               >

*                               はじめる
                                ...
                              ...
                          ...
                  ...
                ...

      at throwOnHydrationMismatch (react-dom-client.development.js:5465:11)
      at beginWork (react-dom-client.development.js:12361:17)
      at runWithFiberInDEV (react-dom-client.development.js:986:30)
      at performUnitOfWork (react-dom-client.development.js:18988:22)
      at workLoopConcurrentByScheduler (react-dom-client.development.js:18982:9)
      at renderRootConcurrent (react-dom-client.development.js:18964:15)
      at performWorkOnRoot (react-dom-client.development.js:17822:11)
      at performWorkOnRootViaSchedulerTask (react-dom-client.development.js:20471:7)
      at MessagePort.performWorkUntilDeadline (scheduler.development.js:45:48)

  throwOnHydrationMismatch @ react-dom-client.development.js:5465
  beginWork @ react-dom-client.development.js:12361
  runWithFiberInDEV @ react-dom-client.development.js:986
  performUnitOfWork @ react-dom-client.development.js:18988
  workLoopConcurrentByScheduler @ react-dom-client.development.js:18982
  renderRootConcurrent @ react-dom-client.development.js:18964
  performWorkOnRoot @ react-dom-client.development.js:17822
  performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:20471
  performWorkUntilDeadline @ scheduler.development.js:45
  <svg>
  exports.createElement @ react.development.js:1137
  （匿名） @ Icon.ts:46
  react_stack_bottom_frame @ react-dom-client.development.js:28241
  renderWithHooksAgain @ react-dom-client.development.js:8025
  renderWithHooks @ react-dom-client.development.js:7937
  updateForwardRef @ react-dom-client.development.js:10000
  beginWork @ react-dom-client.development.js:12451
  runWithFiberInDEV @ react-dom-client.development.js:986
  performUnitOfWork @ react-dom-client.development.js:18988
  workLoopConcurrentByScheduler @ react-dom-client.development.js:18982
  renderRootConcurrent @ react-dom-client.development.js:18964
  performWorkOnRoot @ react-dom-client.development.js:17822
  performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:20471
  performWorkUntilDeadline @ scheduler.development.js:45
  <ForwardRef>
  exports.createElement @ react.development.js:1137
  Play @ createLucideIcon.ts:14
  react_stack_bottom_frame @ react-dom-client.development.js:28241
  renderWithHooksAgain @ react-dom-client.development.js:8025
  renderWithHooks @ react-dom-client.development.js:7937
  updateForwardRef @ react-dom-client.development.js:10000
  beginWork @ react-dom-client.development.js:12451
  runWithFiberInDEV @ react-dom-client.development.js:986
  performUnitOfWork @ react-dom-client.development.js:18988
  workLoopConcurrentByScheduler @ react-dom-client.development.js:18982
  renderRootConcurrent @ react-dom-client.development.js:18964
  performWorkOnRoot @ react-dom-client.development.js:17822
  performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:20471
  performWorkUntilDeadline @ scheduler.development.js:45
  <Play>
  exports.jsxDEV @ react-jsx-dev-runtime.development.js:342
  Interview @ Interview.tsx:260
  react_stack_bottom_frame @ react-dom-client.development.js:28241
  renderWithHooksAgain @ react-dom-client.development.js:8025
  renderWithHooks @ react-dom-client.development.js:7937
  updateFunctionComponent @ react-dom-client.development.js:10442
  beginWork @ react-dom-client.development.js:12052
  runWithFiberInDEV @ react-dom-client.development.js:986
  performUnitOfWork @ react-dom-client.development.js:18988
  workLoopConcurrentByScheduler @ react-dom-client.development.js:18982
  renderRootConcurrent @ react-dom-client.development.js:18964
  performWorkOnRoot @ react-dom-client.development.js:17822
  performWorkOnRootViaSchedulerTask @ react-dom-client.development.js:20471
  performWorkUntilDeadline @ scheduler.development.js:45
  "use client"
  Home @ page.tsx:4
  initializeElement @ react-server-dom-turbopack-client.browser.development.js:1975
  <Home>
  Promise.all @ VM2003 <anonymous>:1
  initializeFakeTask @ react-server-dom-turbopack-client.browser.development.js:3454
  initializeDebugInfo @ react-server-dom-turbopack-client.browser.development.js:3479
  fulfillReference @ react-server-dom-turbopack-client.browser.development.js:2118
  wakeChunk @ react-server-dom-turbopack-client.browser.development.js:1549
  fulfillReference @ react-server-dom-turbopack-client.browser.development.js:2159
  wakeChunk @ react-server-dom-turbopack-client.browser.development.js:1549
  fulfillReference @ react-server-dom-turbopack-client.browser.development.js:2159
  wakeChunk @ react-server-dom-turbopack-client.browser.development.js:1549
  wakeChunkIfInitialized @ react-server-dom-turbopack-client.browser.development.js:1591
  resolveModelChunk @ react-server-dom-turbopack-client.browser.development.js:1701
  processFullStringRow @ react-server-dom-turbopack-client.browser.development.js:4512
  processFullBinaryRow @ react-server-dom-turbopack-client.browser.development.js:4370
  processBinaryChunk @ react-server-dom-turbopack-client.browser.development.js:4593
  progress @ react-server-dom-turbopack-client.browser.development.js:4910
  "use server"
  ResponseInstance @ react-server-dom-turbopack-client.browser.development.js:2833
  createResponseFromOptions @ react-server-dom-turbopack-client.browser.development.js:4788
  exports.createFromReadableStream @ react-server-dom-turbopack-client.browser.development.js:5191
  module evaluation @ app-index.tsx:265
  （匿名） @ hmr-runtime.ts:650
  runModuleExecutionHooks @ dev-base.ts:213
  instantiateModuleShared @ hmr-runtime.ts:648
  instantiateModule @ dev-base.ts:181
  getOrInstantiateModuleFromParent @ dev-base.ts:135
  commonJsRequire @ runtime-utils.ts:440
  （匿名） @ app-next-turbopack.ts:12
  （匿名） @ app-bootstrap.ts:79
  loadScriptsInSequence @ app-bootstrap.ts:23
  appBootstrap @ app-bootstrap.ts:61
  module evaluation @ app-next-turbopack.ts:11
  （匿名） @ hmr-runtime.ts:650
  runModuleExecutionHooks @ dev-base.ts:213
  instantiateModuleShared @ hmr-runtime.ts:648
  instantiateModule @ dev-base.ts:181
  getOrInstantiateRuntimeModule @ dev-base.ts:101
  registerChunk @ runtime-backend-dom.ts:65
  await in registerChunk
  registerChunk @ dev-base.ts:562
  （匿名） @ dev-backend-dom.ts:145
  （匿名） @ dev-backend-dom.ts:145このエラーを分析

⨯ ./src/app/components/Interview.tsx:13:1
Module not found: Can't resolve './ConfirmScreen'
11 | import MessageBox from "./MessageBox";
12 | import AnswerBox from "./AnswerBox";

> 13 | import ConfirmScreen from "./ConfirmScreen";

     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

14 |
15 | const CONFIG = {
16 | greeting1: "こんにちは、エーアイの翔平です。今日はちょっとしたお話の時間だよ。",

Import trace:
Server Component:
./src/app/components/Interview.tsx
./src/app/page.tsx

https://nextjs.org/docs/messages/module-not-found

⨯ ./src/app/components/Interview.tsx:13:1
Module not found: Can't resolve './ConfirmScreen'
11 | import MessageBox from "./MessageBox";
12 | import AnswerBox from "./AnswerBox";

> 13 | import ConfirmScreen from "./ConfirmScreen";

     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

14 |
15 | const CONFIG = {
16 | greeting1: "こんにちは、エーアイの翔平です。今日はちょっとしたお話の時間だよ。",

Import trace:
Server Component:
./src/app/components/Interview.tsx
./src/app/page.tsx

https://nextjs.org/docs/messages/module-not-found

⨯ ./src/app/components/Interview.tsx:13:1
Module not found: Can't resolve './ConfirmScreen'
11 | import MessageBox from "./MessageBox";
12 | import AnswerBox from "./AnswerBox";

> 13 | import ConfirmScreen from "./ConfirmScreen";

     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

14 |
15 | const CONFIG = {
16 | greeting1: "こんにちは、エーアイの翔平です。今日はちょっとしたお話の時間だよ。",

Import trace:
Server Component:
./src/app/components/Interview.tsx
./src/app/page.tsx

https://nextjs.org/docs/messages/module-not-found

⨯ ./src/app/components/Interview.tsx:13:1
Module not found: Can't resolve './ConfirmScreen'
11 | import MessageBox from "./MessageBox";
12 | import AnswerBox from "./AnswerBox";

> 13 | import ConfirmScreen from "./ConfirmScreen";

     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

14 |
15 | const CONFIG = {
16 | greeting1: "こんにちは、エーアイの翔平です。今日はちょっとしたお話の時間だよ。",

Import trace:
Server Component:
./src/app/components/Interview.tsx
./src/app/page.tsx

https://nextjs.org/docs/messages/module-not-found

⨯ ./src/app/components/Interview.tsx:13:1
Module not found: Can't resolve './ConfirmScreen'
11 | import MessageBox from "./MessageBox";
12 | import AnswerBox from "./AnswerBox";

> 13 | import ConfirmScreen from "./ConfirmScreen";

     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

14 |
15 | const CONFIG = {
16 | greeting1: "こんにちは、エーアイの翔平です。今日はちょっとしたお話の時間だよ。",

Import trace:
Server Component:
./src/app/components/Interview.tsx
./src/app/page.tsx

https://nextjs.org/docs/messages/module-not-found

⨯ ./src/app/components/Interview.tsx:13:1
Module not found: Can't resolve './ConfirmScreen'
11 | import MessageBox from "./MessageBox";
12 | import AnswerBox from "./AnswerBox";

> 13 | import ConfirmScreen from "./ConfirmScreen";

     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

14 |
15 | const CONFIG = {
16 | greeting1: "こんにちは、エーアイの翔平です。今日はちょっとしたお話の時間だよ。",

Import trace:
Server Component:
./src/app/components/Interview.tsx
./src/app/page.tsx

https://nextjs.org/docs/messages/module-not-found

⨯ ./src/app/components/Interview.tsx:13:1
Module not found: Can't resolve './ConfirmScreen'
11 | import MessageBox from "./MessageBox";
12 | import AnswerBox from "./AnswerBox";

> 13 | import ConfirmScreen from "./ConfirmScreen";

     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

14 |
15 | const CONFIG = {
16 | greeting1: "こんにちは、エーアイの翔平です。今日はちょっとしたお話の時間だよ。",

Import trace:
Server Component:
./src/app/components/Interview.tsx
./src/app/page.tsx

https://nextjs.org/docs/messages/module-not-found

⨯ ./src/app/components/Interview.tsx:13:1
Module not found: Can't resolve './ConfirmScreen'
11 | import MessageBox from "./MessageBox";
12 | import AnswerBox from "./AnswerBox";

> 13 | import ConfirmScreen from "./ConfirmScreen";

     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

14 |
15 | const CONFIG = {
16 | greeting1: "こんにちは、エーアイの翔平です。今日はちょっとしたお話の時間だよ。",

Import trace:
Server Component:
./src/app/components/Interview.tsx
./src/app/page.tsx

https://nextjs.org/docs/messages/module-not-found

⨯ ./src/app/components/Interview.tsx:13:1
Module not found: Can't resolve './ConfirmScreen'
11 | import MessageBox from "./MessageBox";
12 | import AnswerBox from "./AnswerBox";

> 13 | import ConfirmScreen from "./ConfirmScreen";

     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

14 |
15 | const CONFIG = {
16 | greeting1: "こんにちは、エーアイの翔平です。今日はちょっとしたお話の時間だよ。",

Import trace:
Server Component:
./src/app/components/Interview.tsx
./src/app/page.tsx

https://nextjs.org/docs/messages/module-not-found

⨯ ./src/app/components/Interview.tsx:13:1
Module not found: Can't resolve './ConfirmScreen'
11 | import MessageBox from "./MessageBox";
12 | import AnswerBox from "./AnswerBox";

> 13 | import ConfirmScreen from "./ConfirmScreen";

     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

14 |
15 | const CONFIG = {
16 | greeting1: "こんにちは、エーアイの翔平です。今日はちょっとしたお話の時間だよ。",

Import trace:
Server Component:
./src/app/components/Interview.tsx
./src/app/page.tsx

https://nextjs.org/docs/messages/module-not-found

⨯ ./src/app/components/Interview.tsx:13:1
Module not found: Can't resolve './ConfirmScreen'
11 | import MessageBox from "./MessageBox";
12 | import AnswerBox from "./AnswerBox";

> 13 | import ConfirmScreen from "./ConfirmScreen";

     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

14 |
15 | const CONFIG = {
16 | greeting1: "こんにちは、エーアイの翔平です。今日はちょっとしたお話の時間だよ。",

Import trace:
Server Component:
./src/app/components/Interview.tsx
./src/app/page.tsx

https://nextjs.org/docs/messages/module-not-found

⨯ ./src/app/components/Interview.tsx:13:1
Module not found: Can't resolve './ConfirmScreen'
11 | import MessageBox from "./MessageBox";
12 | import AnswerBox from "./AnswerBox";

> 13 | import ConfirmScreen from "./ConfirmScreen";

     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

14 |
15 | const CONFIG = {
16 | greeting1: "こんにちは、エーアイの翔平です。今日はちょっとしたお話の時間だよ。",

Import trace:
Server Component:
./src/app/components/Interview.tsx
./src/app/page.tsx

https://nextjs.org/docs/messages/module-not-found

⨯ ./src/app/components/Interview.tsx:13:1
Module not found: Can't resolve './ConfirmScreen'
11 | import MessageBox from "./MessageBox";
12 | import AnswerBox from "./AnswerBox";

> 13 | import ConfirmScreen from "./ConfirmScreen";

     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

14 |
15 | const CONFIG = {
16 | greeting1: "こんにちは、エーアイの翔平です。今日はちょっとしたお話の時間だよ。",

Import trace:
Server Component:
./src/app/components/Interview.tsx
./src/app/page.tsx

https://nextjs.org/docs/messages/module-not-found

⨯ ./src/app/components/Interview.tsx:13:1
Module not found: Can't resolve './ConfirmScreen'
11 | import MessageBox from "./MessageBox";
12 | import AnswerBox from "./AnswerBox";

> 13 | import ConfirmScreen from "./ConfirmScreen";

     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

14 |
15 | const CONFIG = {
16 | greeting1: "こんにちは、エーアイの翔平です。今日はちょっとしたお話の時間だよ。",

Import trace:
Server Component:
./src/app/components/Interview.tsx
./src/app/page.tsx

https://nextjs.org/docs/messages/module-not-found

⨯ ./src/app/components/Interview.tsx:13:1
Module not found: Can't resolve './ConfirmScreen'
11 | import MessageBox from "./MessageBox";
12 | import AnswerBox from "./AnswerBox";

> 13 | import ConfirmScreen from "./ConfirmScreen";

     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

14 |
15 | const CONFIG = {
16 | greeting1: "こんにちは、エーアイの翔平です。今日はちょっとしたお話の時間だよ。",

Import trace:
Server Component:
./src/app/components/Interview.tsx
./src/app/page.tsx

https://nextjs.org/docs/messages/module-not-found

⨯ ./src/app/components/Interview.tsx:13:1
Module not found: Can't resolve './ConfirmScreen'
11 | import MessageBox from "./MessageBox";
12 | import AnswerBox from "./AnswerBox";

> 13 | import ConfirmScreen from "./ConfirmScreen";

     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

14 |
15 | const CONFIG = {
16 | greeting1: "こんにちは、エーアイの翔平です。今日はちょっとしたお話の時間だよ。",

Import trace:
Server Component:
./src/app/components/Interview.tsx
./src/app/page.tsx

https://nextjs.org/docs/messages/module-not-found

⨯ ./src/app/components/Interview.tsx:13:1
Module not found: Can't resolve './ConfirmScreen'
11 | import MessageBox from "./MessageBox";
12 | import AnswerBox from "./AnswerBox";

> 13 | import ConfirmScreen from "./ConfirmScreen";

     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

14 |
15 | const CONFIG = {
16 | greeting1: "こんにちは、エーアイの翔平です。今日はちょっとしたお話の時間だよ。",

Import trace:
Server Component:
./src/app/components/Interview.tsx
./src/app/page.tsx

https://nextjs.org/docs/messages/module-not-found

⨯ ./src/app/components/Interview.tsx:13:1
Module not found: Can't resolve './ConfirmScreen'
11 | import MessageBox from "./MessageBox";
12 | import AnswerBox from "./AnswerBox";

> 13 | import ConfirmScreen from "./ConfirmScreen";

     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

14 |
15 | const CONFIG = {
16 | greeting1: "こんにちは、エーアイの翔平です。今日はちょっとしたお話の時間だよ。",

Import trace:
Server Component:
./src/app/components/Interview.tsx
./src/app/page.tsx

https://nextjs.org/docs/messages/module-not-found

⨯ ./src/app/components/Interview.tsx:13:1
Module not found: Can't resolve './ConfirmScreen'
11 | import MessageBox from "./MessageBox";
12 | import AnswerBox from "./AnswerBox";

> 13 | import ConfirmScreen from "./ConfirmScreen";

     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

14 |
15 | const CONFIG = {
16 | greeting1: "こんにちは、エーアイの翔平です。今日はちょっとしたお話の時間だよ。",

Import trace:
Server Component:
./src/app/components/Interview.tsx
./src/app/page.tsx

https://nextjs.org/docs/messages/module-not-found

⨯ ./src/app/components/Interview.tsx:13:1
Module not found: Can't resolve './ConfirmScreen'
11 | import MessageBox from "./MessageBox";
12 | import AnswerBox from "./AnswerBox";

> 13 | import ConfirmScreen from "./ConfirmScreen";

     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

14 |
15 | const CONFIG = {
16 | greeting1: "こんにちは、エーアイの翔平です。今日はちょっとしたお話の時間だよ。",

Import trace:
Server Component:
./src/app/components/Interview.tsx
./src/app/page.tsx

https://nextjs.org/docs/messages/module-not-found

⨯ ./src/app/components/Interview.tsx:13:1
Module not found: Can't resolve './ConfirmScreen'
11 | import MessageBox from "./MessageBox";
12 | import AnswerBox from "./AnswerBox";

> 13 | import ConfirmScreen from "./ConfirmScreen";

     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

14 |
15 | const CONFIG = {
16 | greeting1: "こんにちは、エーアイの翔平です。今日はちょっとしたお話の時間だよ。",

Import trace:
Server Component:
./src/app/components/Interview.tsx
./src/app/page.tsx

https://nextjs.org/docs/messages/module-not-found

⨯ ./src/app/components/Interview.tsx:13:1
Module not found: Can't resolve './ConfirmScreen'
11 | import MessageBox from "./MessageBox";
12 | import AnswerBox from "./AnswerBox";

> 13 | import ConfirmScreen from "./ConfirmScreen";

     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

14 |
15 | const CONFIG = {
16 | greeting1: "こんにちは、エーアイの翔平です。今日はちょっとしたお話の時間だよ。",

Import trace:
Server Component:
./src/app/components/Interview.tsx
./src/app/page.tsx

https://nextjs.org/docs/messages/module-not-found

✓ Compiled in 3.2s
⨯ ./src/app/components/Interview.tsx:13:1
Module not found: Can't resolve './ConfirmScreen'
11 | import MessageBox from "./MessageBox";
12 | import AnswerBox from "./AnswerBox";

> 13 | import ConfirmScreen from "./ConfirmScreen";

     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

14 |
15 | const CONFIG = {
16 | greeting1: "こんにちは、エーアイの翔平です。今日はちょっとしたお話の時間だよ。",

Import trace:
Server Component:
./src/app/components/Interview.tsx
./src/app/page.tsx

https://nextjs.org/docs/messages/module-not-found

GET / 500 in 1580ms (next.js: 1234ms, proxy.ts: 129ms, application-code: 218ms)
⨯ ./src/app/components/Interview.tsx:13:1
Module not found: Can't resolve './ConfirmScreen'
11 | import MessageBox from "./MessageBox";
12 | import AnswerBox from "./AnswerBox";

> 13 | import ConfirmScreen from "./ConfirmScreen";

     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

14 |
15 | const CONFIG = {
16 | greeting1: "こんにちは、エーアイの翔平です。今日はちょっとしたお話の時間だよ。",

Import trace:
Server Component:
./src/app/components/Interview.tsx
./src/app/page.tsx

https://nextjs.org/docs/messages/module-not-found

GET / 500 in 25ms (next.js: 9ms, proxy.ts: 3ms, application-code: 14ms)
⨯ ./src/app/components/Interview.tsx:13:1
Module not found: Can't resolve './ConfirmScreen'
11 | import MessageBox from "./MessageBox";
12 | import AnswerBox from "./AnswerBox";

> 13 | import ConfirmScreen from "./ConfirmScreen";

     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

14 |
15 | const CONFIG = {
16 | greeting1: "こんにちは、エーアイの翔平です。今日はちょっとしたお話の時間だよ。",

Import trace:
Server Component:
./src/app/components/Interview.tsx
./src/app/page.tsx

https://nextjs.org/docs/messages/module-not-found

GET / 500 in 22ms (next.js: 7ms, proxy.ts: 4ms, application-code: 11ms)
⨯ ./src/app/components/Interview.tsx:13:1
Module not found: Can't resolve './ConfirmScreen'
11 | import MessageBox from "./MessageBox";
12 | import AnswerBox from "./AnswerBox";

> 13 | import ConfirmScreen from "./ConfirmScreen";

     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

14 |
15 | const CONFIG = {
16 | greeting1: "こんにちは、エーアイの翔平です。今日はちょっとしたお話の時間だよ。",

Import trace:
Server Component:
./src/app/components/Interview.tsx
./src/app/page.tsx

https://nextjs.org/docs/messages/module-not-found

GET / 500 in 35ms (next.js: 9ms, proxy.ts: 4ms, application-code: 22ms)
[browser] Uncaught Error: ./src/app/components/Interview.tsx:13:1
Module not found: Can't resolve './ConfirmScreen'
11 | import MessageBox from "./MessageBox";
12 | import AnswerBox from "./AnswerBox";

> 13 | import ConfirmScreen from "./ConfirmScreen";

     | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

14 |
15 | const CONFIG = {
16 | greeting1: "こんにちは、エーアイの翔平です。今日はちょっとしたお話の時間だよ。",

Import trace:
Server Component:
./src/app/components/Interview.tsx
./src/app/page.tsx

https://nextjs.org/docs/messages/module-not-found

    at <unknown> (Error: ./src/app/components/Interview.tsx:13:1)
    at <unknown> (https://nextjs.org/docs/messages/module-not-found)
    at <unknown> (Error: (./src/app/components/Interview.tsx:13:1)
    at <unknown> (https://nextjs.org/docs/messages/module-not-found)

✓ Compiled in 1675ms
GET / 200 in 335ms (next.js: 169ms, proxy.ts: 4ms, application-code: 162ms)
✓ Compiled in 318ms
⚠ Fast Refresh had to perform a full reload when ./src/app/components/Interview.tsx changed. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
GET / 200 in 131ms (next.js: 28ms, proxy.ts: 4ms, application-code: 98ms)
GET / 200 in 775ms (next.js: 384ms, proxy.ts: 51ms, application-code: 340ms)
GET / 200 in 98ms (next.js: 18ms, proxy.ts: 6ms, application-code: 74ms)
[browser] Uncaught Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

- A server/client branch `if (typeof window !== 'undefined')`.
- Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
- Date formatting in a user's locale which doesn't match the server.
- External changing data without sending a snapshot of it along with the HTML.
- Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

...
<ErrorBoundary errorComponent={undefined} errorStyles={undefined} errorScripts={undefined}>
<LoadingBoundary name="/" loading={null}>
<HTTPAccessFallbackBoundary notFound={{...}} forbidden={undefined} unauthorized={undefined}>
<HTTPAccessFallbackErrorBoundary pathname="/" notFound={{...}} forbidden={undefined} unauthorized={undefined} ...>
<RedirectBoundary>
<RedirectErrorBoundary router={{...}}>
<InnerLayoutRouter url="/" tree={[...]} params={{}} cacheNode={{rsc:{...}, ...}} segmentPath={[...]} ...>
<SegmentViewNode type="page" pagePath="page.tsx">
<SegmentTrieNode>
<Home>
<Interview>
<div className="mx-auto h-...">
<Toaster>
<motion.div>
<motion.div>
<motion.div>
<motion.div initial={{opacity:0, ...}} animate={{opacity:1,scale:1}} transition={{delay:0.45}} ...>
<div className="flex flex-..." style={{opacity:0, ...}} ...>
<button>

-                             <button
-                               onClick={function onClick}
-                               className="text-sm text-slate-400 underline underline-offset-2"
-                             >
                            ...
                    ...
                  ...

      at <unknown> (https://react.dev/link/hydration-mismatch)
      at button (<anonymous>)
      at Interview (src/app/components/Interview.tsx:271:13)
      at Home (src/app/page.tsx:4:10)

  269 | )}
  270 | {typeof window !== "undefined" && localStorage.getItem("ai-mendan-history") && (

  > 271 | <button onClick={() => store.setScreen("myrecord")} className="text-sm text-slate-400 underline underline-offset-2">

        |             ^

  272 | 提出済みの回答を見る
  273 | </button>
  274 | )}
  GET /admin 200 in 212ms (next.js: 59ms, proxy.ts: 13ms, application-code: 141ms)
  GET /admin 200 in 559ms (next.js: 264ms, proxy.ts: 69ms, application-code: 226ms)
  GET /admin 200 in 140ms (next.js: 84ms, proxy.ts: 24ms, application-code: 33ms)
  GET /admin 200 in 499ms (next.js: 25ms, proxy.ts: 109ms, application-code: 366ms)
  GET / 200 in 898ms (next.js: 151ms, proxy.ts: 17ms, application-code: 730ms)
  [browser] Uncaught Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

* A server/client branch `if (typeof window !== 'undefined')`.
* Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
* Date formatting in a user's locale which doesn't match the server.
* External changing data without sending a snapshot of it along with the HTML.
* Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

...
<ErrorBoundary errorComponent={undefined} errorStyles={undefined} errorScripts={undefined}>
<LoadingBoundary name="/" loading={null}>
<HTTPAccessFallbackBoundary notFound={{...}} forbidden={undefined} unauthorized={undefined}>
<HTTPAccessFallbackErrorBoundary pathname="/" notFound={{...}} forbidden={undefined} unauthorized={undefined} ...>
<RedirectBoundary>
<RedirectErrorBoundary router={{...}}>
<InnerLayoutRouter url="/" tree={[...]} params={{}} cacheNode={{rsc:{...}, ...}} segmentPath={[...]} ...>
<SegmentViewNode type="page" pagePath="page.tsx">
<SegmentTrieNode>
<Home>
<Interview>
<div className="mx-auto h-...">
<Toaster>
<motion.div>
<motion.div>
<motion.div>
<motion.div initial={{opacity:0, ...}} animate={{opacity:1,scale:1}} transition={{delay:0.45}} ...>
<div className="flex flex-..." style={{opacity:0, ...}} ...>
<button>

-                             <button
-                               onClick={function onClick}
-                               className="text-sm text-slate-400 underline underline-offset-2"
-                             >
                            ...
                    ...
                  ...

      at <unknown> (https://react.dev/link/hydration-mismatch)
      at button (<anonymous>)
      at Interview (src/app/components/Interview.tsx:271:13)
      at Home (src/app/page.tsx:4:10)

  269 | )}
  270 | {typeof window !== "undefined" && localStorage.getItem("ai-mendan-history") && (

  > 271 | <button onClick={() => store.setScreen("myrecord")} className="text-sm text-slate-400 underline underline-offset-2">

        |             ^

  272 | 提出済みの回答を見る
  273 | </button>
  274 | )}
  GET / 200 in 63ms (next.js: 8ms, proxy.ts: 5ms, application-code: 50ms)
  [browser] Uncaught Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

* A server/client branch `if (typeof window !== 'undefined')`.
* Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
* Date formatting in a user's locale which doesn't match the server.
* External changing data without sending a snapshot of it along with the HTML.
* Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

...
<ErrorBoundary errorComponent={undefined} errorStyles={undefined} errorScripts={undefined}>
<LoadingBoundary name="/" loading={null}>
<HTTPAccessFallbackBoundary notFound={{...}} forbidden={undefined} unauthorized={undefined}>
<HTTPAccessFallbackErrorBoundary pathname="/" notFound={{...}} forbidden={undefined} unauthorized={undefined} ...>
<RedirectBoundary>
<RedirectErrorBoundary router={{...}}>
<InnerLayoutRouter url="/" tree={[...]} params={{}} cacheNode={{rsc:{...}, ...}} segmentPath={[...]} ...>
<SegmentViewNode type="page" pagePath="page.tsx">
<SegmentTrieNode>
<Home>
<Interview>
<div className="mx-auto h-...">
<Toaster>
<motion.div>
<motion.div>
<motion.div>
<motion.div initial={{opacity:0, ...}} animate={{opacity:1,scale:1}} transition={{delay:0.45}} ...>
<div className="flex flex-..." style={{opacity:0, ...}} ...>
<button>

-                             <button
-                               onClick={function onClick}
-                               className="text-sm text-slate-400 underline underline-offset-2"
-                             >
                            ...
                    ...
                  ...

      at <unknown> (https://react.dev/link/hydration-mismatch)
      at button (<anonymous>)
      at Interview (src/app/components/Interview.tsx:271:13)
      at Home (src/app/page.tsx:4:10)

  269 | )}
  270 | {typeof window !== "undefined" && localStorage.getItem("ai-mendan-history") && (

  > 271 | <button onClick={() => store.setScreen("myrecord")} className="text-sm text-slate-400 underline underline-offset-2">

        |             ^

  272 | 提出済みの回答を見る
  273 | </button>
  274 | )}
  GET / 200 in 63ms (next.js: 10ms, proxy.ts: 7ms, application-code: 46ms)
  [browser] Uncaught Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

* A server/client branch `if (typeof window !== 'undefined')`.
* Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
* Date formatting in a user's locale which doesn't match the server.
* External changing data without sending a snapshot of it along with the HTML.
* Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

...
<ErrorBoundary errorComponent={undefined} errorStyles={undefined} errorScripts={undefined}>
<LoadingBoundary name="/" loading={null}>
<HTTPAccessFallbackBoundary notFound={{...}} forbidden={undefined} unauthorized={undefined}>
<HTTPAccessFallbackErrorBoundary pathname="/" notFound={{...}} forbidden={undefined} unauthorized={undefined} ...>
<RedirectBoundary>
<RedirectErrorBoundary router={{...}}>
<InnerLayoutRouter url="/" tree={[...]} params={{}} cacheNode={{rsc:{...}, ...}} segmentPath={[...]} ...>
<SegmentViewNode type="page" pagePath="page.tsx">
<SegmentTrieNode>
<Home>
<Interview>
<div className="mx-auto h-...">
<Toaster>
<motion.div>
<motion.div>
<motion.div>
<motion.div initial={{opacity:0, ...}} animate={{opacity:1,scale:1}} transition={{delay:0.45}} ...>
<div className="flex flex-..." style={{opacity:0, ...}} ...>
<button>

-                             <button
-                               onClick={function onClick}
-                               className="text-sm text-slate-400 underline underline-offset-2"
-                             >
                            ...
                    ...
                  ...

      at <unknown> (https://react.dev/link/hydration-mismatch)
      at button (<anonymous>)
      at Interview (src/app/components/Interview.tsx:271:13)
      at Home (src/app/page.tsx:4:10)

  269 | )}
  270 | {typeof window !== "undefined" && localStorage.getItem("ai-mendan-history") && (

  > 271 | <button onClick={() => store.setScreen("myrecord")} className="text-sm text-slate-400 underline underline-offset-2">

        |             ^

  272 | 提出済みの回答を見る
  273 | </button>
  274 | )}
  GET / 200 in 126ms (next.js: 26ms, proxy.ts: 22ms, application-code: 78ms)
  [browser] Uncaught Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

* A server/client branch `if (typeof window !== 'undefined')`.
* Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
* Date formatting in a user's locale which doesn't match the server.
* External changing data without sending a snapshot of it along with the HTML.
* Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

...
<ErrorBoundary errorComponent={undefined} errorStyles={undefined} errorScripts={undefined}>
<LoadingBoundary name="/" loading={null}>
<HTTPAccessFallbackBoundary notFound={{...}} forbidden={undefined} unauthorized={undefined}>
<HTTPAccessFallbackErrorBoundary pathname="/" notFound={{...}} forbidden={undefined} unauthorized={undefined} ...>
<RedirectBoundary>
<RedirectErrorBoundary router={{...}}>
<InnerLayoutRouter url="/" tree={[...]} params={{}} cacheNode={{rsc:{...}, ...}} segmentPath={[...]} ...>
<SegmentViewNode type="page" pagePath="page.tsx">
<SegmentTrieNode>
<Home>
<Interview>
<div className="mx-auto h-...">
<Toaster>
<motion.div>
<motion.div>
<motion.div>
<motion.div initial={{opacity:0, ...}} animate={{opacity:1,scale:1}} transition={{delay:0.45}} ...>
<div className="flex flex-..." style={{opacity:0, ...}} ...>
<button>

-                             <button
-                               onClick={function onClick}
-                               className="text-sm text-slate-400 underline underline-offset-2"
-                             >
                            ...
                    ...
                  ...

      at <unknown> (https://react.dev/link/hydration-mismatch)
      at button (<anonymous>)
      at Interview (src/app/components/Interview.tsx:271:13)
      at Home (src/app/page.tsx:4:10)

  269 | )}
  270 | {typeof window !== "undefined" && localStorage.getItem("ai-mendan-history") && (

  > 271 | <button onClick={() => store.setScreen("myrecord")} className="text-sm text-slate-400 underline underline-offset-2">

        |             ^

  272 | 提出済みの回答を見る
  273 | </button>
  274 | )}
  ✓ Compiled in 1265ms
  GET / 200 in 1134ms (next.js: 310ms, proxy.ts: 303ms, application-code: 521ms)
  [browser] Uncaught Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

* A server/client branch `if (typeof window !== 'undefined')`.
* Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
* Date formatting in a user's locale which doesn't match the server.
* External changing data without sending a snapshot of it along with the HTML.
* Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

...
<ErrorBoundary errorComponent={undefined} errorStyles={undefined} errorScripts={undefined}>
<LoadingBoundary name="/" loading={null}>
<HTTPAccessFallbackBoundary notFound={{...}} forbidden={undefined} unauthorized={undefined}>
<HTTPAccessFallbackErrorBoundary pathname="/" notFound={{...}} forbidden={undefined} unauthorized={undefined} ...>
<RedirectBoundary>
<RedirectErrorBoundary router={{...}}>
<InnerLayoutRouter url="/" tree={[...]} params={{}} cacheNode={{rsc:{...}, ...}} segmentPath={[...]} ...>
<SegmentViewNode type="page" pagePath="page.tsx">
<SegmentTrieNode>
<Home>
<Interview>
<div className="mx-auto h-...">
<Toaster>
<motion.div>
<motion.div>
<motion.div>
<motion.div initial={{opacity:0, ...}} animate={{opacity:1,scale:1}} transition={{delay:0.45}} ...>
<div className="flex flex-..." style={{opacity:0, ...}} ...>
<button>

-                             <button
-                               onClick={function onClick}
-                               className="text-sm text-slate-400 underline underline-offset-2"
-                             >
                            ...
                    ...
                  ...

      at <unknown> (https://react.dev/link/hydration-mismatch)
      at button (<anonymous>)
      at Interview (src/app/components/Interview.tsx:271:13)
      at Home (src/app/page.tsx:4:10)

  269 | )}
  270 | {typeof window !== "undefined" && localStorage.getItem("ai-mendan-history") && (

  > 271 | <button onClick={() => store.setScreen("myrecord")} className="text-sm text-slate-400 underline underline-offset-2">

        |             ^

  272 | 提出済みの回答を見る
  273 | </button>
  274 | )}
  ✓ Compiled in 1154ms
  ⚠ Fast Refresh had to perform a full reload when ./src/app/components/Interview.tsx changed. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
  GET / 200 in 830ms (next.js: 279ms, proxy.ts: 4ms, application-code: 547ms)
  [browser] Uncaught Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

* A server/client branch `if (typeof window !== 'undefined')`.
* Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
* Date formatting in a user's locale which doesn't match the server.
* External changing data without sending a snapshot of it along with the HTML.
* Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

...
<ErrorBoundary errorComponent={undefined} errorStyles={undefined} errorScripts={undefined}>
<LoadingBoundary name="/" loading={null}>
<HTTPAccessFallbackBoundary notFound={{...}} forbidden={undefined} unauthorized={undefined}>
<HTTPAccessFallbackErrorBoundary pathname="/" notFound={{...}} forbidden={undefined} unauthorized={undefined} ...>
<RedirectBoundary>
<RedirectErrorBoundary router={{...}}>
<InnerLayoutRouter url="/" tree={[...]} params={{}} cacheNode={{rsc:{...}, ...}} segmentPath={[...]} ...>
<SegmentViewNode type="page" pagePath="page.tsx">
<SegmentTrieNode>
<Home>
<Interview>
<div className="mx-auto h-...">
<Toaster>
<motion.div>
<motion.div>
<motion.div>
<motion.div initial={{opacity:0, ...}} animate={{opacity:1,scale:1}} transition={{delay:0.45}} ...>
<div className="flex flex-..." style={{opacity:0, ...}} ...>
<button>

-                             <button
-                               onClick={function onClick}
-                               className="text-sm text-slate-400 underline underline-offset-2"
-                             >
                            ...
                    ...
                  ...

      at <unknown> (https://react.dev/link/hydration-mismatch)
      at button (<anonymous>)
      at Interview (src/app/components/Interview.tsx:272:13)
      at Home (src/app/page.tsx:4:10)

  270 | )}
  271 | {typeof window !== "undefined" && localStorage.getItem("ai-mendan-history") && (

  > 272 | <button onClick={() => store.setScreen("myrecord")} className="text-sm text-slate-400 underline underline-offset-2">

        |             ^

  273 | 提出済みの回答を見る
  274 | </button>
  275 | )}
  ✓ Compiled in 471ms
  ⚠ Fast Refresh had to perform a full reload when ./src/app/components/Interview.tsx changed. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
  GET / 200 in 155ms (next.js: 18ms, proxy.ts: 3ms, application-code: 134ms)
  ✓ Compiled in 321ms
  ⚠ Fast Refresh had to perform a full reload when ./src/app/components/Interview.tsx changed. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
  GET / 200 in 254ms (next.js: 68ms, proxy.ts: 19ms, application-code: 167ms)
  ✓ Compiled in 416ms
  ⚠ Fast Refresh had to perform a full reload when ./src/app/components/Interview.tsx changed. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
  GET / 200 in 305ms (next.js: 61ms, proxy.ts: 30ms, application-code: 214ms)
  GET / 200 in 1156ms (next.js: 284ms, proxy.ts: 393ms, application-code: 479ms)
  ✓ Compiled in 3s
  ⚠ Fast Refresh had to perform a full reload when ./src/app/components/Interview.tsx changed. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
  GET / 200 in 1262ms (next.js: 300ms, proxy.ts: 259ms, application-code: 702ms)
  GET / 200 in 125ms (next.js: 23ms, proxy.ts: 13ms, application-code: 89ms)
  GET / 200 in 1044ms (next.js: 450ms, proxy.ts: 9ms, application-code: 585ms)
  GET / 200 in 98ms (next.js: 31ms, proxy.ts: 11ms, application-code: 56ms)
  [browser] Uncaught Error: Hydration failed because the server rendered HTML didn't match the client. As a result this tree will be regenerated on the client. This can happen if a SSR-ed Client Component used:

* A server/client branch `if (typeof window !== 'undefined')`.
* Variable input such as `Date.now()` or `Math.random()` which changes each time it's called.
* Date formatting in a user's locale which doesn't match the server.
* External changing data without sending a snapshot of it along with the HTML.
* Invalid HTML tag nesting.

It can also happen if the client has a browser extension installed which messes with the HTML before React loaded.

https://react.dev/link/hydration-mismatch

...
<LoadingBoundary name="/" loading={null}>
<HTTPAccessFallbackBoundary notFound={{...}} forbidden={undefined} unauthorized={undefined}>
<HTTPAccessFallbackErrorBoundary pathname="/" notFound={{...}} forbidden={undefined} unauthorized={undefined} ...>
<RedirectBoundary>
<RedirectErrorBoundary router={{...}}>
<InnerLayoutRouter url="/" tree={[...]} params={{}} cacheNode={{rsc:{...}, ...}} segmentPath={[...]} ...>
<SegmentViewNode type="page" pagePath="page.tsx">
<SegmentTrieNode>
<Home>
<Interview>
<div className="mx-auto h-...">
<Toaster>
<motion.div>
<motion.div>
<motion.div>
<motion.div initial={{opacity:0, ...}} animate={{opacity:1,scale:1}} transition={{delay:0.45}} ...>
<div className="flex flex-..." style={{opacity:0, ...}} ref={function useMotionRef.useCallback}>
<button
onClick={function resumeInterview}

-                             className="w-[140px] h-[140px] flex flex-col items-center justify-center rounded-3xl fon..."

*                             className="w-[140px] h-[140px] flex items-center justify-center rounded-3xl font-bold te..."
                            >
                              <Play size={28}>

-                               <svg
-                                 ref={null}
-                                 xmlns="http://www.w3.org/2000/svg"
-                                 width={28}
-                                 height={28}
-                                 viewBox="0 0 24 24"
-                                 fill="none"
-                                 stroke="currentColor"
-                                 strokeWidth={2}
-                                 strokeLinecap="round"
-                                 strokeLinejoin="round"
-                                 className="lucide lucide-play"
-                                 aria-hidden="true"
-                               >

*                               はじめる
                                ...
                              ...
                          ...
                  ...
                ...

      at <unknown> (https://react.dev/link/hydration-mismatch)
      at svg (<anonymous>)
      at Interview (src/app/components/Interview.tsx:260:17)
      at Home (src/app/page.tsx:4:10)

  258 | <>
  259 | <button onClick={resumeInterview} className="w-[140px] h-[140px] flex flex-col items-center justify-center rounded-3xl...

  > 260 | <Play size={28} />

        |                 ^

  261 | <span>続きから</span>
  262 | </button>
  263 | <button onClick={() => { store.reset(); toast("リセットしました"); }} className="text-sm text-slate-400 underline unde...
  ✓ Compiled in 345ms
  ⚠ Fast Refresh had to perform a full reload when ./src/app/store.ts changed. Read more: https://nextjs.org/docs/messages/fast-refresh-reload
  GET / 200 in 125ms (next.js: 25ms, proxy.ts: 7ms, application-code: 93ms)
