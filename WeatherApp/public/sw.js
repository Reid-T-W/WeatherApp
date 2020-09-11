
const CACHE_NAME = 'SITE_CONTENT_V1';

const urlsToCache = [
    './',
    './images/icon192.png'

]

self.addEventListener("install", installer=>{
    console.log('Installing');
    const done = async () => {
        const cache = await caches.open(CACHE_NAME);
        return  cache.addAll(urlsToCache);
    };
    installer.waitUntil(done());
});

self.addEventListener("fetch", fetchEvent => {
    const url = fetchEvent.request.url;

    console.log(`Fetching: ${url}`);
    const getResponse = async (request) => {
        let response;

        response = await caches.match(request);
        if(response && response.status === 200){
            console.log('File in cache. Returning cahced version');
            return response;
        }

        try{
            console.log("File not in cache")
            response = await fetch(request);
        }
        catch(e){
            console.log(e)
        }
        const clone = response.clone();
        const cache = await caches.open(CACHE_NAME);
        cache.put(url,clone);
        return response;

    };

    //console.log(`Intercepting fetch request for: ${e.request.url}`);
    fetchEvent.respondWith(getResponse(fetchEvent.request));
});


self.addEventListener('activate', activator => {
    console.log('Activating');

    const currentCaches = [CACHE_NAME];
    const done = async () => {
        const names = await caches.keys();
        return Promise.all(names.map(name => {
            if(!currentCaches.includes(name)){
                return caches.delete(name);
            };
        }));
    };
    activator.waitUntil(done());
})


