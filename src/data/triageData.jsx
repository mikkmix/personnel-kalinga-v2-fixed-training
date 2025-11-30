// src/data/triageData.js

export const triageData = [
  {
    hospital: "Jose B. Lingad Memorial Regional Hospital",
    patients: [
      { age: 60, temperature: 39.5, heartRate: 120, spo2: 90, complaint: "Chest pain", mentalStatus: "Verbal", comorbidities: "Hypertension" },
      { age: 45, temperature: 38.2, heartRate: 95, spo2: 95, complaint: "Fever and cough", mentalStatus: "Alert", comorbidities: "None" },
    ],
  },
  {
    hospital: "Arayat District Hospital",
    patients: [
      { age: 32, temperature: 37.9, heartRate: 100, spo2: 93, complaint: "Shortness of breath", mentalStatus: "Alert", comorbidities: "Asthma" },
      { age: 50, temperature: 36.7, heartRate: 80, spo2: 97, complaint: "Headache", mentalStatus: "Alert", comorbidities: "None" },
    ],
  },
  {
    hospital: "Candaba District Hospital",
    patients: [
      { age: 70, temperature: 39.8, heartRate: 115, spo2: 88, complaint: "Breathing difficulty", mentalStatus: "Verbal", comorbidities: "Diabetes" },
    ],
  },
  {
    hospital: "Mexico Community Hospital",
    patients: [
      { age: 28, temperature: 36.5, heartRate: 78, spo2: 99, complaint: "Wound injury", mentalStatus: "Alert", comorbidities: "None" },
    ],
  },
];
