# Axios handlers
```
yarn add @laura-wert/axios-handlers
```
# AxiosCacheHandler
- throttle all requests at most once per threshold milliseconds (default is 1000ms)
- use the cache prop on a get request to tell the tell the cache witch entities will be fetched 
- use the cache prop on a post, put, delete or patch request to clear all these the entities from the cache
# AxiosErrorHandler
- catches errors
- these error can easily accessed bij the getError and getLastError helpers
- u can pass a custom error handler
    - if that handler returns false the error would not be stored in de error handler
# AxiosImmutableHandler
- makes the response.data immutable through a object.freeze
# AxiosLoadingHandler
- sets loading to true when a request start
- sets loading to false when a request stops

# Examples
- see the test/integration and tests/unit folders for some examples  
