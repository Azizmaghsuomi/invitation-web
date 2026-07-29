"use client";

import Link from "next/link";
import { useState } from "react";

const PERSIAN_MONTHS = [
  "فروردین",
  "اردیبهشت",
  "خرداد",
  "تیر",
  "مرداد",
  "شهریور",
  "مهر",
  "آبان",
  "آذر",
  "دی",
  "بهمن",
  "اسفند",
];

const NO_MESSAGES = [
  "مطمئنی؟ 🥺",
  "فکراتو بکن... 👉👈",
  "دکمه آره داره صدات میزنه 💗",
  "خب دیگه بسه، فقط آره رو بزن 😅",
  "آره همینجاست، منتظرته 💕",
];

export default function Home() {
  const [step, setStep] = useState(1);
  const [noClicks, setNoClicks] = useState(0);
  const [selectedFood, setSelectedFood] = useState("");
  const [jalaliDay, setJalaliDay] = useState("");
  const [jalaliMonth, setJalaliMonth] = useState("");
  const [useToday, setUseToday] = useState(false);
  const [time, setTime] = useState("");
  const [heartBurst, setHeartBurst] = useState(0);
  const [dateTimeError, setDateTimeError] = useState("");
  const [foodError, setFoodError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const noMessage =
    noClicks > 0
      ? NO_MESSAGES[Math.min(noClicks - 1, NO_MESSAGES.length - 1)]
      : "";

  const goToStep = (nextStep: number) => {
    setHeartBurst((count) => count + 1);
    setStep(nextStep);
  };

  const dateIsComplete = Boolean(jalaliDay && jalaliMonth);
  const persianNumber = (value: string) =>
    new Intl.NumberFormat("fa-IR").format(Number(value));
  const persianDate = dateIsComplete
    ? `${persianNumber(jalaliDay)} ${PERSIAN_MONTHS[Number(jalaliMonth) - 1]}`
    : "تاریخ انتخاب‌شده";

  const chooseToday = (checked: boolean) => {
    setUseToday(checked);
    setDateTimeError("");

    if (checked) {
      const parts = new Intl.DateTimeFormat("en-US-u-ca-persian", {
        day: "numeric",
        month: "numeric",
      }).formatToParts(new Date());
      setJalaliDay(parts.find((part) => part.type === "day")?.value ?? "");
      setJalaliMonth(parts.find((part) => part.type === "month")?.value ?? "");
    }
  };

  const continueFromDate = () => {
    if (!dateIsComplete || !time) {
      setDateTimeError("لطفاً تاریخ و ساعت قرار را انتخاب کن.");
      return;
    }
    setDateTimeError("");
    goToStep(3);
  };

  const submitInvitation = async () => {
    setIsSubmitting(true);
    setFoodError("");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedDate: persianDate,
          food: selectedFood,
          time,
        }),
      });

      const result = await response.json();
      if (response.ok && result?.success) {
        goToStep(4);
        return true;
      }

      setFoodError("ثبت اطلاعات با مشکل مواجه شد. دوباره تلاش کن.");
      return false;
    } catch {
      setFoodError("ثبت اطلاعات با مشکل مواجه شد. دوباره تلاش کن.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const continueFromFood = async () => {
    if (!selectedFood) {
      setFoodError("لطفاً یک غذا انتخاب کن.");
      return;
    }

    await submitInvitation();
  };

  return (
    <main className="container">
      <div className="background" aria-hidden="true"></div>
      <div className="floating-hearts" aria-hidden="true">
        <span className="heart heart-1">♥</span>
        <span className="heart heart-2">♥</span>
        <span className="heart heart-3">♥</span>
        <span className="heart heart-4">♥</span>
        <span className="heart heart-5">♥</span>
        <span className="heart heart-6">♥</span>
        <span className="heart heart-7">♥</span>
        <span className="heart heart-8">♥</span>
        <span className="heart heart-9">♥</span>
      </div>

      {heartBurst > 0 && (
        <div
          className="heart-burst"
          key={`heart-burst-${heartBurst}`}
          aria-hidden="true"
        >
          {Array.from({ length: 24 }, (_, index) => (
            <span className="burst-heart" key={index}>
              ♥
            </span>
          ))}
        </div>
      )}

      <div className="signature" aria-hidden="true">
        <span>♥</span>
        <Link href={"/admin"}>
          <span className="signature-name">Aziz</span>
        </Link>
        <span>♥</span>
      </div>

      <div className={`card step-${step}`} key={`step-${step}`}>
        <div className="progress">
          <div className={step >= 1 ? "dot active" : "dot"} />

          <div className={step >= 2 ? "dot active" : "dot"} />

          <div className={step >= 3 ? "dot active" : "dot"} />

          <div className={step >= 4 ? "dot active" : "dot"} />
        </div>

        {step === 1 && (
          <>
            <div className="emoji">🥺</div>

            <h1>با من میای سر قرار؟</h1>

            <p>فقط یه سوال ساده‌ست... جواب درست هم فقط یکیشه 😏</p>

            <div className="btns">
              {noClicks < NO_MESSAGES.length && (
                <button
                  className="no"
                  onClick={() => setNoClicks((c) => c + 1)}
                  style={{
                    transform: `scale(${Math.max(0.2, 1 - noClicks * 0.1)})`,
                    transition: "transform .18s",
                  }}
                >
                  نه 😒
                </button>
              )}

              <button
                className="yes"
                onClick={() => goToStep(2)}
                style={{
                  transform: `scale(${Math.min(1.35, 1 + noClicks * 0.06)})`,
                  transition: "transform .35s cubic-bezier(.34,1.56,.64,1)",
                  boxShadow: `0 15px 30px rgba(255,50,140,${Math.min(0.5, 0.25 + noClicks * 0.04)})`,
                }}
              >
                آره 💖
              </button>
            </div>

            <p className={`no-message ${noMessage ? "is-visible" : ""}`}>
              {noMessage || " "}
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <div className="emoji">📅</div>

            <h1>تاریخ قرار</h1>

            <div className="jalali-picker">
              <label className="today-choice">
                <input
                  type="checkbox"
                  checked={useToday}
                  onChange={(event) => chooseToday(event.target.checked)}
                />
                <span>انتخاب امروز</span>
              </label>

              <label>
                <span>روز</span>
                <select
                  value={jalaliDay}
                  disabled={useToday}
                  onChange={(event) => {
                    setJalaliDay(event.target.value);
                    setDateTimeError("");
                  }}
                >
                  <option value="">روز</option>
                  {Array.from({ length: 31 }, (_, index) =>
                    String(index + 1),
                  ).map((day) => (
                    <option value={day} key={day}>
                      {persianNumber(day)}
                    </option>
                  ))}
                </select>
              </label>

              <label className="month-select">
                <span>ماه</span>
                <select
                  value={jalaliMonth}
                  disabled={useToday}
                  onChange={(event) => {
                    setJalaliMonth(event.target.value);
                    setDateTimeError("");
                  }}
                >
                  <option value="">ماه</option>
                  {PERSIAN_MONTHS.map((month, index) => (
                    <option value={String(index + 1)} key={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <p className={`persian-date ${dateIsComplete ? "" : "is-empty"}`}>
              {dateIsComplete ? `تاریخ انتخاب‌شده: ${persianDate}` : " "}
            </p>

            <label className="time-label">
              <span>ساعت</span>
              <input
                type="time"
                value={time}
                onChange={(event) => {
                  setTime(event.target.value);
                  setDateTimeError("");
                }}
              />
            </label>

            {dateTimeError && (
              <p className="validation-error" role="alert">
                {dateTimeError}
              </p>
            )}

            <button className="next" onClick={continueFromDate}>
              ادامه
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <div className="emoji">🍽️</div>

            <h1>چی سفارش میدی؟</h1>

            <p className="food-intro">یه چیز خوشمزه انتخاب کن که مهمونت باشی</p>

            <div className="foods">
              <button
                className={
                  selectedFood === "قهوه" ? "food-btn active" : "food-btn"
                }
                onClick={() => {
                  setSelectedFood("قهوه");
                  setFoodError("");
                }}
              >
                {selectedFood === "قهوه" && (
                  <span className="selected-check">✓</span>
                )}
                <span className="food-icon">☕</span>
                <span>قهوه</span>
              </button>

              <button
                className={
                  selectedFood === "پاستا" ? "food-btn active" : "food-btn"
                }
                onClick={() => {
                  setSelectedFood("پاستا");
                  setFoodError("");
                }}
              >
                {selectedFood === "پاستا" && (
                  <span className="selected-check">✓</span>
                )}
                <span className="food-icon">🍝</span>
                <span>پاستا</span>
              </button>

              <button
                className={
                  selectedFood === "برگر" ? "food-btn active" : "food-btn"
                }
                onClick={() => {
                  setSelectedFood("برگر");
                  setFoodError("");
                }}
              >
                {selectedFood === "برگر" && (
                  <span className="selected-check">✓</span>
                )}
                <span className="food-icon">🍔</span>
                <span>برگر</span>
              </button>

              <button
                className={
                  selectedFood === "کوبیده" ? "food-btn active" : "food-btn"
                }
                onClick={() => {
                  setSelectedFood("کوبیده");
                  setFoodError("");
                }}
              >
                {selectedFood === "کوبیده" && (
                  <span className="selected-check">✓</span>
                )}
                <span className="food-icon">🍢</span>
                <span>کوبیده</span>
              </button>
            </div>

            {foodError && (
              <p className="validation-error" role="alert">
                {foodError}
              </p>
            )}

            <button
              className="next"
              onClick={continueFromFood}
              disabled={isSubmitting}
              style={{ opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? "در حال ثبت..." : "ثبت و ادامه"}
            </button>
          </>
        )}

        {step === 4 && (
          <>
            <div className="emoji">🎉</div>

            <h1>خوشحالم نگفتی نه!</h1>

            <p className="final-message">
              پس {persianDate} ساعت {time || "زمان انتخاب‌شده"} میام دنبالت،
              برای {selectedFood || "غذای انتخاب‌شده"} 🥂
              <br />
            </p>
            <div className="final-divider" />
            <p className="final-pickup">پس آماده باش، خودم میام دنبالت 🚗💨</p>
          </>
        )}
      </div>
    </main>
  );
}
