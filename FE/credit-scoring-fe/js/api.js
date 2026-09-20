const API_BASE_URL = 'http://localhost:8080';
const MOCK_MODE = true;
async function apiGet(url){if(MOCK_MODE)return mockGet(url);const r=await fetch(API_BASE_URL+url,{headers:authHeaders()});if(!r.ok)throw new Error('HTTP '+r.status);return r.json()}
async function apiPost(url,data){if(MOCK_MODE)return {};const r=await fetch(API_BASE_URL+url,{method:'POST',headers:{'Content-Type':'application/json',...authHeaders()},body:JSON.stringify(data)});if(!r.ok)throw new Error('HTTP '+r.status);return r.json()}
function authHeaders(){const token=localStorage.getItem('access_token');return token?{Authorization:'Bearer '+token}:{}}
async function mockGet(url){return {data:[]}}