import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  QuestionType,
  useGetFormQuery,
  useSubmitResponseMutation,
} from "../../shared/api/generated";

import styles from "./FormFillPage.module.css";

type AnswersState = Record<string, string | string[]>;

export const FormFillPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, error } = useGetFormQuery(
    { id: id ?? "" },
    { skip: !id }
  );

  const [submitResponse, submitState] = useSubmitResponseMutation();

  const [answers, setAnswers] = useState<AnswersState>({});

  const form = data?.form;

  const canSubmit = useMemo(() => {
    if (!form) return false;

    return form.questions.every((q) => {
      if (!q.required) return true;

      const value = answers[q.id];

      if (q.type === QuestionType.CHECKBOX) {
        return Array.isArray(value) && value.length > 0;
      }

      return typeof value === "string" && value.trim().length > 0;
    });
  }, [answers, form]);

  const setText = (questionId: string, value: string) => {
    setAnswers((s) => ({ ...s, [questionId]: value }));
  };

  const setSingle = (questionId: string, value: string) => {
    setAnswers((s) => ({ ...s, [questionId]: value }));
  };

  const toggleMulti = (questionId: string, value: string) => {
    setAnswers((s) => {
      const current = s[questionId];
      const arr = Array.isArray(current) ? current : [];
      const exists = arr.includes(value);

      return {
        ...s,
        [questionId]: exists ? arr.filter((x) => x !== value) : [...arr, value],
      };
    });
  };

  const onSubmit = async () => {
    if (!form || !id) return;

    const payloadAnswers = form.questions
      .filter((q) => answers[q.id] !== undefined)
      .map((q) => ({
        questionId: q.id,
        value: answers[q.id] as string | string[],
      }));

    try {
      await submitResponse({ formId: id, answers: payloadAnswers }).unwrap();
    } catch {
    
    }
  };

  if (!id) return <div className={styles.page}>Missing form id</div>;
  if (isLoading) return <div className={styles.page}>Loading...</div>;
  if (error) return <div className={styles.page}>Error loading form</div>;
  if (!form) return <div className={styles.page}>Form not found</div>;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.header}>
            <h1 className={styles.title}>{form.title}</h1>
            {form.description ? (
              <p className={styles.description}>{form.description}</p>
            ) : null}
          </div>

          <div className={styles.questions}>
            {form.questions.map((q) => {
              const current = answers[q.id];

              return (
                <div key={q.id} className={styles.card}>
                  <div className={styles.qTitleRow}>
                    <p className={styles.qTitle}>{q.title}</p>
                    {q.required ? (
                      <span className={styles.required}>Required</span>
                    ) : null}
                  </div>

                  <div className={styles.control}>
                    {q.type === QuestionType.TEXT ? (
                      <input
                        className={styles.input}
                        value={typeof current === "string" ? current : ""}
                        onChange={(e) => setText(q.id, e.target.value)}
                        placeholder="Your answer"
                      />
                    ) : null}

                    {q.type === QuestionType.DATE ? (
                      <input
                        className={styles.date}
                        type="date"
                        value={typeof current === "string" ? current : ""}
                        onChange={(e) => setText(q.id, e.target.value)}
                      />
                    ) : null}

                    {q.type === QuestionType.MULTIPLE_CHOICE ? (
                      <div className={styles.options}>
                        {(q.options ?? []).map((o) => (
                          <label key={o.id} className={styles.optionRow}>
                            <input
                              type="radio"
                              name={q.id}
                              checked={current === o.label}
                              onChange={() => setSingle(q.id, o.label)}
                            />
                            <span className={styles.optionLabel}>{o.label}</span>
                          </label>
                        ))}
                      </div>
                    ) : null}

                    {q.type === QuestionType.CHECKBOX ? (
                      <div className={styles.options}>
                        {(q.options ?? []).map((o) => {
                          const arr = Array.isArray(current) ? current : [];
                          const checked = arr.includes(o.label);

                          return (
                            <label key={o.id} className={styles.optionRow}>
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleMulti(q.id, o.label)}
                              />
                              <span className={styles.optionLabel}>{o.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>

          <div className={styles.footerRow}>
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              type="button"
              onClick={onSubmit}
              disabled={!canSubmit || submitState.isLoading}
            >
              {submitState.isLoading ? "Submitting..." : "Submit"}
            </button>

            {!canSubmit ? (
              <span className={styles.hint}>Fill required questions</span>
            ) : null}
          </div>

          {submitState.isSuccess ? (
            <div className={styles.success}>Form submitted successfully!</div>
          ) : null}

          {submitState.error ? (
            <div className={styles.error}>Error submitting form</div>
          ) : null}
        </div>
      </div>
    </div>
  );
};