import { Link } from 'react-router-dom';
import { modules } from '../data/modulesIndex';
import './HomePage.css';

export function HomePage() {
  return (
    <div className="home-page">
      <header className="home-hero">
        <h1>Smart Programmer</h1>
        <p className="home-tagline">
          DSA visualizer platform — step-by-step algorithm playback. Module 0: Loop Foundations.
        </p>
      </header>

      {modules.map((mod) => (
        <section key={mod.id} className="module-section">
          <h2>
            <span className="module-order">{mod.order}</span>
            {mod.title}
          </h2>
          <p className="module-desc">{mod.description}</p>

          {mod.problems.length === 0 ? (
            <p className="coming-soon">Coming soon</p>
          ) : (
            <div className="problem-grid">
              {mod.problems.map((p) => (
                <Link key={p.id} to={`/problem/${p.id}`} className="problem-card">
                  <span className="card-level">L{p.level ?? '?'}</span>
                  <span className="card-title">{p.title}</span>
                  <span className="card-meta">
                    #{p.programNumber} · Type {p.movementType}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
