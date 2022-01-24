# Tracker

* [Frontend](frontend/README.md)
* [Backend](backend/README.md)

# todo

after track delete you get this...

```
TrackList.vue?a1a1:6 Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'fields')
at eval (TrackList.vue?a1a1:6:1)
at renderList (runtime-core.esm-bundler.js?5c40:6519:1)
at eval (TrackList.vue?a1a1:5:1)
at renderList (runtime-core.esm-bundler.js?5c40:6497:1)
at Proxy.render (TrackList.vue?a1a1:3:1)
at renderComponentRoot (runtime-core.esm-bundler.js?5c40:893:1)
at ReactiveEffect.componentUpdateFn [as fn] (runtime-core.esm-bundler.js?5c40:5098:1)
at ReactiveEffect.run (reactivity.esm-bundler.js?a1e9:160:1)
at callWithErrorHandling (runtime-core.esm-bundler.js?5c40:155:1)
at flushJobs (runtime-core.esm-bundler.js?5c40:394:1)
```