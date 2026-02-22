import { Link } from "react-router-dom";
import { useGetFormsQuery, useDeleteFormMutation } from "../../shared/api/generated";
import styles from "./HomePage.module.css";

export const HomePage = () => {
  const { data, isLoading, error, refetch, isFetching } = useGetFormsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [deleteForm, { isLoading: isDeleting }] = useDeleteFormMutation();

  if (isLoading) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.errorMessage}>Error loading forms</div>
          <button className={styles.btn} type="button" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const forms = data?.forms ?? [];

  const handleDelete = async (formId: string) => {
    if (confirm("Are you sure you want to delete this form?")) {
      try {
        await deleteForm({ id: formId }).unwrap();
      } catch (err) {
        console.error("Error deleting form:", err);
      }
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Forms</h1>

          <div className={styles.headerActions}>
            <Link className={`${styles.btn} ${styles.btnPrimary}`} to="/forms/new">
              + Create new form
            </Link>

            <button className={styles.btn} type="button" onClick={() => refetch()}>
              {isFetching ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>

        {forms.length === 0 ? (
          <div className={styles.meta}>
            No forms yet. Create one to start.
          </div>
        ) : (
          <div className={styles.list}>
            {forms.map((f) => (
              <div key={f.id} className={styles.card}>
                <div className={styles.meta}>ID: {f.id}</div>
                <h3 className={styles.cardTitle}>{f.title}</h3>
                {f.description ? (
                  <p className={styles.cardDesc}>{f.description}</p>
                ) : null}

                <div className={styles.actions}>
                  <Link className={styles.linkBtn} to={`/forms/${f.id}/fill`}>
                    View form
                  </Link>
                  <Link className={styles.linkBtn} to={`/forms/${f.id}/responses`}>
                    View responses
                  </Link>
                  <button
                    className={`${styles.linkBtn} ${styles.btnDanger}`}
                    type="button"
                    onClick={() => handleDelete(f.id)}
                    disabled={isDeleting}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};