import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../../layouts/Layout";
import Footer from "../../components/Footer";
import courseContent from "../../data/courseContent";
import "../../styles/assessment.css";

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

// ----------------------------------------
// ⭐ FIXED NORMALIZATION FOR TYPE
// ----------------------------------------
const normalizeType = (raw) => {
  if (!raw) return "";
  const t = raw.toLowerCase();

  if (t.includes("final")) return "final";          // final-assessment → final
  if (t.includes("pre")) return "pretest";          // pre-test → pretest
  if (t.includes("quiz")) return "quiz";            // quiz → quiz

  return t.replace(/-/g, "");
};
// ----------------------------------------

const slugify = (text = "") =>
  text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/&/g, "-and-")
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");

export default function AssessmentPage() {
  const { id, type } = useParams();
  const navigate = useNavigate();

  const normalizedType = normalizeType(type);
  const course = courseContent[id];

  const questions =
    (course && course.assessments && course.assessments[normalizedType]) || [];

  const defaultDurations = { pretest: 180, quiz: 300, final: 600 };
  const initialTime = defaultDurations[normalizedType] || 300;

  const passingScore = 80;

  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [passed, setPassed] = useState(false);

  useEffect(() => {
    if (!questions.length) return;
    setAnswers(Array(questions.length).fill(null));
  }, [id, type]);

  useEffect(() => {
    if (!questions.length || submitted) return;

    const t = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(t);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(t);
  }, [questions, submitted]);

  const handleSelect = (qIndex, optionIndex) => {
    if (submitted) return;
    setAnswers((prev) => {
      const copy = [...prev];
      copy[qIndex] = optionIndex;
      return copy;
    });
  };

  const handlePrev = () => setCurrentIndex((i) => Math.max(0, i - 1));
  const handleNext = () =>
    setCurrentIndex((i) => Math.min(questions.length - 1, i + 1));

  const handleSubmit = () => {
    if (submitted) return;

    let correct = 0;
    for (let i = 0; i < questions.length; i++) {
      if (answers[i] !== null && answers[i] === questions[i].answer) correct++;
    }

    const percent = questions.length
      ? Math.round((correct / questions.length) * 100)
      : 0;

    const isPassed = percent >= passingScore;
    setScore({ correct, total: questions.length, percent });
    setPassed(isPassed);
    setSubmitted(true);

    const results = JSON.parse(localStorage.getItem("assessmentResults")) || {};
    results[`${id}-${normalizedType}`] = {
      score: percent,
      passed: isPassed,
      date: new Date().toISOString(),
    };
    localStorage.setItem("assessmentResults", JSON.stringify(results));

    localStorage.setItem(`${id}-${normalizedType}-passed`, isPassed ? "true" : "false");

    if (normalizedType === "final" && isPassed) {
      const certs = JSON.parse(localStorage.getItem("certificates") || "{}");
      certs[String(id)] = true;
      localStorage.setItem("certificates", JSON.stringify(certs));
    }

    if (normalizedType === "quiz") {
      if (isPassed) {
        const unlockKey = "unlocked-modules";
        const unlockedModules = JSON.parse(localStorage.getItem(unlockKey)) || [];
        const updatedModules = Array.from(new Set([...unlockedModules, String(id)]));
        localStorage.setItem(unlockKey, JSON.stringify(updatedModules));

        const firstTitle =
          course.sections && course.sections[0]
            ? typeof course.sections[0] === "string"
              ? course.sections[0]
              : course.sections[0].title
            : null;

        const firstSlug = firstTitle ? slugify(firstTitle) : null;

        if (firstSlug) {
          navigate(`/modules/${id}/activity/${firstSlug}`);
        } else {
          navigate(`/modules/${id}`);
        }
        return;
      } else {
        return;
      }
    }

    if (normalizedType === "final") {
      navigate(`/modules/${id}`);
      return;
    }

    navigate(`/modules/${id}`);
  };

  if (!course) {
    return (
      <Layout>
        <div style={{ padding: 24 }}>Course not found.</div>
        <Footer />
      </Layout>
    );
  }

  if (!questions.length) {
    return (
      <Layout>
        <div className="assessment-wrapper">
          <h2>
            {course.title} — {normalizedType?.toUpperCase()}
          </h2>
          <p>No assessment questions available for this activity.</p>
          <button onClick={() => navigate(-1)} className="btn">
            Back
          </button>
        </div>
        <Footer />
      </Layout>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <Layout>
      <div className="assessment-wrapper">
        <div className="assessment-header">
          <div>
            <h2>{course.title}</h2>
            <h4 className="muted">
              {normalizedType === "pretest"
                ? "Pre-Test"
                : normalizedType === "quiz"
                ? "Quiz"
                : "Final Assessment"}
            </h4>
          </div>

          <div className="timer">
            <div>Time left</div>
            <div className="timer-value">{formatTime(timeLeft)}</div>
          </div>
        </div>

        {!submitted ? (
          <div>
            <div className="question-card">
              <div className="question-meta">
                <strong>
                  Question {currentIndex + 1} / {questions.length}
                </strong>
              </div>
              <div className="question-text">{currentQ.q}</div>

              <div className="options">
                {currentQ.options.map((opt, oi) => (
                  <label
                    key={oi}
                    className={`option ${
                      answers[currentIndex] === oi ? "selected" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${currentIndex}`}
                      checked={answers[currentIndex] === oi}
                      onChange={() => handleSelect(currentIndex, oi)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>

              <div className="question-actions">
                <button
                  onClick={handlePrev}
                  className="btn btn-light"
                  disabled={currentIndex === 0}
                >
                  Previous
                </button>

                <button
                  onClick={handleNext}
                  className="btn btn-light"
                  disabled={currentIndex === questions.length - 1}
                >
                  Next
                </button>

                <div style={{ flex: 1 }} />

                <button onClick={handleSubmit} className="btn btn-primary">
                  Submit
                </button>
              </div>
            </div>

            <div className="progress-line">
              {questions.map((_, i) => (
                <div
                  key={i}
                  className={`progress-dot ${
                    answers[i] != null ? "answered" : ""
                  } ${i === currentIndex ? "active" : ""}`}
                  onClick={() => setCurrentIndex(i)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="result-card">
            <h3>Results</h3>
            <p>
              Score: {score.correct} / {score.total} ({score.percent}%)
            </p>

            {passed ? (
              <p className="pass-msg" style={{ color: "green", fontWeight: "bold" }}>
                ✅ Congratulations! You passed this assessment.
              </p>
            ) : (
              <p className="fail-msg" style={{ color: "red", fontWeight: "bold" }}>
                ❌ You did not reach the passing score (80%). Please try again.
              </p>
            )}

            <div className="result-actions">
              <button className="btn" onClick={() => navigate(-1)}>
                Back to Course
              </button>

              {!passed && (
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setSubmitted(false);
                    setAnswers(Array(questions.length).fill(null));
                    setScore(null);
                    setTimeLeft(initialTime);
                    setCurrentIndex(0);
                  }}
                >
                  Retake
                </button>
              )}
            </div>

            <div className="answers-review">
              <h4>Review</h4>

              {questions.map((qq, idx) => (
                <div key={idx} className="review-item">
                  <div>
                    <strong>{idx + 1}.</strong> {qq.q}
                  </div>
                  <div>
                    Your answer:{" "}
                    {answers[idx] == null ? "No answer" : qq.options[answers[idx]]}
                  </div>
                  <div>Correct: {qq.options[qq.answer]}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </Layout>
  );
}
