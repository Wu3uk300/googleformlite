import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuestionType, useCreateFormMutation } from "../../shared/api/generated";
import type { DraftForm } from "../../features/forms/formDraft.types";
import {
  createDraftOption,
  createDraftQuestion,
  createEmptyDraftForm,
} from "../../features/forms/formDraft.factory";
import { mapDraftToCreateFormVariables } from "../../features/forms/formDraft.mapper";

import styles from "./FormBuilderPage.module.css";

export const FormBuilderPage = () => {
  const navigate = useNavigate();
  const [createForm, { isLoading, error }] = useCreateFormMutation();

  const [draft, setDraft] = useState<DraftForm>(() => createEmptyDraftForm());

  const canSave = useMemo(() => draft.title.trim().length > 0, [draft.title]);

  const setTitle = (v: string) => setDraft((s) => ({ ...s, title: v }));
  const setDescription = (v: string) => setDraft((s) => ({ ...s, description: v }));

  const addQuestion = (type: QuestionType) => {
    setDraft((s) => ({ ...s, questions: [...s.questions, createDraftQuestion(type)] }));
  };

  const updateQuestionTitle = (qid: string, title: string) => {
    setDraft((s) => ({
      ...s,
      questions: s.questions.map((q) => (q.id === qid ? { ...q, title } : q)),
    }));
  };

  const toggleRequired = (qid: string) => {
    setDraft((s) => ({
      ...s,
      questions: s.questions.map((q) => (q.id === qid ? { ...q, required: !q.required } : q)),
    }));
  };

  const addOption = (qid: string) => {
    setDraft((s) => ({
      ...s,
      questions: s.questions.map((q) =>
        q.id === qid ? { ...q, options: [...q.options, createDraftOption()] } : q
      ),
    }));
  };

  const updateOptionLabel = (qid: string, oid: string, label: string) => {
    setDraft((s) => ({
      ...s,
      questions: s.questions.map((q) =>
        q.id === qid
          ? { ...q, options: q.options.map((o) => (o.id === oid ? { ...o, label } : o)) }
          : q
      ),
    }));
  };

  const removeOption = (qid: string, oid: string) => {
    setDraft((s) => ({
      ...s,
      questions: s.questions.map((q) =>
        q.id === qid ? { ...q, options: q.options.filter((o) => o.id !== oid) } : q
      ),
    }));
  };

  const removeQuestion = (qid: string) => {
    setDraft((s) => ({ ...s, questions: s.questions.filter((q) => q.id !== qid) }));
  };

  const onSave = async () => {
    if (!canSave) return;

    const vars = mapDraftToCreateFormVariables(draft);

    try {
      await createForm(vars).unwrap();
      navigate("/");
    } catch {
      // error показываем ниже
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>Create new form</h1>
            <p className={styles.subtitle}>Draft is kept locally until you save.</p>
          </div>
        </div>

        <div className={`${styles.card} ${styles.stack}`}>
          <label className={styles.label}>
            Title *
            <input
              className={styles.input}
              value={draft.title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Form title"
            />
          </label>

          <label className={styles.label}>
            Description
            <textarea
              className={styles.textarea}
              value={draft.description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional description"
            />
          </label>
        </div>

        <div className={styles.toolbar}>
          <button className={styles.btn} type="button" onClick={() => addQuestion(QuestionType.TEXT)}>
            + Text
          </button>
          <button
            className={styles.btn}
            type="button"
            onClick={() => addQuestion(QuestionType.MULTIPLE_CHOICE)}
          >
            + Multiple choice
          </button>
          <button
            className={styles.btn}
            type="button"
            onClick={() => addQuestion(QuestionType.CHECKBOX)}
          >
            + Checkbox
          </button>
          <button className={styles.btn} type="button" onClick={() => addQuestion(QuestionType.DATE)}>
            + Date
          </button>
        </div>

        <div className={styles.questions}>
          {draft.questions.map((q, idx) => {
            const hasOptions = q.type === QuestionType.MULTIPLE_CHOICE || q.type === QuestionType.CHECKBOX;

            return (
              <div key={q.id} className={styles.card}>
                <div className={styles.questionHeader}>
                  <div style={{ flex: 1 }}>
                    <div className={styles.questionMeta}>
                      Question {idx + 1} — {q.type}
                    </div>
                    <input
                      className={styles.input}
                      value={q.title}
                      onChange={(e) => updateQuestionTitle(q.id, e.target.value)}
                    />
                  </div>

                  <div className={styles.rightControls}>
                    <label className={styles.checkboxRow}>
                      <input
                        type="checkbox"
                        checked={q.required}
                        onChange={() => toggleRequired(q.id)}
                      />
                      Required
                    </label>

                    <button className={`${styles.btn} ${styles.btnDanger}`} type="button" onClick={() => removeQuestion(q.id)}>
                      Remove
                    </button>
                  </div>
                </div>

                {hasOptions ? (
                  <div>
                    <div className={styles.optionsTitle}>Options</div>

                    <div className={styles.optionsList}>
                      {q.options.map((o) => (
                        <div key={o.id} className={styles.optionRow}>
                          <input
                            className={styles.optionInput}
                            value={o.label}
                            onChange={(e) => updateOptionLabel(q.id, o.id, e.target.value)}
                          />
                          <button
                            className={styles.btn}
                            type="button"
                            onClick={() => removeOption(q.id, o.id)}
                            disabled={q.options.length <= 1}
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: 8 }}>
                      <button className={styles.btn} type="button" onClick={() => addOption(q.id)}>
                        + Add option
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className={styles.footerRow}>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            type="button"
            onClick={onSave}
            disabled={!canSave || isLoading}
          >
            {isLoading ? "Saving..." : "Save form"}
          </button>

          {!canSave ? <span className={styles.hint}>Title is required</span> : null}
        </div>

        {error ? <div className={styles.error}>Error saving form</div> : null}
      </div>
    </div>
  );
};