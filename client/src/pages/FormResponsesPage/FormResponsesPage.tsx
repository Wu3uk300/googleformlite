import { useParams, Link } from "react-router-dom";
import {
  useGetFormQuery,
  useGetResponsesQuery,
} from "../../shared/api/generated";
import styles from "./FormResponsesPage.module.css";

export const FormResponsesPage = () => {
  const { id } = useParams<{ id: string }>();

  const { data: formData, isLoading: formLoading } = useGetFormQuery(
    { id: id ?? "" },
    { skip: !id }
  );

  const {
    data: responsesData,
    isLoading: responsesLoading,
    error,
  } = useGetResponsesQuery(
    { formId: id ?? "" },
    { skip: !id }
  );

  if (!id) return <div className={styles.page}>Missing form id</div>;
  if (formLoading || responsesLoading)
    return <div className={styles.page}>Loading...</div>;
  if (error) return <div className={styles.page}>Error loading responses</div>;

  const form = formData?.form;
  const responses = responsesData?.responses ?? [];

  if (!form) {
    return <div className={styles.page}>Form not found</div>;
  }

  const questionsById = new Map(
    form.questions.map((q) => [q.id, q.title])
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Responses</h1>
          <div className={styles.meta}>
            Form: {form.title}
          </div>
          <div style={{ marginTop: 6 }}>
            <Link to="/">← Back to forms</Link>
          </div>
        </div>

        {responses.length === 0 ? (
          <div className={styles.empty}>
            No responses yet.
          </div>
        ) : (
          <div className={styles.list}>
            {responses.map((r) => (
              <div key={r.id} className={styles.card}>
                <div className={styles.responseHeader}>
                  <span>ID: {r.id}</span>
                  <span>
                    {new Date(r.submittedAt).toLocaleString()}
                  </span>
                </div>

                {r.answers.map((a) => (
                  <div key={a.questionId} className={styles.answerRow}>
                    <strong>
                      {questionsById.get(a.questionId) ?? "Unknown question"}:
                    </strong>{" "}
                    {Array.isArray(a.value)
                      ? a.value.join(", ")
                      : a.value}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};