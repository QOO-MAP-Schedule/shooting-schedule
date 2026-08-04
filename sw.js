const CACHE_NAME = 'shooting-schedule-v1';
const VAPID_PUBLIC_KEY = 'BAU2RiQpQwqn4DSimUzwo2QxOceQFs6q2eBk91roUyWVN5m6VOZKw1dZlYjnGQncxFEuqDdfzWivLt33jPdLHOY';

// Install
self.addEventListener('install', function(e) {
  self.skipWaiting();
});

// Activate
self.addEventListener('activate', function(e) {
  e.waitUntil(clients.claim());
});

// Push notification received
self.addEventListener('push', function(e) {
  var data = {};
  try { data = e.data.json(); } catch(err) { data = { title: '拍攝行程管理', body: e.data ? e.data.text() : '您有新的行程通知' }; }
  var options = {
    body: data.body || '請開啟 APP 查看今日行程',
    icon: '/shooting-schedule/icons/icon-192.png',
    badge: '/shooting-schedule/icons/icon-192.png',
    vibrate: [200, 100, 200],
    data: { url: data.url || '/shooting-schedule/' },
    actions: [
      { action: 'open', title: '查看行程' },
      { action: 'close', title: '關閉' }
    ]
  };
  e.waitUntil(self.registration.showNotification(data.title || '拍攝行程管理', options));
});

// Notification click
self.addEventListener('notificationclick', function(e) {
  e.notification.close();
  if (e.action === 'close') return;
  var url = (e.notification.data && e.notification.data.url) || '/shooting-schedule/';
  e.waitUntil(clients.matchAll({ type: 'window' }).then(function(clientList) {
    for (var i = 0; i < clientList.length; i++) {
      var client = clientList[i];
      if (client.url.includes('shooting-schedule') && 'focus' in client) return client.focus();
    }
    if (clients.openWindow) return clients.openWindow(url);
  }));
});
