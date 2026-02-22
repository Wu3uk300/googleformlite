import { Link } from "react-router-dom";
import { useGetFormsQuery } from "../../shared/api/generated";
import styles from "./HomePage.module.css";

export const HomePage = () => {
  const { data, isLoading, error, refetch, isFetching } = useGetFormsQuery();

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
          <div style={{ marginBottom: 12 }}>Error loading forms</div>
          <button className={styles.btn} type="button" onClick={() => refetch()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const forms = data?.forms ?? [];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Forms</h1>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
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
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};