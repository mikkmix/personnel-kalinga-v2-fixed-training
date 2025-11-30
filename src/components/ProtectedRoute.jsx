// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { getProgress } from "../lib/progress";

/**
 * usage:
 * <ProtectedRoute requiredUnlock="helpful"><YourComponent/></ProtectedRoute>
 */
export default function ProtectedRoute({ requiredUnlock, children }) {
  const { id } = useParams();
  const progress = getProgress(id || "1");

  if (!requiredUnlock) return children;

  if (requiredUnlock === "helpful" && progress.unlocked && progress.unlocked.helpful) return children;
  if (requiredUnlock === "training" && progress.unlocked && progress.unlocked.training) return children;

  // redirect to course landing if not unlocked
  return <Navigate to={`/modules/${id}`} replace />;
}
