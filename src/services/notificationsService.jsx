// src/services/notificationsService.js
// API-ready notifications service with mock fallback.
//
// Usage: import { fetchNotifications, markAllRead, deleteNotification, createMockIncoming }
// from "./services/notificationsService";

const USE_MOCK = true; // set to false and set BASE_URL to use real API
const BASE_URL = "https://your-api.example.com"; // <- change if USE_MOCK = false

/******************************
 * MOCK DATA & HELPERS
 ******************************/
let mockData = [
  {
    id: 1,
    title: "New Report Submitted",
    message: "ER Unit filed a new triage report for review.",
    time: "2 mins ago",
    read: false,
  },
  {
    id: 2,
    title: "Personnel Update",
    message: "Nurse Clara has been reassigned to Center 3.",
    time: "15 mins ago",
    read: false,
  },
  {
    id: 3,
    title: "Training Module Released",
    message: "New CPR Certification module is now available.",
    time: "1 hour ago",
    read: true,
  },
];

// simple id generator for mock
let nextMockId = 4;

/******************************
 * MOCK IMPLEMENTATIONS
 ******************************/
const wait = (ms) => new Promise((res) => setTimeout(res, ms));

async function fetchNotificationsMock() {
  await wait(200);
  // return a shallow copy
  return mockData.map((n) => ({ ...n }));
}

async function markAllReadMock() {
  await wait(150);
  mockData = mockData.map((n) => ({ ...n, read: true }));
  return mockData.map((n) => ({ ...n }));
}

async function deleteNotificationMock(id) {
  await wait(150);
  mockData = mockData.filter((n) => n.id !== id);
  return { success: true, id };
}

async function fetchAndMarkReadMock(id) {
  await wait(120);
  mockData = mockData.map((n) => (n.id === id ? { ...n, read: true } : n));
  return mockData.find((n) => n.id === id) || null;
}

async function createMockNotification(payload) {
  const newNotif = {
    id: nextMockId++,
    title: payload.title || "New notification",
    message: payload.message || "",
    time: payload.time || "Just now",
    read: false,
  };
  mockData = [newNotif, ...mockData];
  return newNotif;
}

/******************************
 * REAL API IMPLEMENTATIONS
 * (these assume REST endpoints)
 ******************************/
async function fetchNotificationsApi() {
  const res = await fetch(`${BASE_URL}/notifications`);
  if (!res.ok) throw new Error("Failed to load notifications");
  return res.json();
}

async function markAllReadApi() {
  const res = await fetch(`${BASE_URL}/notifications/mark-all-read`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to mark all read");
  return res.json();
}

async function deleteNotificationApi(id) {
  const res = await fetch(`${BASE_URL}/notifications/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete");
  return res.json();
}

async function fetchAndMarkReadApi(id) {
  const res = await fetch(`${BASE_URL}/notifications/${id}/mark-read`, {
    method: "POST",
  });
  if (!res.ok) throw new Error("Failed to mark read");
  return res.json();
}

/******************************
 * EXPORTED FUNCTIONS
 ******************************/
export async function fetchNotifications() {
  return USE_MOCK ? fetchNotificationsMock() : fetchNotificationsApi();
}

export async function markAllRead() {
  return USE_MOCK ? markAllReadMock() : markAllReadApi();
}

export async function deleteNotification(id) {
  return USE_MOCK ? deleteNotificationMock(id) : deleteNotificationApi(id);
}

export async function markRead(id) {
  return USE_MOCK ? fetchAndMarkReadMock(id) : fetchAndMarkReadApi(id);
}

/******************************
 * Utilities for demo / mock incoming
 ******************************/
/**
 * createMockIncoming(payload)
 *   Simulate arrival of a new notification (mock only).
 *   Returns the newly created notification.
 */
export async function createMockIncoming(payload) {
  if (!USE_MOCK) throw new Error("createMockIncoming is only for mock mode");
  // small delay to simulate network/incoming event
  await wait(100);
  const n = await createMockNotification(payload);
  return n;
}
