export default {
     API_ROOT_URL: 'https://k8s-api.dev.simplevat.com',
// API_ROOT_URL: 'http://localhost:8080',
 API_ROOT_URL: window._env_.SIMPLEVAT_HOST,
   FRONTEND_RELEASE: window._env_.SIMPLEVAT_RELEASE,
};